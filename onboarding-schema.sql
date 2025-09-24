-- Comprehensive Onboarding Journey Schema Addendum
-- This script creates all necessary tables, triggers, functions, and policies
-- for the gamified onboarding journey system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_onboarding_progress_user_id ON user_onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_progress_step_id ON user_onboarding_progress(step_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_progress_status ON user_onboarding_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_activities_user_id ON onboarding_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_activities_action ON onboarding_activities(action);
CREATE INDEX IF NOT EXISTS idx_rewards_type ON rewards(type);
CREATE INDEX IF NOT EXISTS idx_rewards_is_nsfw ON rewards(is_nsfw);

-- Create triggers for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers to new tables
CREATE TRIGGER update_onboarding_steps_updated_at BEFORE UPDATE ON onboarding_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_onboarding_progress_updated_at BEFORE UPDATE ON user_onboarding_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_levels_updated_at BEFORE UPDATE ON levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize onboarding journey for new paid users
CREATE OR REPLACE FUNCTION initialize_onboarding_journey()
RETURNS TRIGGER AS $$
DECLARE
    step_record RECORD;
BEGIN
    -- Only initialize if user becomes paid member and doesn't have existing progress
    IF NEW.is_paid_member = true AND OLD.is_paid_member = false THEN
        -- Check if user already has onboarding progress
        IF NOT EXISTS (SELECT 1 FROM user_onboarding_progress WHERE user_id = NEW.id) THEN
            -- Initialize progress for all onboarding steps
            FOR step_record IN SELECT id FROM onboarding_steps ORDER BY "order" LOOP
                INSERT INTO user_onboarding_progress (user_id, step_id, status, created_at, updated_at)
                VALUES (NEW.id, step_record.id, 'PENDING', NOW(), NOW());
            END LOOP;
            
            -- Log initialization activity
            INSERT INTO onboarding_activities (user_id, action, details, created_at)
            VALUES (NEW.id, 'STEP_STARTED', json_build_object('event', 'onboarding_initialized', 'steps_count', (SELECT COUNT(*) FROM onboarding_steps)), NOW());
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for onboarding initialization
CREATE TRIGGER on_user_paid_member_change
    AFTER UPDATE OF is_paid_member ON users
    FOR EACH ROW
    EXECUTE FUNCTION initialize_onboarding_journey();

-- Function to award points and check for badges/levels
CREATE OR REPLACE FUNCTION award_onboarding_points()
RETURNS TRIGGER AS $$
DECLARE
    step_points INTEGER;
    user_points INTEGER;
    new_level_id UUID;
    badge_record RECORD;
BEGIN
    -- Award points when step is completed
    IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        -- Get points for this step
        SELECT points_reward INTO step_points FROM onboarding_steps WHERE id = NEW.step_id;
        
        -- Update user points
        UPDATE users 
        SET points = points + step_points
        WHERE id = NEW.user_id;
        
        -- Get updated user points
        SELECT points INTO user_points FROM users WHERE id = NEW.user_id;
        
        -- Log points earned
        INSERT INTO onboarding_activities (user_id, action, details, created_at)
        VALUES (NEW.user_id, 'POINTS_EARNED', json_build_object('step_id', NEW.step_id, 'points', step_points, 'total_points', user_points), NOW());
        
        -- Check for level up
        SELECT id INTO new_level_id FROM levels 
        WHERE min_points <= user_points AND (max_points IS NULL OR max_points >= user_points)
        ORDER BY min_points DESC LIMIT 1;
        
        IF new_level_id IS NOT NULL AND (SELECT current_level_id FROM users WHERE id = NEW.user_id) != new_level_id THEN
            UPDATE users SET current_level_id = new_level_id WHERE id = NEW.user_id;
            
            -- Log level up
            INSERT INTO onboarding_activities (user_id, action, details, created_at)
            VALUES (NEW.user_id, 'LEVEL_UP', json_build_object('new_level_id', new_level_id, 'points', user_points), NOW());
        END IF;
        
        -- Check for badge eligibility
        FOR badge_record IN SELECT * FROM badges WHERE points_required <= user_points LOOP
            IF NOT EXISTS (SELECT 1 FROM user_badges WHERE user_id = NEW.user_id AND badge_id = badge_record.id) THEN
                INSERT INTO user_badges (user_id, badge_id, awarded_at)
                VALUES (NEW.user_id, badge_record.id, NOW());
                
                -- Log badge earned
                INSERT INTO onboarding_activities (user_id, action, details, created_at)
                VALUES (NEW.user_id, 'BADGE_EARNED', json_build_object('badge_id', badge_record.id, 'badge_name', badge_record.name), NOW());
            END IF;
        END LOOP;
        
        -- Check if all required steps are completed
        PERFORM check_onboarding_completion(NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for awarding points
CREATE TRIGGER on_step_completed
    AFTER UPDATE OF status ON user_onboarding_progress
    FOR EACH ROW
    EXECUTE FUNCTION award_onboarding_points();

-- Function to check and mark onboarding completion
CREATE OR REPLACE FUNCTION check_onboarding_completion(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
    total_required INTEGER;
    completed_required INTEGER;
    completion_percentage NUMERIC;
BEGIN
    -- Count total required steps
    SELECT COUNT(*) INTO total_required 
    FROM onboarding_steps 
    WHERE is_required = true;
    
    -- Count completed required steps
    SELECT COUNT(*) INTO completed_required 
    FROM user_onboarding_progress uop
    JOIN onboarding_steps os ON uop.step_id = os.id
    WHERE uop.user_id = user_id_param AND uop.status = 'COMPLETED' AND os.is_required = true;
    
    -- Calculate completion percentage
    completion_percentage = (completed_required::NUMERIC / total_required::NUMERIC) * 100;
    
    -- Update progress percentage for all steps
    UPDATE user_onboarding_progress 
    SET progress_percentage = completion_percentage
    WHERE user_id = user_id_param;
    
    -- Check if all required steps are completed
    IF completed_required = total_required AND total_required > 0 THEN
        UPDATE users 
        SET onboarding_completed = true 
        WHERE id = user_id_param AND onboarding_completed = false;
        
        -- Log completion
        INSERT INTO onboarding_activities (user_id, action, details, created_at)
        VALUES (user_id_param, 'ONBOARDING_COMPLETED', json_build_object('completion_percentage', completion_percentage), NOW());
    END IF;
END;
$$ language 'plpgsql';

-- Function to handle reward redemption
CREATE OR REPLACE FUNCTION redeem_reward(user_id_param UUID, reward_id_param UUID)
RETURNS JSON AS $$
DECLARE
    user_points INTEGER;
    reward_cost INTEGER;
    reward_stock INTEGER;
    reward_type TEXT;
    reward_value JSON;
    result JSON;
BEGIN
    -- Get user points
    SELECT points INTO user_points FROM users WHERE id = user_id_param;
    
    -- Get reward details
    SELECT points_cost, stock, type, value INTO reward_cost, reward_stock, reward_type, reward_value 
    FROM rewards WHERE id = reward_id_param;
    
    -- Check if user has enough points
    IF user_points < reward_cost THEN
        RETURN json_build_object('success', false, 'error', 'Insufficient points');
    END IF;
    
    -- Check if reward is in stock
    IF reward_stock IS NOT NULL AND reward_stock <= 0 THEN
        RETURN json_build_object('success', false, 'error', 'Reward out of stock');
    END IF;
    
    -- Check if user already has pending reward
    IF EXISTS (SELECT 1 FROM user_rewards WHERE user_id = user_id_param AND reward_id = reward_id_param AND status = 'PENDING') THEN
        RETURN json_build_object('success', false, 'error', 'Reward already pending');
    END IF;
    
    -- Deduct points from user
    UPDATE users SET points = points - reward_cost WHERE id = user_id_param;
    
    -- Update reward stock if limited
    IF reward_stock IS NOT NULL THEN
        UPDATE rewards SET stock = stock - 1 WHERE id = reward_id_param;
    END IF;
    
    -- Create user reward record
    INSERT INTO user_rewards (user_id, reward_id, redeemed_at, status)
    VALUES (user_id_param, reward_id_param, NOW(), 'PENDING');
    
    -- Log redemption
    INSERT INTO onboarding_activities (user_id, action, details, created_at)
    VALUES (user_id_param, 'REWARD_REDEEMED', json_build_object('reward_id', reward_id_param, 'points_cost', reward_cost, 'reward_type', reward_type), NOW());
    
    -- Return success
    result = json_build_object(
        'success', true,
        'reward_type', reward_type,
        'reward_value', reward_value,
        'points_deducted', reward_cost,
        'remaining_points', user_points - reward_cost
    );
    
    RETURN result;
END;
$$ language 'plpgsql';

-- Function to get user onboarding progress
CREATE OR REPLACE FUNCTION get_user_onboarding_progress(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
    progress_data JSON;
    total_steps INTEGER;
    completed_steps INTEGER;
    total_required INTEGER;
    completed_required INTEGER;
    completion_percentage NUMERIC;
BEGIN
    -- Get overall progress
    SELECT COUNT(*) INTO total_steps FROM onboarding_steps;
    SELECT COUNT(*) INTO completed_steps FROM user_onboarding_progress WHERE user_id = user_id_param AND status = 'COMPLETED';
    SELECT COUNT(*) INTO total_required FROM onboarding_steps WHERE is_required = true;
    SELECT COUNT(*) INTO completed_required FROM user_onboarding_progress uop JOIN onboarding_steps os ON uop.step_id = os.id WHERE uop.user_id = user_id_param AND uop.status = 'COMPLETED' AND os.is_required = true;
    
    completion_percentage = CASE 
        WHEN total_required = 0 THEN 0
        ELSE (completed_required::NUMERIC / total_required::NUMERIC) * 100
    END;
    
    -- Build progress data
    progress_data = json_build_object(
        'total_steps', total_steps,
        'completed_steps', completed_steps,
        'total_required', total_required,
        'completed_required', completed_required,
        'completion_percentage', completion_percentage,
        'is_completed', (SELECT onboarding_completed FROM users WHERE id = user_id_param),
        'user_points', (SELECT points FROM users WHERE id = user_id_param),
        'current_level', (SELECT json_build_object('id', l.id, 'name', l.name, 'min_points', l.min_points, 'benefits', l.benefits) FROM levels l JOIN users u ON l.id = u.current_level_id WHERE u.id = user_id_param),
        'badges', (SELECT COALESCE(json_agg(json_build_object('id', b.id, 'name', b.name, 'description', b.description, 'icon_url', b.icon_url, 'awarded_at', ub.awarded_at)), '[]') FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = user_id_param),
        'steps', (SELECT COALESCE(json_agg(json_build_object('id', os.id, 'name', os.name, 'description', os.description, 'order', os.order, 'points_reward', os.points_reward, 'is_required', os.isRequired, 'status', uop.status, 'progress_percentage', uop.progress_percentage, 'completed_at', uop.completed_at)), '[]') FROM user_onboarding_progress uop JOIN onboarding_steps os ON uop.step_id = os.id WHERE uop.user_id = user_id_param ORDER BY os.order)
    );
    
    RETURN progress_data;
END;
$$ language 'plpgsql';

-- Function to auto-complete steps based on criteria
CREATE OR REPLACE FUNCTION check_step_completion(user_id_param UUID, action_type TEXT)
RETURNS VOID AS $$
DECLARE
    step_record RECORD;
    criteria JSON;
    should_complete BOOLEAN;
BEGIN
    -- Check each pending step to see if criteria are met
    FOR step_record IN SELECT * FROM onboarding_steps os JOIN user_onboarding_progress uop ON os.id = uop.step_id WHERE uop.user_id = user_id_param AND uop.status = 'PENDING' LOOP
        criteria := step_record.criteria;
        should_complete := false;
        
        -- Check different action types
        IF action_type = 'content_upload' AND criteria->>'action' = 'upload_content' THEN
            -- Check if user has uploaded content
            IF EXISTS (SELECT 1 FROM contents WHERE user_id = user_id_param LIMIT 1) THEN
                should_complete := true;
            END IF;
        ELSIF action_type = 'ai_generation' AND criteria->>'action' = 'generate_ai_content' THEN
            -- Check if user has generated AI content
            IF EXISTS (SELECT 1 FROM contents WHERE user_id = user_id_param AND prompt IS NOT NULL LIMIT 1) THEN
                should_complete := true;
            END IF;
        ELSIF action_type = 'affiliate_referral' AND criteria->>'action' = 'make_referral' THEN
            -- Check if user has made affiliate referrals
            IF EXISTS (SELECT 1 FROM affiliate_referrals WHERE referrer_id = user_id_param LIMIT 1) THEN
                should_complete := true;
            END IF;
        ELSIF action_type = 'profile_completion' AND criteria->>'action' = 'complete_profile' THEN
            -- Check if user has completed profile
            IF EXISTS (SELECT 1 FROM users WHERE id = user_id_param AND name IS NOT NULL AND bio IS NOT NULL LIMIT 1) THEN
                should_complete := true;
            END IF;
        END IF;
        
        -- Complete step if criteria are met
        IF should_complete THEN
            UPDATE user_onboarding_progress 
            SET status = 'COMPLETED', completed_at = NOW(), progress_percentage = 100
            WHERE user_id = user_id_param AND step_id = step_record.id;
        END IF;
    END LOOP;
END;
$$ language 'plpgsql';

-- Create triggers for auto-completion
CREATE OR REPLACE FUNCTION trigger_content_upload_completion()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM check_step_completion(NEW.user_id, 'content_upload');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION trigger_ai_generation_completion()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM check_step_completion(NEW.user_id, 'ai_generation');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION trigger_affiliate_referral_completion()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM check_step_completion(NEW.referrer_id, 'affiliate_referral');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION trigger_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NOT NULL AND NEW.bio IS NOT NULL AND (OLD.name IS NULL OR OLD.bio IS NULL) THEN
        PERFORM check_step_completion(NEW.id, 'profile_completion');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers (these would be created on the respective tables)
-- Note: These are examples - actual table names may vary based on existing schema
-- CREATE TRIGGER on_content_upload AFTER INSERT ON contents FOR EACH ROW EXECUTE FUNCTION trigger_content_upload_completion();
-- CREATE TRIGGER on_ai_generation AFTER INSERT ON ai_generations FOR EACH ROW EXECUTE FUNCTION trigger_ai_generation_completion();
-- CREATE TRIGGER on_affiliate_referral AFTER INSERT ON affiliate_referrals FOR EACH ROW EXECUTE FUNCTION trigger_affiliate_referral_completion();
-- CREATE TRIGGER on_profile_completion AFTER UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_profile_completion();

-- Row Level Security (RLS) Policies
-- Enable RLS on new tables
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for onboarding_steps (public read-only)
CREATE POLICY "Onboarding steps are viewable by everyone" ON onboarding_steps FOR SELECT USING (true);
CREATE POLICY "Only admins can manage onboarding steps" ON onboarding_steps FOR INSERT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Only admins can update onboarding steps" ON onboarding_steps FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Only admins can delete onboarding steps" ON onboarding_steps FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for user_onboarding_progress
CREATE POLICY "Users can view their own progress" ON user_onboarding_progress FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all progress" ON user_onboarding_progress FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "System can insert progress" ON user_onboarding_progress FOR INSERT USING (true);
CREATE POLICY "Users can update their own progress" ON user_onboarding_progress FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can update progress" ON user_onboarding_progress FOR UPDATE USING (true);
CREATE POLICY "Admins can update all progress" ON user_onboarding_progress FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for badges (public read-only)
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);
CREATE POLICY "Only admins can manage badges" ON badges FOR INSERT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Only admins can update badges" ON badges FOR UPDATE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "Only admins can delete badges" ON badges FOR DELETE USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON user_badges FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all badges" ON user_badges FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "System can award badges" ON user_badges FOR INSERT USING (true);
CREATE POLICY "Admins can manage badges" ON user_badges FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for levels (public read-only)
CREATE POLICY "Levels are viewable by everyone" ON levels FOR SELECT USING (true);
CREATE POLICY "Only admins can manage levels" ON levels FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for rewards (public read-only, NSFW-aware)
CREATE POLICY "Rewards are viewable by everyone" ON rewards FOR SELECT USING (true);
CREATE POLICY "NSFW rewards only for NSFW mode" ON rewards FOR SELECT USING (is_nsfw = current_setting('app.nsfw_mode', true)::boolean OR NOT is_nsfw);
CREATE POLICY "Only admins can manage rewards" ON rewards FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for user_rewards
CREATE POLICY "Users can view their own rewards" ON user_rewards FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all rewards" ON user_rewards FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "System can create rewards" ON user_rewards FOR INSERT USING (true);
CREATE POLICY "Users can redeem rewards" ON user_rewards FOR INSERT USING (user_id = auth.uid() AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_paid_member = true));
CREATE POLICY "Admins can manage rewards" ON user_rewards FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- RLS Policies for onboarding_activities
CREATE POLICY "Users can view their own activities" ON onboarding_activities FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all activities" ON onboarding_activities FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
CREATE POLICY "System can log activities" ON onboarding_activities FOR INSERT USING (true);

-- Create views for common queries
CREATE OR REPLACE VIEW user_onboarding_summary AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.points,
    u.onboarding_completed,
    l.name as current_level_name,
    l.min_points as current_level_min_points,
    COUNT(DISTINCT ub.id) as badges_count,
    COUNT(DISTINCT ur.id) as rewards_count,
    COUNT(DISTINCT CASE WHEN uop.status = 'COMPLETED' THEN uop.id END) as completed_steps,
    COUNT(DISTINCT os.id) as total_steps,
    ROUND((COUNT(DISTINCT CASE WHEN uop.status = 'COMPLETED' AND os.is_required = true THEN uop.id END)::NUMERIC / 
           COUNT(DISTINCT CASE WHEN os.is_required = true THEN os.id END)::NUMERIC) * 100, 2) as completion_percentage
FROM users u
LEFT JOIN levels l ON u.current_level_id = l.id
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN user_rewards ur ON u.id = ur.user_id
LEFT JOIN user_onboarding_progress uop ON u.id = uop.user_id
LEFT JOIN onboarding_steps os ON uop.step_id = os.id
GROUP BY u.id, u.email, u.name, u.points, u.onboarding_completed, l.name, l.min_points;

-- Create view for admin analytics
CREATE OR REPLACE VIEW onboarding_analytics AS
SELECT 
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN u.is_paid_member = true THEN u.id END) as paid_users,
    COUNT(DISTINCT CASE WHEN u.onboarding_completed = true THEN u.id END) as completed_onboarding,
    COUNT(DISTINCT CASE WHEN u.is_paid_member = true THEN u.id END)::NUMERIC / 
           COUNT(DISTINCT u.id)::NUMERIC * 100 as paid_conversion_rate,
    COUNT(DISTINCT CASE WHEN u.onboarding_completed = true THEN u.id END)::NUMERIC / 
           COUNT(DISTINCT CASE WHEN u.is_paid_member = true THEN u.id END)::NUMERIC * 100 as onboarding_completion_rate,
    AVG(u.points) as avg_points,
    COUNT(DISTINCT ub.id) as total_badges_awarded,
    COUNT(DISTINCT ur.id) as total_rewards_redeemed,
    COUNT(DISTINCT CASE WHEN os.is_required = true THEN uop.id END) as total_required_steps,
    COUNT(DISTINCT CASE WHEN uop.status = 'COMPLETED' AND os.is_required = true THEN uop.id END) as completed_required_steps
FROM users u
LEFT JOIN user_onboarding_progress uop ON u.id = uop.user_id
LEFT JOIN onboarding_steps os ON uop.step_id = os.id
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN user_rewards ur ON u.id = ur.user_id;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON SCHEMA public TO authenticated;

-- Grant specific permissions for public access
GRANT SELECT ON onboarding_steps TO public;
GRANT SELECT ON badges TO public;
GRANT SELECT ON levels TO public;
GRANT SELECT ON rewards TO public;
GRANT SELECT ON user_onboarding_summary TO public;
GRANT SELECT ON onboarding_analytics TO authenticated;
-- Sample Data Insertion for Onboarding Journey System
-- This script populates the onboarding system with initial data

-- Insert sample onboarding steps
INSERT INTO onboarding_steps (id, name, description, "order", points_reward, is_required, criteria, created_at, updated_at) VALUES
('step-1', 'Complete Profile', 'Fill out your profile information including name, bio, and avatar to get started on your journey.', 1, 100, true, '{"action": "complete_profile", "required_fields": ["name", "bio"]}', NOW(), NOW()),
('step-2', 'Upload First Content', 'Upload your first piece of content to showcase your creativity and start building your portfolio.', 2, 150, true, '{"action": "upload_content", "min_count": 1}', NOW(), NOW()),
('step-3', 'Generate AI Content', 'Use our AI tools to generate your first piece of AI-powered content and explore the possibilities.', 3, 200, true, '{"action": "generate_ai_content", "min_count": 1}', NOW(), NOW()),
('step-4', 'Connect Social Platform', 'Connect at least one social media platform to expand your reach and grow your audience.', 4, 100, true, '{"action": "connect_platform", "min_count": 1}', NOW(), NOW()),
('step-5', 'Make First Referral', 'Share your affiliate link and make your first successful referral to earn bonus points.', 5, 250, true, '{"action": "make_referral", "min_count": 1}', NOW(), NOW()),
('step-6', 'Join Community', 'Join our community forum or Discord server to connect with other creators.', 6, 50, false, '{"action": "join_community", "platform": "discord"}', NOW(), NOW()),
('step-7', 'Complete Tutorial', 'Watch our getting started tutorial to learn all the features and tips for success.', 7, 75, false, '{"action": "complete_tutorial", "tutorial_id": "getting-started"}', NOW(), NOW()),
('step-8', 'Set Up Payment', 'Configure your payment settings to receive earnings from your content and referrals.', 8, 100, true, '{"action": "setup_payment", "methods": ["paypal", "bank_transfer"]}', NOW(), NOW()),
('step-9', 'Create First Post', 'Write and publish your first post to share your thoughts with the community.', 9, 125, false, '{"action": "create_post", "min_count": 1}', NOW(), NOW()),
('step-10', 'Explore Marketplace', 'Browse the marketplace and discover AI models, templates, and other resources.', 10, 50, false, '{"action": "browse_marketplace", "min_duration": 300}', NOW(), NOW());

-- Insert sample badges
INSERT INTO badges (id, name, description, icon_url, criteria, points_required, created_at, updated_at) VALUES
('badge-1', 'Onboarding Beginner', 'Completed your first 3 onboarding steps', '/badges/beginner.png', '{"required_steps": 3, "min_points": 0}', 0, NOW(), NOW()),
('badge-2', 'Profile Master', 'Completed your profile with all information', '/badges/profile-master.png', '{"required_steps": ["step-1"], "min_points": 100}', 100, NOW(), NOW()),
('badge-3', 'Content Creator', 'Uploaded your first piece of content', '/badges/content-creator.png', '{"required_steps": ["step-2"], "min_points": 150}', 150, NOW(), NOW()),
('badge-4', 'AI Pioneer', 'Generated your first AI content', '/badges/ai-pioneer.png', '{"required_steps": ["step-3"], "min_points": 200}', 200, NOW(), NOW()),
('badge-5', 'Social Connector', 'Connected your first social platform', '/badges/social-connector.png', '{"required_steps": ["step-4"], "min_points": 100}', 100, NOW(), NOW()),
('badge-6', 'Referral Expert', 'Made your first successful referral', '/badges/referral-expert.png', '{"required_steps": ["step-5"], "min_points": 250}', 250, NOW(), NOW()),
('badge-7', 'Community Star', 'Joined the community and completed 5 steps', '/badges/community-star.png', '{"required_steps": 5, "min_points": 300}', 300, NOW(), NOW()),
('badge-8', 'Onboarding Master', 'Completed all required onboarding steps', '/badges/onboarding-master.png', '{"required_all_steps": true, "min_points": 800}', 800, NOW(), NOW()),
('badge-9', 'Point Collector', 'Accumulated 1000 points through onboarding', '/badges/point-collector.png', '{"min_points": 1000}', 1000, NOW(), NOW()),
('badge-10', 'Dedicated Creator', 'Completed all 10 onboarding steps', '/badges/dedicated-creator.png', '{"required_steps": 10, "min_points": 1200}', 1200, NOW(), NOW());

-- Insert sample levels
INSERT INTO levels (id, name, min_points, max_points, benefits, created_at, updated_at) VALUES
('level-1', 'Bronze Creator', 0, 299, '{"ai_credits_bonus": 0, "affiliate_bonus": 0.10, "support_priority": "standard"}', NOW(), NOW()),
('level-2', 'Silver Creator', 300, 699, '{"ai_credits_bonus": 10, "affiliate_bonus": 0.12, "support_priority": "priority"}', NOW(), NOW()),
('level-3', 'Gold Creator', 700, 1499, '{"ai_credits_bonus": 25, "affiliate_bonus": 0.15, "support_priority": "vip"}', NOW(), NOW()),
('level-4', 'Platinum Creator', 1500, 2999, '{"ai_credits_bonus": 50, "affiliate_bonus": 0.18, "support_priority": "premium"}', NOW(), NOW()),
('level-5', 'Diamond Creator', 3000, null, '{"ai_credits_bonus": 100, "affiliate_bonus": 0.20, "support_priority": "exclusive", "early_access": true}', NOW(), NOW());

-- Insert sample rewards
INSERT INTO rewards (id, name, description, points_cost, type, value, stock, is_nsfw, created_at, updated_at) VALUES
('reward-1', 'Extra AI Credits - 50', 'Get 50 additional AI generation credits to create more content', 500, 'AI_CREDITS', '{"credits": 50}', null, false, NOW(), NOW()),
('reward-2', 'AI Credits Boost - 100', 'Receive 100 bonus AI generation credits for advanced projects', 900, 'AI_CREDITS', '{"credits": 100}', null, false, NOW(), NOW()),
('reward-3', 'Affiliate Commission Boost', 'Increase your affiliate commission rate by 5% for 30 days', 750, 'AFFILIATE_BONUS', '{"bonus_rate": 0.05, "duration_days": 30}', null, false, NOW(), NOW()),
('reward-4', 'Premium Content Unlock', 'Unlock access to premium content templates and resources', 600, 'CONTENT_UNLOCK', '{"content_ids": ["premium-template-1", "premium-template-2"], "duration_days": 30}', null, true, NOW(), NOW()),
('reward-5', 'AI Style Pack', 'Get access to exclusive AI style packs for unique content creation', 800, 'CONTENT_UNLOCK', '{"style_packs": ["cyberpunk", "anime", "realistic"], "permanent": true}', 50, true, NOW(), NOW()),
('reward-6', 'Priority Support', 'Get priority customer support for 7 days', 400, 'CUSTOM', '{"support_level": "priority", "duration_days": 7}', null, false, NOW(), NOW()),
('reward-7', 'Profile Badge - Featured', 'Display a special "Featured Creator" badge on your profile', 1200, 'CUSTOM', '{"badge_type": "featured", "duration_days": 30}', null, false, NOW(), NOW()),
('reward-8', 'Marketplace Discount', 'Get 25% discount on your next marketplace purchase', 350, 'CUSTOM', '{"discount_percent": 25, "max_discount": 50}', null, false, NOW(), NOW()),
('reward-9', 'Exclusive Content Pack', 'Unlock exclusive NSFW content pack with premium templates', 1000, 'CONTENT_UNLOCK', '{"content_pack": "nsfw-premium", "permanent": true}', 25, true, NOW(), NOW()),
('reward-10', 'AI Generation Boost', 'Double your AI generation speed for 24 hours', 300, 'CUSTOM', '{"speed_multiplier": 2, "duration_hours": 24}', null, false, NOW(), NOW());

-- Insert sample onboarding settings
INSERT INTO gamification_settings (id, gamification_enabled, leaderboard_enabled, achievements_enabled, challenges_enabled, points_per_referral, points_per_sale, level_up_multiplier, created_at, updated_at) VALUES
('settings-1', true, true, true, true, 100, 50, 1.5, NOW(), NOW());

-- Create function to reset user onboarding progress (for admin use)
CREATE OR REPLACE FUNCTION reset_user_onboarding(user_id_param UUID)
RETURNS JSON AS $$
DECLARE
    reset_count INTEGER;
BEGIN
    -- Delete user's onboarding progress
    DELETE FROM user_onboarding_progress WHERE user_id = user_id_param;
    
    -- Get count of deleted records
    GET DIAGNOSTICS reset_count = ROW_COUNT;
    
    -- Reset user's onboarding status
    UPDATE users 
    SET onboarding_completed = false, points = 0, current_level_id = NULL
    WHERE id = user_id_param;
    
    -- Delete user's badges
    DELETE FROM user_badges WHERE user_id = user_id_param;
    
    -- Delete user's rewards (keep claimed ones for audit)
    DELETE FROM user_rewards WHERE user_id = user_id_param AND status = 'PENDING';
    
    -- Log reset action
    INSERT INTO onboarding_activities (user_id, action, details, created_at)
    VALUES (user_id_param, 'STEP_STARTED', json_build_object('event', 'onboarding_reset', 'reset_by', 'admin'), NOW());
    
    -- Re-initialize onboarding if user is still paid member
    IF EXISTS (SELECT 1 FROM users WHERE id = user_id_param AND is_paid_member = true) THEN
        PERFORM initialize_onboarding_journey_for_user(user_id_param);
    END IF;
    
    RETURN json_build_object('success', true, 'reset_count', reset_count, 'message', 'User onboarding progress reset successfully');
END;
$$ language 'plpgsql';

-- Create function to initialize onboarding for specific user
CREATE OR REPLACE FUNCTION initialize_onboarding_journey_for_user(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
    step_record RECORD;
BEGIN
    -- Initialize progress for all onboarding steps
    FOR step_record IN SELECT id FROM onboarding_steps ORDER BY "order" LOOP
        INSERT INTO user_onboarding_progress (user_id, step_id, status, created_at, updated_at)
        VALUES (user_id_param, step_record.id, 'PENDING', NOW(), NOW());
    END LOOP;
    
    -- Log initialization activity
    INSERT INTO onboarding_activities (user_id, action, details, created_at)
    VALUES (user_id_param, 'STEP_STARTED', json_build_object('event', 'onboarding_initialized', 'steps_count', (SELECT COUNT(*) FROM onboarding_steps)), NOW());
END;
$$ language 'plpgsql';

-- Create function to get leaderboard for onboarding progress
CREATE OR REPLACE FUNCTION get_onboarding_leaderboard(limit_param INTEGER DEFAULT 10, timeframe_param TEXT DEFAULT 'all_time')
RETURNS TABLE (
    rank INTEGER,
    user_id UUID,
    user_name TEXT,
    user_email TEXT,
    points INTEGER,
    completed_steps INTEGER,
    total_steps INTEGER,
    completion_percentage NUMERIC,
    badges_count INTEGER,
    level_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            u.id,
            u.name,
            u.email,
            u.points,
            COUNT(DISTINCT CASE WHEN uop.status = 'COMPLETED' THEN uop.id END) as completed_steps,
            (SELECT COUNT(*) FROM onboarding_steps) as total_steps,
            COUNT(DISTINCT ub.id) as badges_count,
            l.name as level_name
        FROM users u
        LEFT JOIN user_onboarding_progress uop ON u.id = uop.user_id
        LEFT JOIN user_badges ub ON u.id = ub.user_id
        LEFT JOIN levels l ON u.current_level_id = l.id
        WHERE u.is_paid_member = true
        GROUP BY u.id, u.name, u.email, u.points, l.name
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY points DESC, completed_steps DESC) as rank,
        user_id,
        user_name,
        user_email,
        points,
        completed_steps,
        total_steps,
        CASE 
            WHEN total_steps = 0 THEN 0
            ELSE (completed_steps::NUMERIC / total_steps::NUMERIC) * 100
        END as completion_percentage,
        badges_count,
        level_name
    FROM user_stats
    ORDER BY points DESC, completed_steps DESC
    LIMIT limit_param;
END;
$$ language 'plpgsql';

-- Create function to award bonus points for specific actions
CREATE OR REPLACE FUNCTION award_bonus_points(user_id_param UUID, points_param INTEGER, reason_param TEXT)
RETURNS JSON AS $$
DECLARE
    current_points INTEGER;
    new_points INTEGER;
BEGIN
    -- Get current user points
    SELECT points INTO current_points FROM users WHERE id = user_id_param;
    
    IF current_points IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update user points
    new_points := current_points + points_param;
    UPDATE users SET points = new_points WHERE id = user_id_param;
    
    -- Log bonus points
    INSERT INTO onboarding_activities (user_id, action, details, created_at)
    VALUES (user_id_param, 'POINTS_EARNED', json_build_object('reason', reason_param, 'bonus_points', points_param, 'total_points', new_points), NOW());
    
    -- Check for level up
    PERFORM check_level_up(user_id_param);
    
    RETURN json_build_object('success', true, 'points_awarded', points_param, 'total_points', new_points);
END;
$$ language 'plpgsql';

-- Create function to check level up
CREATE OR REPLACE FUNCTION check_level_up(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
    user_points INTEGER;
    new_level_id UUID;
BEGIN
    -- Get user points
    SELECT points INTO user_points FROM users WHERE id = user_id_param;
    
    -- Find appropriate level
    SELECT id INTO new_level_id FROM levels 
    WHERE min_points <= user_points AND (max_points IS NULL OR max_points >= user_points)
    ORDER BY min_points DESC LIMIT 1;
    
    -- Update user level if changed
    IF new_level_id IS NOT NULL THEN
        UPDATE users SET current_level_id = new_level_id WHERE id = user_id_param AND current_level_id != new_level_id;
        
        -- Log level up if changed
        IF FOUND THEN
            INSERT INTO onboarding_activities (user_id, action, details, created_at)
            VALUES (user_id_param, 'LEVEL_UP', json_build_object('new_level_id', new_level_id, 'points', user_points), NOW());
        END IF;
    END IF;
END;
$$ language 'plpgsql';

-- Create view for onboarding dashboard statistics
CREATE OR REPLACE VIEW onboarding_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_paid_member = true) as total_paid_users,
    (SELECT COUNT(*) FROM users WHERE onboarding_completed = true) as completed_onboarding,
    (SELECT COUNT(*) FROM user_onboarding_progress WHERE status = 'COMPLETED') as total_completed_steps,
    (SELECT COUNT(*) FROM user_badges) as total_badges_awarded,
    (SELECT COUNT(*) FROM user_rewards WHERE status = 'CLAIMED') as total_rewards_claimed,
    (SELECT AVG(points) FROM users WHERE is_paid_member = true) as avg_points_per_user,
    (SELECT COUNT(*) FROM onboarding_activities WHERE created_at >= NOW() - INTERVAL '7 days') as activities_last_7_days,
    (SELECT COUNT(*) FROM user_rewards WHERE redeemed_at >= NOW() - INTERVAL '7 days') as rewards_redeemed_last_7_days;

-- Grant execute permissions for new functions
GRANT EXECUTE ON FUNCTION reset_user_onboarding(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION initialize_onboarding_journey_for_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_onboarding_leaderboard(INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION award_bonus_points(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_level_up(UUID) TO authenticated;
GRANT SELECT ON onboarding_dashboard_stats TO authenticated;
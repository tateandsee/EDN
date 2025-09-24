-- Sample Queries for Onboarding Journey System
-- These queries demonstrate common operations and analytics

-- 1. Get user's complete onboarding progress
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
WHERE u.id = 'USER_ID_HERE' -- Replace with actual user ID
GROUP BY u.id, u.email, u.name, u.points, u.onboarding_completed, l.name, l.min_points;

-- 2. Get detailed step progress for a user
SELECT 
    os.id,
    os.name,
    os.description,
    os."order",
    os.points_reward,
    os.is_required,
    uop.status,
    uop.progress_percentage,
    uop.completed_at,
    uop.created_at,
    uop.updated_at
FROM onboarding_steps os
LEFT JOIN user_onboarding_progress uop ON os.id = uop.step_id AND uop.user_id = 'USER_ID_HERE'
ORDER BY os."order";

-- 3. Get user's badges with details
SELECT 
    b.id,
    b.name,
    b.description,
    b.icon_url,
    b.points_required,
    ub.awarded_at
FROM badges b
JOIN user_badges ub ON b.id = ub.badge_id
WHERE ub.user_id = 'USER_ID_HERE'
ORDER BY ub.awarded_at DESC;

-- 4. Get available rewards for a user based on points
SELECT 
    r.id,
    r.name,
    r.description,
    r.points_cost,
    r.type,
    r.value,
    r.stock,
    r.is_nsfw
FROM rewards r
WHERE r.points_cost <= (SELECT points FROM users WHERE id = 'USER_ID_HERE')
ORDER BY r.points_cost;

-- 5. Get user's reward redemption history
SELECT 
    r.id,
    r.name,
    r.description,
    r.type,
    ur.redeemed_at,
    ur.status
FROM user_rewards ur
JOIN rewards r ON ur.reward_id = r.id
WHERE ur.user_id = 'USER_ID_HERE'
ORDER BY ur.redeemed_at DESC;

-- 6. Get user's recent activities
SELECT 
    action,
    details,
    created_at
FROM onboarding_activities
WHERE user_id = 'USER_ID_HERE'
ORDER BY created_at DESC
LIMIT 20;

-- 7. Get onboarding analytics (admin view)
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
    COUNT(DISTINCT ur.id) as total_rewards_redeemed
FROM users u
LEFT JOIN user_badges ub ON u.id = ub.user_id
LEFT JOIN user_rewards ur ON u.id = ur.user_id;

-- 8. Get step completion statistics
SELECT 
    os.id,
    os.name,
    os.is_required,
    COUNT(uop.id) as total_users,
    COUNT(CASE WHEN uop.status = 'COMPLETED' THEN uop.id END) as completed_users,
    COUNT(CASE WHEN uop.status = 'IN_PROGRESS' THEN uop.id END) as in_progress_users,
    COUNT(CASE WHEN uop.status = 'PENDING' THEN uop.id END) as pending_users,
    ROUND(COUNT(CASE WHEN uop.status = 'COMPLETED' THEN uop.id END)::NUMERIC / 
           COUNT(uop.id)::NUMERIC * 100, 2) as completion_rate
FROM onboarding_steps os
LEFT JOIN user_onboarding_progress uop ON os.id = uop.step_id
GROUP BY os.id, os.name, os.is_required
ORDER BY os."order";

-- 9. Get badge popularity statistics
SELECT 
    b.id,
    b.name,
    b.description,
    COUNT(ub.id) as times_awarded,
    b.points_required
FROM badges b
LEFT JOIN user_badges ub ON b.id = ub.badge_id
GROUP BY b.id, b.name, b.description, b.points_required
ORDER BY times_awarded DESC;

-- 10. Get reward redemption statistics
SELECT 
    r.id,
    r.name,
    r.type,
    r.points_cost,
    COUNT(ur.id) as times_redeemed,
    COUNT(CASE WHEN ur.status = 'CLAIMED' THEN ur.id END) as claimed_count,
    COUNT(CASE WHEN ur.status = 'PENDING' THEN ur.id END) as pending_count,
    r.stock
FROM rewards r
LEFT JOIN user_rewards ur ON r.id = ur.reward_id
GROUP BY r.id, r.name, r.type, r.points_cost, r.stock
ORDER BY times_redeemed DESC;

-- 11. Get leaderboard using the function
SELECT * FROM get_onboarding_leaderboard(10, 'all_time');

-- 12. Get users stuck at specific steps
SELECT 
    os.name as step_name,
    os."order" as step_order,
    COUNT(uop.id) as stuck_users,
    AVG(uop.progress_percentage) as avg_progress
FROM user_onboarding_progress uop
JOIN onboarding_steps os ON uop.step_id = os.id
WHERE uop.status = 'IN_PROGRESS' 
   AND uop.updated_at < NOW() - INTERVAL '7 days'
GROUP BY os.id, os.name, os."order"
ORDER BY stuck_users DESC;

-- 13. Get onboarding completion trends over time
SELECT 
    DATE_TRUNC('day', oa.created_at) as date,
    COUNT(DISTINCT CASE WHEN oa.action = 'ONBOARDING_COMPLETED' THEN oa.user_id END) as completed_count,
    COUNT(DISTINCT CASE WHEN oa.action = 'STEP_STARTED' THEN oa.user_id END) as started_count
FROM onboarding_activities oa
WHERE oa.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', oa.created_at)
ORDER BY date;

-- 14. Get level distribution
SELECT 
    l.name as level_name,
    l.min_points,
    l.max_points,
    COUNT(u.id) as user_count,
    ROUND(COUNT(u.id)::NUMERIC / (SELECT COUNT(*) FROM users WHERE is_paid_member = true)::NUMERIC * 100, 2) as percentage
FROM levels l
LEFT JOIN users u ON l.id = u.current_level_id
GROUP BY l.id, l.name, l.min_points, l.max_points
ORDER BY l.min_points;

-- 15. Get reward popularity by type
SELECT 
    r.type,
    COUNT(ur.id) as redemption_count,
    AVG(r.points_cost) as avg_points_cost,
    SUM(CASE WHEN ur.status = 'CLAIMED' THEN 1 ELSE 0 END) as claimed_count
FROM rewards r
LEFT JOIN user_rewards ur ON r.id = ur.reward_id
GROUP BY r.type
ORDER BY redemption_count DESC;

-- 16. Get users who need attention (low progress)
SELECT 
    u.id,
    u.email,
    u.name,
    u.points,
    u.onboarding_completed,
    COUNT(uop.id) as total_steps_assigned,
    COUNT(CASE WHEN uop.status = 'COMPLETED' THEN uop.id END) as completed_steps,
    ROUND(COUNT(CASE WHEN uop.status = 'COMPLETED' THEN uop.id END)::NUMERIC / 
           COUNT(uop.id)::NUMERIC * 100, 2) as completion_rate,
    MAX(uop.updated_at) as last_activity
FROM users u
JOIN user_onboarding_progress uop ON u.id = uop.user_id
WHERE u.is_paid_member = true
   AND u.onboarding_completed = false
   AND uop.updated_at < NOW() - INTERVAL '3 days'
GROUP BY u.id, u.email, u.name, u.points, u.onboarding_completed
HAVING completion_rate < 50
ORDER BY completion_rate ASC, last_activity ASC;

-- 17. Get onboarding performance metrics
SELECT 
    os.name as step_name,
    AVG(EXTRACT(EPOCH FROM (uop.completed_at - uop.created_at))/3600) as avg_completion_hours,
    MIN(EXTRACT(EPOCH FROM (uop.completed_at - uop.created_at))/3600) as min_completion_hours,
    MAX(EXTRACT(EPOCH FROM (uop.completed_at - uop.created_at))/3600) as max_completion_hours,
    COUNT(uop.id) as completion_count
FROM user_onboarding_progress uop
JOIN onboarding_steps os ON uop.step_id = os.id
WHERE uop.status = 'COMPLETED'
   AND uop.completed_at IS NOT NULL
GROUP BY os.id, os.name
ORDER BY avg_completion_hours;

-- 18. Get points distribution analysis
SELECT 
    CASE 
        WHEN u.points = 0 THEN '0 points'
        WHEN u.points BETWEEN 1 AND 99 THEN '1-99 points'
        WHEN u.points BETWEEN 100 AND 299 THEN '100-299 points'
        WHEN u.points BETWEEN 300 AND 699 THEN '300-699 points'
        WHEN u.points BETWEEN 700 AND 1499 THEN '700-1499 points'
        WHEN u.points >= 1500 THEN '1500+ points'
    END as points_range,
    COUNT(u.id) as user_count,
    ROUND(COUNT(u.id)::NUMERIC / (SELECT COUNT(*) FROM users WHERE is_paid_member = true)::NUMERIC * 100, 2) as percentage
FROM users u
WHERE u.is_paid_member = true
GROUP BY 
    CASE 
        WHEN u.points = 0 THEN '0 points'
        WHEN u.points BETWEEN 1 AND 99 THEN '1-99 points'
        WHEN u.points BETWEEN 100 AND 299 THEN '100-299 points'
        WHEN u.points BETWEEN 300 AND 699 THEN '300-699 points'
        WHEN u.points BETWEEN 700 AND 1499 THEN '700-1499 points'
        WHEN u.points >= 1500 THEN '1500+ points'
    END
ORDER BY 
    CASE 
        WHEN u.points = 0 THEN 0
        WHEN u.points BETWEEN 1 AND 99 THEN 1
        WHEN u.points BETWEEN 100 AND 299 THEN 2
        WHEN u.points BETWEEN 300 AND 699 THEN 3
        WHEN u.points BETWEEN 700 AND 1499 THEN 4
        WHEN u.points >= 1500 THEN 5
    END;
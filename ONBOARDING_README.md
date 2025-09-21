# Gamified Onboarding Journey System

A comprehensive gamified onboarding journey system exclusively for paid users, featuring progress tracking, achievements, rewards, and real-time updates.

## 🎯 Overview

This system enhances user engagement post-subscription by incorporating game-like elements such as:
- **Progress Tracking**: Visual progress bars and completion metrics
- **Steps/Tasks**: Sequential and optional onboarding tasks
- **Points System**: Earn points for completing activities
- **Badges**: Achievement badges based on completion criteria
- **Levels**: User progression based on accumulated points
- **Rewards**: Redeemable items and benefits
- **Real-time Updates**: Live progress updates via subscriptions

## 🚀 Features

### Core Features
- **Paid User Exclusive**: Only accessible to users with `is_paid_member = true`
- **Auto-initialization**: Triggers automatically when user becomes paid
- **Gamification Elements**: Points, badges, levels, rewards, and achievements
- **Progress Tracking**: Real-time progress visualization and analytics
- **Reward Redemption**: Point-based reward system with various benefit types
- **Admin Dashboard**: Comprehensive management and analytics tools

### Technical Features
- **Edge Functions**: Serverless functions for core operations
- **Realtime Subscriptions**: Live updates for progress and activities
- **Row Level Security**: Secure access control for paid users only
- **Database Functions**: Complex operations with transaction safety
- **Comprehensive Logging**: Activity tracking for analytics and debugging
- **Scalable Architecture**: Optimized for high performance and growth

## 📋 Requirements

### System Requirements
- **Supabase**: PostgreSQL database with Supabase platform
- **Node.js**: Version 16+ for edge functions
- **Supabase CLI**: For deployment and management

### User Requirements
- **Paid Membership**: Users must have `is_paid_member = true`
- **Authentication**: Valid user session required
- **NSFW Mode**: Configurable based on user preferences

## 🛠️ Installation

### 1. Prerequisites

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Install project dependencies
npm install
```

### 2. Database Setup

```bash
# Push schema changes to database
npm run db:push

# Run the deployment script
chmod +x deploy-onboarding.sh
./deploy-onboarding.sh
```

### 3. Sample Data (Optional)

```bash
# Insert sample data for testing
supabase db shell --command "$(cat onboarding-sample-data.sql)"
```

## 🗄️ Database Schema

### Core Tables

#### Users Table (Updated)
```sql
ALTER TABLE users ADD COLUMN is_paid_member BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN current_level_id UUID;
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;
```

#### Onboarding Steps
```sql
CREATE TABLE onboarding_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    order INTEGER NOT NULL,
    points_reward INTEGER DEFAULT 100,
    is_required BOOLEAN DEFAULT true,
    criteria JSON,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

#### User Progress
```sql
CREATE TABLE user_onboarding_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    step_id UUID REFERENCES onboarding_steps(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'PENDING',
    completed_at TIMESTAMP,
    progress_percentage FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, step_id)
);
```

#### Badges System
```sql
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT,
    criteria JSON NOT NULL,
    points_required INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP DEFAULT now(),
    UNIQUE(user_id, badge_id)
);
```

#### Levels System
```sql
CREATE TABLE levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    min_points INTEGER NOT NULL,
    max_points INTEGER,
    benefits JSON,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

#### Rewards System
```sql
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    points_cost INTEGER NOT NULL,
    type TEXT NOT NULL,
    value JSON,
    stock INTEGER,
    is_nsfw BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE user_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP DEFAULT now(),
    status TEXT DEFAULT 'PENDING'
);
```

#### Activity Logging
```sql
CREATE TABLE onboarding_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSON,
    created_at TIMESTAMP DEFAULT now()
);
```

## ⚡ Edge Functions

### 1. Onboarding Initialization
**Endpoint**: `POST /functions/v1/onboarding-init`

Initializes the onboarding journey for a paid user.

```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/onboarding-init`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ userId: user.id })
});
```

### 2. Reward Redemption
**Endpoint**: `POST /functions/v1/redeem-reward`

Handles reward redemption with point deduction and benefit application.

```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/redeem-reward`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: user.id,
    rewardId: reward.id
  })
});
```

### 3. Progress Retrieval
**Endpoint**: `GET /functions/v1/onboarding-progress`

Retrieves comprehensive onboarding progress for a user.

```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/onboarding-progress`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'x-nsfw-mode': 'true'
  }
});
```

### 4. Admin Management
**Endpoint**: `/functions/v1/admin-onboarding/*`

Provides CRUD operations for onboarding management.

```javascript
// Get analytics
const analytics = await fetch(`${SUPABASE_URL}/functions/v1/admin-onboarding/analytics`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

// Manage steps
const steps = await fetch(`${SUPABASE_URL}/functions/v1/admin-onboarding/steps`, {
  method: 'GET',
  headers: { 'Authorization': `Bearer ${adminToken}` }
});
```

## 🔧 Database Functions

### Core Functions

#### `get_user_onboarding_progress(user_id_param UUID)`
Returns comprehensive progress data for a user.

```sql
SELECT * FROM get_user_onboarding_progress('user-uuid');
```

#### `redeem_reward(user_id_param UUID, reward_id_param UUID)`
Handles reward redemption with transaction safety.

```sql
SELECT * FROM redeem_reward('user-uuid', 'reward-uuid');
```

#### `get_onboarding_leaderboard(limit_param INTEGER, timeframe_param TEXT)`
Returns leaderboard data for onboarding progress.

```sql
SELECT * FROM get_onboarding_leaderboard(10, 'all_time');
```

#### `award_bonus_points(user_id_param UUID, points_param INTEGER, reason_param TEXT)`
Awards bonus points to a user with logging.

```sql
SELECT * FROM award_bonus_points('user-uuid', 100, 'Special bonus');
```

#### `reset_user_onboarding(user_id_param UUID)`
Resets a user's onboarding progress (admin only).

```sql
SELECT * FROM reset_user_onboarding('user-uuid');
```

## 🔄 Realtime Subscriptions

### Setting Up Subscriptions

```javascript
// User progress changes
const progressChannel = supabase
  .channel('user-progress')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_onboarding_progress',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Progress updated:', payload);
      // Update UI
    }
  )
  .subscribe();

// Points changes
const pointsChannel = supabase
  .channel('user-points')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'users',
      filter: `id=eq.${userId}`
    },
    (payload) => {
      console.log('Points updated:', payload.new.points);
      // Update points display
    }
  )
  .subscribe();

// New badges
const badgesChannel = supabase
  .channel('user-badges')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'user_badges',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New badge earned:', payload.new);
      // Show notification
    }
  )
  .subscribe();
```

### Cleaning Up Subscriptions

```javascript
// Unsubscribe from all channels
supabase.removeChannel(progressChannel);
supabase.removeChannel(pointsChannel);
supabase.removeChannel(badgesChannel);
```

## 🎨 Frontend Integration

### React Hook for Onboarding

```javascript
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export function useOnboardingProgress(userId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/onboarding-progress`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.session.access_token}`,
            'x-nsfw-mode': 'true'
          }
        });

        const data = await response.json();
        setProgress(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchProgress();
  }, [userId]);

  return { progress, loading, error };
}
```

### Progress Bar Component

```javascript
export function ProgressBar({ steps }) {
  const completedSteps = steps.filter(step => step.status === 'COMPLETED').length;
  const totalSteps = steps.length;
  const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>{completedSteps} of {totalSteps} steps completed</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

### Reward Redemption Component

```javascript
export function RewardCard({ reward, userId, onRedeem }) {
  const [redeeming, setRedeeming] = useState(false);

  const handleRedeem = async () => {
    setRedeeming(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/redeem-reward`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, rewardId: reward.id })
      });

      const data = await response.json();
      if (data.success) {
        onRedeem(data);
      }
    } catch (error) {
      console.error('Redemption failed:', error);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="reward-card">
      <h3>{reward.name}</h3>
      <p>{reward.description}</p>
      <div className="reward-cost">{reward.points_cost} points</div>
      <button 
        onClick={handleRedeem}
        disabled={redeeming}
        className="redeem-button"
      >
        {redeeming ? 'Redeeming...' : 'Redeem'}
      </button>
    </div>
  );
}
```

## 📊 Analytics and Reporting

### Key Metrics

#### User Engagement Metrics
- **Onboarding Completion Rate**: Percentage of paid users who complete onboarding
- **Step Completion Rates**: Individual step completion percentages
- **Average Completion Time**: Time taken to complete onboarding
- **Points Distribution**: User points distribution across levels

#### Reward System Metrics
- **Redemption Rate**: Percentage of available rewards being redeemed
- **Popular Rewards**: Most redeemed reward types
- **Points Economy**: Points earned vs. points spent ratio
- **Reward Effectiveness**: Impact of rewards on user engagement

#### Activity Metrics
- **Daily Active Users**: Users engaging with onboarding daily
- **Activity Frequency**: How often users complete steps
- **Drop-off Points**: Where users abandon the onboarding process
- **Completion Patterns**: Time-based completion patterns

### Sample Queries

```sql
-- Get completion rates by step
SELECT 
    os.name,
    COUNT(uop.id) as total_users,
    COUNT(CASE WHEN uop.status = 'COMPLETED' THEN uop.id END) as completed_users,
    ROUND(COUNT(CASE WHEN uop.status = 'COMPLETED' THEN uop.id END)::NUMERIC / 
           COUNT(uop.id)::NUMERIC * 100, 2) as completion_rate
FROM onboarding_steps os
LEFT JOIN user_onboarding_progress uop ON os.id = uop.step_id
GROUP BY os.id, os.name;

-- Get leaderboard
SELECT * FROM get_onboarding_leaderboard(10, 'all_time');

-- Get user engagement trends
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(DISTINCT user_id) as active_users,
    COUNT(CASE WHEN action = 'STEP_COMPLETED' THEN 1 END) as steps_completed
FROM onboarding_activities
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date;
```

## 🔐 Security

### Row Level Security (RLS)

The system implements comprehensive RLS policies:

#### User Access Control
- **Paid Users Only**: All onboarding features restricted to paid members
- **Own Data Only**: Users can only access their own progress and rewards
- **Admin Override**: Administrators can access all data for management

#### Data Protection
- **Sensitive Data**: User points and progress are protected
- **NSFW Content**: Rewards and content respect NSFW preferences
- **Audit Trail**: All actions are logged for security and analytics

### Authentication & Authorization

```sql
-- Example RLS Policies
CREATE POLICY "Users can view their own progress" 
ON user_onboarding_progress FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Only paid users can redeem rewards" 
ON user_rewards FOR INSERT 
USING (
  user_id = auth.uid() 
  AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_paid_member = true)
);
```

## 🚀 Deployment

### Automated Deployment

```bash
# Make deployment script executable
chmod +x deploy-onboarding.sh

# Run deployment
./deploy-onboarding.sh
```

### Manual Deployment

```bash
# Deploy database schema
supabase db push

# Deploy edge functions
supabase functions deploy onboarding-init
supabase functions deploy redeem-reward
supabase functions deploy onboarding-progress
supabase functions deploy admin-onboarding

# Create storage bucket
supabase storage create buckets onboarding-assets

# Insert sample data (optional)
supabase db shell --command "$(cat onboarding-sample-data.sql)"
```

### Environment Variables

```bash
# Required environment variables
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_NSFW_MODE=false
```

## 🧪 Testing

### Unit Testing

```javascript
// Test onboarding initialization
test('should initialize onboarding for paid user', async () => {
  const response = await fetch('/functions/v1/onboarding-init', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${paidUserToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId: paidUserId })
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
});

// Test reward redemption
test('should redeem reward with sufficient points', async () => {
  const response = await fetch('/functions/v1/redeem-reward', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: userId,
      rewardId: rewardId
    })
  });

  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
});
```

### Integration Testing

```javascript
// Test complete onboarding flow
test('should handle complete onboarding journey', async () => {
  // 1. Initialize onboarding
  const initResponse = await initializeOnboarding(userId);
  expect(initResponse.success).toBe(true);

  // 2. Complete steps (simulate user actions)
  await completeStep(userId, 'step-1');
  await completeStep(userId, 'step-2');

  // 3. Check progress
  const progress = await getOnboardingProgress(userId);
  expect(progress.data.completed_steps).toBe(2);

  // 4. Redeem reward
  const redemption = await redeemReward(userId, 'reward-1');
  expect(redemption.success).toBe(true);

  // 5. Verify points deducted
  const updatedProgress = await getOnboardingProgress(userId);
  expect(updatedProgress.data.user.points).toBeLessThan(initialPoints);
});
```

## 📈 Monitoring

### Key Performance Indicators

#### User Metrics
- **Onboarding Start Rate**: Percentage of paid users starting onboarding
- **Completion Rate**: Percentage of users completing all required steps
- **Drop-off Rate**: Users abandoning the onboarding process
- **Time to Complete**: Average time to complete onboarding

#### Engagement Metrics
- **Daily Active Users**: Users engaging with onboarding features
- **Step Completion Rate**: Individual step completion rates
- **Reward Redemption Rate**: Percentage of rewards being redeemed
- **Points Economy Health**: Balance between points earned and spent

#### Technical Metrics
- **API Response Times**: Edge function performance
- **Database Query Performance**: Query optimization metrics
- **Realtime Subscription Health**: Connection stability
- **Error Rates**: System error frequency

### Monitoring Setup

```javascript
// Example monitoring setup
const monitoring = {
  // Track API performance
  trackApiCall: (endpoint, duration, success) => {
    console.log(`API Call: ${endpoint}, Duration: ${duration}ms, Success: ${success}`);
  },

  // Track user engagement
  trackUserAction: (userId, action, details) => {
    console.log(`User Action: ${userId}, ${action}`, details);
  },

  // Track errors
  trackError: (error, context) => {
    console.error('Error:', error, 'Context:', context);
  }
};
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Onboarding Not Initializing
**Problem**: User becomes paid but onboarding doesn't start

**Solution**: 
- Check if `is_paid_member` trigger is working
- Verify user has `is_paid_member = true`
- Check database logs for trigger errors

#### 2. Points Not Awarding
**Problem**: Steps completed but points not awarded

**Solution**:
- Check if step completion trigger is working
- Verify step criteria are met
- Check `award_onboarding_points` function logs

#### 3. Realtime Updates Not Working
**Problem**: Progress not updating in real-time

**Solution**:
- Verify Supabase realtime is enabled
- Check client-side subscription setup
- Ensure proper RLS policies for realtime

#### 4. Reward Redemption Failing
**Problem**: Users cannot redeem rewards

**Solution**:
- Check user has sufficient points
- Verify reward is in stock
- Check `redeem_reward` function logs

### Debug Queries

```sql
-- Check user's paid status
SELECT id, email, is_paid_member, points, onboarding_completed 
FROM users 
WHERE id = 'user-uuid';

-- Check onboarding progress
SELECT uop.*, os.name, os.points_reward
FROM user_onboarding_progress uop
JOIN onboarding_steps os ON uop.step_id = os.id
WHERE uop.user_id = 'user-uuid'
ORDER BY os."order";

-- Check recent activities
SELECT action, details, created_at
FROM onboarding_activities
WHERE user_id = 'user-uuid'
ORDER BY created_at DESC
LIMIT 10;

-- Check reward availability
SELECT id, name, points_cost, stock, is_nsfw
FROM rewards
WHERE id = 'reward-uuid';
```

## 📚 API Documentation

For complete API documentation, see [onboarding-api-examples.md](./onboarding-api-examples.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the API documentation
- Contact the development team

---

**Built with ❤️ using Supabase, TypeScript, and modern web technologies.**
# Onboarding Journey API Documentation

This document provides comprehensive API examples and usage guidelines for the gamified onboarding journey system.

## Table of Contents
1. [Edge Functions](#edge-functions)
2. [Database Functions](#database-functions)
3. [Realtime Subscriptions](#realtime-subscriptions)
4. [Frontend Integration](#frontend-integration)
5. [Admin API](#admin-api)
6. [Error Handling](#error-handling)
7. [Sample Data](#sample-data)

## Edge Functions

### 1. Initialize Onboarding

**Endpoint:** `POST /functions/v1/onboarding-init`

**Description:** Initializes the onboarding journey for a paid user.

**Request Body:**
```json
{
  "userId": "user-uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Onboarding journey initialized successfully",
  "steps_count": 10
}
```

**Example Usage:**
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/onboarding-init`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: user.id
  })
});

const data = await response.json();
```

### 2. Redeem Reward

**Endpoint:** `POST /functions/v1/redeem-reward`

**Description:** Redeems a reward using user points.

**Request Body:**
```json
{
  "userId": "user-uuid-here",
  "rewardId": "reward-uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reward redeemed successfully",
  "reward": {
    "id": "reward-1",
    "name": "Extra AI Credits - 50",
    "type": "AI_CREDITS",
    "points_cost": 500
  },
  "points_deducted": 500,
  "remaining_points": 1500,
  "benefit_applied": true
}
```

**Example Usage:**
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/redeem-reward`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: user.id,
    rewardId: selectedReward.id
  })
});

const data = await response.json();
```

### 3. Get Onboarding Progress

**Endpoint:** `GET /functions/v1/onboarding-progress`

**Description:** Retrieves comprehensive onboarding progress for a user.

**Headers:**
```
Authorization: Bearer {user-token}
x-nsfw-mode: true/false (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "points": 2000,
      "onboarding_completed": false,
      "current_level_id": "level-3"
    },
    "progress": {
      "total_steps": 10,
      "completed_steps": 7,
      "total_required": 8,
      "completed_required": 6,
      "completion_percentage": 75.0,
      "is_completed": false,
      "user_points": 2000,
      "current_level": {
        "id": "level-3",
        "name": "Gold Creator",
        "min_points": 700,
        "benefits": {
          "ai_credits_bonus": 25,
          "affiliate_bonus": 0.15,
          "support_priority": "vip"
        }
      },
      "badges": [
        {
          "id": "badge-1",
          "name": "Onboarding Beginner",
          "description": "Completed your first 3 onboarding steps",
          "icon_url": "/badges/beginner.png",
          "awarded_at": "2024-01-15T10:30:00Z"
        }
      ],
      "steps": [
        {
          "id": "step-1",
          "name": "Complete Profile",
          "description": "Fill out your profile information...",
          "order": 1,
          "points_reward": 100,
          "is_required": true,
          "status": "COMPLETED",
          "progress_percentage": 100,
          "completed_at": "2024-01-15T10:30:00Z"
        }
      ]
    },
    "available_rewards": [
      {
        "id": "reward-1",
        "name": "Extra AI Credits - 50",
        "description": "Get 50 additional AI generation credits",
        "points_cost": 500,
        "type": "AI_CREDITS",
        "value": {
          "credits": 50
        },
        "stock": null,
        "is_nsfw": false
      }
    ],
    "redeemed_rewards": [
      {
        "id": "reward-redemption-1",
        "reward_id": "reward-1",
        "redeemed_at": "2024-01-16T14:20:00Z",
        "status": "CLAIMED",
        "rewards": {
          "id": "reward-1",
          "name": "Extra AI Credits - 50",
          "type": "AI_CREDITS",
          "description": "Get 50 additional AI generation credits",
          "points_cost": 500
        }
      }
    ],
    "recent_activities": [
      {
        "id": "activity-1",
        "user_id": "user-uuid",
        "action": "POINTS_EARNED",
        "details": {
          "step_id": "step-2",
          "points": 150,
          "total_points": 2000
        },
        "created_at": "2024-01-16T15:30:00Z"
      }
    ],
    "next_level": {
      "id": "level-4",
      "name": "Platinum Creator",
      "min_points": 1500,
      "max_points": 2999,
      "benefits": {
        "ai_credits_bonus": 50,
        "affiliate_bonus": 0.18,
        "support_priority": "premium"
      }
    }
  }
}
```

**Example Usage:**
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/onboarding-progress`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'x-nsfw-mode': 'true'
  }
});

const data = await response.json();
```

### 4. Admin Onboarding Management

**Base URL:** `/functions/v1/admin-onboarding`

#### 4.1 Manage Steps

**GET /admin-onboarding/steps** - Get all onboarding steps
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-onboarding/steps`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

**POST /admin-onboarding/steps** - Create new step
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-onboarding/steps`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "New Step",
    description: "Step description",
    order: 11,
    points_reward: 100,
    is_required: true,
    criteria: {"action": "custom_action"}
  })
});
```

**PUT /admin-onboarding/steps?id={stepId}** - Update step
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-onboarding/steps?id=${stepId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Updated Step Name",
    points_reward: 150
  })
});
```

**DELETE /admin-onboarding/steps?id={stepId}** - Delete step
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-onboarding/steps?id=${stepId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

#### 4.2 Get Analytics

**GET /admin-onboarding/analytics** - Get comprehensive analytics
```javascript
const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-onboarding/analytics`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall_analytics": {
      "total_users": 150,
      "paid_users": 45,
      "completed_onboarding": 32,
      "paid_conversion_rate": 30.0,
      "onboarding_completion_rate": 71.1,
      "avg_points": 850.5,
      "total_badges_awarded": 128,
      "total_rewards_redeemed": 67
    },
    "step_completion_rates": [
      {
        "step_id": "step-1",
        "name": "Complete Profile",
        "is_required": true,
        "total": 45,
        "completed": 42,
        "in_progress": 2,
        "pending": 1,
        "completion_rate": 93.3
      }
    ],
    "badge_distribution": [
      {
        "badge_id": "badge-1",
        "name": "Onboarding Beginner",
        "count": 38
      }
    ],
    "reward_redemption_stats": [
      {
        "reward_id": "reward-1",
        "name": "Extra AI Credits - 50",
        "type": "AI_CREDITS",
        "points_cost": 500,
        "total": 25,
        "pending": 2,
        "claimed": 23,
        "expired": 0
      }
    ]
  }
}
```

## Database Functions

### 1. Get User Onboarding Progress

**Function:** `get_user_onboarding_progress(user_id_param UUID)`

**Description:** Returns comprehensive progress data for a user.

**Usage:**
```javascript
const { data, error } = await supabase
  .rpc('get_user_onboarding_progress', { 
    user_id_param: userId 
  });
```

### 2. Redeem Reward

**Function:** `redeem_reward(user_id_param UUID, reward_id_param UUID)`

**Description:** Handles reward redemption with transaction safety.

**Usage:**
```javascript
const { data, error } = await supabase
  .rpc('redeem_reward', { 
    user_id_param: userId,
    reward_id_param: rewardId 
  });
```

### 3. Get Onboarding Leaderboard

**Function:** `get_onboarding_leaderboard(limit_param INTEGER, timeframe_param TEXT)`

**Description:** Returns leaderboard data for onboarding progress.

**Usage:**
```javascript
const { data, error } = await supabase
  .rpc('get_onboarding_leaderboard', { 
    limit_param: 10,
    timeframe_param: 'all_time' 
  });
```

### 4. Award Bonus Points

**Function:** `award_bonus_points(user_id_param UUID, points_param INTEGER, reason_param TEXT)`

**Description:** Awards bonus points to a user with logging.

**Usage:**
```javascript
const { data, error } = await supabase
  .rpc('award_bonus_points', { 
    user_id_param: userId,
    points_param: 100,
    reason_param: 'Special bonus for engagement' 
  });
```

### 5. Reset User Onboarding

**Function:** `reset_user_onboarding(user_id_param UUID)`

**Description:** Resets a user's onboarding progress (admin only).

**Usage:**
```javascript
const { data, error } = await supabase
  .rpc('reset_user_onboarding', { 
    user_id_param: userId 
  });
```

## Realtime Subscriptions

### 1. Subscribe to User Progress

```javascript
// Subscribe to user's onboarding progress changes
const channel = supabase
  .channel('user-onboarding')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_onboarding_progress',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Progress changed:', payload);
      // Update UI with new progress data
    }
  )
  .subscribe();

// Subscribe to user's points changes
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

// Subscribe to new badges
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
      // Show badge notification
    }
  )
  .subscribe();

// Subscribe to activities
const activitiesChannel = supabase
  .channel('user-activities')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'onboarding_activities',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New activity:', payload.new);
      // Update activity feed
    }
  )
  .subscribe();
```

### 2. Unsubscribe from Channels

```javascript
// Cleanup subscriptions
supabase.removeChannel(channel);
supabase.removeChannel(pointsChannel);
supabase.removeChannel(badgesChannel);
supabase.removeChannel(activitiesChannel);
```

## Frontend Integration

### 1. React Hook for Onboarding Progress

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
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/onboarding-progress`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.session.access_token}`,
            'x-nsfw-mode': 'true' // or get from context
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch progress');
        }

        const data = await response.json();
        setProgress(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  // Setup realtime subscriptions
  useEffect(() => {
    if (!userId) return;

    const channels = [];

    // Progress changes
    const progressChannel = supabase
      .channel(`progress-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_onboarding_progress',
          filter: `user_id=eq.${userId}`
        },
        () => {
          // Refetch progress data
          fetchProgress();
        }
      )
      .subscribe();
    channels.push(progressChannel);

    // Points changes
    const pointsChannel = supabase
      .channel(`points-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`
        },
        () => {
          // Refetch progress data
          fetchProgress();
        }
      )
      .subscribe();
    channels.push(pointsChannel);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [userId]);

  return { progress, loading, error };
}
```

### 2. Reward Redemption Component

```javascript
import { useState } from 'react';
import { supabase } from './supabaseClient';

export function RewardRedemption({ userId, reward, onRedeemed }) {
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState(null);

  const handleRedeem = async () => {
    setRedeeming(true);
    setError(null);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/redeem-reward`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          rewardId: reward.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to redeem reward');
      }

      onRedeemed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="reward-card">
      <h3>{reward.name}</h3>
      <p>{reward.description}</p>
      <div className="reward-cost">
        <span className="points">{reward.points_cost} points</span>
      </div>
      <button 
        onClick={handleRedeem}
        disabled={redeeming}
        className="redeem-button"
      >
        {redeeming ? 'Redeeming...' : 'Redeem Reward'}
      </button>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### 3. Progress Bar Component

```javascript
export function ProgressBar({ progress, steps }) {
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
      <div className="steps-list">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`step-item ${step.status.toLowerCase()}`}
          >
            <div className="step-icon">
              {step.status === 'COMPLETED' ? '✓' : index + 1}
            </div>
            <div className="step-content">
              <h4>{step.name}</h4>
              <p>{step.description}</p>
              {step.status === 'COMPLETED' && (
                <div className="step-reward">
                  +{step.points_reward} points
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Admin API

### 1. Admin Dashboard Component

```javascript
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/admin-onboarding/analytics`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>Failed to load analytics</div>;

  return (
    <div className="admin-dashboard">
      <h2>Onboarding Analytics</h2>
      
      <div className="analytics-overview">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{analytics.overall_analytics.total_users}</p>
        </div>
        <div className="stat-card">
          <h3>Paid Users</h3>
          <p>{analytics.overall_analytics.paid_users}</p>
        </div>
        <div className="stat-card">
          <h3>Completion Rate</h3>
          <p>{analytics.overall_analytics.onboarding_completion_rate.toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <h3>Avg Points</h3>
          <p>{Math.round(analytics.overall_analytics.avg_points)}</p>
        </div>
      </div>

      <div className="analytics-details">
        <h3>Step Completion Rates</h3>
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>Completion Rate</th>
              <th>Completed</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {analytics.step_completion_rates.map((step) => (
              <tr key={step.step_id}>
                <td>{step.name}</td>
                <td>{step.completion_rate.toFixed(1)}%</td>
                <td>{step.completed}</td>
                <td>{step.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

## Error Handling

### 1. Common Error Responses

**Authentication Error:**
```json
{
  "error": "Invalid token"
}
```

**Authorization Error:**
```json
{
  "error": "User must be a paid member to access onboarding"
}
```

**Insufficient Points:**
```json
{
  "error": "Insufficient points",
  "required": 500,
  "available": 250
}
```

**Reward Out of Stock:**
```json
{
  "error": "Reward is out of stock"
}
```

### 2. Error Handling Utility

```javascript
export function handleOnboardingError(error) {
  const errorMap = {
    'Invalid token': 'Please log in again',
    'User must be a paid member to access onboarding': 'Upgrade to a paid plan to access onboarding features',
    'Insufficient points': 'You need more points to redeem this reward',
    'Reward is out of stock': 'This reward is currently unavailable',
    'User not found': 'User account not found',
    'Onboarding already initialized': 'Onboarding journey already started'
  };

  return errorMap[error] || error || 'An unexpected error occurred';
}

// Usage example
try {
  const response = await fetch(/* ... */);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error);
  }
  
  // Handle success
} catch (error) {
  const userMessage = handleOnboardingError(error.message);
  setError(userMessage);
}
```

## Sample Data

### 1. Sample User Progress

```json
{
  "user": {
    "id": "user-123",
    "points": 850,
    "onboarding_completed": false,
    "current_level_id": "level-2"
  },
  "progress": {
    "total_steps": 10,
    "completed_steps": 6,
    "completion_percentage": 60,
    "steps": [
      {
        "id": "step-1",
        "name": "Complete Profile",
        "status": "COMPLETED",
        "points_reward": 100
      },
      {
        "id": "step-2",
        "name": "Upload First Content",
        "status": "COMPLETED",
        "points_reward": 150
      }
    ]
  },
  "badges": [
    {
      "id": "badge-1",
      "name": "Profile Master",
      "awarded_at": "2024-01-15T10:30:00Z"
    }
  ],
  "available_rewards": [
    {
      "id": "reward-1",
      "name": "Extra AI Credits - 50",
      "points_cost": 500,
      "type": "AI_CREDITS"
    }
  ]
}
```

### 2. Sample Analytics Data

```json
{
  "overall_analytics": {
    "total_users": 150,
    "paid_users": 45,
    "completed_onboarding": 32,
    "paid_conversion_rate": 30.0,
    "onboarding_completion_rate": 71.1,
    "avg_points": 850.5,
    "total_badges_awarded": 128,
    "total_rewards_redeemed": 67
  },
  "step_completion_rates": [
    {
      "step_id": "step-1",
      "name": "Complete Profile",
      "completion_rate": 93.3,
      "completed": 42,
      "total": 45
    }
  ]
}
```

This comprehensive API documentation provides all the necessary information to integrate and use the onboarding journey system effectively. The examples cover common use cases and demonstrate best practices for error handling and real-time updates.
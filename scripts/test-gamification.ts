import { createClient } from '../src/lib/supabase-client'
import { db } from '../src/lib/db'

async function testGamification() {
  try {
    console.log('Testing gamification system...')

    // Create a test user
    const testUser = {
      email: 'test@example.com',
      password: 'testpassword123',
      name: 'Test User'
    }

    const supabase = createClient()

    // Try to sign up the test user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
    })

    if (signUpError && !signUpError.message.includes('already registered')) {
      console.error('Sign up error:', signUpError)
      return
    }

    // Sign in the test user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    })

    if (signInError) {
      console.error('Sign in error:', signInError)
      return
    }

    console.log('✅ User authenticated successfully')

    // Create user profile in database
    if (signInData.user) {
      try {
        const response = await fetch('http://localhost:3000/api/auth/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: signInData.user.id,
            email: signInData.user.email,
            name: testUser.name,
          }),
        })

        if (response.ok) {
          console.log('✅ User profile created in database')
        } else {
          console.error('❌ Failed to create user profile')
        }
      } catch (error) {
        console.error('Error creating user profile:', error)
      }
    }

    // Test gamification progress API
    try {
      const progressResponse = await fetch('http://localhost:3000/api/gamification/progress', {
        headers: {
          'Authorization': `Bearer ${signInData.session?.access_token}`,
        },
      })

      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        console.log('✅ Gamification progress API working')
        console.log('Progress data:', JSON.stringify(progressData, null, 2))
      } else {
        console.error('❌ Gamification progress API failed:', progressResponse.status)
      }
    } catch (error) {
      console.error('Error testing gamification API:', error)
    }

    // Test reward redemption (if there are rewards)
    try {
      const rewardsResponse = await fetch('http://localhost:3000/api/gamification/progress', {
        headers: {
          'Authorization': `Bearer ${signInData.session?.access_token}`,
        },
      })

      if (rewardsResponse.ok) {
        const rewardsData = await rewardsResponse.json()
        if (rewardsData.rewards && rewardsData.rewards.length > 0) {
          const firstReward = rewardsData.rewards[0]
          console.log(`Testing reward redemption for: ${firstReward.name}`)
          
          // Give the user some points for testing
          await db.user.update({
            where: { email: testUser.email },
            data: { points: 1000 },
          })

          const redeemResponse = await fetch(`http://localhost:3000/api/gamification/rewards/${firstReward.id}/redeem`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${signInData.session?.access_token}`,
            },
          })

          if (redeemResponse.ok) {
            console.log('✅ Reward redemption API working')
          } else {
            const errorData = await redeemResponse.json()
            console.error('❌ Reward redemption failed:', errorData.error)
          }
        }
      }
    } catch (error) {
      console.error('Error testing reward redemption:', error)
    }

    console.log('🎉 Gamification system test completed!')

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testGamification()
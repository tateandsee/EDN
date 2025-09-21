-- Affiliate Commission and Payout System Schema
-- This script adds triggers and functions for automated affiliate commission calculation and payout processing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_status ON affiliate_payouts(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_method ON affiliate_payouts(method);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_created_at ON affiliate_payouts(created_at);
CREATE INDEX IF NOT EXISTS idx_affiliates_tier ON affiliates(tier);
CREATE INDEX IF NOT EXISTS idx_affiliates_earnings ON affiliates(earnings);

-- Function to get commission rate based on affiliate tier
CREATE OR REPLACE FUNCTION get_commission_rate(tier_param TEXT)
RETURNS FLOAT AS $$
DECLARE
    commission_rate FLOAT;
BEGIN
    CASE tier_param
        WHEN 'BRONZE' THEN commission_rate := 0.10;
        WHEN 'SILVER' THEN commission_rate := 0.15;
        WHEN 'GOLD' THEN commission_rate := 0.20;
        WHEN 'PLATINUM' THEN commission_rate := 0.25;
        WHEN 'DIAMOND' THEN commission_rate := 0.30;
        ELSE commission_rate := 0.10; -- Default to Bronze rate
    END CASE;
    
    RETURN commission_rate;
END;
$$ language 'plpgsql';

-- Function to process affiliate commission when a new order is completed
CREATE OR REPLACE FUNCTION process_affiliate_commission()
RETURNS TRIGGER AS $$
DECLARE
    affiliate_record RECORD;
    commission_amount FLOAT;
    commission_rate FLOAT;
    referred_user_id UUID;
BEGIN
    -- Only process completed orders
    IF NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        -- Check if order has affiliate referral code
        -- This assumes there's a referral_code field in orders table or we need to join with users
        -- For now, we'll assume the referral information is stored in the order or user session
        
        -- Get the user who made the order
        -- SELECT user_id INTO referred_user_id FROM orders WHERE id = NEW.id;
        referred_user_id := NEW.user_id;
        
        -- Check if this user was referred by an affiliate
        -- This would typically be stored in a referrals table or user record
        -- For demonstration, we'll check if user has a referring_affiliate_id field
        
        -- Note: In a real implementation, you would have a referrals table that tracks
        -- which user was referred by which affiliate
        
        -- Simulate finding the affiliate (in production, this would come from a referrals table)
        SELECT a.* INTO affiliate_record 
        FROM affiliates a
        JOIN user_referrals ur ON a.user_id = ur.referrer_id
        WHERE ur.referred_user_id = referred_user_id
        LIMIT 1;
        
        IF affiliate_record IS NOT NULL THEN
            -- Get commission rate based on tier
            commission_rate := get_commission_rate(affiliate_record.tier::TEXT);
            
            -- Calculate commission amount (10% of order amount as example)
            commission_amount := NEW.amount * commission_rate;
            
            -- Update affiliate earnings
            UPDATE affiliates 
            SET 
                earnings = earnings + commission_amount,
                referrals = referrals + 1,
                updated_at = NOW()
            WHERE id = affiliate_record.id;
            
            -- Create earning record
            INSERT INTO earnings (user_id, amount, type, description, created_at)
            VALUES (
                affiliate_record.user_id, 
                commission_amount, 
                'AFFILIATE_COMMISSION', 
                json_build_object(
                    'order_id', NEW.id,
                    'referred_user_id', referred_user_id,
                    'commission_rate', commission_rate,
                    'tier', affiliate_record.tier
                ),
                NOW()
            );
            
            -- Create affiliate payout record
            INSERT INTO affiliate_payouts (
                affiliate_id, 
                amount, 
                commission_rate, 
                referral_user_id, 
                status, 
                method, 
                created_at
            )
            VALUES (
                affiliate_record.id,
                commission_amount,
                commission_rate,
                referred_user_id,
                'PENDING',
                COALESCE(affiliate_record.payout_method->>'preferred_method', 'coinbase'),
                NOW()
            );
            
            -- Log the commission activity
            INSERT INTO onboarding_activities (user_id, action, details, created_at)
            VALUES (
                affiliate_record.user_id,
                'POINTS_EARNED',
                json_build_object(
                    'type', 'affiliate_commission',
                    'amount', commission_amount,
                    'order_id', NEW.id,
                    'referred_user_id', referred_user_id,
                    'tier', affiliate_record.tier
                ),
                NOW()
            );
            
            -- Check if affiliate should be upgraded to next tier
            PERFORM check_affiliate_tier_upgrade(affiliate_record.id);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to check and upgrade affiliate tier based on performance
CREATE OR REPLACE FUNCTION check_affiliate_tier_upgrade(affiliate_id_param UUID)
RETURNS VOID AS $$
DECLARE
    affiliate_record RECORD;
    current_tier TEXT;
    new_tier TEXT;
    referral_count INTEGER;
    total_earnings FLOAT;
BEGIN
    -- Get current affiliate data
    SELECT * INTO affiliate_record FROM affiliates WHERE id = affiliate_id_param;
    
    IF affiliate_record IS NULL THEN
        RETURN;
    END IF;
    
    current_tier := affiliate_record.tier::TEXT;
    referral_count := affiliate_record.referrals;
    total_earnings := affiliate_record.earnings;
    
    -- Determine new tier based on performance
    new_tier := current_tier;
    
    IF total_earnings >= 10000 AND referral_count >= 50 THEN
        new_tier := 'DIAMOND';
    ELSIF total_earnings >= 5000 AND referral_count >= 25 THEN
        new_tier := 'PLATINUM';
    ELSIF total_earnings >= 2000 AND referral_count >= 10 THEN
        new_tier := 'GOLD';
    ELSIF total_earnings >= 500 AND referral_count >= 5 THEN
        new_tier := 'SILVER';
    END IF;
    
    -- Update tier if changed
    IF new_tier != current_tier THEN
        UPDATE affiliates 
        SET 
            tier = new_tier::AffiliateTier,
            commission = get_commission_rate(new_tier),
            updated_at = NOW()
        WHERE id = affiliate_id_param;
        
        -- Log tier upgrade
        INSERT INTO onboarding_activities (user_id, action, details, created_at)
        VALUES (
            affiliate_record.user_id,
            'LEVEL_UP',
            json_build_object(
                'type', 'affiliate_tier_upgrade',
                'old_tier', current_tier,
                'new_tier', new_tier,
                'total_earnings', total_earnings,
                'referral_count', referral_count
            ),
            NOW()
        );
    END IF;
END;
$$ language 'plpgsql';

-- Function to automatically process payouts when earnings reach threshold
CREATE OR REPLACE FUNCTION process_automatic_payouts()
RETURNS VOID AS $$
DECLARE
    affiliate_record RECORD;
    payout_amount FLOAT;
BEGIN
    -- Process affiliates with auto-payout enabled and earnings above threshold
    FOR affiliate_record IN 
        SELECT * FROM affiliates 
        WHERE auto_payout_enabled = true 
        AND earnings >= minimum_payout_threshold
        AND earnings > 0
    LOOP
        payout_amount := affiliate_record.earnings;
        
        -- Create pending payout record
        INSERT INTO affiliate_payouts (
            affiliate_id,
            amount,
            commission_rate,
            status,
            method,
            scheduled_for,
            created_at
        )
        VALUES (
            affiliate_record.id,
            payout_amount,
            affiliate_record.commission,
            'PENDING',
            NOW() + INTERVAL '1 hour', -- Schedule for processing in 1 hour
            NOW()
        );
        
        -- Log the scheduled payout
        INSERT INTO onboarding_activities (user_id, action, details, created_at)
        VALUES (
            affiliate_record.user_id,
            'REWARD_REDEEMED',
            json_build_object(
                'type', 'automatic_payout_scheduled',
                'amount', payout_amount,
                'method', COALESCE(affiliate_record.payout_method->>'preferred_method', 'coinbase'),
                'threshold', affiliate_record.minimum_payout_threshold
            ),
            NOW()
        );
        
        -- Note: In a real implementation, you would also deduct the earnings here
        -- or wait until the payout is actually processed
    END LOOP;
END;
$$ language 'plpgsql';

-- Function to process scheduled payouts
CREATE OR REPLACE FUNCTION process_scheduled_payouts()
RETURNS VOID AS $$
DECLARE
    payout_record RECORD;
    process_result JSON;
BEGIN
    -- Process payouts that are scheduled for now or past due
    FOR payout_record IN 
        SELECT * FROM affiliate_payouts 
        WHERE status = 'PENDING' 
        AND scheduled_for <= NOW()
        ORDER BY created_at ASC
        LIMIT 100 -- Process in batches to avoid overload
    LOOP
        -- Get affiliate details
        SELECT a.*, u.payment_details INTO affiliate_record
        FROM affiliates a
        JOIN users u ON a.user_id = u.id
        WHERE a.id = payout_record.affiliate_id;
        
        IF affiliate_record IS NOT NULL THEN
            -- Process the payout based on method
            -- This would typically call an external API
            -- For now, we'll simulate successful processing
            
            -- Update payout status to processing
            UPDATE affiliate_payouts 
            SET status = 'PROCESSING', 
                processed_at = NOW()
            WHERE id = payout_record.id;
            
            -- Simulate processing (in production, this would call payment APIs)
            -- process_result := process_payout_via_api(affiliate_record, payout_record.amount, payout_record.method);
            
            -- For demonstration, assume successful processing
            process_result := json_build_object(
                'success', true,
                'transaction_id', 'txn_' || substring(md5(random()::text), 1, 16),
                'processed_at', NOW()
            );
            
            IF process_result->>'success' = 'true' THEN
                -- Mark payout as completed
                UPDATE affiliate_payouts 
                SET 
                    status = 'COMPLETED',
                    provider_response = process_result,
                    processed_at = NOW()
                WHERE id = payout_record.id;
                
                -- Deduct from affiliate earnings
                UPDATE affiliates 
                SET 
                    earnings = earnings - payout_record.amount,
                    updated_at = NOW()
                WHERE id = payout_record.affiliate_id;
                
                -- Log successful payout
                INSERT INTO onboarding_activities (user_id, action, details, created_at)
                VALUES (
                    affiliate_record.user_id,
                    'REWARD_REDEEMED',
                    json_build_object(
                        'type', 'payout_completed',
                        'amount', payout_record.amount,
                        'method', payout_record.method,
                        'transaction_id', process_result->>'transaction_id'
                    ),
                    NOW()
                );
            ELSE
                -- Mark payout as failed
                UPDATE affiliate_payouts 
                SET 
                    status = 'FAILED',
                    provider_response = process_result,
                    processed_at = NOW()
                WHERE id = payout_record.id;
                
                -- Log failed payout
                INSERT INTO onboarding_activities (user_id, action, details, created_at)
                VALUES (
                    affiliate_record.user_id,
                    'REWARD_REDEEMED',
                    json_build_object(
                        'type', 'payout_failed',
                        'amount', payout_record.amount,
                        'method', payout_record.method,
                        'error', process_result->>'error'
                    ),
                    NOW()
                );
            END IF;
        END IF;
    END LOOP;
END;
$$ language 'plpgsql';

-- Function to add payment details as part of onboarding
CREATE OR REPLACE FUNCTION add_payment_details_step(user_id_param UUID, payment_details JSON)
RETURNS JSON AS $$
DECLARE
    step_record RECORD;
    result JSON;
BEGIN
    -- Update user payment details
    UPDATE users 
    SET payment_details = payment_details,
        updated_at = NOW()
    WHERE id = user_id_param;
    
    -- Check if there's a payment details setup step in onboarding
    SELECT * INTO step_record 
    FROM onboarding_steps 
    WHERE name = 'Setup Payment Details' 
    LIMIT 1;
    
    IF step_record IS NOT NULL THEN
        -- Complete the payment details step
        UPDATE user_onboarding_progress 
        SET 
            status = 'COMPLETED',
            completed_at = NOW(),
            progress_percentage = 100
        WHERE user_id = user_id_param AND step_id = step_record.id;
        
        -- Award points for completing payment setup
        UPDATE users 
        SET points = points + step_record.points_reward
        WHERE id = user_id_param;
        
        -- Log the activity
        INSERT INTO onboarding_activities (user_id, action, details, created_at)
        VALUES (
            user_id_param,
            'STEP_COMPLETED',
            json_build_object(
                'step_id', step_record.id,
                'step_name', step_record.name,
                'points_earned', step_record.points_reward,
                'payment_methods', json_build_object(
                    'coinbase', payment_details->'coinbase' IS NOT NULL,
                    'paypal', payment_details->'paypal' IS NOT NULL,
                    'bank', payment_details->'bank' IS NOT NULL
                )
            ),
            NOW()
        );
    END IF;
    
    -- Return success
    result := json_build_object(
        'success', true,
        'message', 'Payment details updated successfully',
        'payment_methods_configured', json_build_object(
            'coinbase', payment_details->'coinbase' IS NOT NULL,
            'paypal', payment_details->'paypal' IS NOT NULL,
            'bank', payment_details->'bank' IS NOT NULL
        )
    );
    
    RETURN result;
END;
$$ language 'plpgsql';

-- Create triggers for commission processing
-- Note: These triggers would be created on the actual tables in your system
-- CREATE TRIGGER on_order_completed
--     AFTER UPDATE OF status ON orders
--     FOR EACH ROW
--     EXECUTE FUNCTION process_affiliate_commission();

-- Create scheduled job for automatic payouts (requires pg_cron extension)
-- SELECT cron.schedule('process-automatic-payouts', '0 0 * * *', $$SELECT process_automatic_payouts()$$);
-- SELECT cron.schedule('process-scheduled-payouts', '0 * * * *', $$SELECT process_scheduled_payouts()$$);

-- Create sample onboarding step for payment details setup
INSERT INTO onboarding_steps (name, description, "order", points_reward, is_required, criteria) 
VALUES (
    'Setup Payment Details',
    'Configure your payment details for affiliate payouts (Coinbase, PayPal, or Bank Transfer)',
    3,
    150,
    true,
    json_build_object(
        'action', 'setup_payment_details',
        'required_methods', array['coinbase', 'paypal', 'bank_transfer'],
        'description', 'User must configure at least one payment method'
    )
)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    "order" = EXCLUDED."order",
    points_reward = EXCLUDED.points_reward,
    is_required = EXCLUDED.is_required,
    criteria = EXCLUDED.criteria,
    updated_at = NOW();

-- Create function to validate payment details
CREATE OR REPLACE FUNCTION validate_payment_details(payment_details JSON)
RETURNS JSON AS $$
DECLARE
    validation_result JSON;
    has_valid_method BOOLEAN := false;
    errors TEXT[] := '{}';
BEGIN
    -- Validate Coinbase details
    IF payment_details->'coinbase' IS NOT NULL THEN
        IF payment_details->'coinbase'->>'payment_method_id' IS NULL THEN
            errors := errors || 'Coinbase payment method ID is required';
        ELSE
            has_valid_method := true;
        END IF;
    END IF;
    
    -- Validate PayPal details
    IF payment_details->'paypal' IS NOT NULL THEN
        IF payment_details->'paypal'->>'email' IS NULL THEN
            errors := errors || 'PayPal email is required';
        ELSIF payment_details->'paypal'->>'email' !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' THEN
            errors := errors || 'PayPal email is invalid';
        ELSE
            has_valid_method := true;
        END IF;
    END IF;
    
    -- Validate Bank details
    IF payment_details->'bank' IS NOT NULL THEN
        IF payment_details->'bank'->>'account_number' IS NULL THEN
            errors := errors || 'Bank account number is required';
        ELSIF payment_details->'bank'->>'routing_number' IS NULL THEN
            errors := errors || 'Bank routing number is required';
        ELSIF length(payment_details->'bank'->>'account_number') < 8 THEN
            errors := errors || 'Bank account number is too short';
        ELSIF length(payment_details->'bank'->>'routing_number') != 9 THEN
            errors := errors || 'Bank routing number must be 9 digits';
        ELSE
            has_valid_method := true;
        END IF;
    END IF;
    
    -- Build validation result
    validation_result := json_build_object(
        'valid', has_valid_method AND array_length(errors, 1) IS NULL,
        'has_valid_method', has_valid_method,
        'errors', CASE WHEN array_length(errors, 1) IS NULL THEN '[]' ELSE to_jsonb(errors) END,
        'configured_methods', json_build_object(
            'coinbase', payment_details->'coinbase' IS NOT NULL,
            'paypal', payment_details->'paypal' IS NOT NULL,
            'bank', payment_details->'bank' IS NOT NULL
        )
    );
    
    RETURN validation_result;
END;
$$ language 'plpgsql';
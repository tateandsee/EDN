-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_paid_member BOOLEAN DEFAULT false,
    subscription_plan TEXT DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    points INTEGER DEFAULT 0,
    current_level_id UUID,
    onboarding_completed BOOLEAN DEFAULT false,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}'
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    display_name TEXT,
    bio TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    is_nsfw_creator BOOLEAN DEFAULT false,
    content_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content table
CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'text')),
    content_url TEXT NOT NULL,
    thumbnail_url TEXT,
    prompt TEXT,
    ai_model TEXT,
    generation_parameters JSONB DEFAULT '{}',
    is_nsfw BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'ready' CHECK (status IN ('processing', 'ready', 'failed', 'deleted')),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'basic', 'pro', 'elite', 'master', 'vip')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace_items table
CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    content_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[],
    is_nsfw BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    purchases INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace_orders table
CREATE TABLE IF NOT EXISTS marketplace_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate table
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    affiliate_code TEXT UNIQUE NOT NULL,
    commission_rate DECIMAL(5,4) DEFAULT 0.10,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    active_referrals INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_referrals table
CREATE TABLE IF NOT EXISTS affiliate_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    commission_amount DECIMAL(10,2),
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
    marketplace_item_id UUID REFERENCES marketplace_items(id) ON DELETE SET NULL,
    download_type TEXT NOT NULL CHECK (download_type IN ('content', 'marketplace_item')),
    file_url TEXT NOT NULL,
    file_size BIGINT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_contents_user_id ON contents(user_id);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_is_nsfw ON contents(is_nsfw);
CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_user_id ON marketplace_items(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_is_nsfw ON marketplace_items(is_nsfw);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_affiliate_id ON affiliate_referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_content_id ON downloads(content_id);
CREATE INDEX IF NOT EXISTS idx_downloads_marketplace_item_id ON downloads(marketplace_item_id);
CREATE INDEX IF NOT EXISTS idx_downloads_download_type ON downloads(download_type);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at);
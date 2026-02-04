-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (Extended)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('sme', 'influencer', 'admin')),
    
    -- Additional fields
    avatar_url TEXT,
    bio TEXT,
    phone VARCHAR(50),
    email_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);

-- ============================================
-- 2. INFLUENCERS TABLE (Extended)
-- ============================================
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Core metrics
    followers_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    niche VARCHAR(100),
    price_per_post DECIMAL(10,2),
    
    -- Additional fields
    instagram_handle VARCHAR(100),
    tiktok_handle VARCHAR(100),
    youtube_handle VARCHAR(100),
    twitter_handle VARCHAR(100),
    location VARCHAR(255),
    languages TEXT[], -- Array of languages
    content_categories TEXT[], -- Array of categories
    is_available BOOLEAN DEFAULT TRUE,
    avg_delivery_days INTEGER DEFAULT 7,
    portfolio_url TEXT,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Influencers
CREATE INDEX idx_influencers_user_id ON influencers(user_id);
CREATE INDEX idx_influencers_niche ON influencers(niche);
CREATE INDEX idx_influencers_verification ON influencers(verification_status);
CREATE INDEX idx_influencers_available ON influencers(is_available) WHERE is_available = TRUE;

-- ============================================
-- 3. ORDERS TABLE (Extended)
-- ============================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE RESTRICT,
    sme_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Status fields
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'in_progress', 'completed', 'cancelled', 'disputed')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    
    -- Pricing
    total_price DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) DEFAULT 0,
    
    -- Additional fields
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    deliverables TEXT[], -- Array of deliverable types
    delivery_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Orders
CREATE INDEX idx_orders_influencer ON orders(influencer_id);
CREATE INDEX idx_orders_sme ON orders(sme_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- 4. REVIEWS TABLE (Extended)
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    -- Additional fields
    is_verified BOOLEAN DEFAULT FALSE, -- Verified purchase
    helpful_count INTEGER DEFAULT 0,
    reported BOOLEAN DEFAULT FALSE,
    report_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Reviews
CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_verified ON reviews(is_verified);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at BEFORE UPDATE ON influencers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users RLS
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Influencers RLS
CREATE POLICY "Influencers are viewable by everyone" ON influencers
    FOR SELECT USING (true);
CREATE POLICY "Users can update own influencer profile" ON influencers
    FOR ALL USING (auth.uid() = user_id);

-- Orders RLS
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = sme_id OR auth.uid() IN (
        SELECT user_id FROM influencers WHERE id = influencer_id
    ));
CREATE POLICY "SMEs can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = sme_id);

-- Reviews RLS
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);
CREATE POLICY "SMEs can create reviews for their orders" ON reviews
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT sme_id FROM orders WHERE id = order_id
    ));

-- ============================================
-- SAMPLE DATA INSERTION
-- ============================================

-- Users (5 records)
INSERT INTO users (id, name, email, password_hash, user_type, avatar_url, bio, phone, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@nanoconnect.com', '$2b$10$hashedpassword', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', 'Platform administrator', '+1234567890', 'active'),
('22222222-2222-2222-2222-222222222222', 'TechStart Inc', 'sme1@example.com', '$2b$10$hashedpassword', 'sme', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SME1', 'Tech startup looking for influencers', '+1234567891', 'active'),
('33333333-3333-3333-3333-333333333333', 'Fashion Brand Co', 'sme2@example.com', '$2b$10$hashedpassword', 'sme', 'https://api.dicebear.com/7.x/avataaars/svg?seed=SME2', 'Fashion brand seeking promotion', '+1234567892', 'active'),
('44444444-4444-4444-4444-444444444444', 'Sarah Johnson', 'influencer1@example.com', '$2b$10$hashedpassword', 'influencer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Influencer1', 'Lifestyle & fashion content creator', '+1234567893', 'active'),
('55555555-5555-5555-5555-555555555555', 'Mike Chen', 'influencer2@example.com', '$2b$10$hashedpassword', 'influencer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Influencer2', 'Tech reviewer and gadget enthusiast', '+1234567894', 'active');

-- Influencers (2 records - linked to influencer users)
INSERT INTO influencers (id, user_id, followers_count, engagement_rate, niche, price_per_post, instagram_handle, tiktok_handle, location, languages, content_categories, is_available, avg_delivery_days, verification_status) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 150000, 4.5, 'Fashion & Lifestyle', 500.00, '@sarahstyle', '@sarahtiktok', 'New York, USA', ARRAY['English', 'Spanish'], ARRAY['Fashion', 'Beauty', 'Lifestyle'], true, 5, 'verified'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 85000, 6.2, 'Technology', 350.00, '@miketech', '@miketechtok', 'San Francisco, USA', ARRAY['English'], ARRAY['Technology', 'Gaming', 'Reviews'], true, 3, 'verified');

-- Orders (5 records)
INSERT INTO orders (id, influencer_id, sme_id, order_status, payment_status, total_price, platform_fee, title, description, requirements, deliverables, delivery_date) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'completed', 'paid', 500.00, 50.00, 'Summer Fashion Campaign', 'Promote our new summer collection', 'Create 3 Instagram posts and 2 stories', ARRAY['Instagram Post', 'Instagram Story'], '2024-07-15'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'in_progress', 'paid', 350.00, 35.00, 'Gadget Review Video', 'Review our latest smartphone', 'Create a 5-minute YouTube review video', ARRAY['YouTube Video'], '2024-08-01'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'pending', 'pending', 750.00, 75.00, 'Brand Awareness Campaign', 'Increase brand visibility', 'Create 5 posts over 2 weeks', ARRAY['Instagram Post', 'TikTok Video'], '2024-08-15'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'completed', 'paid', 350.00, 35.00, 'Product Launch Announcement', 'Announce our new product line', 'Create announcement content', ARRAY['Instagram Post', 'Instagram Story'], '2024-06-20'),
('11111111-2222-3333-4444-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'cancelled', 'refunded', 500.00, 50.00, 'Holiday Special', 'Holiday promotion campaign', 'Create holiday-themed content', ARRAY['Instagram Post'], '2024-12-01');

-- Reviews (5 records)
INSERT INTO reviews (id, order_id, rating, comment, is_verified, helpful_count) VALUES
('77777777-7777-7777-7777-777777777777', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5, 'Excellent work! Sarah delivered high-quality content on time. Highly recommend!', true, 12),
('88888888-8888-8888-8888-888888888888', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 4, 'Great video review. Mike provided detailed insights about the product.', true, 8),
('99999999-9999-9999-9999-999999999999', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 5, 'Outstanding collaboration! Professional and creative approach.', true, 15),
('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 4, 'Good engagement on the posts. Would work with again.', true, 5),
('ffffffff-eeee-dddd-cccc-bbbbbbbbbbbb', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 5, 'Amazing results! Our sales increased significantly after the campaign.', true, 20);

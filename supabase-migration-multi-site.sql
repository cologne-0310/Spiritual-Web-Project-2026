-- Migration to support Multi-Site Affiliate Tracking
-- Target: Supabase DB

-- 1. Update orders table to track which site the order originated from
ALTER TABLE orders ADD COLUMN IF NOT EXISTS source_domain TEXT;

-- 2. Update affiliates table to distinguish between general users and teachers
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS site_access TEXT[]; -- e.g. ['source31.com', 'sajeev.source31.com']

-- 3. (Optional) Create a view for teacher-specific dashboard if needed
-- CREATE VIEW teacher_orders AS 
-- SELECT * FROM orders WHERE referral_id IN (SELECT code FROM affiliates WHERE type = 'teacher');

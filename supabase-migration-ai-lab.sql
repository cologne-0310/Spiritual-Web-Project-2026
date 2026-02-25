-- Create Tables for AI Lab Interaction Tracking
-- This table stores chat messages between users and the AI Guide
CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL, -- To group messages in a session
    user_message TEXT,
    ai_response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- This table stores oracle card drawing records
CREATE TABLE IF NOT EXISTS public.oracle_drawings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    card_title TEXT NOT NULL,
    card_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oracle_drawings ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for visitors to record their experiences)
CREATE POLICY "Allow public insert for chat logs" ON public.ai_chat_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert for oracle drawings" ON public.oracle_drawings
    FOR INSERT WITH CHECK (true);

-- Allow admin read access (for analytics)
CREATE POLICY "Allow public read for analytics" ON public.ai_chat_logs
    FOR SELECT USING (true); -- Restricted in production to admin role

CREATE POLICY "Allow public read for drawing analytics" ON public.oracle_drawings
    FOR SELECT USING (true); -- Restricted in production to admin role

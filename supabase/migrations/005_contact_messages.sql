-- Create contact_messages table (for the contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS: authenticated users (admin) can read all messages
CREATE POLICY "Authenticated users can read contact_messages"
    ON contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- RLS: anyone can insert (contact form submission)
CREATE POLICY "Anyone can insert contact_messages"
    ON contact_messages
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- RLS: authenticated users can mark messages as read
CREATE POLICY "Authenticated users can update contact_messages"
    ON contact_messages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Index for ordering by most recent
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
    ON contact_messages(created_at DESC);

-- Index for filtering by read/unread
CREATE INDEX IF NOT EXISTS idx_contact_messages_read
    ON contact_messages(read);

COMMENT ON TABLE contact_messages IS 'Contact form submissions from the portfolio';
COMMENT ON COLUMN contact_messages.read IS 'Whether an admin has reviewed this message';

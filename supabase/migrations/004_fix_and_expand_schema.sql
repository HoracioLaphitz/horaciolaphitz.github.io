-- 1. Drop redundant index (Postgres automatically creates a unique index for UNIQUE constraints)
DROP INDEX IF EXISTS idx_projects_slug;

-- 2. Add CHECK constraint to projects status to guarantee data integrity matching frontend enum
ALTER TABLE projects 
ADD CONSTRAINT chk_projects_status 
CHECK (status IN ('completed', 'in-progress', 'planned'));

-- 3. Add missing columns to experience table matching profile data
ALTER TABLE experience 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'professional' CHECK (type IN ('professional', 'non-remunerated', 'volunteer'));

-- 4. Add performance indexes for frequent query paths
CREATE INDEX IF NOT EXISTS idx_project_technologies_technology_id ON project_technologies(technology_id);
CREATE INDEX IF NOT EXISTS idx_experience_start_date ON experience(start_date DESC);

-- 5. Create education table
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    location TEXT,
    start_date DATE,
    end_date DATE,
    period TEXT, -- Display period (e.g. "2018 - 2020")
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE,
    period TEXT, -- Display period (e.g. "Mar 2025")
    certificate_url TEXT,
    credly_badge_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Add updated_at triggers for new tables
CREATE OR REPLACE TRIGGER update_education_updated_at
    BEFORE UPDATE ON education
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_certifications_updated_at
    BEFORE UPDATE ON certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Enable Row Level Security (RLS) on new tables
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- 9. Create public read-only policies for new tables
CREATE POLICY "Public read access for education" ON education
    FOR SELECT USING (true);

CREATE POLICY "Public read access for certifications" ON certifications
    FOR SELECT USING (true);

-- 10. Performance indexes for new tables
CREATE INDEX IF NOT EXISTS idx_education_start_date ON education(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_issue_date ON certifications(issue_date DESC);

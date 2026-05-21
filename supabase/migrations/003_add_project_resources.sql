-- Add resource fields to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS pdf_size TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_projects_github_url ON projects(github_url);
CREATE INDEX IF NOT EXISTS idx_projects_pdf_url ON projects(pdf_url);

-- Update full-text search to include long_description
DROP INDEX IF EXISTS idx_projects_search;
CREATE INDEX idx_projects_search ON projects 
USING GIN(to_tsvector('spanish', 
    title || ' ' || 
    description || ' ' || 
    COALESCE(long_description, '')
));

-- Add comment for documentation
COMMENT ON COLUMN projects.long_description IS 'Extended project description for detail pages';
COMMENT ON COLUMN projects.highlights IS 'Array of project highlights/features';
COMMENT ON COLUMN projects.github_url IS 'GitHub repository URL';
COMMENT ON COLUMN projects.demo_url IS 'Live demo URL';
COMMENT ON COLUMN projects.pdf_url IS 'PDF document URL (relative to public folder)';
COMMENT ON COLUMN projects.pdf_size IS 'Human-readable PDF file size (e.g., "1.2 MB")';
COMMENT ON COLUMN projects.thumbnail_url IS 'Project thumbnail image URL';

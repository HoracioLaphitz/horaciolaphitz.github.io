-- Insert sample technologies
INSERT INTO technologies (name, slug, category) VALUES
    ('Python', 'python', 'language'),
    ('TypeScript', 'typescript', 'language'),
    ('React', 'react', 'framework'),
    ('Astro', 'astro', 'framework'),
    ('FastAPI', 'fastapi', 'framework'),
    ('PostgreSQL', 'postgresql', 'database'),
    ('Supabase', 'supabase', 'platform'),
    ('Tailwind CSS', 'tailwind', 'styling'),
    ('TensorFlow', 'tensorflow', 'ml'),
    ('Scikit-learn', 'scikit-learn', 'ml')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample project
INSERT INTO projects (
    slug,
    title,
    description,
    category,
    status,
    featured
) VALUES (
    'portfolio-profesional-2026',
    'Portfolio Profesional 2026',
    'Portfolio Full Stack con arquitectura híbrida Astro + FastAPI, diseño dual-theme y backend serverless sobre Supabase + Vercel',
    'Web Development',
    'in-progress',
    true
) ON CONFLICT (slug) DO NOTHING;

-- Link technologies to project
INSERT INTO project_technologies (project_id, technology_id)
SELECT 
    p.id,
    t.id
FROM projects p
CROSS JOIN technologies t
WHERE p.slug = 'portfolio-profesional-2026'
    AND t.slug IN ('typescript', 'react', 'astro', 'fastapi', 'postgresql', 'supabase', 'tailwind')
ON CONFLICT DO NOTHING;

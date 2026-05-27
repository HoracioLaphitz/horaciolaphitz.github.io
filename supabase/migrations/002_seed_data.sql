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

-- Insert sample project (all columns, compatible with 003_add_project_resources)
INSERT INTO projects (
    slug,
    title,
    description,
    long_description,
    category,
    status,
    featured,
    highlights,
    github_url,
    demo_url,
    pdf_url,
    pdf_size,
    thumbnail_url
) VALUES (
    'portfolio-profesional-2026',
    'Portfolio Profesional 2026',
    'Portfolio Full Stack con arquitectura híbrida Astro + FastAPI, diseño dual-theme y backend serverless sobre Supabase + Vercel',
    '',
    'Web Development',
    'in-progress',
    true,
    '[]'::jsonb,
    'https://github.com/hmaldon1999/Portafolio',
    NULL,
    NULL,
    NULL,
    NULL
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

import urllib.request, json, sys

BASE = 'http://localhost:8000'

def get(path):
    r = urllib.request.urlopen(BASE + path)
    return json.loads(r.read())

def post(path, data):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(data).encode(),
        headers={'Content-Type': 'application/json'},
    )
    r = urllib.request.urlopen(req)
    return json.loads(r.read())

# Test all endpoints
endpoints = [
    ('Health', '/api/health'),
    ('Projects list', '/api/v1/projects'),
    ('Featured projects', '/api/v1/projects/featured'),
    ('Project detail', '/api/v1/projects/etl-procesamiento-datos'),
    ('Filtered projects', '/api/v1/projects?category=Machine+Learning'),
    ('Experience', '/api/v1/experience'),
    ('Technologies', '/api/v1/technologies'),
    ('Education', '/api/v1/education'),
    ('Certifications', '/api/v1/certifications'),
    ('Notebooks', '/api/v1/notebooks'),
]

for name, url in endpoints:
    try:
        data = get(url)
        if isinstance(data, list):
            print(f'OK {name}: {len(data)} items')
            if data and isinstance(data[0], dict):
                first = data[0]
                if 'technologies' in first:
                    techs = first.get('technologies', [])
                    print(f'  First item technologies count: {len(techs)}')
        elif isinstance(data, dict):
            item_summary = {k: v for k, v in data.items() if k in ('title', 'name', 'slug', 'status', 'version')}
            print(f'OK {name}: {item_summary}')
    except Exception as ex:
        print(f'ERR {name}: {ex}')

# Test contact POST
print('---')
try:
    result = post('/api/v1/contact', {
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'This is a test message.',
    })
    print(f'Contact POST: {result}')
except Exception as ex:
    print(f'Contact POST error: {ex}')

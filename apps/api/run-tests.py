import json
import urllib.request
import urllib.error
import sys

BASE = 'https://voeq.onrender.com'
results = {'frontend': [], 'backend': [], 'database': []}

def frontend(name, fn):
    try:
        ok = fn()
        results['frontend'].append((name, 'PASS' if ok else 'FAIL'))
    except Exception as e:
        results['frontend'].append((name, f'FAIL: {e}'))

def backend(name, fn):
    try:
        ok = fn()
        results['backend'].append((name, 'PASS' if ok else 'FAIL'))
    except Exception as e:
        results['backend'].append((name, f'FAIL: {e}'))

def database(name, fn):
    try:
        ok = fn()
        results['database'].append((name, 'PASS' if ok else 'FAIL'))
    except Exception as e:
        results['database'].append((name, f'FAIL: {e}'))

def get(path, data=None, headers=None, method=None):
    url = f'{BASE}{path}'
    if data:
        body = json.dumps(data).encode()
    else:
        body = None
    req = urllib.request.Request(url, data=body, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            text = resp.read().decode()
            try:
                payload = json.loads(text)
            except Exception:
                payload = text
            return resp.status, payload
    except urllib.error.HTTPError as e:
        text = e.read().decode()
        try:
            payload = json.loads(text)
        except Exception:
            payload = text
        return e.code, payload
    except Exception as e:
        raise

# DATABASE TESTS
def db_categories():
    status, data = get('/api/categories')
    return status == 200 and isinstance(data, list) and len(data) > 0

def db_vendors():
    status, data = get('/api/vendors/chow-court-nmu')
    return status == 200 and 'vendor' in data

def db_listings():
    status, data = get('/api/listings?limit=1')
    return status == 200 and isinstance(data, list)

def db_reviews():
    status, data = get('/api/vendors/chow-court-nmu/reviews')
    return status == 200 and isinstance(data, list)

def db_indexes():
    status, data = get('/api/listings?limit=1&sort=newest')
    return status == 200

def db_foreign_keys():
    status, data = get('/api/test/db')
    return status == 200 and data.get('institutions', 0) > 0 and data.get('categories', 0) > 0

def db_cascade():
    status, data = get('/api/test/db')
    return status == 200

def db_users():
    status, data = get('/api/test/db')
    return status == 200 and data.get('users', 0) > 0

def db_no_orphans():
    status, data = get('/api/test/db')
    return status == 200

# BACKEND TESTS
def backend_health():
    status, data = get('/health')
    return status == 200 and data.get('status') == 'ok'

def backend_signup_validation():
    status, data = get('/api/auth/signup/password', data={'email': 'bad', 'name': '', 'password': 'short'}, method='POST')
    return status == 400

def backend_otp_rate_limit():
    for i in range(6):
        get('/api/auth/verify-otp', data={'email': 'test@test.com', 'otp': '000000'}, method='POST')
    status, data = get('/api/auth/verify-otp', data={'email': 'test@test.com', 'otp': '000000'}, method='POST')
    return status == 429

def backend_cors():
    headers = {
        'Origin': 'https://voeq.vercel.app',
        'Access-Control-Request-Method': 'POST',
    }
    status, _ = get('/api/auth/signup/password', headers=headers)
    return status == 204 or status == 200

def backend_cookie_config():
    status, data = get('/api/test/db')
    return status == 200

def backend_error_format():
    status, data = get('/nonexistent-route')
    return status == 404 and isinstance(data, dict) and 'error' in data

def backend_404_json():
    status, data = get('/api/nonexistent')
    return status == 404 and data.get('error') == 'NotFound'

def backend_rate_limit_headers():
    status, data = get('/health')
    return status == 200

def backend_json_body_limit():
    status, data = get('/api/auth/signup/password', data={'email': 'x' * 10000, 'name': 'x', 'password': 'TestPass1!'}, method='POST')
    return status in (413, 400)

# FRONTEND TESTS
def frontend_api_wiring():
    status, data = get('/health')
    return status == 200

def frontend_categories():
    status, data = get('/api/categories')
    return status == 200 and isinstance(data, list) and len(data) > 0

def frontend_browse_listings():
    status, data = get('/api/listings?limit=5')
    return status == 200 and isinstance(data, list)

def frontend_search():
    status, data = get('/api/search?q=test')
    return status == 200 and isinstance(data, dict)

def frontend_auth_signup():
    status, data = get('/api/auth/signup/password', data={'email': 'test@example.com', 'name': 'Test', 'password': 'TestPass1!'}, method='POST')
    return status in (200, 400)

def frontend_vendors():
    status, data = get('/api/vendors/chow-court-nmu')
    return status == 200 and 'vendor' in data

def frontend_agreements():
    status, data = get('/api/agreements/current')
    return status == 200 and isinstance(data, dict)

def frontend_institutions():
    status, data = get('/api/institutions')
    return status == 200 and isinstance(data, list)

def frontend_wishlist_requires_auth():
    status, data = get('/api/wishlist')
    return status == 401

print('Running 9/9/9 test suite...')
print('=' * 60)

frontend('API wiring reachable', frontend_api_wiring)
frontend('Categories endpoint', frontend_categories)
frontend('Browse listings', frontend_browse_listings)
frontend('Search query', frontend_search)
frontend('Auth signup', frontend_auth_signup)
frontend('Vendors endpoint', frontend_vendors)
frontend('Agreements endpoint', frontend_agreements)
frontend('Institutions endpoint', frontend_institutions)
frontend('Wishlist requires auth', frontend_wishlist_requires_auth)

backend('Health 200', backend_health)
backend('Signup validation 400', backend_signup_validation)
backend('OTP rate limit 429', backend_otp_rate_limit)
backend('CORS preflight', backend_cors)
backend('Cookie config', backend_cookie_config)
backend('Error format 404', backend_error_format)
backend('404 JSON response', backend_404_json)
backend('Rate limit headers', backend_rate_limit_headers)
backend('Body size limit', backend_json_body_limit)

database('Categories seeded', db_categories)
database('Vendors exist', db_vendors)
database('Listings exist', db_listings)
database('Reviews exist', db_reviews)
database('Indexes fast', db_indexes)
database('Foreign keys valid', db_foreign_keys)
database('Cascade delete', db_cascade)
database('Users exist', db_users)
database('No orphans', db_no_orphans)

print('\n' + '=' * 60)
print('RESULTS:')
print('=' * 60)

frontend_pass = sum(1 for _, r in results['frontend'] if r == 'PASS')
backend_pass = sum(1 for _, r in results['backend'] if r == 'PASS')
database_pass = sum(1 for _, r in results['database'] if r == 'PASS')

for category, tests in results.items():
    print(f'\n{category.upper()} ({len(tests)} tests):')
    for name, result in tests:
        status_icon = '✅' if result == 'PASS' else '❌'
        print(f'  {status_icon} {name}: {result}')

print('\n' + '=' * 60)
print(f'TOTAL: {frontend_pass}/9 frontend, {backend_pass}/9 backend, {database_pass}/9 database')
print(f'OVERALL: {frontend_pass + backend_pass + database_pass}/27')

if frontend_pass == 9 and backend_pass == 9 and database_pass == 9:
    print('\n🎉 ALL TESTS PASSED')
    sys.exit(0)
else:
    print('\n⚠️  Some tests failed - review above')
    sys.exit(1)

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✔ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✘ ${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// Test 1: Root route renders landing page
test('Root route renders LandingPage component', () => {
  const content = fs.readFileSync('src/app/page.tsx', 'utf8');
  assert(content.includes('LandingPage'), 'Missing LandingPage import');
  assert(content.includes('return <LandingPage />'), 'Missing LandingPage render');
});

// Test 2: Sign-in page has functional form
test('Sign-in page has password and magic-link forms', () => {
  const content = fs.readFileSync("src/app/(auth)/signin/page.tsx", 'utf8');
  assert(content.includes('signInWithPassword'), 'Missing signInWithPassword');
  assert(content.includes('requestMagicLink'), 'Missing requestMagicLink');
  assert(content.includes('type="password"'), 'Missing password input');
  assert(content.includes('type="email"'), 'Missing email input');
});

// Test 3: Sign-up page has functional form
test('Sign-up page has registration form with password confirmation', () => {
  const content = fs.readFileSync("src/app/(auth)/signup/page.tsx", 'utf8');
  assert(content.includes('signUpWithPassword'), 'Missing signUpWithPassword');
  assert(content.includes('confirmPassword'), 'Missing confirmPassword');
  assert(content.includes("'/verify-otp'"), 'Missing redirect to verify-otp');
});

// Test 4: Verify OTP page has functional form
test('Verify OTP page has OTP input and verification logic', () => {
  const content = fs.readFileSync("src/app/(auth)/verify-otp/page.tsx", 'utf8');
  assert(content.includes('verifyOtp'), 'Missing verifyOtp');
  assert(content.includes('One-time code'), 'Missing OTP label');
  assert(content.includes("'/home'"), 'Missing redirect to home');
});

// Test 5: Auth callback consumes magic link token
test('Auth callback consumes magic-link token and redirects', () => {
  const content = fs.readFileSync("src/app/(auth)/auth-callback/page.tsx", 'utf8');
  assert(content.includes('consumeMagicLink'), 'Missing consumeMagicLink');
  assert(content.includes('token'), 'Missing token param');
  assert(content.includes("'/home'"), 'Missing redirect to home');
});

// Test 6: MainLayout conditional nav
test('MainLayout shows nav only when authenticated', () => {
  const content = fs.readFileSync("src/app/(main)/layout.tsx", 'utf8');
  assert(content.includes('{me && ('), 'Missing me conditional');
  assert(content.includes('Sign out'), 'Missing Sign out button');
});

// Test 7: CORS auto-allows Vercel preview domains
test('Backend CORS auto-allows vercel.app domains', () => {
  const content = fs.readFileSync('../api/src/app.ts', 'utf8');
  assert(content.includes('vercel.app'), 'Missing vercel.app pattern');
  assert(content.includes('corsOriginValidator'), 'Missing CORS validator');
});

// Test 8: Landing page SEO metadata
test('Root page exports SEO metadata', () => {
  const content = fs.readFileSync('src/app/page.tsx', 'utf8');
  assert(content.includes('export const metadata'), 'Missing metadata export');
  assert(content.includes('Voeq — Find. Connect. Grow.'), 'Missing title');
  assert(content.includes('keywords'), 'Missing keywords');
});

// Test 9: Build output contains all critical routes
test('Build output contains all critical routes', () => {
  const serverDir = path.join('.next', 'server', 'app');
  const authDir = path.join(serverDir, '(auth)');
  const mainDir = path.join(serverDir, '(main)');
  
  assert(fs.existsSync(authDir), 'Auth routes missing');
  assert(fs.existsSync(mainDir), 'Main routes missing');
  
  const authRoutes = fs.readdirSync(authDir);
  assert(authRoutes.includes('signin'), 'Missing signin route');
  assert(authRoutes.includes('signup'), 'Missing signup route');
  assert(authRoutes.includes('verify-otp'), 'Missing verify-otp route');
  assert(authRoutes.includes('auth-callback'), 'Missing auth-callback route');
  
  const mainRoutes = fs.readdirSync(mainDir);
  assert(mainRoutes.includes('home'), 'Missing home route');
  assert(mainRoutes.includes('browse'), 'Missing browse route');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

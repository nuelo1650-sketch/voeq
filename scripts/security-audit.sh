# Voeq Security Audit Script
# Run with: bash scripts/security-audit.sh

set -e

echo "🔒 Running security audit..."

echo "📦 Checking for vulnerable dependencies..."
pnpm audit --audit-level=high || true

echo "🔍 Checking for secrets in code..."
if grep -r "BEGIN PRIVATE KEY" --include="*.ts" --include="*.tsx" --include="*.js" .; then
  echo "❌ Found private keys in code!"
  exit 1
fi

if grep -rE "AKIA[0-9A-Z]{16}" --include="*.ts" --include="*.tsx" .; then
  echo "❌ Found AWS access keys!"
  exit 1
fi

if grep -rE "sk_live_[0-9a-zA-Z]{24,}" --include="*.ts" --include="*.tsx" .; then
  echo "❌ Found Stripe live keys!"
  exit 1
fi

echo "🔍 Checking for console.log..."
if grep -rE "console\.(log|warn|info|debug)" --include="*.ts" --include="*.tsx" apps packages; then
  echo "⚠️  Found console statements (should use logger)"
fi

echo "🔍 Checking for TODO comments..."
if grep -rE "TODO|FIXME|XXX" --include="*.ts" --include="*.tsx" apps packages; then
  echo "⚠️  Found TODO comments"
fi

echo "🔍 Checking for 'any' types..."
if grep -rE ":\s*any\b" --include="*.ts" --include="*.tsx" apps packages; then
  echo "⚠️  Found 'any' types"
fi

echo "✅ Security audit complete"

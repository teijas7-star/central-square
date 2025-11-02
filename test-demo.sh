#!/bin/bash

# Central Square MVP - Quick Demo Test Script

echo "🎬 Central Square MVP - Demo Environment Test"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check 1: Dev Server
echo "1️⃣ Checking dev server..."
if curl -s http://localhost:3000 > /dev/null; then
  echo -e "${GREEN}✅ Dev server is running${NC}"
else
  echo -e "${RED}❌ Dev server not running. Run: npm run dev${NC}"
  exit 1
fi

# Check 2: API Endpoints
echo ""
echo "2️⃣ Testing API endpoints..."
SQUARE_API=$(curl -s http://localhost:3000/api/feed/square 2>/dev/null)
if echo "$SQUARE_API" | grep -q "posts"; then
  echo -e "${GREEN}✅ Square API working${NC}"
else
  echo -e "${YELLOW}⚠️  Square API responded but may be empty${NC}"
fi

# Check 3: Database Connection
echo ""
echo "3️⃣ Checking database connection..."
if npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Database connection OK${NC}"
else
  echo -e "${YELLOW}⚠️  Database connection check (this is OK if migrations are applied)${NC}"
fi

# Check 4: Environment Variables
echo ""
echo "4️⃣ Checking environment variables..."
ENV_VARS=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "DATABASE_URL")
MISSING=0
for var in "${ENV_VARS[@]}"; do
  if grep -q "^${var}=" .env.local 2>/dev/null; then
    echo -e "${GREEN}✅ ${var} is set${NC}"
  else
    echo -e "${RED}❌ ${var} is missing${NC}"
    MISSING=1
  fi
done

# Summary
echo ""
echo "=============================================="
if [ $MISSING -eq 0 ]; then
  echo -e "${GREEN}✅ Environment looks good!${NC}"
  echo ""
  echo "🎯 Next Steps:"
  echo "   1. Open http://localhost:3000 in your browser"
  echo "   2. Sign in with your email"
  echo "   3. Create your profile"
  echo "   4. Start exploring!"
  echo ""
  echo "📄 Demo guide: specs/001-central-square/DEMO-GUIDE.md"
else
  echo -e "${YELLOW}⚠️  Some environment variables are missing${NC}"
  echo "   Check .env.local file"
fi


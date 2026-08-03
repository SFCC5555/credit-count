#!/usr/bin/env bash
# API-level security validation — maps to SOW Acceptance Criteria.
#
# Usage (run from project root):
#
#   Step 1 — visitor tests only (no credentials needed):
#     bash docs/api-security-tests.local.sh 2>/dev/null | grep -A3 "TEST [123]"
#
#   Step 2 — get JWTs (fill in emails/passwords first):
#     bash docs/api-security-tests.local.sh 2>/dev/null | grep -A2 "GET.*TOKEN"
#
#   Step 3 — full suite (fill in all placeholders first):
#     bash docs/api-security-tests.local.sh 2>/dev/null
#
# Fill in the placeholders in api-security-tests.local.sh before running.

set -a
source .env.local
set +a

EMAIL_ENTHUSIAST="PASTE_ENTHUSIAST_EMAIL_HERE"
PASSWORD_ENTHUSIAST="PASTE_ENTHUSIAST_PASSWORD_HERE"
EMAIL_ADMIN="PASTE_ADMIN_EMAIL_HERE"
PASSWORD_ADMIN="PASTE_ADMIN_PASSWORD_HERE"

TOKEN_ENTHUSIAST="PASTE_ENTHUSIAST_JWT_HERE"
TOKEN_ADMIN="PASTE_ADMIN_JWT_HERE"
UUID_ENTHUSIAST="PASTE_ENTHUSIAST_PROFILE_UUID_HERE"
UUID_ADMIN="PASTE_ADMIN_PROFILE_UUID_HERE"
UUID_ANY_COASTER="PASTE_ANY_COASTER_UUID_HERE"


# ── Step 1: get JWTs (run once per session, tokens expire) ───────────────────

echo "=== GET ENTHUSIAST TOKEN ==="
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL_ENTHUSIAST\",\"password\":\"$PASSWORD_ENTHUSIAST\"}" \
  | grep -o '"access_token":"[^"]*"'

echo ""
echo "=== GET ADMIN TOKEN ==="
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL_ADMIN\",\"password\":\"$PASSWORD_ADMIN\"}" \
  | grep -o '"access_token":"[^"]*"'


# ── Test 1: Visitor cannot read rides (SOW FR #1) ────────────────────────────
# Expected: 401 or {"message":"permission denied for table rides"}
echo ""
echo "=== TEST 1: visitor → rides (expect 401 / permission denied) ==="
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rides" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

# ── Test 2: Visitor cannot read coasters (SOW FR #1) ────────────────────────
# Expected: 401 or permission denied
echo ""
echo "=== TEST 2: visitor → coasters (expect 401 / permission denied) ==="
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/coasters" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

# ── Test 3: Visitor cannot read profiles (SOW FR #1) ────────────────────────
# Expected: 401 or permission denied
echo ""
echo "=== TEST 3: visitor → profiles (expect 401 / permission denied) ==="
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/profiles" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"

# ── Test 4: Enthusiast only sees their own rides (SOW AC #2) ─────────────────
# Expected: 200 with array containing ONLY this user's rows (RLS filters silently).
# Compare row count against the Table Editor in the Supabase dashboard (which
# bypasses RLS) to confirm other users' rows are hidden.
echo ""
echo "=== TEST 4: enthusiast → own rides only (expect 200, own rows only) ==="
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rides?select=*" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $TOKEN_ENTHUSIAST"

# ── Test 5: Enthusiast cannot insert a ride for another user (SOW AC #2) ─────
# Expected: 403 / new row violates row-level security policy
echo ""
echo "=== TEST 5: enthusiast → insert ride for another user (expect 403) ==="
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rides" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $TOKEN_ENTHUSIAST" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"$UUID_ADMIN\",\"coaster_id\":\"$UUID_ANY_COASTER\",\"ride_date\":\"2026-01-01\"}"

# ── Test 6: Enthusiast cannot create a coaster (SOW AC #4) ───────────────────
# Expected: 403
echo ""
echo "=== TEST 6: enthusiast → insert coaster (expect 403) ==="
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/coasters" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $TOKEN_ENTHUSIAST" \
  -H "Content-Type: application/json" \
  -d '{"name":"Fake Coaster","park":"Test","country":"Test","manufacturer":"Test","type":"Steel"}'

# ── Test 7: Enthusiast cannot escalate their own role (hardened beyond SOW) ──
# Expected: 403 / column privilege error (thanks to column-level GRANT)
echo ""
echo "=== TEST 7: enthusiast → self-promote to admin (expect 403) ==="
curl -s -X PATCH "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/profiles?id=eq.$UUID_ENTHUSIAST" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $TOKEN_ENTHUSIAST" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}'

# ── Test 8: Admin cannot read another user's rides (SOW AC #2) ───────────────
# Expected: 200 with empty array — admin has no special rides access
echo ""
echo "=== TEST 8: admin → another user's rides (expect 200 empty array) ==="
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rides?select=*&user_id=eq.$UUID_ENTHUSIAST" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $TOKEN_ADMIN"

# ── Test 9 (control): Admin CAN create a coaster (SOW AC #4) ─────────────────
# Expected: 201 Created
echo ""
echo "=== TEST 9: admin → insert coaster (expect 201) ==="
curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/coasters" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Coaster (delete me)","park":"Test Park","country":"Test","manufacturer":"Test","type":"Steel"}'
echo " ← should be 201"

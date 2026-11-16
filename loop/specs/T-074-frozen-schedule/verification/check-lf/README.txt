verify-app run in an autocrlf=false clone of 081c09a (CRLF checkouts make export-data --check report every JSON stale, main too).
export-data --check 0
verify-app --no-plants 0 (379 checks)
t074 plants: all exit 1 on parity, not on export freshness.

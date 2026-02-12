#!/usr/bin/env bash
# Run all wrench test files and report results
# Usage: ./tests/run_all.sh [path-to-wrench]

WRENCH="${1:-wrench}"
DIR="$(cd "$(dirname "$0")" && pwd)"
PASS=0
FAIL=0
SKIP=0

for f in "$DIR"/*.wr; do
    name="$(basename "$f")"

    # Skip files that are meant to have errors
    if [[ "$name" == diagnostics_error.wr ]]; then
        # This file should fail compilation — verify it does
        output=$("$WRENCH" c "$f" /dev/null 2>&1)
        if echo "$output" | grep -q "err:"; then
            echo "  PASS  $name (expected compile error)"
            PASS=$((PASS + 1))
        else
            echo "  FAIL  $name (expected compile error but got none)"
            FAIL=$((FAIL + 1))
        fi
        continue
    fi

    # Skip manual-only test files
    if [[ "$name" == completions_test.wr ]]; then
        echo "  SKIP  $name (manual test)"
        SKIP=$((SKIP + 1))
        continue
    fi

    # Run the file and check for errors
    output=$("$WRENCH" r "$f" 2>&1)
    exit_code=$?

    if echo "$output" | grep -q "err:"; then
        echo "  FAIL  $name"
        echo "$output" | sed 's/^/        /'
        FAIL=$((FAIL + 1))
    else
        echo "  PASS  $name"
        PASS=$((PASS + 1))
    fi
done

echo ""
echo "Results: $PASS passed, $FAIL failed, $SKIP skipped"

if [ $FAIL -gt 0 ]; then
    exit 1
fi

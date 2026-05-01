# Tests

All tests use Vitest. Run with: `npm run test`

| File | Test | What it covers |
|------|------|----------------|
| tests/audit-engine.test.ts | recommends downgrade for small team on business plan | Rule 1: wrong plan for team size |
| tests/audit-engine.test.ts | returns isOptimal true when savings < $100 | Optimal spend detection |
| tests/audit-engine.test.ts | sets highSavingsCase true when savings exceed $500 | High-savings flag |
| tests/audit-engine.test.ts | calculates cross-vendor savings accurately | Rule 3: cross-vendor comparison |
| tests/audit-engine.test.ts | flags credits opportunity for high-spend tools | Rule 4: credits arbitrage |
| tests/audit-engine.test.ts | annual savings equals monthly times twelve | Math correctness |
| tests/audit-engine.test.ts | generates fallback summary when API unavailable | Graceful degradation |

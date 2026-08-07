/**
 * Lighthouse CI config for PCR frontend.
 *
 * Phase 0 budgets are warning-only so the CI gate stays green while the FE
 * is bootstrapped. Fase 8 (v1.0.0-rc1 in PRD) flips assertions to "error"
 * to enforce the PRD §13 performance NFRs (LCP < 2.5s, TBT < 200ms).
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "ready",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/listings",
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

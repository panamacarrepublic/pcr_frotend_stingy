/**
 * Sentry Node/edge SDK init for Next.js server runtime.
 *
 * Reads SENTRY_DSN (server-only env var) so the DSN is not exposed to the
 * browser. No-op when unset.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  });
}

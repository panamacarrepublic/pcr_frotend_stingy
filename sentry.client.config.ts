/**
 * Sentry browser SDK init.
 *
 * No-op when NEXT_PUBLIC_SENTRY_DSN is unset, so dev environments without a
 * project pay zero overhead. Sample rates are tuned for the Vercel free tier;
 * tighten via env vars when traffic grows.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  });
}

/**
 * Next.js instrumentation hook.
 *
 * Loads the Sentry SDK config matching the runtime (Node vs. Edge). The
 * client SDK loads automatically when @sentry/nextjs is wrapped via
 * withSentryConfig in next.config.ts. Each branch is a no-op when its DSN
 * env var is unset.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

import "@testing-library/jest-dom";

// src/lib/supabase-client.ts throws at import time when these are missing, which
// takes down any suite that transitively imports it (the wizard does, via
// useMakes → api-client). Real values come from .env.local at runtime; tests
// only need the module to construct.
process.env.NEXT_PUBLIC_SUPABASE_URL ||= "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= "test-anon-key";

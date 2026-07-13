import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in " +
      "(local Postgres for dev, or your Neon/Supabase connection string in production)."
  );
}

// A pooled connection is reused across requests in the same server process.
// On Vercel's serverless runtime, prefer your provider's pooled connection
// string (Neon and Supabase both offer one) rather than a direct connection.
//
// Explicitly request `sslmode=verify-full` for remote databases so pg doesn't
// emit a deprecation warning about the default SSL-mode alias. Local dev
// Postgres (localhost) is left alone since it typically has no TLS.
const dbUrl = new URL(process.env.DATABASE_URL);
const isLocal = dbUrl.hostname === "localhost" || dbUrl.hostname === "127.0.0.1";
if (!isLocal && !dbUrl.searchParams.get("sslmode")) {
  dbUrl.searchParams.set("sslmode", "verify-full");
}

const pool = new Pool({
  connectionString: dbUrl.toString(),
  max: 5,
});

export const db = drizzle(pool, { schema });

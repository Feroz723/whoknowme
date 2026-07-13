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
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

export const db = drizzle(pool, { schema });

import { customAlphabet } from "nanoid";
import { createHash, randomBytes } from "crypto";

// Unambiguous alphabet — no 0/O or 1/I/l mixups when someone reads a link aloud.
const slugAlphabet = "23456789abcdefghjkmnpqrstuvwxyz";
const generateSlug = customAlphabet(slugAlphabet, 7);

export function makeSlug(): string {
  return generateSlug();
}

/**
 * The raw edit token is shown to the creator exactly once (embedded in their
 * private magic link). Only its hash is stored, so a database read alone
 * can never reveal a working token.
 */
export function makeEditToken(): { token: string; tokenHash: string } {
  const token = randomBytes(24).toString("base64url");
  return { token, tokenHash: hashToken(token) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Salted hash of a requester's IP, used only for duplicate-response
 * throttling (see db/schema.ts responses.ipHash). Never store the raw IP.
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "dev-salt-change-in-production";
  return createHash("sha256").update(salt + ip).digest("hex");
}

import { randomBytes } from "crypto";

// Unambiguous alphabet (no 0/O/1/I/L) so tokens are easy to read & share.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Generate an unguessable, share-friendly public token (default 8 chars ≈ 40 bits). */
export function generateToken(length = 8): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

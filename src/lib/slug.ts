import { randomBytes } from "crypto";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a random, non-guessable slug for use in public room URLs.
 * Uses crypto.randomBytes (not Math.random / Date.now) so it can't be
 * predicted or enumerated.
 */
export function generateSlug(length = 10): string {
  const bytes = randomBytes(length);
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return slug;
}

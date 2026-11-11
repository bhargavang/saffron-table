// No 0/O, 1/I/L: easy to read out over the phone.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Short booking reference like "ST-7K3QM". */
export function makeRef(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  let code = "";
  for (const b of bytes) code += ALPHABET[b % ALPHABET.length];
  return `ST-${code}`;
}

// Prints an ADMIN_PASSWORD_HASH value for the given password.
// Usage: npm run hash-password -- "your-password"
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 10) {
  console.error('Usage: npm run hash-password -- "a password of 10+ characters"');
  process.exit(1);
}

const salt = randomBytes(16);
const key = scryptSync(password, salt, 32);
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`);

import { randomInt } from "crypto";

// Excludes 0/O and 1/I/L — easy to misread when a code is read aloud or
// typed from a photo of a screen.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 10;

/** A random code, unique per call by construction (32^10 possibilities —
    collisions are astronomically unlikely, and the DB's unique
    constraint on InviteCode.code is the actual backstop). */
export function generateInviteCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

import crypto from "node:crypto";

export function timingSafeEqualString(received, expected) {
  const left = Buffer.from(String(received || ""), "utf8");
  const right = Buffer.from(String(expected || ""), "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

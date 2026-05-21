import "dotenv/config";

function safePort(value) {
  const fallback = "3000";
  const raw = String(value || fallback).trim();
  const parsed = Number(raw);

  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65535) {
    return fallback;
  }

  return raw;
}

export const cfg = {
  PORT: safePort(process.env.PORT || "3000"),
  CMB_WHATSAPP_WEBHOOK_SECRET: process.env.CMB_WHATSAPP_WEBHOOK_SECRET || "",
};

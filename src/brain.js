const GREETINGS = new Set(["hello", "hi", "hey", "good morning"]);
const PRICING = new Set(["pricing", "price", "cost"]);

export const BOT_PROFILE = [
  "Purpose: WhatsApp Test Assistant is a CookMyBots managed WhatsApp test bot brain.",
  "Public features: greetings, help, pricing, contact, and about.",
  "Rules: WhatsApp-only managed transport, no direct WhatsApp API calls, one short reply per message.",
].join(" ");

export function normalizeText(text) {
  return String(text || "").trim().toLowerCase();
}

export function detectIntent(text) {
  const normalized = normalizeText(text);

  if (GREETINGS.has(normalized)) return "greeting";
  if (normalized === "help") return "help";
  if (PRICING.has(normalized)) return "pricing";
  if (normalized === "contact") return "contact";
  if (normalized === "about") return "about";

  if (
    normalized.includes("what do you do") ||
    normalized.includes("what does this bot do") ||
    normalized.includes("what does the bot do") ||
    normalized.includes("who are you")
  ) {
    return "about";
  }

  return "fallback";
}

export function composeReply(intent) {
  switch (intent) {
    case "greeting":
      return "Hello, welcome to WhatsApp Test Assistant. Send help to see what I can do.";
    case "help":
      return "Available text commands: help, pricing, contact, about.";
    case "pricing":
      return "Pricing is a placeholder for now. Replace this with your real plan details when ready.";
    case "contact":
      return "Support contact is a placeholder for now. Add your real email or phone number here.";
    case "about":
      return "This is WhatsApp Test Assistant, a test WhatsApp bot built with CookMyBots.";
    default:
      return "Thanks, I received your message. Send help to see what I can do.";
  }
}

export async function handleText({ text }) {
  const normalizedText = normalizeText(text);
  const intent = detectIntent(normalizedText);
  const reply = composeReply(intent);

  return {
    ok: true,
    intent,
    normalizedText,
    reply,
  };
}

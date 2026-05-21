# WhatsApp Test Assistant

A WhatsApp-only bot brain for CookMyBots managed WhatsApp transport.

CookMyBots handles WhatsApp connectivity. This repo only receives normalized message events, generates one short reply, and returns it as JSON.

## Endpoints

1) GET /health
Returns deployment health JSON.

2) POST /webhook/cookmybots/whatsapp
Production CookMyBots inbound WhatsApp webhook. Requires X-CookMyBots-Webhook-Secret.

3) POST /test
Local testing endpoint. Requires only a JSON body with text.

## Environment

Copy .env.sample to .env and configure:

1) CMB_WHATSAPP_WEBHOOK_SECRET
2) PORT

No WhatsApp tokens, phone number IDs, QR sessions, or direct WhatsApp credentials are used.

## Run

1) npm install
2) npm run dev

## Test

POST http://localhost:3000/test

Body:

{
  "text": "hello"
}

Expected reply:

Hello, welcome to WhatsApp Test Assistant. Send help to see what I can do.

See DOCS.md for full usage details.

# WhatsApp Test Assistant

WhatsApp Test Assistant is a simple CookMyBots managed WhatsApp bot brain.

CookMyBots handles the WhatsApp connection and transport. This service does not implement WhatsApp Cloud API setup, Meta webhook verification, WhatsApp Web sessions, QR login, phone number ID setup, or direct WhatsApp API calls.

## Endpoints

### GET /health

Returns a simple healthy JSON response for deployment checks.

Example response:

{
  "ok": true,
  "status": "healthy",
  "platform": "whatsapp"
}

### POST /webhook/cookmybots/whatsapp

CookMyBots managed WhatsApp transport forwards inbound WhatsApp messages to this endpoint.

Required header:

X-CookMyBots-Webhook-Secret: your configured CMB_WHATSAPP_WEBHOOK_SECRET

Accepted JSON fields:

1) from
2) text
3) messageId
4) projectId
5) platform
6) source
7) timestamp

Successful response:

{
  "ok": true,
  "reply": "Hello, welcome to WhatsApp Test Assistant. Send help to see what I can do."
}

Invalid or missing webhook secret returns an unauthorized JSON response.

### POST /test

Use this endpoint for local testing without WhatsApp.

Example body:

{
  "text": "hello"
}

Example response:

{
  "ok": true,
  "reply": "Hello, welcome to WhatsApp Test Assistant. Send help to see what I can do."
}

## Supported messages

Send hello, hi, hey, or good morning to receive the welcome reply.

Send help to see available text commands.

Send pricing, price, or cost to receive placeholder pricing information.

Send contact to receive a placeholder support contact message.

Send about, what do you do, what does this bot do, or who are you to learn what the bot does.

Any other message receives a short acknowledgement.

## Public text commands

### help

Shows the available text commands.

Usage: send help

### pricing

Returns placeholder pricing information.

Usage: send pricing, price, or cost

### contact

Returns placeholder support contact information.

Usage: send contact

### about

Explains that this is a test WhatsApp bot built with CookMyBots.

Usage: send about

## Environment variables

### CMB_WHATSAPP_WEBHOOK_SECRET

Required for the production webhook. CookMyBots sends this value in the X-CookMyBots-Webhook-Secret header.

### PORT

Optional server port. Defaults to 3000 when missing.

## Local setup

1) Install dependencies with npm install.
2) Copy .env.sample to .env.
3) Set CMB_WHATSAPP_WEBHOOK_SECRET for webhook testing.
4) Start development mode with npm run dev.

## Local test examples

Start the server, then send a local test request to POST http://localhost:3000/test with this JSON body:

{
  "text": "hello"
}

To test the production-style webhook locally, send POST http://localhost:3000/webhook/cookmybots/whatsapp with the X-CookMyBots-Webhook-Secret header and a body like:

{
  "from": "local-user",
  "text": "help",
  "messageId": "test-message-1",
  "projectId": "local-project",
  "platform": "whatsapp",
  "source": "cookmybots",
  "timestamp": "2026-01-01T00:00:00.000Z"
}

## Deployment notes

Deploy this as one Node.js service. Configure PORT if your host requires it. Configure CMB_WHATSAPP_WEBHOOK_SECRET in the CookMyBots deployment environment.

In CookMyBots, connect your WhatsApp number in the UI. CookMyBots will forward WhatsApp messages to POST /webhook/cookmybots/whatsapp and use the JSON reply returned by this service.

## Logging

The service logs startup, environment sanity booleans, webhook receipt, rejected secret verification, successful reply generation, and route failures.

Secrets are never logged.

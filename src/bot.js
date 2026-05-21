import express from "express";
import { handleText } from "./brain.js";
import { log, safeErr } from "./lib/log.js";
import { timingSafeEqualString } from "./lib/security.js";

function clean(value) {
  return String(value || "").trim();
}

function publicPayloadMeta(body = {}) {
  return {
    messageId: clean(body.messageId) || undefined,
    projectId: clean(body.projectId) || undefined,
    platform: clean(body.platform) || undefined,
    source: clean(body.source) || undefined,
    fromPresent: Boolean(body.from),
    textPresent: Boolean(body.text),
    timestampPresent: Boolean(body.timestamp),
  };
}

export function createApp({ cfg }) {
  const app = express();

  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      status: "healthy",
      platform: "whatsapp",
    });
  });

  app.post("/webhook/cookmybots/whatsapp", async (req, res) => {
    const startedAt = Date.now();
    const meta = publicPayloadMeta(req.body);

    try {
      log.info("webhook.received", meta);

      const expectedSecret = clean(cfg.CMB_WHATSAPP_WEBHOOK_SECRET);
      const receivedSecret = clean(req.headers["x-cookmybots-webhook-secret"]);

      if (!expectedSecret) {
        log.warn("webhook.secret_not_configured", {
          messageId: meta.messageId,
        });
        return res.status(503).json({
          ok: false,
          error: "webhook_secret_not_configured",
        });
      }

      if (!receivedSecret || !timingSafeEqualString(receivedSecret, expectedSecret)) {
        log.warn("webhook.secret_rejected", {
          messageId: meta.messageId,
          headerPresent: Boolean(receivedSecret),
        });
        return res.status(401).json({
          ok: false,
          error: "unauthorized",
        });
      }

      const text = clean(req.body?.text);

      if (!text) {
        log.warn("webhook.missing_text", { messageId: meta.messageId });
        return res.status(400).json({
          ok: false,
          error: "missing_text",
        });
      }

      const result = await handleText({
        from: clean(req.body?.from),
        text,
        messageId: clean(req.body?.messageId),
        projectId: clean(req.body?.projectId),
        platform: clean(req.body?.platform),
        source: clean(req.body?.source),
        timestamp: req.body?.timestamp,
      });

      log.info("webhook.reply_generated", {
        messageId: meta.messageId,
        intent: result.intent,
        durationMs: Date.now() - startedAt,
      });

      return res.status(200).json({
        ok: true,
        reply: result.reply,
      });
    } catch (err) {
      log.error("webhook.route_failure", {
        messageId: meta.messageId,
        error: safeErr(err),
      });
      return res.status(500).json({
        ok: false,
        error: "server_error",
      });
    }
  });

  app.post("/test", async (req, res) => {
    const startedAt = Date.now();

    try {
      const text = clean(req.body?.text);

      if (!text) {
        return res.status(400).json({
          ok: false,
          error: "missing_text",
        });
      }

      const result = await handleText({
        from: clean(req.body?.from) || "local-test",
        text,
        messageId: clean(req.body?.messageId) || "local-test",
        projectId: clean(req.body?.projectId) || "local",
        platform: "whatsapp",
        source: "local-test",
        timestamp: req.body?.timestamp || new Date().toISOString(),
      });

      log.info("test.reply_generated", {
        intent: result.intent,
        durationMs: Date.now() - startedAt,
      });

      return res.status(200).json({
        ok: true,
        reply: result.reply,
      });
    } catch (err) {
      log.error("test.route_failure", { error: safeErr(err) });
      return res.status(500).json({
        ok: false,
        error: "server_error",
      });
    }
  });

  app.use((err, _req, res, _next) => {
    log.error("http.route_failure", { error: safeErr(err) });
    res.status(400).json({
      ok: false,
      error: "invalid_request",
    });
  });

  return app;
}

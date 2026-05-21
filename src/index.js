import "dotenv/config";

function safeBootErr(err) {
  return err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    String(err);
}

process.on("unhandledRejection", (err) => {
  console.error("[fatal] unhandledRejection", { error: safeBootErr(err) });
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[fatal] uncaughtException", { error: safeBootErr(err) });
  process.exit(1);
});

async function boot() {
  try {
    const [{ cfg }, { createApp }, { log }] = await Promise.all([
      import("./lib/config.js"),
      import("./bot.js"),
      import("./lib/log.js"),
    ]);

    log.info("boot.start", { platform: "whatsapp" });
    log.info("config.loaded", {
      portSet: Boolean(process.env.PORT),
      webhookSecretSet: Boolean(cfg.CMB_WHATSAPP_WEBHOOK_SECRET),
    });

    const app = createApp({ cfg });
    const port = Number(cfg.PORT || 3000);

    app.listen(port, () => {
      log.info("server.started", {
        platform: "whatsapp",
        port,
        webhookPath: "/webhook/cookmybots/whatsapp",
      });
    });
  } catch (err) {
    console.error("[boot] failed", {
      error: safeBootErr(err),
      hint: "Check that dependencies are installed with npm run build and all relative imports exist.",
    });
    process.exit(1);
  }
}

boot();

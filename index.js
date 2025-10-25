const fs = require('fs');
const express = require("express");
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get("/ping", (req, res) => res.type("text/plain").send("ok"));

app.get("/room.html", /* ... tu HTML tal cual ... */);

app.listen(port, async () => {
  console.log("HTTP listo en puerto", port);
  console.log("Healthcheck:", "/ping");

  try {
    const url = `http://localhost:${port}/room.html`;

    // 1) Usamos el valor de ENV sin saltos/espacios
    let execPath = (process.env.PUPPETEER_EXECUTABLE_PATH || '').trim();

    // 2) Si esa ruta no existe, hacemos fallback a la de Puppeteer
    if (!execPath || !fs.existsSync(execPath)) {
      const autoPath = puppeteer.executablePath();
      console.log("Ruta env NO válida. Fallback a puppeteer.executablePath():", autoPath);
      execPath = autoPath;
    } else {
      console.log("Usando ruta de ENV para Chrome:", execPath);
    }

    const browser = await puppeteer.launch({
      executablePath: execPath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
      ],
    });

    const page = await browser.newPage();
    page.on("console", (msg) => console.log("[room]", msg.text()));
    await page.goto(url, { waitUntil: "domcontentloaded" });

    console.log("Puppeteer cargó /room.html y la sala debería estar levantada.");
    // No cierres el browser para que la sala siga viva
  } catch (err) {
    console.error("Error lanzando Puppeteer:", err);
  }
});

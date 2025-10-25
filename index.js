const path = require('path');
const fs = require('fs');
const express = require("express");
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.get("/ping", (req, res) => res.type("text/plain").send("ok"));

app.get("/room.html", /* tu HTML igual */);

app.listen(port, async () => {
  console.log("HTTP listo en puerto", port);
  console.log("Healthcheck:", "/ping");

  try {
    const url = `http://localhost:${port}/room.html`;

    // Intentar usar el path del Chrome instalado
    let chromePath = process.env.PUPPETEER_EXECUTABLE_PATH?.trim();
    if (!chromePath || !fs.existsSync(chromePath)) {
      chromePath = '/opt/render/.cache/puppeteer/chrome/linux-141.0.7390.122/chrome-linux64/chrome';
      console.log("Usando ruta forzada para Chrome:", chromePath);
    }

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process'
      ]
    });

    const page = await browser.newPage();
    page.on("console", (msg) => console.log("[room]", msg.text()));
    await page.goto(url, { waitUntil: "domcontentloaded" });

    console.log("Puppeteer cargó /room.html y la sala debería estar levantada.");
  } catch (err) {
    console.error("Error lanzando Puppeteer:", err);
  }
});


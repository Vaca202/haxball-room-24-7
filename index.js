const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

const port = process.env.PORT || 3000;

app.get("/ping", (req, res) => res.type("text/plain").send("ok"));

app.get("/room.html", /* tu HTML actual, sin cambios */);

app.listen(port, async () => {
  console.log("HTTP listo en puerto", port);
  console.log("Healthcheck:", "/ping");

  try {
    const url = `http://localhost:${port}/room.html`;

    // 🔑 Pide a Puppeteer la ruta del Chrome que acaba de instalarse en el start
    const chromePath = await puppeteer.executablePath();
    console.log("Chrome path:", chromePath);

    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,               // o 'new'
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
    // No cierres el browser
  } catch (err) {
    console.error("Error lanzando Puppeteer:", err);
  }
});

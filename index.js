const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = process.env.PORT || 3000;

// Healthcheck
app.get("/ping", (req, res) => res.type("text/plain").send("ok"));

// Página que levanta la sala (en el navegador/Chromium)
app.get("/room.html", (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Haxball Headless Host</title>
  </head>
  <body>
    <script src="https://www.haxball.com/headless"></script>
    <script>
      // Esperar a que cargue headless
      (function waitHB(){
        if (typeof HBInit !== 'function') return setTimeout(waitHB, 100);
        start();
      })();

      function start() {
        const room = HBInit({
          roomName: "⚽ 𝗟𝗘𝗖𝗛𝗘 𝟮𝟰/𝟳 | Vaca 🐄⚽",
          maxPlayers: 12,
          public: true,
          token: "${process.env.HAXBALL_TOKEN || ""}", // viene de Render env vars
          geo: { code: "ES", lat: 40.4168, lon: -3.7038 } // España
        });

        room.setDefaultStadium("Classic");
        room.setScoreLimit(3);
        room.setTimeLimit(3);

        // Mensajes amigables
        room.onPlayerJoin = (player) => {
          room.sendAnnouncement("👋 ¡Bienvenido " + player.name + "!", null, 0x00C853, "bold", 2);
        };
        room.onPlayerLeave = (player) => {
          room.sendAnnouncement("👋 " + player.name + " ha salido.", null, 0x9E9E9E, "normal", 1);
        };
        room.onPlayerChat = (player, msg) => {
          if (msg === "!admin") {
            room.setPlayerAdmin(player.id, true);
            room.sendAnnouncement("🔑 Ahora eres admin, " + player.name + "!", null, 0x2962FF, "bold", 2);
            return false;
          }
        };

        // Log de enlace de la sala
        room.onRoomLink = (link) => {
          console.log("ROOM LINK:", link);
        };

        console.log("Room script listo.");
      }
    </script>
  </body>
</html>`);
});

// Arrancar servidor y luego abrir la sala con Puppeteer (Chrome headless)
app.listen(port, async () => {
  console.log("HTTP listo en puerto", port);
  console.log("Healthcheck:", "/ping");

  try {
    const url = `http://localhost:${port}/room.html`;
    const browser = await puppeteer.launch({
  executablePath: puppeteer.executablePath(),  // usa el Chromium que se bajó
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--no-zygote",
    "--single-process"
  ]
});


    const page = await browser.newPage();
    page.on("console", (msg) => console.log("[room]", msg.text()));
    await page.goto(url, { waitUntil: "domcontentloaded" });

    console.log("Puppeteer cargó /room.html y la sala debería estar levantada.");
    // ¡NO cierres el browser! Si lo cierras, muere la sala.
    // await browser.close();
  } catch (err) {
    console.error("Error lanzando Puppeteer:", err);
  }
});



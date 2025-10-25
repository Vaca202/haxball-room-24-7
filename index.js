const express = require("express");
const app = express();

// Use Render/Heroku-style PORT or default to 3000 for local dev
const port = process.env.PORT || 3000;

// Minimal healthcheck to keep the service awake (for UptimeRobot, etc.)
app.get("/ping", (req, res) => res.type("text/plain").send("ok"));

// Headless room bootstrap
app.get("/", (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow">
    <title>Haxball Headless</title>
  </head>
  <body>
    <script src="https://www.haxball.com/headless"></script>
    <script>
      // === Configuración de la sala ===
      const room = HBInit({
        roomName: "⚽ 𝗟𝗘𝗖𝗛𝗘 𝟮𝟰/𝟳 | Vaca 🐄⚽",
        maxPlayers: 12,
        public: true,
        // El token se inyecta desde una variable de entorno segura del servidor
        token: "${process.env.HAXBALL_TOKEN || ""}",
        // Fuerza región España (Madrid)
        geo: { code: "ES", lat: 40.4168, lon: -3.7038 }
      });

      // Ajustes básicos (puedes cambiarlos)
      room.setDefaultStadium("Classic");
      room.setScoreLimit(3);
      room.setTimeLimit(3); // minutos

      // Mensajes útiles
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
          return false; // no mostrar en chat
        }
      };
    </script>
  </body>
</html>`);
});

app.listen(port, () => {
  console.log(`Servidor iniciado en puerto ${port}`);
  console.log("Healthcheck:", `/ping`);
});

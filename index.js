import { HBInit } from "@haxball/headless-host";

const room = HBInit({
  roomName: "⚽ 𝗟𝗘𝗖𝗛𝗘 𝟮𝟰/𝟳 | Vaca 🐄⚽",
  maxPlayers: 12,
  public: true,
  token: process.env.HAXBALL_TOKEN,
  geo: { code: "ES", lat: 40.4168, lon: -3.7038 }
});

room.setDefaultStadium("Classic");
room.setScoreLimit(3);
room.setTimeLimit(3);

room.onPlayerJoin = (player) => {
  room.sendAnnouncement(`👋 ¡Bienvenido ${player.name}!`, null, 0x00C853, "bold", 2);
};

room.onPlayerLeave = (player) => {
  room.sendAnnouncement(`👋 ${player.name} ha salido.`, null, 0x9E9E9E, "normal", 1);
};

room.onPlayerChat = (player, msg) => {
  if (msg === "!admin") {
    room.setPlayerAdmin(player.id, true);
    room.sendAnnouncement(`🔑 Ahora eres admin, ${player.name}!`, null, 0x2962FF, "bold", 2);
    return false;
  }
};



# Haxball Headless Room – Render 24/7

Esta carpeta ya está lista para desplegar en **Render.com** (gratis) y mantener tu sala 24/7.

## 1) Archivos
- `index.js` → servidor Express que crea la sala headless, región España, y expone `/ping`.
- `package.json` → dependencias y comando de inicio.

## 2) Pasos en Render
1. Sube esta carpeta a un repositorio de **GitHub** (dos archivos: `index.js`, `package.json`).
2. Entra a https://render.com → **New** → **Web Service** → conecta tu repo.
3. Configura:
   - **Environment**: Node
   - **Build Command**: (déjalo vacío, Render instalará con `npm install`)
   - **Start Command**: `npm start`
   - **Region**: EU (Frankfurt/London funcionan bien para ES)
4. En **Environment Variables** crea una variable:
   - **Key**: `HAXBALL_TOKEN`
   - **Value**: (tu token de https://www.haxball.com/headlesstoken )
5. Haz **Deploy**. Cuando veas `Servidor iniciado en puerto ...`, visita la URL de Render (p.ej. `https://tu-app.onrender.com`).

> La página puede mostrarse en blanco: es normal, el script headless corre en segundo plano.  
> Para probar que el servicio está vivo, abre `/ping` (ej: `https://tu-app.onrender.com/ping`) y verás `ok`.

## 3) Mantener 24/7 (opcional pero recomendado)
Crea un monitor en https://uptimerobot.com de tipo **HTTP(s)** apuntando a:
```
https://TU-APP.onrender.com/ping
```
Así Render mantendrá el proceso activo.

## 4) Personalización rápida
- Cambia el nombre de la sala en `index.js` (propiedad `roomName`).
- `geo` está fijado a España (Madrid). Puedes cambiar lat/lon si quieres otra ciudad.
- Comandos del chat: escribe `!admin` para volverte admin.

¡Listo! Tu sala debería aparecer en **Haxball → Public Rooms → Europe (Spain)** con el nombre configurado.

# 🛡️ Tickhosting 24/7 Manager v2.0

Este proyecto automatiza por completo el mantenimiento de tus servidores en Tickhosting, evitando que caduquen y que hibernen por falta de jugadores.

## ✨ Características
- **🔄 Auto-Renovación**: Pulsa el botón de "Renew" cada 4 horas automáticamente vía GitHub Actions.
- **🤖 Bot Anti-Hibernación**: Un bot de Minecraft (`mineflayer`) se conecta al servidor para mantenerlo activo 24/7.
- **📜 Sistema de Licencias**: Soporte para planes Free, Pro, Ultra y Admin.
- **🔔 Notificaciones Discord**: Recibe alertas cada vez que tu servidor sea renovado con éxito.

## 🚀 Instalación y Configuración en GitHub

1. Sube este código a un repositorio de GitHub **PRIVADO**.
2. Ve a `Settings` > `Secrets and variables` > `Actions` > `New repository secret`.
3. Añade los siguientes secretos:
   - `TICK_USER`: Tu usuario del panel de Tickhosting.
   - `TICK_PASS`: Tu contraseña del panel de Tickhosting.
   - `MC_HOST`: IP de tu servidor (ej: `play.creeperlegends.com`).
   - `MC_USER`: Nombre del bot en el juego (ej: `AntiAFK_Bot`).
   - `MC_VERSION`: Versión del servidor (ej: `1.20.1`).
   - `LICENSE_KEY`: Usa `ADMIN-123` para acceso total.
   - `DISCORD_WEBHOOK`: (Opcional) URL para notificaciones.

## 🛠️ Ejecución Local (Opcional)

Si prefieres correr el bot de Minecraft desde tu propia PC:
1. Instala las dependencias: `npm install`
2. Configura el archivo `.env` (usa el `.env.example` como guía).
3. Ejecuta el renovador: `node renew.js`
4. Ejecuta el bot AFK: `node afk-bot.js`

## 💎 Planes de Licencia
- **Plan Free**: Funciones básicas, límite de 3 renovaciones diarias.
- **Plan Pro**: Hasta 24 renovaciones diarias.
- **Plan Ultra**: Renovaciones ilimitadas y soporte prioritario.
- **Plan Admin**: Acceso total a todas las funciones (Reservado).

---
**Desarrollado por Gemini Developer para Tickhosting Manager.**

const mineflayer = require('mineflayer');
const LicenseManager = require('./utils/license');
require('dotenv').config();

async function startBot() {
    const license = new LicenseManager(process.env.LICENSE_KEY);
    const plan = await license.validate();

    if (plan.name === 'Free') {
        console.warn("[BOT] El plan Free tiene limitaciones de tiempo AFK. Recomendado: Pro.");
    }

    const config = {
        host: process.env.MC_HOST,
        port: parseInt(process.env.MC_PORT) || 25565,
        username: process.env.MC_USER || 'TickGuardian_Bot',
        version: process.env.MC_VERSION || '1.20.1',
        duration: 3.8 * 60 * 60 * 1000 // 3h 48m
    };

    console.log(`[BOT] Conectando a ${config.host}:${config.port} [Plan: ${plan.name}]`);

    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version
    });

    bot.on('login', () => {
        console.log(`[BOT] Sesión iniciada como ${bot.username}`);
        
        // Desconexión automática tras cumplirse el ciclo
        setTimeout(() => {
            console.log("[BOT] Ciclo completado. Desconectando para reiniciar ciclo de renovación...");
            bot.quit();
            process.exit(0);
        }, config.duration);
    });

    bot.on('spawn', () => {
        console.log("¡Bot en el juego!");
        bot.chat(`🛡️ TickManager v2.2 [${plan.name}] Activo`);

        // Comportamiento Humanoide Aleatorio
        setInterval(() => {
            if (!bot.entity) return;

            const action = Math.random();

            if (action < 0.2) { // Salto
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            } else if (action < 0.4) { // Rotación de cabeza
                const yaw = (Math.random() - 0.5) * Math.PI;
                const pitch = (Math.random() - 0.5) * Math.PI / 2;
                bot.look(yaw, pitch);
            } else if (action < 0.6) { // Pequeño movimiento
                bot.setControlState('forward', true);
                setTimeout(() => bot.setControlState('forward', false), 1000);
            } else { // Agacharse/Levantarse
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 800);
            }
        }, 30000); // Cada 30 segundos una acción
    });

    bot.on('error', (err) => {
        console.error(`[ERROR] ${err.message}`);
        setTimeout(startBot, 30000);
    });

    bot.on('kicked', (reason) => {
        console.warn(`[KICKED] Razón: ${reason}`);
        setTimeout(startBot, 30000);
    });
}

startBot();

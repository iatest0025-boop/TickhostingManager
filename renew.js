const puppeteer = require('puppeteer');
const LicenseManager = require('./utils/license');
require('dotenv').config();

const MAX_ATTEMPTS = 3;

async function sendDiscordNotification(status, message, planName) {
    const webhookUrl = process.env.DISCORD_WEBHOOK;
    if (!webhookUrl) return;

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: status === 'success' ? '✅ Renovación Completada' : '❌ Error en Renovación',
                    description: `**Host:** ${process.env.MC_HOST}\n**Mensaje:** ${message}\n**Plan:** ${planName}`,
                    color: status === 'success' ? 0x2ECC71 : 0xFF0000,
                    footer: { text: 'Tickhosting Manager v2.2 - Proceso Autónomo' },
                    timestamp: new Date().toISOString()
                }]
            })
        });
    } catch (e) {
        console.error('Error enviando notificación a Discord:', e.message);
    }
}

async function runRenewalTask(attempt = 1) {
    const license = new LicenseManager(process.env.LICENSE_KEY);
    const plan = await license.validate();

    console.log(`\n[${new Date().toLocaleString()}] Intento ${attempt}/${MAX_ATTEMPTS} para el plan ${plan.name}`);
    
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    const page = await browser.newPage();
    // User agent realista para evitar bloqueos
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        console.log("-> Accediendo a Tickhosting...");
        await page.goto('https://panel.tickhosting.com/auth/login', { waitUntil: 'networkidle2', timeout: 60000 });

        console.log("⏳ Esperando resolución de retos (Cloudflare)...");
        await new Promise(r => setTimeout(r, 30000)); // Espera base para captcha

        console.log("-> Identificando campos de login...");
        await page.waitForSelector('input[name="user"]', { timeout: 10000 });
        await page.type('input[name="user"]', process.env.TICK_USER, { delay: 100 });
        await page.type('input[name="password"]', process.env.TICK_PASS, { delay: 100 });
        
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null)
        ]);

        console.log("-> Buscando botón de renovación...");
        await new Promise(r => setTimeout(r, 5000)); // Espera a que el dashboard cargue

        const result = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button, a'));
            const renewBtn = btns.find(b => 
                b.innerText.toLowerCase().includes('renew') || 
                b.innerText.toLowerCase().includes('renovar') ||
                b.innerText.toLowerCase().includes('keep alive')
            );

            if (renewBtn) {
                renewBtn.click();
                return { success: true, text: renewBtn.innerText };
            }
            return { success: false };
        });

        if (result.success) {
            console.log("✅ ¡Botón pulsado con éxito!");
            await sendDiscordNotification('success', "El servidor ha sido renovado correctamente.", plan.name);
            await browser.close();
            return true;
        } else {
            throw new Error("No se encontró el botón de renovación en la página actual.");
        }

    } catch (error) {
        console.error(`❌ Fallo en intento ${attempt}: ${error.message}`);
        await browser.close();

        if (attempt < MAX_ATTEMPTS) {
            console.log("Reintentando en 10 segundos...");
            await new Promise(r => setTimeout(r, 10000));
            return await runRenewalTask(attempt + 1);
        } else {
            await sendDiscordNotification('error', `Fallaron todos los reintentos: ${error.message}`, plan.name);
            return false;
        }
    }
}

runRenewalTask();

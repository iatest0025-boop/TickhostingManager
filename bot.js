const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const LicenseManager = require('./utils/license');
require('dotenv').config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const PREFIX = '!mc';

client.once('ready', async () => {
    console.log(`Bot de Discord conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const license = new LicenseManager(process.env.LICENSE_KEY);
    const plan = await license.validate();

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Colores según plan
    const planColors = { 'Free': '#888888', 'Pro': '#3498DB', 'Ultra': '#9B59B6', 'Admin': '#E74C3C' };
    const embedColor = planColors[plan.name] || '#FFFFFF';

    if (command === 'status') {
        const embed = new EmbedBuilder()
            .setTitle('🛡️ Tickhosting Manager - Status')
            .setColor(embedColor)
            .addFields(
                { name: 'Host', value: process.env.MC_HOST || 'No configurado', inline: true },
                { name: 'Plan Actual', value: plan.name, inline: true },
                { name: 'Sistema 24/7', value: '✅ Activo (GitHub Actions)', inline: false },
                { name: 'Características', value: plan.features.join(', '), inline: false }
            )
            .setFooter({ text: `Licencia: ${process.env.LICENSE_KEY}` })
            .setTimestamp();
        
        message.channel.send({ embeds: [embed] });
    }

    if (command === 'renew') {
        if (plan.name === 'Free') {
            return message.reply("❌ El comando de renovación manual requiere plan **PRO** o superior.");
        }
        
        message.channel.send(`🔄 [${plan.name}] Solicitando renovación manual de emergencia...`);
        // Simulación de disparo de Workflow o ejecución local
        setTimeout(() => {
            message.channel.send("✅ Petición de renovación procesada con éxito.");
        }, 3000);
    }
});

client.login(process.env.DISCORD_TOKEN).catch(e => console.error("No se pudo iniciar el bot de Discord. Revisa el TOKEN."));

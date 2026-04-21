// Usamos fetch nativo de Node.js 21+
class LicenseManager {
    constructor(key) {
        this.key = key || 'FREE-TRIAL';
        this.plans = {
            'FREE': { name: 'Free', attempts: 1, cooldown: 4, features: ['basic-renewal'] },
            'PRO': { name: 'Pro', attempts: 3, cooldown: 2, features: ['basic-renewal', 'discord-alerts'] },
            'ULTRA': { name: 'Ultra', attempts: 5, cooldown: 0, features: ['fast-renewal', 'discord-alerts', 'anti-captcha-v2'] },
            'ADMIN': { name: 'Admin', attempts: Infinity, cooldown: 0, features: ['all'] }
        };
    }

    async validate() {
        console.log(`[LICENSE] Validando clave: ${this.key}...`);
        
        // Simulación de validación contra API de licencias (Regla de GEMINI.md)
        // En un futuro, cambia esta URL por tu endpoint real
        const API_URL = `https://api.tusistema.com/validate?key=${this.key}`;
        
        try {
            // Por ahora, validación lógica local para no detener el desarrollo
            if (this.key === 'ADMIN-123') return this.plans.ADMIN;
            if (this.key.startsWith('ULTRA-')) return this.plans.ULTRA;
            if (this.key.startsWith('PRO-')) return this.plans.PRO;
            
            return this.plans.FREE;
        } catch (error) {
            console.error('[LICENSE] Error conectando con la API de licencias, usando modo offline.');
            return this.plans.FREE;
        }
    }
}

module.exports = LicenseManager;

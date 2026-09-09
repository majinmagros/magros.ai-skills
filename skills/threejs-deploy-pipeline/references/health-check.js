// scripts/health-check.js — Health check pós-deploy (status, three.js, canvas, scripts, tempo)
// Extraído de SKILL.md (2026-09-09). Uso: SITE_URL=https://seu-dominio.com node scripts/health-check.js
async function healthCheck() {
  const url = process.env.SITE_URL || 'https://seu-dominio.com';

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Verificações básicas
    const checks = {
      status: response.ok,
      statusCode: response.status,
      hasThreeJS: html.includes('three'),
      hasCanvas: html.includes('<canvas') || html.includes('webgl'),
      hasScripts: html.includes('<script'),
      responseTime: performance.now() - startTime
    };

    console.log('Health Check:', checks);

    if (!checks.status) {
      throw new Error(`Health check failed: ${checks.statusCode}`);
    }

    return checks;
  } catch (error) {
    console.error('Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();

#!/usr/bin/env node
/**
 * deploy-hostinger.js — FTP/API deploy to Hostinger VPS.
 * 
 * Uso: node scripts/deploy-hostinger.js [ftp|api]
 */

import { createClient } from 'basic-ftp';
import { promises as fs } from 'fs';
import path from 'node:path';
import { HostingerAPI } from '@hostinger/api-cli';

const DIST_PATH = path.resolve('dist');
const HOSTINGER_CONFIG = {
  ftp: {
    host: process.env.HOSTINGER_FTP_HOST || 'ftp.seu-dominio.com',
    user: process.env.HOSTINGER_FTP_USER || 'usuario',
    password: process.env.HOSTINGER_FTP_PASS || 'senha',
    secure: true, // FTPS
    secureOptions: { rejectUnauthorized: false }
  },
  api: {
    token: process.env.HOSTINGER_API_TOKEN || 'seu-token'
  },
  vps: {
    label: process.env.HOSTINGER_VPS_LABEL || 'threejs-site',
    domain: process.env.HOSTINGER_DOMAIN || 'seu-dominio.com'
  }
};

async function deployFTP() {
  console.log('🚀 Iniciando deploy via FTP (FTPS)...');
  
  if (!await fs.stat(DIST_PATH).catch(() => false)) {
    console.error('❌ Pasta dist/ não encontrada. Rode `npm run build` primeiro.');
    process.exit(1);
  }
  
  const client = new createClient();
  client.ftp.verbose = true;
  
  try {
    console.log('🔌 Conectando ao Hostinger...');
    await client.access(HOSTINGER_CONFIG.ftp);
    console.log('✅ Conectado!');
    
    // Ensure remote directory
    await client.ensureDir('public_html');
    
    // Clear remote directory (optional - comentar se quiser manter arquivos)
    console.log('🧹 Limpando diretório remoto...');
    await client.clearWorkingDir();
    
    // Upload
    console.log('📤 Enviando arquivos...');
    await client.uploadFromDir(DIST_PATH, 'public_html');
    
    console.log('✅ Deploy FTP concluído com sucesso!');
    
  } catch (err) {
    console.error('❌ Erro no deploy FTP:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

async function deployAPI() {
  console.log('🚀 Iniciando deploy via Hostinger API...');
  
  if (!await fs.stat(DIST_PATH).catch(() => false)) {
    console.error('❌ Pasta dist/ não encontrada. Rode `npm run build` primeiro.');
    process.exit(1);
  }
  
  try {
    const api = new HostingerAPI({
      token: HOSTINGER_CONFIG.api.token
    });
    
    console.log('🔍 Buscando VPS...');
    const vpsList = await api.vps.list();
    const targetVps = vpsList.find(v => v.label === HOSTINGER_CONFIG.vps.label);
    
    if (!targetVps) {
      throw new Error(`VPS "${HOSTINGER_CONFIG.vps.label}" não encontrado`);
    }
    
    console.log(`🎯 VPS encontrado: ${targetVps.label} (${targetVps.ip})`);
    
    console.log('📤 Iniciando deploy via API...');
    const deployment = await api.vps.deploy(targetVps.id, {
      source: 'github',
      repo: process.env.GITHUB_REPO || 'usuario/repo',
      branch: process.env.GITHUB_BRANCH || 'main',
      buildCommand: 'npm ci && npm run build',
      outputDir: 'dist',
      domain: HOSTINGER_CONFIG.vps.domain
    });
    
    console.log('✅ Deploy API iniciado:', deployment);
    
    // Poll for completion
    console.log('⏳ Aguardando conclusão...');
    let status = 'pending';
    while (status === 'pending' || status === 'building' || status === 'deploying') {
      await new Promise(r => setTimeout(r, 10000));
      const updated = await api.vps.getDeployment(targetVps.id, deployment.id);
      status = updated.status;
      console.log(`   Status: ${status} (${updated.progress || 0}%)`);
    }
    
    if (status === 'success') {
      console.log('✅ Deploy API concluído com sucesso!');
    } else {
      console.error('❌ Deploy falhou:', status);
      process.exit(1);
    }
    
  } catch (err) {
    console.error('❌ Erro no deploy API:', err.message);
    process.exit(1);
  }
}

async function deployVPS() {
  console.log('🚀 Deploy direto no VPS via SSH...');
  
  // Este método requer SSH configurado
  // Para uso com `ssh user@vps-ip "cd /var/www/projeto && git pull && npm ci && npm run build && pm2 restart all"`
  
  console.log('⚠️  Deploy SSH requer configuração manual.');
  console.log('Execute no VPS:');
  console.log('  ssh root@seu-vps-ip');
  console.log('  cd /var/www/seu-projeto');
  console.log('  git pull origin main');
  console.log('  npm ci && npm run build');
  console.log('  pm2 restart all');
}

async function main() {
  const args = process.argv.slice(2);
  const method = args[0] || 'ftp';
  
  console.log('╔══════════════════════════════════════╗');
  console.log('║     THREE.JS DEPLOY TO HOSTINGER     ║');
  console.log('╚══════════════════════════════════════╝');
  
  switch (method) {
    case 'ftp':
      await deployFTP();
      break;
    case 'api':
      await deployAPI();
      break;
    case 'vps':
      await deployVPS();
      break;
    default:
      console.error(`Método desconhecido: ${method}`);
      console.log('Uso: node deploy-hostinger.js [ftp|api|vps]');
      process.exit(1);
  }
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
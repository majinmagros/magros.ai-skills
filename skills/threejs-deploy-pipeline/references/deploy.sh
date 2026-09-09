#!/bin/bash
# scripts/deploy.sh — Deploy local: ./deploy.sh [production|staging] [hostinger|netlify|vercel|github-pages]
# Extraído de SKILL.md (2026-09-09).

set -e

ENVIRONMENT=${1:-production}
TARGET=${2:-hostinger}

echo "Iniciando deploy para $TARGET ($ENVIRONMENT)..."

# 1. Build
echo "Building..."
npm run build

# 2. Verificar tamanho
echo "Tamanho do build:"
du -sh dist/
find dist -name "*.js" -o -name "*.css" | xargs ls -lh | awk '{sum+=$5} END {print "Total JS/CSS:", sum/1024/1024, "MB"}'

# 3. Deploy baseado no target
case $TARGET in
  hostinger)
    echo "Deploying to Hostinger VPS..."
    cd dist && zip -r ../deploy.zip .
    scp deploy.zip $HOSTINGER_USER@$HOSTINGER_HOST:/tmp/
    ssh $HOSTINGER_USER@$HOSTINGER_HOST "
      cd /var/www/html && rm -rf * && unzip -o /tmp/deploy.zip
      chown -R www-data:www-data .
      systemctl reload nginx
    "
    ;;
  netlify)
    echo "Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist
    ;;
  vercel)
    echo "Deploying to Vercel..."
    vercel --prod --token=$VERCEL_TOKEN
    ;;
  github-pages)
    echo "Deploying to GitHub Pages..."
    npx gh-pages -d dist
    ;;
  *)
    echo "Target desconhecido: $TARGET"
    exit 1
    ;;
esac

echo "Deploy concluído!"

#!/bin/bash
set -e

echo "=== Instalando dependencias frontend ==="
cd frontend
npm ci

echo "=== Construyendo frontend ==="
npm run build

echo "=== Moviendo dist al backend ==="
rm -rf ../Nuevo_back/dist
cp -r dist ../Nuevo_back/dist

echo "=== Instalando dependencias backend ==="
cd ../Nuevo_back
npm ci

echo "=== Iniciando backend ==="
# Railway inyecta process.env.PORT automáticamente
node src/app.js
# Si deseas correr localmente, descomenta la línea siguiente y comenta la anterior



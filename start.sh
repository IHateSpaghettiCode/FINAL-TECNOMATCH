#!/bin/bash
set -e

# Variables
FRONTEND_DIR="frontend"
BACKEND_DIR="Nuevo_back"

echo "=== Instalando dependencias frontend ==="
cd $FRONTEND_DIR
npm ci

echo "=== Instalando dependencias backend ==="
cd ../$BACKEND_DIR
npm ci

echo "=== Construyendo frontend ==="
cd ../$FRONTEND_DIR
npm run build

echo "=== Moviendo dist al backend ==="
rm -rf ../$BACKEND_DIR/dist
cp -r dist ../$BACKEND_DIR/dist

echo "=== Iniciando backend ==="
cd ../$BACKEND_DIR

# Forzar uso de puerto dinámico de Railway
export PORT=${PORT:-4000}
node src/app.js



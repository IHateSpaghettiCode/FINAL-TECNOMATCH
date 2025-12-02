#!/bin/bash
set -e

echo "=== Instalando dependencias frontend ==="
cd frontend
npm ci

echo "=== Instalando dependencias backend ==="
cd ../Nuevo_back
npm ci

echo "=== Construyendo frontend ==="
cd ../frontend
npm run build

echo "=== Moviendo dist al backend ==="
rm -rf ../Nuevo_back/dist
cp -r dist ../Nuevo_back/dist

echo "=== Iniciando backend ==="
cd ../Nuevo_back
node src/app.js

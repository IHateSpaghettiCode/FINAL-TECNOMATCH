#!/bin/bash

# ================================
# 🚀 Script de deployment TecnoMatch
# ================================

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
node src/app.js

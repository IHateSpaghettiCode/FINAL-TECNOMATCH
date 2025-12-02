#!/bin/bash
echo "=== Instalando dependencias frontend ==="
cd frontend
npm ci
cd ../Nuevo_back
echo "=== Instalando dependencias backend ==="
npm ci
echo "=== Construyendo frontend ==="
cd ../frontend
npm run build
echo "=== Moviendo dist al backend ==="
rm -rf ../Nuevo_back/dist
cp -r dist ../Nuevo_back/dist
echo "=== Iniciando backend ==="
cd ../Nuevo_back
npm run start

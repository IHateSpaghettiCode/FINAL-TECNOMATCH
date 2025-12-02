#!/bin/bash

echo "=== Instalando dependencias frontend ==="
cd frontend
npm ci
cd ..

echo "=== Instalando dependencias backend ==="
cd Nuevo_back
npm ci
cd ..

echo "=== Construyendo frontend ==="
cd frontend
npm run build
cd ..

echo "=== Moviendo dist al backend ==="
rm -rf Nuevo_back/dist
cp -r frontend/dist Nuevo_back/dist

echo "=== Iniciando backend ==="
cd Nuevo_back
node src/app.js

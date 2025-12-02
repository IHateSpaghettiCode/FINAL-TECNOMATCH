#!/bin/bash
set -e

# =======================================
# 🛠 Variables
# =======================================
FRONTEND_DIR="frontend"
BACKEND_DIR="Nuevo_back"

# =======================================
# 1️⃣ Instalar dependencias frontend
# =======================================
echo "=== Instalando dependencias frontend ==="
cd $FRONTEND_DIR
npm ci

# =======================================
# 2️⃣ Instalar dependencias backend
# =======================================
echo "=== Instalando dependencias backend ==="
cd ../$BACKEND_DIR
npm ci

# =======================================
# 3️⃣ Construir frontend
# =======================================
echo "=== Construyendo frontend ==="
cd ../$FRONTEND_DIR
npm run build

# =======================================
# 4️⃣ Mover dist al backend
# =======================================
echo "=== Moviendo dist al backend ==="
rm -rf ../$BACKEND_DIR/dist
cp -r dist ../$BACKEND_DIR/dist

# =======================================
# 5️⃣ Iniciar backend en puerto dinámico
# =======================================
echo "=== Iniciando backend ==="
cd ../$BACKEND_DIR

# Forzamos que Node use el puerto dinámico de Railway
export PORT=${PORT:-4000}
node src/app.js



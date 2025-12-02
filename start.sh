#!/bin/bash

COMMAND=$1

if [ "$COMMAND" == "install" ]; then
    echo "=== Instalando frontend ==="
    cd frontend
    npm ci
    cd ..

    echo "=== Instalando backend ==="
    cd Nuevo_back
    npm ci
    cd ..

elif [ "$COMMAND" == "build" ]; then
    echo "=== Construyendo frontend ==="
    cd frontend
    npm run build
    cd ..

    echo "=== Moviendo dist al backend ==="
    rm -rf Nuevo_back/dist
    cp -r frontend/dist Nuevo_back/dist

elif [ "$COMMAND" == "start" ]; then
    echo "=== Iniciando backend ==="
    cd Nuevo_back
    node src/app.js

else
    echo "Comando desconocido: $COMMAND"
fi

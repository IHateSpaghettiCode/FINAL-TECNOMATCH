# Imagen base con Node
FROM node:20

# Crear directorio para la app
WORKDIR /app

# Copiar todo el repo dentro del contenedor
COPY . .

# Dar permisos a start.sh
RUN chmod +x start.sh

# Comando de inicio
CMD ["./start.sh"]

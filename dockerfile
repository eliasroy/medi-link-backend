# Usar Node.js ligero
FROM node:20-alpine

# Crear directorio de la app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción y dev necesarias para compilación
RUN npm install --only=production apk add --no-cache curl

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto de la app
EXPOSE 3000

# Ejecutar la app compilada
CMD ["node", "dist/app.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1

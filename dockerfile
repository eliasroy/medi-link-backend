# Usar Node.js ligero
FROM node:20-alpine

# Crear directorio de la app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción y dev necesarias para compilación
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer puerto de la app
EXPOSE 3000

# Ejecutar la app compilada
CMD ["node", "dist/app.js"]

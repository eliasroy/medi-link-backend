# ========================
# Etapa 1: Build
# ========================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar TODAS las dependencias (incluye dev)
RUN npm install

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# ========================
# Etapa 2: Runtime
# ========================
FROM node:20-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar solo lo necesario desde build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src

EXPOSE 3000

CMD ["node", "dist/app.js"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

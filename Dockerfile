FROM node:20

WORKDIR /app

# Copiamos solo package.json y package-lock.json primero
COPY package*.json ./

# Instalamos dependencias (incluye typescript y vite)
RUN npm install

# Copiamos el resto del código
COPY . .

# Aseguramos permisos de ejecución para todos los binarios locales
RUN chmod +x node_modules/.bin/*

# Compilamos usando npx para garantizar que use los binarios locales
RUN npx tsc -b && npx vite build

# Instala un servidor ligero para servir el dist
RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
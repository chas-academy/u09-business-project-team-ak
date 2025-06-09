# Använd smalare image
FROM node:24-alpine

# Ange arbetskatalog
WORKDIR /app

# Kopiera och installera bara beroenden först
COPY package*.json ./
RUN npm install

# Kopiera all kod
COPY . .

# Bygg TypeScript
RUN npm run build

# Rensa cache för mindre image (valfritt)
RUN npm cache clean --force

# Ange miljö
ENV NODE_ENV=production

# Exponera port om du vill (valfritt men bra för dokumentation)
EXPOSE 4000

# Starta applikationen
CMD ["npm", "start"]

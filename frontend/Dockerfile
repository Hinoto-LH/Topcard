FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4200

# --host 0.0.0.0 est nécessaire pour que Docker expose le serveur en dehors du container
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200"]

# Compilar projeto
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Executar projeto
FROM node:24-alpine
WORKDIR /app
COPY package*.json .
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
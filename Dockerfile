# --- Stage 1: Build ---
# Uses a multi-stage build to keep the final production image lightweight
FROM node:24-alpine AS builder
WORKDIR /app

# Copies package files first to leverage Docker layer caching
COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Production ---
FROM node:24-alpine
WORKDIR /app

COPY package*.json .
# Installs only production dependencies for better security and a smaller image footprint
RUN npm install --omit=dev

# Retrieves only the compiled output from the builder stage, discarding source code
COPY --from=builder /app/dist ./dist

# Documents the port the application listens on (does not automatically publish it)
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
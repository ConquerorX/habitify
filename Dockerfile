# Build Frontend
FROM node:22-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build

# Build Backend
FROM node:22-slim AS backend-builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY server/package*.json ./server/
RUN cd server && npm install --include=dev
COPY server ./server/
RUN cd server && npx prisma generate && npm run build

# Final Stage
FROM node:22-slim
WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy Backend Build
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/prisma ./server/prisma

# Copy Frontend Build to Backend's public folder
COPY --from=frontend-builder /app/dist ./server/public

# Create startup script that runs migrations then starts server
RUN echo '#!/bin/sh\ncd /app/server\nnpx prisma migrate deploy --schema=./prisma/schema.prisma || npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss\nnpm run start' > /app/start.sh && chmod +x /app/start.sh

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

WORKDIR /app/server
CMD ["/bin/sh", "/app/start.sh"]

# Build Frontend
FROM node:22-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build Backend
FROM node:22-slim AS backend-builder
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server/
RUN cd server && npx prisma generate && npm run build

# Final Stage
FROM node:22-slim
WORKDIR /app

# Copy Backend Build
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/prisma ./server/prisma

# Copy Frontend Build to Backend's public folder
COPY --from=frontend-builder /app/dist ./server/public

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

WORKDIR /app/server
CMD ["npm", "run", "start"]

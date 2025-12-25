# Coolify Deployment Guide for Habitify

Habitify'ı Coolify üzerinde yayınlamak için aşağıdaki adımları takip edebilirsin.

## 1. Veritabanı Kurulumu (PostgreSQL)
Coolify panelinde:
1. **Resources** -> **New** -> **Database** -> **PostgreSQL** seç.
2. Veritabanı adını `habitify-db` koy.
3. Kurulum tamamlandıktan sonra, **External Connection URL** veya **Internal Connection URL**'i kopyala.
    - Eğer uygulama ve veritabanı aynı Coolify projesi içindeyse Internal URL (`postgres://...`) daha hızlıdır.

## 2. Uygulama Kurulumu
Habitify uygulamasını Coolify'a eklerken:
1. **GitHub Repository** olarak projeni seç.
2. **Build Pack** olarak `Nixpacks` veya `Docker` seçebilirsin (Aşağıdaki Docker konfigürasyonu en sağlıklısıdır).

## 3. Ortam Değişkenleri (Environment Variables)
Uygulama ayarlarında **Variables** sekmesine şunları ekle:
- `DATABASE_URL`: Az önce kopyaladığın PostgreSQL URL'i.
- `JWT_SECRET`: Güçlü ve rastgele bir anahtar (Örn: `habitify_secret_key_2025`).
- `VITE_API_BASE_URL`: Uygulamanın yayınlanacağı tam URL (Örn: `https://habitify.dural.qzz.io/api`).
- `PORT`: `5000` (Backend için).

## 4. Docker Konfigürasyonu (Tavsiye Edilen)
Projenin kök dizinine aşağıdaki `Dockerfile` dosyasını ekledim. Coolify bunu otomatik tanıyacaktır.

```dockerfile
# Build Frontend
FROM node:22-slim AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Build Backend
FROM node:22-slim
WORKDIR /app
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server ./server/
COPY --from=frontend-builder /app/dist ./server/public

# Generate Prisma
RUN cd server && npx prisma generate

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server/src/index.js"]
```

> [!NOTE]
> Backend'de `src/index.ts` kullandığımız için production'da `ts-node` yerine derlenmiş JS dosyalarını çalıştırmak daha performanslıdır. Eğer direkt TS çalıştırmak istersen CMD kısmını `npx ts-node server/src/index.ts` olarak güncelleyebilirsin.

## 5. Erişim
Uygulama ayağa kalktığında Coolify sana bir domain (örn: `habitify.your-ip.sslip.io`) verecektir. Dashboard üzerinden bu domaini ayarlayabilirsin.

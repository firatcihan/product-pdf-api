# 🚀 Quick Start - JWT Authentication

## Hızlı Başlangıç

### 1️⃣ Environment Setup

```bash
cp .env.example .env
```

`.env` dosyasını düzenle:

```env
MONGO_URI=mongodb://localhost/stajapi
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
PORT=3000
```

### 2️⃣ MongoDB'yi Başlat

```bash
# Docker ile
docker run -d -p 27017:27017 --name mongodb mongo

# veya Windows Service
net start MongoDB
```

### 3️⃣ Uygulamayı Başlat

```bash
yarn install
yarn start:dev
```

✅ Uygulama çalışıyor: http://localhost:3000
✅ Swagger Docs: http://localhost:3000/api

---

## 📝 Kullanım Örnekleri

### Kayıt Ol

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "675c1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user"
}
```

### Giriş Yap

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Korumalı Endpoint'e Erişim

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔐 Kendi Endpoint'inizi Koruyun

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from './auth/current-user.decorator';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: CurrentUserData) {
    return {
      message: 'This is protected!',
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
  }
}
```

---

## 📚 Daha Fazla Bilgi

Detaylı kullanım için `AUTH_USAGE.md` dosyasına bakın.

---

## ✅ Test

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Type check
yarn typechecks

# Linting
yarn lint
```

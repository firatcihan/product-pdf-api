# Staj API - JWT Authentication System

NestJS ile geliştirilmiş, MongoDB kullanan, email ve şifre tabanlı JWT authentication sistemi.

## ✨ Özellikler

- 🔐 **JWT Authentication** - Email ve şifre ile güvenli kimlik doğrulama
- 📝 **User Registration** - Yeni kullanıcı kaydı
- 🔑 **Login System** - Kullanıcı girişi
- 🛡️ **Protected Routes** - JWT ile korumalı endpoint'ler
- 📚 **Swagger Documentation** - Otomatik API dokümantasyonu
- ✅ **Validation** - Class-validator ile veri doğrulama
- 🏗️ **ikapi Architecture** - Production-ready mimari
- 🧪 **Testing** - Unit ve E2E test desteği

## 🚀 Hızlı Başlangıç

### Önkoşullar

- Node.js (v18+)
- MongoDB
- Yarn package manager

### Kurulum

```bash
# Bağımlılıkları yükle
yarn install

# Environment variables ayarla
cp .env.example .env

# .env dosyasını düzenle
# MONGO_URI, JWT_SECRET, vb.

# MongoDB'yi başlat (Docker)
docker run -d -p 27017:27017 --name mongodb mongo

# Uygulamayı başlat
yarn start:dev
```

Uygulama şu adreslerde çalışacak:

- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

## 📖 Dokümantasyon

- **[QUICKSTART.md](./QUICKSTART.md)** - Hızlı başlangıç rehberi
- **[AUTH_USAGE.md](./AUTH_USAGE.md)** - Detaylı kullanım kılavuzu ve örnekler

## 🎯 API Endpoints

### Authentication

| Method | Endpoint         | Açıklama             | Auth Required |
| ------ | ---------------- | -------------------- | ------------- |
| POST   | `/auth/register` | Yeni kullanıcı kaydı | ❌            |
| POST   | `/auth/login`    | Kullanıcı girişi     | ❌            |
| GET    | `/auth/me`       | Kullanıcı bilgileri  | ✅            |

### Örnek Kullanım

**Kayıt:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

**Giriş:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Korumalı Endpoint:**

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🏗️ Proje Yapısı

```
src/
├── auth/                       # Authentication modülü
│   ├── dto/                    # Data Transfer Objects
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── auth-response.dto.ts
│   ├── auth.controller.ts      # Auth endpoints
│   ├── auth.service.ts         # Auth business logic
│   ├── auth.module.ts          # Auth module
│   ├── jwt.strategy.ts         # JWT Passport strategy
│   ├── jwt-auth.guard.ts       # JWT Guard
│   └── current-user.decorator.ts
├── user/                       # User modülü
│   ├── entities/
│   │   └── user.entity.ts      # User MongoDB schema
│   └── user.module.ts
├── common/                     # Ortak entity ve servisler
│   └── common.entity.ts
└── main.ts                     # Application entry
```

## 🔐 Korumalı Endpoint Oluşturma

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
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
  }
}
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov

# Type checks
yarn typechecks

# Linting
yarn lint
```

## 📦 Scripts

```bash
yarn start:dev      # Development mode
yarn start:prod     # Production mode
yarn build          # Build project
yarn typechecks     # TypeScript type check
yarn lint           # ESLint check
yarn lint:fix       # Auto-fix lint errors
yarn format         # Format code with Prettier
yarn test           # Run tests
```

## 🔒 Environment Variables

```env
MONGO_URI=mongodb://localhost/stajapi
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3000
```

**⚠️ Önemli:** Production'da `JWT_SECRET` değerini mutlaka değiştirin!

## 🛠️ Teknolojiler

- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport JWT** - JWT authentication
- **bcrypt** - Password hashing
- **class-validator** - Validation
- **Swagger/OpenAPI** - API documentation

## 📝 License

This project is MIT licensed.

# JWT Authentication API - Kullanım Kılavuzu

Bu proje, **ikapi** mimarisine göre tasarlanmış email ve şifre tabanlı JWT authentication sistemi içerir.

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
yarn install
```

### 2. Environment Variables Ayarla

`.env.example` dosyasını `.env` olarak kopyala ve düzenle:

```bash
cp .env.example .env
```

`.env` dosyası:

```env
MONGO_URI=mongodb://localhost/stajapi
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
PORT=3000
```

**ÖNEMLİ:** `JWT_SECRET` değerini production'da mutlaka değiştirin!

### 3. MongoDB'yi Başlat

MongoDB'nin çalıştığından emin olun:

```bash
# Windows'ta MongoDB servisi
net start MongoDB

# veya Docker ile
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Uygulamayı Başlat

```bash
# Development mode
yarn start:dev

# Production build
yarn build
yarn start:prod
```

Uygulama şu adreslerde çalışacak:

- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

---

## 📚 API Endpoints

### 1. Kullanıcı Kaydı (Register)

**POST** `/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (201):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user"
}
```

**Curl Örneği:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

---

### 2. Giriş Yapma (Login)

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user"
}
```

**Curl Örneği:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### 3. Kullanıcı Bilgilerini Alma (Get Me) - Korumalı Endpoint

**GET** `/auth/me`

**Headers:**

```
Authorization: Bearer {accessToken}
```

**Response (200):**

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user"
}
```

**Curl Örneği:**

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🔐 Korumalı Endpoint Oluşturma

Kendi endpoint'lerinizi JWT ile korumak için:

### Controller Örneği:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from './auth/current-user.decorator';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(JwtAuthGuard) // JWT Guard ekle
  @ApiBearerAuth() // Swagger için
  async getProfile(@CurrentUser() user: CurrentUserData) {
    // user.userId, user.email, user.role kullanabilirsiniz
    return {
      message: 'This is a protected route',
      user: user,
    };
  }
}
```

---

## 🛠️ Test Etme

### Postman ile Test:

1. **Register** isteği gönder
2. Dönen `accessToken`'ı kopyala
3. Korumalı endpoint'lere istek atarken:
   - Headers → Authorization: `Bearer {token}`

### Swagger ile Test:

1. Tarayıcıda http://localhost:3000/api aç
2. **POST /auth/register** veya **POST /auth/login** ile token al
3. Sayfanın sağ üstündeki 🔒 **Authorize** butonuna tıkla
4. `Bearer {token}` formatında token'ı yapıştır
5. Korumalı endpoint'leri test et

---

## 📁 Proje Yapısı

```
src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts              # Login DTO
│   │   ├── register.dto.ts           # Register DTO
│   │   └── auth-response.dto.ts      # Response DTO
│   ├── auth.controller.ts            # Auth endpoints
│   ├── auth.service.ts               # Auth business logic
│   ├── auth.module.ts                # Auth module
│   ├── jwt.strategy.ts               # JWT Passport strategy
│   ├── jwt-auth.guard.ts             # JWT Guard
│   └── current-user.decorator.ts     # User decorator
├── user/
│   ├── entities/
│   │   └── user.entity.ts            # User MongoDB schema
│   └── user.module.ts
├── common/
│   └── common.entity.ts              # Base entity (timestamps)
└── main.ts                           # Application entry
```

---

## 🔑 Güvenlik Notları

1. **JWT_SECRET**: Production'da güçlü bir secret key kullanın
2. **Password**: Minimum 6 karakter gerekli (bcrypt ile hashlenmiş)
3. **Token Expiry**: Default 7 gün, ihtiyaca göre değiştirin
4. **HTTPS**: Production'da mutlaka HTTPS kullanın
5. **Rate Limiting**: Brute force saldırılarına karşı rate limiter ekleyin

---

## 🎯 Örnek Senaryo

```bash
# 1. Kullanıcı kaydı
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# Response:
# {"accessToken":"eyJhbG...","userId":"675...","email":"test@test.com","role":"user"}

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Korumalı endpoint'e erişim
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer eyJhbG..."
```

---

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası

```
MongooseError: connect ECONNREFUSED
```

**Çözüm:** MongoDB'nin çalıştığından emin olun

### JWT Secret Hatası

```
JwtService requires a secret or key
```

**Çözüm:** `.env` dosyasında `JWT_SECRET` tanımlı olmalı

### 401 Unauthorized

**Çözüm:** Token'ın geçerli olduğundan ve `Authorization: Bearer {token}` formatında gönderildiğinden emin olun

---

## 📖 Ek Kaynaklar

- [NestJS Documentation](https://docs.nestjs.com)
- [Passport JWT](http://www.passportjs.org/packages/passport-jwt/)
- [Swagger/OpenAPI](https://swagger.io)

---

## 👨‍💻 Development

```bash
# Type check
yarn typechecks

# Linting
yarn lint

# Format
yarn format

# Tests
yarn test
```

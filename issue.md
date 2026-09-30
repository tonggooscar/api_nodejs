# Task: Inisialisasi Project Node.js dengan Express, Drizzle ORM, dan MySQL

## 📌 Deskripsi & Tujuan
Membuat fondasi (starter kit/boilerplate) aplikasi REST API berbasis **Node.js** yang menggunakan framework **Express.js**, ORM **Drizzle**, dan database **MySQL**. Dokumen ini berisi panduan high-level yang siap diimplementasikan oleh programmer atau AI agent.

---

## 🛠️ Stack Teknologi
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **ORM**: Drizzle ORM
- **Database Driver**: `mysql2`
- **Database**: MySQL
- **Tooling**: `drizzle-kit` (untuk migrasi & manajemen skema), `dotenv` (manajemen variabel environment)

---

## 📂 Rekomendasi Struktur Direktori (High-Level)
```
api_nodejs/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── drizzle.config.ts (atau drizzle.config.js)
├── src/
│   ├── config/        # Konfigurasi aplikasi & environment
│   ├── db/            # Connection pool & skema Drizzle
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── routes/        # Endpoint / router Express
│   ├── controllers/   # Logika bisnis & handler request
│   └── index.ts       # Entrypoint server Express
```

---

## 📋 Langkah-Langkah Implementasi

### 1. Inisialisasi Project Node.js
- Jalankan inisialisasi package manager (`npm init -y`).
- Konfigurasi `package.json` (atur script `start`, `dev`, `build`, serta sesuaikan tipe module ESM/TypeScript).
- Buat file `.env` dan `.env.example` untuk menyimpan konfigurasi database (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `PORT`).
- Buat file `.gitignore` (`node_modules`, `.env`, folder dist/build).

### 2. Instalasi Dependency
- **Dependencies Utama**:
  - `express`
  - `drizzle-orm`
  - `mysql2`
  - `dotenv`
- **Dev Dependencies**:
  - `drizzle-kit`
  - `nodemon` / `tsx` (runtime runner untuk development)

### 3. Konfigurasi Database & Drizzle ORM
- Buat file konfigurasi `drizzle.config.ts` (atau `.js`) untuk mengatur skema dan koneksi database Drizzle.
- Inisialisasi koneksi MySQL pool di `src/db/index.ts` menggunakan `mysql2/promise`.
- Hubungkan instance connection pool dengan Drizzle ORM.

### 4. Definisi Skema Database (Drizzle Schema)
- Buat skema tabel awal di `src/db/schema.ts` (misalnya: tabel contoh `users` atau `items` dengan kolom standar seperti `id`, `name`, `createdAt`).
- Ekspor skema agar siap dikonsumsi oleh ORM dan `drizzle-kit`.

### 5. Setup Server Express.js
- Di file `src/index.ts` (entrypoint server):
  - Inisialisasi instance Express app.
  - Pasang middleware standar (`express.json()`, CORS jika diperlukan).
  - Buat route tes/health check (`GET /health` atau `GET /api/status`).
  - Tambahkan error handler middleware dasar.
  - Jalankan server di port yang ditentukan dari environment variable (default: 3000).

### 6. Setup Script Migrasi & Development
- Tambahkan script di `package.json` untuk manajemen database via `drizzle-kit`:
  - `npm run db:generate` (generate file migrasi SQL).
  - `npm run db:push` (push skema langsung ke MySQL database).
  - `npm run db:studio` (GUI browser opsional untuk inspect database).

---

## ✅ Criteria for Completion (Definition of Done)
1. Project dapat dijalankan melalui command `npm run dev` tanpa error.
2. Endpoint `GET /health` memberikan respons HTTP status `200 OK`.
3. Koneksi ke MySQL terverifikasi terhubung dengan sukses melalui Drizzle ORM.
4. Skema database awal berhasil di-push/di-generate menggunakan `drizzle-kit`.

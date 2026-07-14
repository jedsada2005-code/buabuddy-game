# Bua Buddy Phase 1: Supabase Cloud Save Setup

Phase 1 ทำให้เกมมีบัญชีผู้เล่นและบันทึกข้อมูลลง database ได้

## 1) สร้าง Supabase Project

1. เข้า https://supabase.com
2. Create new project
3. ตั้งชื่อเช่น `buabuddy-game`
4. เลือก region ใกล้ไทย เช่น Singapore
5. รอ project สร้างเสร็จ

## 2) สร้างตาราง Database

1. ไปที่ Supabase Dashboard
2. เปิดเมนู SQL Editor
3. Copy เนื้อหาในไฟล์ `supabase-phase1.sql`
4. วางใน SQL Editor แล้วกด Run

ไฟล์นี้จะสร้าง:

- `profiles`
- `game_saves`
- Row Level Security policies

## 3) เอา API Keys มาใส่ในโปรเจกต์

1. Supabase Dashboard → Project Settings → API
2. Copy:
   - Project URL
   - anon public key

สร้างไฟล์ `.env.local` ในโปรเจกต์ แล้วใส่:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

ห้ามใส่ `service_role key` ใน frontend

## 4) ทดสอบในเครื่อง

```bash
npm run dev
```

ถ้าใส่ key แล้ว เกมจะแสดงหน้า Login ก่อนเข้าเกม

## 5) สมัครบัญชีทดสอบ

1. กดสมัครใหม่
2. ใส่ email/password
3. ถ้า Supabase เปิด Email Confirmation ให้ไปกดยืนยันใน email ก่อน
4. Login เข้าเกม

หลัง login ระบบจะ:

- สร้าง profile
- สร้าง Friend ID เช่น `BUA-7K4P2`
- โหลด cloud save ถ้ามี
- ถ้ายังไม่มี cloud save จะอัปโหลด save ปัจจุบันขึ้น database

## 6) เช็กว่า save เข้า database

ใน Supabase Dashboard:

- Table Editor → `profiles`
- Table Editor → `game_saves`

ควรเห็น row ของ user ที่ login

## 7) Deploy ขึ้น GitHub Pages

ใน GitHub repo ต้องเพิ่ม environment variables/secrets สำหรับ build:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

ถ้า GitHub Pages build ไม่มี env สองตัวนี้ เกมจะยังเล่นได้แบบ local-only แต่จะไม่เปิด cloud login

## หมายเหตุ

- ตอนนี้ยังเป็น Phase 1: account + cloud save
- Friend ID ถูกสร้างไว้แล้ว แต่ระบบเพิ่มเพื่อนจริงจะทำใน Phase 2
- เกมยังเก็บ localStorage ไว้เป็น backup เสมอ

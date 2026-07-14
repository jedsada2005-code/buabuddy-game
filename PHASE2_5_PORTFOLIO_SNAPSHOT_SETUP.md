# Bua Buddy Phase 2.5 — Portfolio Snapshot Ranking

Phase 2.5 ทำให้ Trade Ranking ใช้ Return จริงจาก Portfolio Simulation

หลักการคือเกมจะไม่แชร์ save game ทั้งก้อน แต่แชร์เฉพาะข้อมูลสรุปสำหรับ Ranking:

- เปิด Portfolio Simulation แล้วหรือยัง
- มูลค่าพอร์ตปัจจุบัน
- Return %
- จำนวนครั้งที่ซื้อ/ขาย
- เวลาอัปเดตล่าสุด

## วิธีเปิดใช้งาน

1. ต้องรัน `supabase-phase2.sql` ให้ระบบ Friend ใช้งานได้ก่อน
2. เข้า Supabase Dashboard
3. ไปที่ `SQL Editor`
4. เปิดไฟล์ `supabase-phase2-portfolio-snapshot.sql`
5. Copy SQL ทั้งหมดไปวาง แล้วกด `Run`
6. กลับมา refresh เกม

## วิธีทดสอบ

1. Login ด้วย account ที่เป็นเพื่อนกันแล้ว
2. ถ้ายังไม่ปลดล็อก Portfolio Simulation ในหน้า Ranking จะขึ้น `ยังไม่เปิด Portfolio`
3. เมื่อปลดล็อก Portfolio แล้ว ระบบจะเริ่ม sync snapshot เป็น Return 0%
4. เมื่อซื้อ/ขายสินทรัพย์ใน Portfolio Simulation จำนวน trade และ Return จะอัปเดตใน Ranking ของเพื่อน

## ความปลอดภัย

เพื่อนอ่านได้เฉพาะ `portfolio_snapshots` ไม่สามารถอ่าน `game_saves` ทั้งก้อนของผู้เล่นคนอื่นได้

# Bua Buddy Phase 2 — Real Friends

Phase 2 เพิ่มระบบเพื่อนจริงด้วย Supabase:

- ผู้เล่นแต่ละคนมี Friend ID เช่น `BUA-ABCDE`
- เพิ่มเพื่อนด้วย Friend ID
- มีคำขอเป็นเพื่อนแบบรับ/ปฏิเสธ
- เมื่อเป็นเพื่อนแล้วจะเห็นรายชื่อเพื่อนจริงในหน้า Friend
- เยี่ยมบ้านเพื่อนเพื่อดูมาสคอต Level สายการลงทุน และอันดับ Trade Ranking

## วิธีเปิดใช้งาน

1. เข้า Supabase Dashboard ของโปรเจกต์ Bua Buddy
2. ไปที่ `SQL Editor`
3. เปิดไฟล์ `supabase-phase2.sql`
4. Copy SQL ทั้งหมดไปวาง แล้วกด `Run`
5. กลับมารันเกมใหม่

## วิธีทดสอบ

ต้องมีอย่างน้อย 2 account

1. Login account A แล้วไปหน้า Profile ดู Friend ID
2. Login account B แล้วไปหน้า Friend
3. ใส่ Friend ID ของ account A แล้วกด `ส่งคำขอ`
4. กลับมา account A หน้า Friend จะเห็นคำขอ
5. กด `รับ`
6. ทั้งสอง account จะเห็นกันในรายชื่อเพื่อน และกดเยี่ยมบ้านได้

## หมายเหตุ

Phase นี้ยังใช้ข้อมูล public profile สำหรับแสดงเพื่อน เช่น ชื่อ, level, path, coins ส่วน save game เต็มยังเป็นข้อมูลส่วนตัวของเจ้าของบัญชีเท่านั้น

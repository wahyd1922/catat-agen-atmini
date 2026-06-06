# Deployment ke Netlify

1. Buat akun di Netlify (jika belum ada)
2. Buat akun di Supabase (https://supabase.com)
3. Di Supabase:
   - Buat project baru
   - Masuk ke SQL Editor, copy paste isi dari file `supabase_schema.sql` lalu jalankan (Run)
   - Masuk ke Authentication -> Providers -> Pastikan Email enabled
   - Masuk ke Authentication -> Users -> Tambahkan email dan password untuk adik Anda dan agen lainnya
   - Masuk ke Project Settings -> API -> Copy `Project URL` dan `anon/public key`

4. Di Netlify:
   - Hubungkan dengan repository GitHub/GitLab Anda, ATAU gunakan fitur drag-and-drop folder `dist` (hasil dari `npm run build`) jika ingin deploy manual.
   - Set Build Command: `npm run build`
   - Set Publish Directory: `dist`
   - Tambahkan Environment Variables di Netlify:
     - `VITE_SUPABASE_URL` = <Masukkan URL Supabase Anda>
     - `VITE_SUPABASE_ANON_KEY` = <Masukkan anon key Supabase Anda>

Selesai! Web sudah bisa diakses.

Berikut langkah umum untuk menjalankan aplikasi ini:

Install dependencies
Buka terminal di folder SelectionSortSimulator, lalu jalankan:
npm install

Jalankan aplikasi
Biasanya aplikasi dengan konfigurasi Vite dijalankan dengan:
npm run dev

atau jika tidak ada script dev, coba:
npx vite

Akses aplikasi
Setelah server berjalan, buka browser dan akses alamat yang tertera di terminal, biasanya http://localhost:5173 atau serupa.
pada file package.json ubah bagian ini:
    "dev": "cross-env NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist && xcopy /E /I /Y dist\\public server\\public",
    "start": "cross-env NODE_ENV=production node dist/index.js",

pada folder server > buka apliasi index.ts pada bagian :
host: "0.0.0.0" ubah menjadi host: "localhost",
kemudian hapus :
reusePort: true,


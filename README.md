# Seraphine Mobile 🧵✨

Seraphine Mobile adalah aplikasi e-commerce premium berbasis **React Native (Expo)** yang didedikasikan untuk melestarikan dan memasarkan karya seni tekstil tradisional seperti kain tenun Sumba, Ulos, dan Syal eksklusif. Aplikasi ini dirancang dengan antarmuka yang elegan (Premium UI) dan memberikan pengalaman berbelanja yang modern, mudah, serta informatif.

## 🌟 Fitur Utama

- **Katalog & Pencarian Produk:** Jelajahi koleksi tenun dan syal dengan mudah melalui fitur pencarian global (Auto-Search Debounce) dan filter berdasarkan kategori.
- **Keranjang Belanja & Checkout:** Pengalaman berbelanja yang *seamless* dengan integrasi simulasi *payment gateway* (Midtrans Snap).
- **Lacak Pesanan (Live Tracking):** Pantau status pengiriman paket secara *real-time* melalui antarmuka *timeline* yang indah.
- **Simulasi Cek Ongkir:** Cek ongkos kirim ke berbagai destinasi secara langsung dari dalam aplikasi.
- **Wishlist & Ulasan:** Simpan produk favorit Anda dan berikan ulasan (rating & komentar) setelah pesanan selesai.
- **Blog & Artikel:** Pelajari lebih dalam tentang budaya penenun, makna motif kain, dan warisan budaya Sumba.
- **Asisten Cerdas (Chatbot):** Fitur AI Chatbot untuk membantu pengguna menemukan produk atau menjawab pertanyaan.
- **Autentikasi Aman:** Sistem Login dan Registrasi berbasis Token JWT yang tersimpan aman di AsyncStorage.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan teknologi *mobile development* terkini:

- **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 56)
- **Navigasi:** React Navigation (Bottom Tabs & Native Stack)
- **Networking:** Axios (dengan Interceptors untuk injeksi *Bearer Token* & *Error Handling*)
- **Penyimpanan Lokal:** AsyncStorage
- **Ikon & Tipografi:** Lucide React Native, Expo Vector Icons (Ionicons), dan *Custom Fonts* (Playfair Display & Poppins)

## 📁 Struktur Proyek (Project Structure)

```text
seraphine-mobile/
├── src/
│   ├── assets/       # Gambar, Icon, dan Custom Fonts (.ttf)
│   ├── components/   # Komponen UI yang dapat digunakan kembali (Skeleton, dll)
│   ├── hooks/        # Custom React Hooks (misal: useFormatter)
│   ├── navigation/   # Konfigurasi RootNavigation & TabBar
│   ├── screens/      # Halaman utama aplikasi (Home, Katalog, Cart, Profile, dll)
│   ├── services/     # Modul API service untuk komunikasi ke backend (Axios)
│   ├── theme/        # Konfigurasi warna dasar (COLORS) dan typography
│   └── utils/        # Fungsi utilitas pembantu (Responsive UI scaling, dll)
├── App.js            # Entry point aplikasi & Setup Stack Navigator
├── app.json          # Konfigurasi manifest aplikasi Expo
├── package.json      # Daftar dependensi & scripts
└── .env              # Variabel lingkungan (API URL, dsb)
```

## 🚀 Cara Menjalankan Proyek Secara Lokal

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi LTS direkomendasikan)
- [Git](https://git-scm.com/)
- Expo Go (Aplikasi di HP Android/iOS Anda)

### 2. Instalasi
Clone repositori ini dan masuk ke dalam direktori proyek:
```bash
git clone <url-repo-anda>
cd seraphine-mobile
```

Instal seluruh dependensi:
```bash
npm install
```

### 3. Konfigurasi Environment (Variabel Lingkungan)
Buat file bernama `.env` di root folder proyek (sejajar dengan `package.json`), dan isi dengan URL API backend Anda:
```env
EXPO_PUBLIC_API_URL=https://<url-backend-anda>/api/v1
EXPO_PUBLIC_API_BASE_URL=https://<url-backend-anda>
```

### 4. Menjalankan Server Pengembangan (Development Server)
Jalankan perintah berikut untuk memulai server Expo:
```bash
npm start
```

Setelah server berjalan, akan muncul QR Code di terminal. 
- **Bagi Pengguna Android:** Buka aplikasi **Expo Go** di HP Anda, lalu *scan* QR code tersebut.
- **Bagi Pengguna iOS:** Buka aplikasi **Kamera** bawaan iPhone, lalu *scan* QR code tersebut dan buka *link* Expo Go.

> **Catatan:** Pastikan HP dan Laptop/PC Anda terhubung ke jaringan Wi-Fi yang sama jika tidak menggunakan tunnel.

## 👨‍💻 Author

Made with 99% hard work by **Myzee**, and 1% aura by **Ulza**.

## 📄 Lisensi
Hak cipta dilindungi. Proyek ini dikembangkan sebagai bagian dari sistem E-Commerce CD Seraphine.

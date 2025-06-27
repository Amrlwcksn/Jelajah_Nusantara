# 🌏 Jelajah Nusantara

**Jelajah Nusantara** adalah aplikasi web interaktif berbasis peta yang memudahkan pengguna—baik pelajar, pengajar, maupun masyarakat umum—untuk mengenal letak dan informasi 34 provinsi di Indonesia. Dibangun dengan Next.js, Tailwind CSS, dan Mapbox, aplikasi ini menyajikan pengalaman eksplorasi peta yang smooth, edukatif, dan responsif.

> ⚠️ Saat ini peta menampilkan **34 provinsi**. Belum termasuk pemekaran wilayah terbaru di Papua.

---

## 🚀 Fitur Utama

- 🗺️ **Peta Interaktif** – Menampilkan wilayah provinsi Indonesia lengkap dengan style dan navigasi dinamis.
- 🎯 **Interaksi Klik & Pilih** – Klik langsung pada provinsi atau pilih dari dropdown untuk melihat info detail.
- ✨ **Highlight Wilayah** – Provinsi yang dipilih akan di-*zoom in* dan di-*highlight* dengan garis berwarna.
- 💬 **Info Provinsi Lengkap** – Menampilkan nama, ibu kota, luas wilayah, deskripsi, dan fakta unik.
- 🔔 **Pengumuman Otomatis** – Info penting tentang update jumlah provinsi muncul secara berkala.
- 💨 **Smooth UI/UX** – Efek blur, animasi, dan style modern dengan Tailwind CSS.
- 📈 **Tracking Analytics** – Terintegrasi dengan Umami untuk pelacakan pengunjung (jika diaktifkan).
- 🌐 **Custom Domain** – Live di: [jelajahnusantara.my.id](https://www.jelajahnusantara.my.id/)

---

## 📁 Struktur Data

### 1. **GeoJSON Wilayah**

File: `/public/geojson/geoBoundaries-IDN-ADM1.geojson`  
Digunakan sebagai data peta untuk menggambar batas wilayah provinsi.

### 2. **Informasi Provinsi**

File: `/public/geojson/provinsi_info.json`

Contoh isi:
```json
{
  "name": "Jawa Tengah",
  "ibuKota": "Semarang",
  "luas": "32.800 km²",
  "deskripsi": "Provinsi di tengah Pulau Jawa dengan banyak situs budaya.",
  "faktaUnik": "Memiliki Candi Borobudur, salah satu keajaiban dunia."
}

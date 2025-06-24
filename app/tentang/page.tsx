'use client';

import { motion } from 'framer-motion';

export default function TentangPage() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden">

         {/* Navbar */}
          <div className="fixed px-6 top-0 left-0 w-full z-50 backdrop-blur-md bg-gray-500/30 border-b border-gray-500/20 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              <a href='/' className="text-lg md:text-xl font-bold text-white drop-shadow-md">JelajahNusantara</a>
            </div>
           </div>

      {/* 🔽 Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/bg_tentang.webp"
          alt="Background Tentang"
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 " /> {/* Overlay gelap biar teks kebaca */}
      </div>

      {/* 🔽 Konten */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-6 md:px-10 py-16"
      >
        <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-300">
            🧭 Jelajah Nusantara
          </h1>

          <p className="text-base leading-relaxed mb-6 text-gray-200">
            <strong>Jelajah Nusantara</strong> adalah aplikasi interaktif berbasis web yang menampilkan 34 provinsi di Indonesia lengkap dengan informasi ibu kota, luas wilayah, deskripsi, serta fakta unik dari tiap provinsi.
            Aplikasi ini dibuat untuk tujuan edukatif dan eksploratif.
          </p>

          <h2 className="text-xl font-semibold text-yellow-300 mb-2">✨ Fitur Utama</h2>
          <ul className="list-disc list-inside text-gray-100 mb-6 space-y-1">
            <li>🔍 <strong>Pencarian Provinsi</strong> – Cari provinsi lewat dropdown interaktif.</li>
            <li>🗺️ <strong>Peta Interaktif</strong> – Menggunakan Mapbox & GeoJSON, responsif dan smooth.</li>
            <li>🧠 <strong>Informasi Lengkap</strong> – Ibu kota, luas, deskripsi, dan fakta unik tiap provinsi.</li>
          </ul>

          <h2 className="text-xl font-semibold text-yellow-300 mb-2">🛠️ Teknologi yang Digunakan</h2>
          <ul className="list-disc list-inside text-gray-100 mb-6 space-y-1">
            <li><strong>Next.js</strong> – Framework React modern</li>
            <li><strong>Tailwind CSS</strong> – Utility-first styling</li>
            <li><strong>Mapbox GL JS</strong> – Untuk peta dinamis</li>
            <li><strong>GeoJSON</strong> – Format data wilayah</li>
            <li><strong>TypeScript</strong> – Bahasa yang aman & kuat</li>
          </ul>

          <div className="mb-6 text-gray-200 border-l-4 border-yellow-400 pl-4 italic">
            📌 <strong>Catatan Penting:</strong><br />
            Saat ini data peta masih memuat 34 provinsi.  
            Per Juni 2025, Indonesia memiliki <strong>38 provinsi</strong> setelah pemekaran wilayah Papua.  
            Update data lengkap akan tersedia seiring pengembangan selanjutnya.
          </div>

          <h2 className="text-xl font-semibold text-yellow-300 mb-2">🧑‍💻 Tentang Pengembang</h2>
          <p className="text-base text-gray-200 mb-4">
            Aplikasi ini dikembangkan oleh <strong>Ahmad Amirul Wicaksono</strong>, mahasiswa Pendidikan Teknologi Informasi di Universitas PGRI Semarang.
          </p>

          <div className="text-center mt-10">
            <p className="text-sm text-yellow-400 italic">
              Punya saran, kritik, atau mau bantu ngembangin? Hubungi langsung ya!  
              <br />
              <span className="text-blue-300">Indonesia luas, yuk kenali provinsimu! 🇮🇩</span>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

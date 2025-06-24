'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { easeOut } from 'framer-motion';

export default function Home() {
  const [isLeaving, setIsLeaving] = useState(false);
  const router = useRouter();

  const handleClick1 = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push('/map');
    }, 500);
  };

  const handleClick2 = () => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push('/tentang');
    }, 500);
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  return (
    <AnimatePresence>
      {!isLeaving && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-screen h-screen"
        >
          {/* 🖼️ Gambar Background */}
          <img
            src="images/bg-home.jpg"
            alt=""
            className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          />

          {/* 🔝 Navbar */}
          <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-gray-500/30 border-b border-gray-500/20 shadow-md">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
              <h1 className="text-lg md:text-xl font-bold text-white drop-shadow-md">
                JelajahNusantara
              </h1>
              <nav className="space-x-4 md:space-x-6">
                <button
                  onClick={handleClick2}
                  className="text-white text-sm md:text-base hover:underline hover:cursor-pointer"
                >
                  Tentang
                </button>
              </nav>
            </div>
          </div>

          {/* 🎯 Konten Tengah */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center h-full z-10 relative px-6 md:px-12"
          >
            <motion.div
              variants={itemVariants}
              className="text-center text-white drop-shadow-lg bg-gray-500/30 border-b backdrop-blur-md p-4 md:p-6 rounded-2xl border-gray-500/20 shadow-md max-w-3xl"
            >
              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold"
              >
                Klik, Belajar, Jelajah!
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-3 text-base md:text-lg text-white/80"
              >
                Yuk jelajahi provinsi-provinsi di Indonesia lewat peta interaktif yang seru dan edukatif!
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6">
              <button
                onClick={handleClick1}
                className="backdrop-blur-md bg-sky-300/30 hover:bg-sky-300/50 text-white font-semibold px-6 py-2 rounded-xl shadow-md border border-white/30 transition-all duration-300 text-sm md:text-base"
              >
                Get Started
              </button>
            </motion.div>
          </motion.div>

          {/* 👣 Footer */}
          <div className="fixed bottom-0 left-0 w-full z-40 backdrop-blur-md bg-white/10 border-t border-white/20 text-white/80 p-3 md:p-4 text-center text-xs md:text-sm">
            &copy; 2025 JelajahNusantara. Dibuat dengan 💙 di Indonesia.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

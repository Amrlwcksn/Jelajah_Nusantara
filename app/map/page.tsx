'use client';


import dynamic from 'next/dynamic';

const MapWithSearch = dynamic(() => import('../components/mapwithsearch'), { ssr: false });

export default function Home() {
  return (
    <main>
       {/* Navbar */}
          <div className="fixed px-6 top-0 left-0 w-full z-50 backdrop-blur-md bg-gray-500/30 border-b border-gray-500/20 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              <a href='/' className="text-lg md:text-xl font-bold text-white drop-shadow-md">JelajahNusantara</a>
            </div>
           </div>
      <MapWithSearch />
    </main>
  );
}



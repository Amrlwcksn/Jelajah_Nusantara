'use client';


import dynamic from 'next/dynamic';

const MapWithSearch = dynamic(() => import('../components/mapwithsearch'), { ssr: false });

export default function Home() {
  return (
    <main>
      <MapWithSearch />
    </main>
  );
}



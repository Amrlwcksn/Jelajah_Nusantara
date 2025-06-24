'use client';

import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import clsx from 'clsx';

type ProvinsiInfo = {
  name: string;
  ibuKota: string;
  luas: string;
  deskripsi: string;
  faktaUnik: string;
};

export default function PetaProvinsi() {
  const [popupInfo, setPopupInfo] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [infoData, setInfoData] = useState<ProvinsiInfo[]>([]);
  const [selectedProvinsi, setSelectedProvinsi] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    fetch('/geojson/geoBoundaries-IDN-ADM1.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data));

    fetch('/geojson/provinsi_info.json')
      .then((res) => res.json())
      .then((data) => setInfoData(data));
  }, []);

  useEffect(() => {
    const showNow = () => {
      setShowAnnouncement(true);
      setTimeout(() => {
        setShowAnnouncement(false);
      }, 6000);
    };

    const initialTimeout = setTimeout(showNow, 2000);
    const interval = setInterval(showNow, 3 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const getBBox = (geometry: any): [number, number, number, number] => {
    const coords = geometry.type === 'Polygon'
      ? geometry.coordinates.flat(1)
      : geometry.coordinates.flat(2);

    const lngs = coords.map((c: [number, number]) => c[0]);
    const lats = coords.map((c: [number, number]) => c[1]);


    return [
      Math.min(...lngs),
      Math.min(...lats),
      Math.max(...lngs),
      Math.max(...lats),
    ];
  };

  useEffect(() => {
    if (!geoData || !selectedProvinsi || !mapRef.current) return;

    const prov = geoData.features.find(
      (f: any) => f.properties.shapeName === selectedProvinsi
    );

    if (prov) {
      const [minLng, minLat, maxLng, maxLat] = prov.bbox || getBBox(prov.geometry);
      if ([minLng, minLat, maxLng, maxLat].some(isNaN)) return;

      mapRef.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: 60,
        duration: 1000,
      });

      setPopupInfo(prov.properties.shapeName);
      setSelectedFeature(prov);
    }
  }, [selectedProvinsi]);

  const info = popupInfo ? infoData.find(p => p.name === popupInfo) : null;

  return (
    <div className="fixed inset-0 z-0">
      {/* 🔔 Announcement */}
      <div className={clsx(
        "fixed mt-14 top-4 right-4 sm:right-6 z-50 transition-all duration-700 ease-in-out",
        "bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 sm:px-5 py-3 rounded-md shadow-xl w-[280px] sm:w-[300px] text-sm",
        showAnnouncement ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <strong>📢 Info:</strong><br />
        Indonesia kini memiliki <b>38 provinsi</b> sejak pemekaran wilayah Papua.<br />
        Peta ini sementara masih menampilkan 34 provinsi.
      </div>

      {/* 🔍 Search Box */}
      <div className="mt-14 absolute top-4 left-4 sm:left-6 z-10 bg-gray-500/30 backdrop-blur-md text-white px-4 sm:px-5 py-4 rounded-xl shadow-lg border border-blue-300 w-[90vw] max-w-xs sm:max-w-sm">
        <label className="block mb-2 text-sm font-medium">Cari Provinsi</label>
        <select
          className="w-full text-white bg-gray-900/30 px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none"
          onChange={(e) => setSelectedProvinsi(e.target.value)}
          value={selectedProvinsi}
        >
          <option value="">-- Pilih Provinsi --</option>
          {geoData?.features.map((f: any, idx: number) => (
            <option key={idx} value={f.properties.shapeName}>
              {f.properties.shapeName}
            </option>
          ))}
        </select>
      </div>

      {/* 🗺️ MAP */}
      <Map
        ref={(ref) => { mapRef.current = ref?.getMap() ?? null }}
        initialViewState={{ longitude: 117.5, latitude: -2.5, zoom: 4 }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={['fill-provinsi']}
        onClick={(e) => {
          
          const features = e.features ?? [];
          if (features.length > 0 && features[0]?.properties?.shapeName) {
            const nama = features[0].properties.shapeName as string;
            setPopupInfo(nama);
            setSelectedProvinsi(nama);
          }else {
            setPopupInfo(null);
          }
        }}
      >
        <Source id="provinsi" type="geojson" data="/geojson/geoBoundaries-IDN-ADM1.geojson">
          <Layer
            id="fill-provinsi"
            type="fill"
            paint={{
              'fill-color': '#3b82f6',
              'fill-opacity': 0.25,
            }}
          />
          <Layer
            id="outline-provinsi"
            type="line"
            paint={{
              'line-color': '#1e3a8a',
              'line-width': 1.5,
            }}
          />
        </Source>

        {selectedFeature && (
          <Source
            id="highlight"
            type="geojson"
            data={{ type: 'FeatureCollection', features: [selectedFeature] }}
          >
            <Layer
              id="highlight-line"
              type="line"
              paint={{ 'line-color': '#facc15', 'line-width': 4 }}
            />
          </Source>
        )}
      </Map>

      {/* 🧠 Info Box */}
      {info && (
        <div className="absolute bottom-4 left-4 sm:left-6 bg-gray-500/30 backdrop-blur-md text-white px-5 py-4 rounded-xl shadow-lg border border-blue-300 w-[90vw] max-w-md">
          <h2 className="text-xl font-bold">{info.name}</h2>
          <p className="text-sm mb-1"><strong>Ibu Kota:</strong> {info.ibuKota}</p>
          <p className="text-sm mb-1"><strong>Luas Wilayah:</strong> {info.luas}</p>
          <p className="text-sm mb-1"><strong>Deskripsi:</strong> {info.deskripsi}</p>
          <p className="text-sm italic text-yellow-200"><strong>Fakta Unik:</strong> {info.faktaUnik}</p>
        </div>
      )}
    </div>
  );
}

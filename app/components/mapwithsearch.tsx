'use client';

import Maps, { Source, Layer, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import clsx from 'clsx';
import * as turf from '@turf/turf';
import { RulerDimensionLine, Map } from 'lucide-react';

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
  const [isMeasureMode, setIsMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<number[][]>([]);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'provinsi' | 'ukur' | 'none'>('none');
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    fetch('/geojson/geoBoundaries-IDN-ADM1.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data));

    fetch('/geojson/provinsi_info.json')
      .then((res) => res.json())
      .then((data) => setInfoData(data));
  }, []);

  const getBBox = (geometry: any): [number, number, number, number] => {
    const coords = geometry.type === 'Polygon'
      ? geometry.coordinates.flat(1)
      : geometry.coordinates.flat(2);
    const lngs = coords.map((c: [number, number]) => c[0]);
    const lats = coords.map((c: [number, number]) => c[1]);
    return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
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

  const handleMapClick = (e: mapboxgl.MapLayerMouseEvent) => {
    if (isMeasureMode) {
      const point: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      if (measurePoints.length === 0) {
        setMeasurePoints([point]);
      } else if (measurePoints.length === 1) {
        const newPoints = [...measurePoints, point];
        setMeasurePoints(newPoints);
        const from = turf.point(newPoints[0]);
        const to = turf.point(newPoints[1]);
        const dist = turf.distance(from, to, { units: 'kilometers' });
        setMeasuredDistance(dist);
      } else {
        setMeasurePoints([]);
        setMeasuredDistance(null);
      }
    } else {
      const features = e.features ?? [];
      if (features.length > 0 && features[0]?.properties?.shapeName) {
        const nama = features[0].properties.shapeName as string;
        setPopupInfo(nama);
        setSelectedProvinsi(nama);
      } else {
        setPopupInfo(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-0">
      {/* Sidebar Desktop */}
      <div className="hidden sm:flex absolute top-0 left-0 z-10 bg-gray-800/60 backdrop-blur-md text-white py-4 px-2 shadow-lg border-r border-blue-300 h-full w-[95px] space-y-4 flex-col items-center">
        <button
          onClick={() => setSidebarMode('provinsi')}
          className={clsx(
            "w-12 h-12 rounded-lg flex items-center justify-center hover:bg-blue-500 transition",
            sidebarMode === 'provinsi' && 'bg-blue-600'
          )}
          title="Pilih Provinsi"
        >
          <Map />
        </button>
        <button
          onClick={() => setSidebarMode('ukur')}
          className={clsx(
            "w-12 h-12 rounded-lg flex items-center justify-center hover:bg-pink-500 transition",
            sidebarMode === 'ukur' && 'bg-pink-600'
          )}
          title="Ukur Jarak"
        >
          <RulerDimensionLine />
        </button>
      </div>

      {/* Bottom Bar Mobile */}
      <div className="flex sm:hidden fixed bottom-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-md text-white px-4 py-2 justify-around border-t border-blue-300">
        <button
          onClick={() => setSidebarMode('provinsi')}
          className={clsx(
            "flex flex-col items-center justify-center",
            sidebarMode === 'provinsi' && 'text-blue-400'
          )}
        >
          <Map className="w-6 h-6" />
          <span className="text-xs">Provinsi</span>
        </button>
        <button
          onClick={() => setSidebarMode('ukur')}
          className={clsx(
            "flex flex-col items-center justify-center",
            sidebarMode === 'ukur' && 'text-pink-400'
          )}
        >
          <RulerDimensionLine className="w-6 h-6" />
          <span className="text-xs">Ukur</span>
        </button>
      </div>

      {/* Sidebar Content */}
      {sidebarMode !== 'none' && (
        <div className="absolute left-0 ml-5 sm:ml-[110px] top-4 sm:top-4 z-10 bg-gray-500/30 backdrop-blur-md text-white px-5 py-4 rounded-xl shadow-lg border border-blue-300 w-[90vw] sm:w-[85vw] max-w-sm space-y-4 overflow-y-auto max-h-[80vh] mx-auto sm:mx-0">
          {sidebarMode === 'provinsi' && (
            <>
              <label className="block text-sm font-medium">Pilih Provinsi</label>
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
            </>
          )}
          {sidebarMode === 'ukur' && (
            <>
              <button
                onClick={() => {
                  setIsMeasureMode(prev => !prev);
                  setMeasurePoints([]);
                  setMeasuredDistance(null);
                }}
                className={clsx(
                  "w-full px-4 py-2 rounded-md text-sm font-semibold shadow border transition-all",
                  isMeasureMode
                    ? "bg-pink-600 text-white border-pink-700 hover:bg-pink-700"
                    : "bg-white/20 text-white border-white/30 hover:bg-white/30"
                )}
              >
                {isMeasureMode ? 'Ukur Jarak' : 'Ukur Jarak'}
              </button>
              {measuredDistance && isMeasureMode && (
                <>
                  <p className="text-sm text-yellow-200 mt-1">
                    Jarak: <b>{measuredDistance.toFixed(2)} km</b>
                  </p>
                  <p className="text-xs text-red-200 italic -mt-2">
                    ⚠️ Jarak ini cuma simulasi ya! Hanya perkiraan di atas peta, bukan jarak akurat dunia nyata.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Map */}
      <Maps
        ref={(ref) => { mapRef.current = ref?.getMap() ?? null }}
        initialViewState={{ longitude: 117.5, latitude: -2.5, zoom: 4 }}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        interactiveLayerIds={['fill-provinsi']}
        onClick={handleMapClick}
      >
        <Source id="provinsi" type="geojson" data="/geojson/geoBoundaries-IDN-ADM1.geojson">
          <Layer
            id="fill-provinsi"
            type="fill"
            paint={{ 'fill-color': '#3b82f6', 'fill-opacity': 0.25 }}
          />
          <Layer
            id="outline-provinsi"
            type="line"
            paint={{ 'line-color': '#1e3a8a', 'line-width': 1.5 }}
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

        {measurePoints.map(([lng, lat], idx) => (
          <Marker key={idx} longitude={lng} latitude={lat}>
            <div className="w-4 h-4 bg-pink-600 rounded-full border-2 border-white shadow-md" />
          </Marker>
        ))}

        {measurePoints.length === 2 && (
          <Source
            id="measure-line"
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: measurePoints,
              },
            }}
          >
            <Layer
              id="measure-line-layer"
              type="line"
              paint={{ 'line-color': '#f43f5e', 'line-width': 3 }}
            />
          </Source>
        )}
      </Maps>

      {/* Info Box */}
      {info && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto bg-gray-500/30 backdrop-blur-md text-white px-5 py-4 rounded-xl shadow-lg border border-blue-300 w-auto max-w-md mb-14 md:ml-20 md:mb-0">
          <h2 className="text-lg sm:text-xl font-bold">{info.name}</h2>
          <p className="text-sm sm:text-base mb-1"><strong>Ibu Kota:</strong> {info.ibuKota}</p>
          <p className="text-sm sm:text-base mb-1"><strong>Luas Wilayah:</strong> {info.luas}</p>
          <p className="text-sm sm:text-base mb-1"><strong>Deskripsi:</strong> {info.deskripsi}</p>
          <p className="text-sm sm:text-base italic text-yellow-200"><strong>Fakta Unik:</strong> {info.faktaUnik}</p>
        </div>
      )}
    </div>
  );
}

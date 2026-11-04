import L from "leaflet";
import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useMoodStore } from "../store/moodStore";
import type { PlaceSuggestion } from "../types";

// Fix Leaflet's default marker icon path issue in bundlers like Vite.
// @ts-expect-error - _getIconUrl is a private Leaflet internal we intentionally remove.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const STRATEGY_COLOR: Record<string, string> = {
  reset: "#60a5fa",
  shift: "#fbbf24",
  match: "#34d399",
};

const LEGEND = [
  { label: "Reset", color: "bg-blue-400" },
  { label: "Shift", color: "bg-amber-400" },
  { label: "Match", color: "bg-emerald-400" },
];

function makeStrategyIcon(strategy: string, isSelected: boolean): L.DivIcon {
  const color = STRATEGY_COLOR[strategy] ?? "#a78bfa";
  const size = isSelected ? 30 : 22;
  const inner = Math.round(size * 0.34);
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <div style="position:absolute;inset:0;border-radius:9999px;background:${color}33;border:1px solid ${color}80;"></div>
      <div style="position:absolute;top:${(size - inner) / 2}px;left:${(size - inner) / 2}px;width:${inner}px;height:${inner}px;border-radius:9999px;background:${color};box-shadow:0 0 0 2px rgba(5,6,15,0.9);${
        isSelected ? "animation: moodmap-bounce 0.6s ease infinite alternate;" : ""
      }"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function RecenterOnChange({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export function InteractiveMapView() {
  const coordinates = useMoodStore((s) => s.coordinates);
  const places = useMoodStore((s) => s.places);
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const selectPlace = useMoodStore((s) => s.selectPlace);
  const currentMood = useMoodStore((s) => s.currentMood);
  const strategy = currentMood?.strategy ?? "match";

  const center: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : [16.5062, 80.648];

  return (
    <div className="app-panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-violet-200" />
          <span className="text-sm font-medium text-white/80">Nearby map</span>
        </div>
        <span className="text-[11px] text-white/35">
          {places.length > 0 ? `${places.length} places` : "Waiting for a mood"}
        </span>
      </div>

      <div className="relative h-[340px] lg:h-[420px]">
        <style>{`
          @keyframes moodmap-bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-4px); }
          }
          .moodmap-pulse {
            animation: moodmap-pulse-anim 2s ease-out infinite;
          }
          @keyframes moodmap-pulse-anim {
            0% { opacity: 0.6; }
            70% { opacity: 0; }
            100% { opacity: 0; }
          }
        `}</style>
        <MapContainer center={center} zoom={14} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          {coordinates && (
            <>
              <RecenterOnChange lat={coordinates.lat} lng={coordinates.lng} />
              <CircleMarker
                center={[coordinates.lat, coordinates.lng]}
                radius={8}
                pathOptions={{
                  color: "#c4b5fd",
                  fillColor: "#8b5cf6",
                  fillOpacity: 0.95,
                  weight: 2,
                }}
              >
                <Popup>You are here</Popup>
              </CircleMarker>
            </>
          )}
          {places.map((place: PlaceSuggestion) => (
            <Marker
              key={place.place_id}
              position={[place.latitude, place.longitude]}
              icon={makeStrategyIcon(strategy, selectedPlace?.place_id === place.place_id)}
              eventHandlers={{ click: () => selectPlace(place) }}
            >
              <Popup>{place.name}</Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex items-center gap-3 rounded-lg border border-white/10 bg-[#0a0b16]/85 px-3 py-2 backdrop-blur-md">
          {LEGEND.map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1.5 text-[10px] text-white/50">
              <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

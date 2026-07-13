import L from "leaflet";
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
  reset: "#2563eb",
  shift: "#d97706",
  match: "#16a34a",
};

function makeStrategyIcon(strategy: string, isSelected: boolean): L.DivIcon {
  const color = STRATEGY_COLOR[strategy] ?? "#6366f1";
  const size = isSelected ? 34 : 26;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);${
      isSelected ? "animation: moodmap-bounce 0.6s ease infinite alternate;" : ""
    }"></div>`,
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
    <div className="h-64 lg:h-80 rounded-xl overflow-hidden shadow-sm border border-gray-100 relative">
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
        />
        {coordinates && (
          <>
            <RecenterOnChange lat={coordinates.lat} lng={coordinates.lng} />
            <CircleMarker
              center={[coordinates.lat, coordinates.lng]}
              radius={9}
              pathOptions={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.9 }}
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
    </div>
  );
}

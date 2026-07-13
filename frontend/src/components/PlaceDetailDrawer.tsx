import { MapPin, Star, X } from "lucide-react";
import { useMoodStore } from "../store/moodStore";

export function PlaceDetailDrawer() {
  const selectedPlace = useMoodStore((s) => s.selectedPlace);
  const selectPlace = useMoodStore((s) => s.selectPlace);
  const currentMood = useMoodStore((s) => s.currentMood);

  const isOpen = selectedPlace !== null;

  const handleClose = () => selectPlace(null);

  const directionsUrl = selectedPlace
    ? `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`
    : "#";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed z-50 bg-white shadow-2xl transition-transform duration-300 ease-out
          bottom-0 left-0 right-0 rounded-t-2xl max-h-[80vh] overflow-y-auto
          lg:top-0 lg:right-0 lg:left-auto lg:bottom-auto lg:h-full lg:w-96 lg:rounded-none lg:max-h-none
          ${
            isOpen
              ? "translate-y-0 lg:translate-x-0"
              : "translate-y-full lg:translate-y-0 lg:translate-x-full"
          }`}
      >
        {selectedPlace && (
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-gray-900 pr-4">{selectedPlace.name}</h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
                aria-label="Close details"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {selectedPlace.photo_url && (
              <img
                src={selectedPlace.photo_url}
                alt={selectedPlace.name}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{selectedPlace.address}</span>
            </div>

            {selectedPlace.rating != null && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(selectedPlace.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {selectedPlace.rating.toFixed(1)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-1">
              {selectedPlace.place_types.map((type) => (
                <span
                  key={type}
                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 capitalize"
                >
                  {type.replace(/_/g, " ")}
                </span>
              ))}
            </div>

            <p className="text-sm italic text-gray-500">
              {currentMood ? `Strategy: ${currentMood.strategy} — ` : ""}
              {selectedPlace.why_suggested}
            </p>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full rounded-lg bg-indigo-600 text-white font-medium py-2.5 hover:bg-indigo-700 transition"
            >
              Get Directions
            </a>
          </div>
        )}
      </div>
    </>
  );
}

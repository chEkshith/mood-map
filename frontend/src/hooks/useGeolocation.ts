import { useEffect } from "react";
import { useMoodStore } from "../store/moodStore";

export function useGeolocation() {
  const locationStatus = useMoodStore((s) => s.locationStatus);
  const coordinates = useMoodStore((s) => s.coordinates);
  const setCoordinates = useMoodStore((s) => s.setCoordinates);
  const setLocationDenied = useMoodStore((s) => s.setLocationDenied);
  const setLocationRequesting = useMoodStore((s) => s.setLocationRequesting);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationDenied();
      return;
    }

    setLocationRequesting();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLocationDenied();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { locationStatus, coordinates };
}

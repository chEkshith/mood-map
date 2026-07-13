import { create } from "zustand";
import { moodApi } from "../api/client";
import type {
  HistoryEntry,
  HistoryQueryParams,
  MoodResult,
  PlaceSuggestion,
  StatsResponse,
  UserResponse,
} from "../types";

type LocationStatus = "idle" | "requesting" | "granted" | "denied";
type ApiStatus = "idle" | "loading" | "success" | "error";

interface Coordinates {
  lat: number;
  lng: number;
}

interface MoodStoreState {
  user: UserResponse | null;
  isAuthenticated: boolean;

  rawText: string;
  coordinates: Coordinates | null;
  locationStatus: LocationStatus;
  radiusMeters: number;

  apiStatus: ApiStatus;
  errorMessage: string | null;
  currentMood: MoodResult | null;
  places: PlaceSuggestion[];
  selectedPlace: PlaceSuggestion | null;

  history: HistoryEntry[];
  stats: StatsResponse | null;

  setUser: (user: UserResponse) => void;
  clearUser: () => void;
  setCoordinates: (coords: Coordinates) => void;
  setLocationDenied: () => void;
  setLocationRequesting: () => void;
  setRadius: (meters: number) => void;
  selectPlace: (place: PlaceSuggestion | null) => void;
  setRawText: (text: string) => void;

  submitMood: (text: string) => Promise<void>;
  fetchHistory: (params?: HistoryQueryParams) => Promise<void>;
  fetchStats: () => Promise<void>;

  reset: () => void;
}

export const useMoodStore = create<MoodStoreState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  rawText: "",
  coordinates: null,
  locationStatus: "idle",
  radiusMeters: 2000,

  apiStatus: "idle",
  errorMessage: null,
  currentMood: null,
  places: [],
  selectedPlace: null,

  history: [],
  stats: null,

  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setCoordinates: (coords) => set({ coordinates: coords, locationStatus: "granted" }),
  setLocationDenied: () => set({ locationStatus: "denied" }),
  setLocationRequesting: () => set({ locationStatus: "requesting" }),
  setRadius: (meters) => set({ radiusMeters: meters }),
  selectPlace: (place) => set({ selectedPlace: place }),
  setRawText: (text) => set({ rawText: text }),

  submitMood: async (text: string) => {
    const { coordinates, radiusMeters } = get();
    if (!coordinates) {
      set({ apiStatus: "error", errorMessage: "Location is required to find places nearby." });
      return;
    }

    set({ apiStatus: "loading", errorMessage: null });
    try {
      const response = await moodApi.submitMood({
        raw_text: text,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        radius_meters: radiusMeters,
      });
      set({
        apiStatus: "success",
        currentMood: response.mood,
        places: response.places,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong classifying your mood.";
      set({ apiStatus: "error", errorMessage: message });
    }
  },

  fetchHistory: async (params?: HistoryQueryParams) => {
    try {
      const history = await moodApi.getHistory(params ?? { limit: 20, skip: 0 });
      set({ history });
    } catch {
      set({ errorMessage: "Failed to load history." });
    }
  },

  fetchStats: async () => {
    try {
      const stats = await moodApi.getStats();
      set({ stats });
    } catch {
      set({ errorMessage: "Failed to load dashboard stats." });
    }
  },

  reset: () =>
    set({
      apiStatus: "idle",
      errorMessage: null,
      currentMood: null,
      places: [],
      selectedPlace: null,
      rawText: "",
    }),
}));

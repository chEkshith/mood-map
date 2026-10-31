export type MoodEnum =
  | "stressed"
  | "anxious"
  | "bored"
  | "exhausted"
  | "happy"
  | "melancholic";

export interface MoodResult {
  classified_mood: MoodEnum;
  confidence: number;
  strategy: string;
}

export interface PlaceSuggestion {
  place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  place_types: string[];
  rating: number | null;
  distance_meters: number | null;
  why_suggested: string;
  photo_url: string | null;
}

export interface APIResponse {
  mood: MoodResult;
  places: PlaceSuggestion[];
  total_results: number;
  request_id: string;
}

export interface HistoryEntry {
  id: string;
  raw_text: string;
  classified_mood: MoodEnum;
  confidence: number;
  strategy: string;
  latitude: number;
  longitude: number;
  created_at: string;
  places_count: number;
}

export interface UserResponse {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  mood_streak: number;
  total_entries: number;
}

export interface MoodFrequencyItem {
  mood: string;
  count: number;
}

export interface MoodTrendItem {
  date: string;
  mood: string;
  count: number;
}

export interface TopPlaceTypeItem {
  type: string;
  count: number;
}

export interface StatsResponse {
  mood_frequency: MoodFrequencyItem[];
  mood_trend: MoodTrendItem[];
  top_place_types: TopPlaceTypeItem[];
  total_entries: number;
  mood_streak: number;
  most_common_mood: string | null;
}

export interface SignupPayload {
  email: string;
  password: string;
  display_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface MoodSubmitPayload {
  raw_text: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface HistoryQueryParams {
  limit?: number;
  skip?: number;
  mood_filter?: MoodEnum;
}

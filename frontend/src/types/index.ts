/** All possible classified moods. */
export type MoodEnum =
  | 'stressed'
  | 'anxious'
  | 'bored'
  | 'exhausted'
  | 'happy'
  | 'melancholic';

/** Result of AI mood classification. */
export interface MoodResult {
  classified_mood: MoodEnum;
  confidence: number;
  strategy: string;
}

/** A single place suggestion returned by the API. */
export interface PlaceSuggestion {
  place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  place_types: string[];
  rating?: number;
  distance_meters?: number;
  why_suggested: string;
}

/** Top-level API response envelope. */
export interface APIResponse {
  mood: MoodResult;
  places: PlaceSuggestion[];
  total_results: number;
  request_id: string;
}

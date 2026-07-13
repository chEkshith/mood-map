import { InteractiveMapView } from "../components/InteractiveMapView";
import { MoodInputForm } from "../components/MoodInputForm";
import { MoodResultBadge } from "../components/MoodResultBadge";
import { PlaceCardList } from "../components/PlaceCardList";
import { PlaceDetailDrawer } from "../components/PlaceDetailDrawer";
import { useMoodStore } from "../store/moodStore";

export function AppPage() {
  const currentMood = useMoodStore((s) => s.currentMood);
  const apiStatus = useMoodStore((s) => s.apiStatus);
  const places = useMoodStore((s) => s.places);

  const whySuggested = places[0]?.why_suggested;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <MoodInputForm />
          {apiStatus === "success" && currentMood && (
            <MoodResultBadge mood={currentMood} whySuggested={whySuggested} />
          )}
        </div>

        <div className="space-y-4">
          <InteractiveMapView />
          <PlaceCardList />
        </div>
      </div>

      <PlaceDetailDrawer />
    </div>
  );
}

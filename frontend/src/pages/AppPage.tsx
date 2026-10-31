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
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Find Your Place</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Describe how you're feeling and we'll find nearby spots to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Input + Results Badge */}
        <div className="space-y-4">
          <MoodInputForm />
          {apiStatus === "success" && currentMood && (
            <div className="animate-slide-up">
              <MoodResultBadge mood={currentMood} whySuggested={whySuggested} />
            </div>
          )}
        </div>

        {/* Right: Map + Place List */}
        <div className="space-y-4">
          <InteractiveMapView />
          <PlaceCardList />
        </div>
      </div>

      <PlaceDetailDrawer />
    </div>
  );
}

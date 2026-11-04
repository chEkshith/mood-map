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
      <div className="mb-7 anim-stagger" style={{ animationDelay: "0.45s" }}>
        <span className="glass-chip px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-violet-100/70 mb-3">
          AI discovery
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-white tracking-tight">
          Find your <span className="text-gradient">place</span>
        </h1>
        <p className="text-sm text-white/50 mt-1.5">
          Describe how you're feeling and we'll find nearby spots to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Input + Results Badge */}
        <div className="space-y-4 anim-stagger" style={{ animationDelay: "0.55s" }}>
          <MoodInputForm />
          {apiStatus === "success" && currentMood && (
            <div className="animate-slide-up">
              <MoodResultBadge mood={currentMood} whySuggested={whySuggested} />
            </div>
          )}
        </div>

        {/* Right: Map + Place List */}
        <div className="space-y-4 anim-stagger" style={{ animationDelay: "0.65s" }}>
          <InteractiveMapView />
          <PlaceCardList />
        </div>
      </div>

      <PlaceDetailDrawer />
    </div>
  );
}

import { InteractiveMapView } from "../components/InteractiveMapView";
import { MoodInputForm } from "../components/MoodInputForm";
import { MoodResultBadge } from "../components/MoodResultBadge";
import { PlaceCardList } from "../components/PlaceCardList";
import { PlaceDetailDrawer } from "../components/PlaceDetailDrawer";
import { useMoodStore } from "../store/moodStore";

const STATUS_COPY: Record<string, { label: string; dot: string }> = {
  idle: { label: "Ready when you are", dot: "bg-white/30" },
  loading: { label: "Finding places", dot: "bg-amber-400 animate-pulse" },
  success: { label: "Search complete", dot: "bg-emerald-400" },
  error: { label: "Search failed", dot: "bg-rose-400" },
};

export function AppPage() {
  const currentMood = useMoodStore((s) => s.currentMood);
  const apiStatus = useMoodStore((s) => s.apiStatus);
  const places = useMoodStore((s) => s.places);

  const whySuggested = places[0]?.why_suggested;
  const status = STATUS_COPY[apiStatus] ?? STATUS_COPY.idle;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 animate-fade-in md:px-8 md:py-8">
      <div
        className="mb-6 flex flex-col gap-5 anim-stagger md:flex-row md:items-end md:justify-between"
        style={{ animationDelay: "0.1s" }}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/35">
            Mood map
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Find a place that fits the moment.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">
            Describe how you feel. We'll suggest nearby places to help you reset,
            shift, or stay with it.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 md:self-auto">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
              Session status
            </p>
            <p className="mt-0.5 text-sm font-medium text-white/75">
              {apiStatus === "success" ? `${status.label} · ${places.length} places` : status.label}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] xl:gap-5">
        <div className="space-y-4 anim-stagger" style={{ animationDelay: "0.2s" }}>
          <MoodInputForm />
          {apiStatus === "success" && currentMood && (
            <div className="animate-slide-up">
              <MoodResultBadge mood={currentMood} whySuggested={whySuggested} />
            </div>
          )}
        </div>

        <div className="space-y-4 anim-stagger" style={{ animationDelay: "0.3s" }}>
          <InteractiveMapView />
          <PlaceCardList />
        </div>
      </div>

      <PlaceDetailDrawer />
    </div>
  );
}

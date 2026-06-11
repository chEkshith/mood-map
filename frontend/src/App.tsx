import MoodInputForm from './components/MoodInputForm';
import PlaceCardList from './components/PlaceCardList';
import InteractiveMapView from './components/InteractiveMapView';
import DashboardStats from './components/DashboardStats';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">MoodMap</h1>
      </header>

      {/* Two-column layout */}
      <main className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Left panel — input */}
        <aside className="w-full lg:w-1/3 space-y-6">
          <MoodInputForm />
          <DashboardStats />
        </aside>

        {/* Right panel — results */}
        <section className="w-full lg:w-2/3 space-y-6">
          <InteractiveMapView />
          <PlaceCardList />
        </section>
      </main>
    </div>
  );
}

interface AuroraBackgroundProps {
  className?: string;
}

export function AuroraBackground({ className = "fixed inset-0 z-0" }: AuroraBackgroundProps) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <span className="aurora__blob aurora__blob--violet" />
      <span className="aurora__blob aurora__blob--blue" />
      <span className="aurora__blob aurora__blob--pink" />
      <span className="aurora__grid" />
    </div>
  );
}

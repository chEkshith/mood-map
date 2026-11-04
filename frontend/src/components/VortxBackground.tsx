const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260717_120352_eb988725-1351-43b3-8095-16e4a1005e3d.mp4";

export function VortxBackground() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      src={VIDEO_SRC}
      className="absolute inset-0 w-full h-full object-cover anim-fade"
      style={{ animationDelay: "0.2s" }}
    />
  );
}

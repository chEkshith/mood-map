export default function BackgroundVideo() {
  return (
    <div className="site-bg" aria-hidden="true">
      <video
        className="site-bg__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
      >
        <source src="/bg_video.mp4" type="video/mp4" />
      </video>
      <div className="site-bg__overlay" />
    </div>
  );
}

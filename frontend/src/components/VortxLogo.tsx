export function VortxLogo({ className = "w-14 h-14 md:w-16 md:h-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 112A96 96 0 0 1 112 16v96H16Z" />
      <path d="M144 16a96 96 0 0 1 96 96h-96V16Z" />
      <path d="M240 144a96 96 0 0 1-96 96v-96h96Z" />
      <path d="M112 240a96 96 0 0 1-96-96h96v96Z" />
    </svg>
  );
}

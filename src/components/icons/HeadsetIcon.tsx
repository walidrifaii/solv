type IconProps = {
  className?: string;
};

export function HeadsetIcon({ className = "size-10" }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M10 26v-4a14 14 0 0 1 28 0v4" />
      <path d="M8 26a4 4 0 0 1 4-4h2v12h-2a4 4 0 0 1-4-4v-4Z" />
      <path d="M40 26a4 4 0 0 0-4-4h-2v12h2a4 4 0 0 0 4-4v-4Z" />
      <path d="M34 34v2a6 6 0 0 1-6 6h-4" />
      <circle cx="22" cy="42" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

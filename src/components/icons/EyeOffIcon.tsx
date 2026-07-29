type IconProps = {
  className?: string;
};

export function EyeOffIcon({ className = "size-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
      <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c7 0 10 7 10 7a18.45 18.45 0 0 1-2.16 3.19" />
      <path d="M6.61 6.61A18.48 18.48 0 0 0 2 12s3 7 10 7a10.66 10.66 0 0 0 5.39-1.45" />
    </svg>
  );
}

type IconProps = {
  className?: string;
};

export function BagIcon({ className = "size-5" }: IconProps) {
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
      <path d="M6.5 9h11l-.8 10.2a1.5 1.5 0 0 1-1.5 1.3H8.8a1.5 1.5 0 0 1-1.5-1.3L6.5 9Z" />
      <path d="M9 9V7.5A3 3 0 0 1 12 4.5 3 3 0 0 1 15 7.5V9" />
    </svg>
  );
}

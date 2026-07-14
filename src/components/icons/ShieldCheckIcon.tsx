type IconProps = {
  className?: string;
};

export function ShieldCheckIcon({ className = "size-10" }: IconProps) {
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
      <path d="M24 6 10 12v10c0 9.5 6.2 16.4 14 19.5 7.8-3.1 14-10 14-19.5V12L24 6Z" />
      <path d="m17.5 24 4.5 4.5 8.5-9" />
    </svg>
  );
}

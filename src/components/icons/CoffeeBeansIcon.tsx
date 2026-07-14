type IconProps = {
  className?: string;
};

export function CoffeeBeansIcon({ className = "size-10" }: IconProps) {
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
      <ellipse cx="18" cy="24" rx="9" ry="13" transform="rotate(-22 18 24)" />
      <path d="M14 15c2.5 4 3 9 1 16" />
      <ellipse cx="31" cy="24" rx="9" ry="13" transform="rotate(18 31 24)" />
      <path d="M34 15c-2.2 4-2.8 9-1 16" />
    </svg>
  );
}

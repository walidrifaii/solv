type IconProps = {
  className?: string;
};

export function DeliveryTruckIcon({ className = "size-10" }: IconProps) {
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
      <path d="M6 30V14h22v16" />
      <path d="M28 20h8l6 6v4H28V20Z" />
      <circle cx="14" cy="34" r="3.5" />
      <circle cx="36" cy="34" r="3.5" />
      <path d="M17.5 34h14.8" />
      <path d="M6 30h8" />
    </svg>
  );
}

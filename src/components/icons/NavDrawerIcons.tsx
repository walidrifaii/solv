type IconProps = {
  className?: string;
};

export function HomeIcon({ className = "size-5" }: IconProps) {
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
      <path d="M4.5 11.5 12 5l7.5 6.5" />
      <path d="M7 10.5V19h10v-8.5" />
    </svg>
  );
}

export function InfoIcon({ className = "size-5" }: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5V17" />
      <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function StoreIcon({ className = "size-5" }: IconProps) {
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
      <path d="M4 9.5 5.5 5h13L20 9.5" />
      <path d="M4 9.5h16v10.5H4V9.5Z" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

export function ContactIcon({ className = "size-5" }: IconProps) {
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
      <path d="M7.2 3.8h2.4l1.2 3.2-1.5 1.2a10.5 10.5 0 0 0 5.1 5.1l1.2-1.5 3.2 1.2v2.4a2 2 0 0 1-2.1 2A13.8 13.8 0 0 1 5.2 5.9 2 2 0 0 1 7.2 3.8Z" />
    </svg>
  );
}

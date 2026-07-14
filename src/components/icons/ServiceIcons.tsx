type IconProps = {
  className?: string;
};

export function GiftBoxIcon({ className = "size-10" }: IconProps) {
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
      <rect x="10" y="20" width="28" height="18" rx="1.5" />
      <path d="M10 28h28M24 20v18" />
      <path d="M18 20c-3-4 0-8 4-6 2 1 2 4 2 6" />
      <path d="M30 20c3-4 0-8-4-6-2 1-2 4-2 6" />
      <path d="M14 20h20" />
    </svg>
  );
}

export function BuildingIcon({ className = "size-10" }: IconProps) {
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
      <path d="M10 40V16l14-8 14 8v24" />
      <path d="M10 40h28" />
      <path d="M20 40v-8h8v8" />
      <path d="M18 22h2M28 22h2M18 28h2M28 28h2" />
    </svg>
  );
}

export function CupIcon({ className = "size-10" }: IconProps) {
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
      <path d="M14 16h18v12a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8V16Z" />
      <path d="M32 20h3a5 5 0 0 1 0 10h-3" />
      <path d="M16 40h16" />
      <path d="M20 10c0 2 1.5 3 1.5 5M25 9c0 2.5 1.5 3.5 1.5 6" />
    </svg>
  );
}

export function ClipboardIcon({ className = "size-10" }: IconProps) {
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
      <rect x="12" y="12" width="24" height="28" rx="2" />
      <path d="M18 12V10a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M18 22h12M18 28h12M18 34h8" />
    </svg>
  );
}

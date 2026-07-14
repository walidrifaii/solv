type IconProps = {
  className?: string;
};

export function FacebookIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-2.2 0-3 .9-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.3.1-.6.7-.6H14Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.35" cy="6.65" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 3.2a8.7 8.7 0 0 0-7.4 13.3L3.5 20.7l4.35-1.1A8.7 8.7 0 1 0 12.04 3.2Zm0 1.6a7.1 7.1 0 0 1 5.95 10.9 7.05 7.05 0 0 1-5.95 3.2c-1.2 0-2.35-.3-3.38-.87l-.24-.13-2.58.66.7-2.5-.16-.26A7.1 7.1 0 0 1 12.04 4.8Zm-2.3 2.55c-.2 0-.43.08-.57.3-.2.27-.66.64-.66 1.56s.68 1.8.77 1.93c.1.13 1.3 2.08 3.24 2.85 1.56.61 1.93.55 2.26.5.5-.08 1.53-.62 1.75-1.22.22-.6.22-1.11.15-1.22-.07-.1-.25-.17-.53-.3-.27-.13-1.63-.8-1.88-.9-.25-.08-.43-.13-.61.13-.2.27-.72.9-.88 1.08-.16.18-.32.2-.6.07-.27-.13-1.15-.42-2.2-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.3.4-.45.13-.15.18-.25.27-.42.09-.17.05-.32-.02-.45-.08-.13-.6-1.48-.84-2.02-.22-.5-.45-.44-.62-.45h-.53Z" />
    </svg>
  );
}

export function PhoneIcon({ className = "size-4" }: IconProps) {
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

export function MailIcon({ className = "size-4" }: IconProps) {
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
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

export function MapPinIcon({ className = "size-4" }: IconProps) {
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
      <path d="M12 21s6.5-5.2 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.8 12 21 12 21Z" />
      <circle cx="12" cy="10.8" r="2.2" />
    </svg>
  );
}

export function ClockIcon({ className = "size-4" }: IconProps) {
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
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

type IconProps = {
  className?: string;
};

export function VisaLogo({ className = "h-5 w-auto" }: IconProps) {
  return (
    <svg
      viewBox="0 0 60 20"
      width="60"
      height="20"
      className={className}
      aria-label="Visa"
    >
      <text
        x="0"
        y="16"
        fill="#F7B600"
        style={{
          fontFamily: "Arial Black, Arial, sans-serif",
          fontSize: "18px",
          fontWeight: 800,
          letterSpacing: "1px",
          fontStyle: "italic",
        }}
      >
        VISA
      </text>
    </svg>
  );
}

export function MastercardLogo({ className = "h-6 w-auto" }: IconProps) {
  return (
    <svg
      viewBox="0 0 40 24"
      width="40"
      height="24"
      className={className}
      aria-label="Mastercard"
    >
      <circle cx="14" cy="12" r="9" fill="#EB001B" />
      <circle cx="26" cy="12" r="9" fill="#F79E1B" />
      <path
        d="M20 5.2a9 9 0 0 1 0 13.6 9 9 0 0 1 0-13.6Z"
        fill="#FF5F00"
      />
    </svg>
  );
}

/** Clean Apple Pay mark: border + Apple glyph + "Pay" text */
export function ApplePayLogo({ className = "h-7 w-auto" }: IconProps) {
  return (
    <svg
      viewBox="0 0 72 28"
      width="72"
      height="28"
      className={className}
      aria-label="Apple Pay"
    >
      <rect
        x="1"
        y="1"
        width="70"
        height="26"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        fill="currentColor"
        d="M19.6 7.6c.9-.1 1.9.5 2.5 1.1.5.6.9 1.5.8 2.4-1 .1-2-.6-2.6-1.2-.5-.6-.8-1.5-.7-2.3ZM24.8 20.4c-.6.9-1.4 2-2.4 2-.9 0-1.2-.6-2.3-.6-1.1 0-1.4.6-2.3.6-1 0-1.8-1.1-2.4-2.1-1.4-2-1.2-4.9.4-6.5.8-.8 1.9-1.2 2.9-1.2.9 0 1.8.6 2.3.6s1.5-.7 2.6-.6c1.1.1 2 .5 2.5 1.3-2.2 1.3-1.9 4.2.2 5.1-.4 1-.9 1.9-1.5 2.4Z"
      />
      <text
        x="48"
        y="18"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="12"
        fontWeight="500"
      >
        Pay
      </text>
    </svg>
  );
}

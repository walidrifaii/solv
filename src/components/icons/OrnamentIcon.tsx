type IconProps = {
  className?: string;
};

/** Small ornate diamond mark for section dividers */
export function OrnamentIcon({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 3.2 13.8 10.2 20.8 12 13.8 13.8 12 20.8 10.2 13.8 3.2 12l7-1.8L12 3.2Z" />
    </svg>
  );
}

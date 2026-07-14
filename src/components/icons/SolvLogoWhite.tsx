type SolvLogoProps = {
  className?: string;
};

/** White SVG wordmark — tight bounds so it aligns with footer titles */
export function SolvLogoWhite({ className = "h-10 w-auto" }: SolvLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 48"
      width="200"
      height="48"
      className={className}
      role="img"
      aria-label="SOLV Coffee & Tea Supplier"
    >
      <text
        x="0"
        y="28"
        fill="#ffffff"
        style={{
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          fontSize: "32px",
          fontWeight: 500,
          letterSpacing: "0.08em",
        }}
      >
        SOLV
      </text>
      <text
        x="0"
        y="44"
        fill="#ffffff"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "8px",
          fontWeight: 400,
          letterSpacing: "0.28em",
        }}
      >
        COFFEE &amp; TEA SUPPLIER
      </text>
    </svg>
  );
}

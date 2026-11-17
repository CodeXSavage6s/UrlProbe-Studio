// The URLProbe mark: a chain link (two interlocking capsules) with a probe
// point at the junction and crosshair ticks. Colors come from CSS, so it works
// on any background. public/favicon.svg is the same shape with fixed colors.
export default function Logo({ className, title }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g
        transform="rotate(-45 16 16)"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      >
        <rect x="3" y="10" width="17" height="12" rx="6" />
        <rect x="12" y="10" width="17" height="12" rx="6" />
      </g>
      <g
        transform="rotate(-45 16 16)"
        className="stroke-primary"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <line x1="16" y1="4.5" x2="16" y2="7.4" />
        <line x1="16" y1="24.6" x2="16" y2="27.5" />
      </g>
      <circle cx="16" cy="16" r="2.4" className="fill-primary" />
    </svg>
  );
}

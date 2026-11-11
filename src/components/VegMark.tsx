import type { Diet } from "@/lib/menu";

/**
 * The standard Indian food mark: a green square with a dot for vegetarian,
 * a brown square with a triangle for non-vegetarian.
 */
export function VegMark({ diet, className = "" }: { diet: Diet; className?: string }) {
  const veg = diet === "veg";
  return (
    <svg
      viewBox="0 0 16 16"
      className={`inline-block h-4 w-4 shrink-0 ${className}`}
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="2"
        fill="#fff"
        stroke={veg ? "#2f8a3b" : "#8a3b1f"}
        strokeWidth="1.6"
      />
      {veg ? (
        <circle cx="8" cy="8" r="3.6" fill="#2f8a3b" />
      ) : (
        <path d="M8 4.2 12 11.4H4z" fill="#8a3b1f" />
      )}
    </svg>
  );
}

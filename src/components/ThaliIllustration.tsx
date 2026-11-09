/**
 * Top-down illustration of a thali (plate with small bowls), drawn in SVG
 * so the hero looks good before real food photos are added.
 */

const CENTER = 200;
const BOWL_RING = 108;

// Five bowls evenly spaced around the plate, starting at the top.
const bowlPositions = Array.from({ length: 5 }, (_, i) => {
  const angle = ((-90 + i * 72) * Math.PI) / 180;
  return {
    x: +(CENTER + BOWL_RING * Math.cos(angle)).toFixed(1),
    y: +(CENTER + BOWL_RING * Math.sin(angle)).toFixed(1),
  };
});

// Rice grains laid out on a sunflower spiral so they look naturally scattered.
const riceGrains = Array.from({ length: 38 }, (_, i) => {
  const r = 40 * Math.sqrt((i + 0.5) / 38);
  const theta = i * 137.508;
  const rad = (theta * Math.PI) / 180;
  return {
    x: +(CENTER + r * Math.cos(rad)).toFixed(1),
    y: +(CENTER + r * Math.sin(rad)).toFixed(1),
    rotate: Math.round(theta % 180),
  };
});

function Bowl({
  x,
  y,
  fill,
  children,
}: {
  x: number;
  y: number;
  fill: string;
  children?: React.ReactNode;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={42} fill="url(#thali-bowl)" />
      <circle cx={x} cy={y} r={35} fill={`url(#${fill})`} />
      {children}
      <ellipse
        cx={x - 13}
        cy={y - 15}
        rx={10}
        ry={4.5}
        fill="#fff"
        opacity={0.22}
        transform={`rotate(-35 ${x - 13} ${y - 15})`}
      />
    </g>
  );
}

export function ThaliIllustration({ className = "" }: { className?: string }) {
  const [dal, curry, palak, raita, jamun] = bowlPositions;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Illustration of a thali with five curries, rice and dessert"
    >
      <defs>
        <radialGradient id="thali-plate" cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor="#f7f2e9" />
          <stop offset="1" stopColor="#d6c9b5" />
        </radialGradient>
        <radialGradient id="thali-bowl" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#ece3d6" />
          <stop offset="1" stopColor="#b3a48d" />
        </radialGradient>
        <radialGradient id="thali-dal" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#f8c55e" />
          <stop offset="1" stopColor="#d68a1d" />
        </radialGradient>
        <radialGradient id="thali-curry" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#dc6745" />
          <stop offset="1" stopColor="#9b2e1b" />
        </radialGradient>
        <radialGradient id="thali-palak" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#86a252" />
          <stop offset="1" stopColor="#45602a" />
        </radialGradient>
        <radialGradient id="thali-raita" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#fffbf3" />
          <stop offset="1" stopColor="#e8dece" />
        </radialGradient>
        <radialGradient id="thali-syrup" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#f4d79c" />
          <stop offset="1" stopColor="#d6a456" />
        </radialGradient>
        <radialGradient id="thali-jamun" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#8d4220" />
          <stop offset="1" stopColor="#47190a" />
        </radialGradient>
      </defs>

      {/* Plate */}
      <circle cx={CENTER} cy={CENTER} r={190} fill="#bfb09a" />
      <circle cx={CENTER} cy={CENTER} r={182} fill="url(#thali-plate)" />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={162}
        fill="none"
        stroke="#c4b6a1"
        strokeWidth={1.5}
        opacity={0.8}
      />

      {/* Rice in the middle, with coriander */}
      <circle cx={CENTER} cy={CENTER} r={47} fill="#fffaf1" />
      {riceGrains.map((g, i) => (
        <ellipse
          key={i}
          cx={g.x}
          cy={g.y}
          rx={4.2}
          ry={1.7}
          fill="#ebe1cd"
          transform={`rotate(${g.rotate} ${g.x} ${g.y})`}
        />
      ))}
      <path
        d="M214 178c8-6 18-4 20 2-6 6-15 6-20-2z M206 186c2-9 10-14 15-11-1 8-8 12-15 11z"
        fill="#56733d"
      />

      {/* Dal with mustard seeds */}
      <Bowl x={dal.x} y={dal.y} fill="thali-dal">
        {[
          [-10, -6],
          [6, -10],
          [12, 4],
          [-4, 8],
          [-14, 6],
          [2, 0],
        ].map(([dx, dy], i) => (
          <circle key={i} cx={dal.x + dx} cy={dal.y + dy} r={1.9} fill="#3b2412" />
        ))}
        <path
          d={`M${dal.x - 6} ${dal.y + 14}l5-3 2 4z`}
          fill="#b8432c"
        />
      </Bowl>

      {/* Curry with a cream swirl */}
      <Bowl x={curry.x} y={curry.y} fill="thali-curry">
        <path
          d={`M${curry.x - 16} ${curry.y + 3}q8-12 16-4t16-4`}
          fill="none"
          stroke="#fff3df"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.85}
        />
        <circle cx={curry.x + 6} cy={curry.y + 12} r={2.4} fill="#56733d" />
        <circle cx={curry.x - 8} cy={curry.y - 12} r={2} fill="#56733d" />
      </Bowl>

      {/* Palak paneer */}
      <Bowl x={palak.x} y={palak.y} fill="thali-palak">
        {[
          [-10, -8, 12],
          [8, -4, -18],
          [-2, 10, 30],
        ].map(([dx, dy, rot], i) => (
          <rect
            key={i}
            x={palak.x + dx - 5}
            y={palak.y + dy - 5}
            width={10}
            height={10}
            rx={2}
            fill="#fbf3e2"
            transform={`rotate(${rot} ${palak.x + dx} ${palak.y + dy})`}
          />
        ))}
      </Bowl>

      {/* Raita with herbs and chilli powder */}
      <Bowl x={raita.x} y={raita.y} fill="thali-raita">
        {[
          [-12, -4, "#6f8f45"],
          [4, -12, "#6f8f45"],
          [10, 6, "#6f8f45"],
          [-4, 10, "#6f8f45"],
          [0, 0, "#c0502f"],
          [-14, 8, "#c0502f"],
          [13, -6, "#c0502f"],
        ].map(([dx, dy, color], i) => (
          <circle
            key={i}
            cx={raita.x + Number(dx)}
            cy={raita.y + Number(dy)}
            r={1.8}
            fill={String(color)}
          />
        ))}
      </Bowl>

      {/* Gulab jamun in syrup */}
      <Bowl x={jamun.x} y={jamun.y} fill="thali-syrup">
        <circle cx={jamun.x - 9} cy={jamun.y - 3} r={12} fill="url(#thali-jamun)" />
        <circle cx={jamun.x + 10} cy={jamun.y + 6} r={11} fill="url(#thali-jamun)" />
        <circle cx={jamun.x - 13} cy={jamun.y - 7} r={2.5} fill="#fff" opacity={0.35} />
        <circle cx={jamun.x + 6} cy={jamun.y + 2} r={2.2} fill="#fff" opacity={0.35} />
      </Bowl>

      {/* Lemon wedge and green chilli between the bottom bowls */}
      <path d="M186 318a14 14 0 0 1 28 0z" fill="#f3d34c" stroke="#fff8d6" strokeWidth={2} />
      <path
        d="M196 334c10 4 22 2 30-6"
        fill="none"
        stroke="#4d7a2a"
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  );
}

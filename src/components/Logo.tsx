export function Logo({ size = 36, withText = true, compact = false }: { size?: number; withText?: boolean; compact?: boolean }) {
  return (
    <div className={`inline-flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Shield outline */}
        <svg viewBox="0 0 48 48" width={size} height={size} fill="none" aria-hidden>
          <defs>
            <linearGradient id="lgShield" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff8236" />
              <stop offset="100%" stopColor="#e5580c" />
            </linearGradient>
          </defs>
          <path
            d="M24 3 L42 10 V24 C42 34 34 42 24 45 C14 42 6 34 6 24 V10 Z"
            fill="url(#lgShield)"
            stroke="#0b0f16"
            strokeWidth="1.5"
          />
          {/* Helmet top */}
          <path
            d="M16 22 Q24 12 32 22 V26 H16 Z"
            fill="#0b0f16"
            opacity="0.85"
          />
          {/* AR frame corners */}
          <g stroke="#0b0f16" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 14 L12 18 M12 14 L16 14" />
            <path d="M36 14 L36 18 M36 14 L32 14" />
            <path d="M12 34 L12 30 M12 34 L16 34" />
            <path d="M36 34 L36 30 M36 34 L32 34" />
          </g>
          {/* Jharkhand-inspired triangle motif */}
          <path d="M24 30 L20 36 L28 36 Z" fill="#0b0f16" />
          <circle cx="24" cy="38" r="1" fill="#ffb020" />
        </svg>
      </div>
      {withText && (
        <div className={`leading-none ${compact ? "" : ""}`}>
          <div className={`font-bold tracking-[0.18em] text-white ${compact ? "text-base" : "text-xl"}`}>
            SURAKSHAAR
          </div>
          {!compact && (
            <div className="text-[10px] tracking-[0.16em] text-surface-300 mt-1 uppercase">
              Safe · Skilled · Jharkhand
            </div>
          )}
        </div>
      )}
    </div>
  );
}

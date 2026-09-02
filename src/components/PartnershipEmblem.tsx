const SHIELD =
  "M -65,-70 C -65,-85 -35,-92 0,-92 C 35,-92 65,-85 65,-70 L 65,10 C 65,55 35,80 0,92 C -35,80 -65,55 -65,10 Z";

export function PartnershipEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 320"
      className={className}
      role="img"
      aria-label="Partenariat entre la France et l'Algérie"
    >
      <defs>
        <clipPath id="shield-fr">
          <path d={SHIELD} transform="translate(120,150)" />
        </clipPath>
        <clipPath id="shield-dz">
          <path d={SHIELD} transform="translate(380,150)" />
        </clipPath>
      </defs>

      {/* Connecting lines */}
      <g fill="none" stroke="#C9A24B" strokeWidth="1.5" opacity="0.75">
        <path d="M195,110 C260,80 300,150 375,120" />
        <path d="M195,150 C260,175 300,120 375,150" />
        <path d="M195,190 C260,165 300,205 375,185" />
      </g>
      <circle cx="250" cy="123" r="3.5" fill="#C9A24B" />
      <circle cx="288" cy="150" r="3.5" fill="#C9A24B" />
      <circle cx="255" cy="178" r="3.5" fill="#C9A24B" />

      {/* France shield */}
      <g clipPath="url(#shield-fr)">
        <rect x="55" y="58" width="130" height="184" fill="#ED2939" />
        <rect x="55" y="58" width="86.6" height="184" fill="#FFFFFF" />
        <rect x="55" y="58" width="43.3" height="184" fill="#002395" />
      </g>
      <path
        d={SHIELD}
        transform="translate(120,150)"
        fill="none"
        stroke="#C9A24B"
        strokeWidth="4"
      />

      {/* Algeria shield */}
      <g clipPath="url(#shield-dz)">
        <rect x="315" y="58" width="130" height="184" fill="#FFFFFF" />
        <rect x="315" y="58" width="65" height="184" fill="#006233" />
        <g fill="#D21034">
          <circle cx="392" cy="150" r="30" />
          <circle cx="402" cy="150" r="24" fill="#FFFFFF" />
          <polygon
            points="0,-1 0.225,-0.309 0.951,-0.309 0.363,0.118 0.588,0.951 0,0.382 -0.588,0.951 -0.363,0.118 -0.951,-0.309 -0.225,-0.309"
            transform="translate(400,150) scale(9)"
          />
        </g>
      </g>
      <path
        d={SHIELD}
        transform="translate(380,150)"
        fill="none"
        stroke="#C9A24B"
        strokeWidth="4"
      />
    </svg>
  );
}

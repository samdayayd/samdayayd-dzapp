/** Abstract line-art silhouette — a simplified Eiffel Tower (France) and
    the Algiers Martyrs' Memorial (Algeria), facing each other across the
    page. This replaces using the literal hero photograph as decoration
    elsewhere on the page: it carries the same France/Algeria duality the
    brand is built on, but as a drawn, unique-to-DZ-APP mark rather than
    another stock-feeling photograph. Pure SVG, no raster asset. */
export function BrandSkyline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 220"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Eiffel Tower, left */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M150 220 L175 60 L200 220" />
        <path d="M165 220 L175 60 L185 220" />
        <path d="M152 170 H198" />
        <path d="M158 120 H192" />
        <path d="M167 75 H183" />
        <path d="M175 60 L175 20" />
        <path d="M140 220 H210" />
      </g>
      {/* Algiers Martyrs' Memorial, right — three curved blades meeting at a point */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1000 220 C 995 140, 1010 70, 1030 30" />
        <path d="M1030 220 C 1030 130, 1030 60, 1030 20" />
        <path d="M1060 220 C 1065 140, 1050 70, 1030 30" />
        <path d="M980 220 H1080" />
      </g>
      {/* A low, calm skyline connecting the two, kept deliberately minimal */}
      <path
        d="M0 220 H150 M210 220 H260 L270 205 H300 L310 220 H420 M980 220 H900 L890 200 H860 L850 220 H700 M1080 220 H1200"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

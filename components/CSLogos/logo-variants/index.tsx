import React from 'react';

// Static Logo Components
export function GeometricSquareLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Central square */}
      <rect x="20" y="20" width="24" height="24" fill="currentColor" />
      
      {/* Intersecting lines */}
      <rect x="30" y="8" width="4" height="48" fill="currentColor" />
      <rect x="8" y="30" width="48" height="4" fill="currentColor" />
      
      {/* Corner accents */}
      <rect x="16" y="16" width="8" height="8" fill="currentColor" opacity="0.3" />
      <rect x="40" y="16" width="8" height="8" fill="currentColor" opacity="0.3" />
      <rect x="16" y="40" width="8" height="8" fill="currentColor" opacity="0.3" />
      <rect x="40" y="40" width="8" height="8" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function RadiatingPathsLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Central hub */}
      <circle cx="32" cy="32" r="8" fill="currentColor" />
      
      {/* Radiating paths */}
      <rect x="30" y="4" width="4" height="20" fill="currentColor" />
      <rect x="30" y="40" width="4" height="20" fill="currentColor" />
      <rect x="4" y="30" width="20" height="4" fill="currentColor" />
      <rect x="40" y="30" width="20" height="4" fill="currentColor" />
      
      {/* Diagonal paths */}
      <rect x="45" y="13" width="4" height="14" fill="currentColor" transform="rotate(45 47 20)" />
      <rect x="45" y="37" width="4" height="14" fill="currentColor" transform="rotate(-45 47 44)" />
      <rect x="15" y="13" width="4" height="14" fill="currentColor" transform="rotate(-45 17 20)" />
      <rect x="15" y="37" width="4" height="14" fill="currentColor" transform="rotate(45 17 44)" />
    </svg>
  );
}

export function ArchitecturalFrameLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Outer frame */}
      <rect x="8" y="8" width="48" height="48" stroke="currentColor" strokeWidth="4" fill="none" />
      
      {/* Inner frame */}
      <rect x="16" y="16" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" />
      
      {/* Central element */}
      <rect x="28" y="28" width="8" height="8" fill="currentColor" />
      
      {/* Arch elements */}
      <path d="M 20 12 Q 32 20 44 12" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M 20 52 Q 32 44 44 52" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function GridPatternLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Grid cells */}
      <rect x="12" y="12" width="12" height="12" fill="currentColor" opacity="0.3" />
      <rect x="28" y="12" width="12" height="12" fill="currentColor" />
      <rect x="44" y="12" width="12" height="12" fill="currentColor" opacity="0.3" />
      
      <rect x="12" y="28" width="12" height="12" fill="currentColor" />
      <rect x="28" y="28" width="12" height="12" fill="currentColor" opacity="0.8" />
      <rect x="44" y="28" width="12" height="12" fill="currentColor" />
      
      <rect x="12" y="44" width="12" height="12" fill="currentColor" opacity="0.3" />
      <rect x="28" y="44" width="12" height="12" fill="currentColor" />
      <rect x="44" y="44" width="12" height="12" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function CircleSquareHybridLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Outer circle */}
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3" fill="none" />
      
      {/* Inner square */}
      <rect x="20" y="20" width="24" height="24" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" />
      
      {/* Central element */}
      <circle cx="32" cy="32" r="6" fill="currentColor" />
      
      {/* Connection points */}
      <circle cx="32" cy="12" r="2" fill="currentColor" />
      <circle cx="52" cy="32" r="2" fill="currentColor" />
      <circle cx="32" cy="52" r="2" fill="currentColor" />
      <circle cx="12" cy="32" r="2" fill="currentColor" />
    </svg>
  );
}

export function MinimalMarkLogo({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Central square with rounded corners */}
      <rect x="24" y="24" width="16" height="16" rx="2" fill="currentColor" />
      
      {/* Minimal connection indicators */}
      <rect x="30" y="16" width="4" height="4" fill="currentColor" />
      <rect x="30" y="44" width="4" height="4" fill="currentColor" />
      <rect x="16" y="30" width="4" height="4" fill="currentColor" />
      <rect x="44" y="30" width="4" height="4" fill="currentColor" />
    </svg>
  );
}
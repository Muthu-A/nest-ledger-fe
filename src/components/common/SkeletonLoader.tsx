import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

export function Skeleton({ width = '100%', height = 16, style, className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        borderRadius: 4,
        background: 'linear-gradient(90deg, #f3f3f3 25%, #ecebeb 37%, #f3f3f3 63%)',
        backgroundSize: '400% 100%',
        animation: 'skeleton-loading 1.2s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function SkeletonText({ lines = 2, width = '100%', style = {} }: { lines?: number; width?: string | number; style?: React.CSSProperties }) {
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={width} height={14} style={{ marginBottom: 6, ...style }} />
      ))}
    </div>
  );
}

// Add this to your global CSS:
// @keyframes skeleton-loading {
//   0% { background-position: 100% 50%; }
//   100% { background-position: 0 50%; }
// }

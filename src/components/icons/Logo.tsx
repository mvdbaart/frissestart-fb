import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--secondary))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <text
        x="5"
        y="30"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="28"
        fontWeight="bold"
        fill="url(#logoGradient)"
      >
        FrisseStart
      </text>
      <text
        x="128"
        y="30"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="28"
        fontWeight="normal"
        fill="hsl(var(--foreground))"
      >
        Digital
      </text>
    </svg>
  );
}

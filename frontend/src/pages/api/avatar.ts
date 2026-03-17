import type { NextApiRequest, NextApiResponse } from 'next';

// Deterministic color from name string
function nameToColor(name: string): string {
  const palette = [
    '#277C78', '#626070', '#82C9D7', '#F2CDAC', '#93674F',
    '#934F6F', '#3F82B2', '#97A0AC', '#7F9161', '#CAB361',
    '#BE6C49', '#AF81BA',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const name = typeof req.query.name === 'string' ? req.query.name : 'U';
  const size = 40;
  const bg = nameToColor(name);
  const initials = getInitials(name);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
    font-family="sans-serif" font-size="${size * 0.38}" font-weight="700" fill="#ffffff">
    ${initials}
  </text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.status(200).send(svg);
}

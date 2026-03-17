import React from 'react';

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number;
}

export default function Avatar({ name, size = 40 }: AvatarProps) {
  // avatarUrl kept in props for future use; we always generate via API to avoid 404s
  const src = `/api/avatar?name=${encodeURIComponent(name)}`;
  return (
    <div className="avatar" style={{ width: size, height: size }}>
      <img src={src} alt={name} width={size} height={size} />
    </div>
  );
}

// src/HeroIcon.tsx
import React from 'react';
import * as SolidIcons from '@heroicons/react/24/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';

export type IconName = keyof typeof SolidIcons | keyof typeof OutlineIcons;

type HeroIconProps = {
  solid?: boolean;
  iconName: IconName;
  className?: string;
};

export function HeroIcon({
  solid,
  iconName,
  className
}: HeroIconProps): JSX.Element {
  const Icon = solid ? SolidIcons[iconName] : OutlineIcons[iconName];

  if (!Icon) {
    return <div className={className ?? 'h-6 w-6'}>Icon not found</div>;
  }

  return <Icon className={className ?? 'h-6 w-6'} />;
}

'use client';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import cn from 'clsx';

type AvatarProps = {
  src: string;
  alt: string;
  initials: string;
  size?: number; // size now directly accepts a numeric value
};

const Avatar = ({
  src,
  alt,
  initials,
  size = 48, // default size is set to 48 pixels
}: AvatarProps) => {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'AvatarRoot inline-flex items-center justify-center overflow-hidden rounded-full bg-slate-900',
      )}
      style={{ width: size, height: size }} // Inline style for width and height
    >
      <AvatarPrimitive.Image
        className="AvatarImage w-full h-full object-cover"
        src={src}
        alt={alt}
      />
      <AvatarPrimitive.Fallback
        className="AvatarFallback w-full h-full flex items-center justify-center text-base text-white leading-none font-semibold"
        delayMs={600}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

export default Avatar;

import { Avatar as NextUIAvatar } from '@nextui-org/avatar';

type AvatarProps = {
  src?: string; // src is now optional
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
  const showInitials = !src;

  return (
    <NextUIAvatar
      classNames={{
        base: "bg-gradient-to-br from-[#5C4747] to-[#000000] z-0",
        icon: "text-black/80",
        name:"text-white"
      }}
      style={{ width: size, height: size }} // Use style instead of css
      src={src}
      alt={alt}
      name={initials}
    >
      {showInitials && initials}
    </NextUIAvatar>
  );
};

export default Avatar;

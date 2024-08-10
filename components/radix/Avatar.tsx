import { Avatar as NextUIAvatar } from '@nextui-org/avatar';

type AvatarProps = {
  src?: string; // src is now optional
  alt: string;
  initials: string;
  size?: number; // size now directly accepts a numeric value
  children?: React.ReactNode; // Add children prop to accept additional content
};

const Avatar = ({
  src,
  alt,
  initials,
  size = 48, // default size is set to 48 pixels
  children,
}: AvatarProps) => {
  const showInitials = !src;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <NextUIAvatar
      
      icon={children }
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
      </NextUIAvatar>
     
    </div>
  );
};

export default Avatar;

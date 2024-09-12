import { useEffect, useState } from 'react';
import { Avatar as NextUIAvatar } from '@nextui-org/avatar';

type AvatarProps = {
  src?: string; // src는 JSON 형식의 문자열 또는 일반 URL일 수 있음
  alt?: string;
  initials?: string;
  size?: number;
  children?: React.ReactNode;
};

const Avatar = ({
  src,
  alt,
  initials,
  size = 48,
  children,
}: AvatarProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (src) {
      try {
        // src가 JSON 형식인지 확인하고 파싱
        const parsedSrc = JSON.parse(src);
        if (parsedSrc.base64 && parsedSrc.base64.startsWith('data:image')) {
          // src가 { base64: "data:image/png;base64,..." } 형식일 때 처리
          setImageUrl(parsedSrc.base64);
        } else {
          // 일반 URL일 때 처리
          setImageUrl(src);
        }
      } catch (error) {
        // src가 JSON 형식이 아닐 경우 (일반 URL로 가정)
        setImageUrl(src);
      }
    } else {
      setImageUrl(undefined); // src가 없을 때
    }
  }, [src]);

  // 이미지가 없으면 이니셜을 표시
  const showInitials = !imageUrl;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <NextUIAvatar
        icon={children}
        classNames={{
          base: "bg-gradient-to-br from-[#5C4747] to-[#000000] z-0",
          icon: "text-black/80",
          name: "text-white",
        }}
        style={{ width: size, height: size }}
        src={imageUrl} // Base64 데이터 또는 일반 URL을 img src로 사용
        alt={alt}
        name={showInitials ? initials : undefined} // 이미지가 없을 때만 이니셜 표시
      >
        {children}
      </NextUIAvatar>
    </div>
  );
};

export default Avatar;

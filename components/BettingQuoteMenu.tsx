import React from 'react';
import Image from 'next/image';
import HoverCard from '@rd/HoverCard';
import UserInfo from '@components/UserInfo';

interface QuoteBettingProductProps {
  userName: string;
  displayName: string;
  userImg: string;
  title: string;
  imgUrls: string[];
  tierName: string;
  bettingId: number;
  blindName: string | null;
  onClick: () => void;
}

const QuoteBettingProduct: React.FC<QuoteBettingProductProps> = ({
  userName,
  displayName,
  userImg,
  title,
  imgUrls,
  tierName,
  bettingId,
  blindName,
  onClick,
}) => {
  // userName이 없을 경우 "U"를 기본값으로 사용
  const initial = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex gap-x-4">
        <div className="flex-shrink-0">
          {!blindName ? (
            <HoverCard
              src={userImg}
              alt={displayName || "Unknown"}
              initials={initial}
              name={displayName || "Unknown"}
              username={userName || "unknown"}
              following="0"
              followers="0"
              description=""
            />
          ) : (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image 
                src="/images/logo.png" 
                alt="Blind User"
                width={40}
                height={40}
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center mb-2">
            {!blindName ? (
              <UserInfo
                name={displayName || "Unknown"}
                username={userName || "unknown"}
                date=""
                tierName={tierName || ""}
              />
            ) : (
              <span className="text-sm font-medium">{blindName}</span>
            )}
          </div>
          
          <div className="text-2xl font-bold mb-2">{title}</div>
          
          {imgUrls?.length > 0 && (
            <div className="w-full h-32 flex gap-2 overflow-x-auto pb-2">
              {imgUrls.map((url, index) => (
                <div 
                  key={url} 
                  className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 my-4"
                >
                  <Image
                    src={url}
                    alt={`Betting image ${index + 1}`}
                    className="h-full w-full object-scale-down object-center"
                    width={500}
                    height={500}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteBettingProduct;
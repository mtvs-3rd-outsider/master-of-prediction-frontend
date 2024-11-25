import React from 'react';
import { UserDTO, GuestDTO } from '@components/types/feedResponseDTO';
import MediaGrid from '@components/MediaGrid';
import HoverCard from '@rd/HoverCard';
import Userinfo from '@components/UserInfo';

interface QuotePostProps {
  quoteId: number;
  quoteContent: string;
  quoteCreateAt: string;
  quoteUser: UserDTO | null;
  quoteGuest: GuestDTO | null;
  mediaFileUrls: string[];
  youtubeUrls: string[];
  onClick: () => void;
}

const QuotePost: React.FC<QuotePostProps> = ({
quoteId,
  quoteContent,
  quoteCreateAt,
  quoteUser,
  quoteGuest,
  mediaFileUrls,
  youtubeUrls,
  onClick
}) => {
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
          {quoteUser && (
            <HoverCard
              src={quoteUser.userImg}
              alt={quoteUser.displayName}
              initials={quoteUser.userName[0].toUpperCase()}
              name={quoteUser.displayName}
              username={quoteUser.userName}
              following="0"
              followers="0"
              description={""}
            />
          )}
          {quoteGuest && (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium">
                {quoteGuest.guestId[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center mb-2">
            {quoteUser && (
              <Userinfo
                name={quoteUser.displayName}
                username={quoteUser.userName}
                date={new Date(quoteCreateAt).toLocaleString()}
                tierName={quoteUser.tier.name}
              />
            )}
            {quoteGuest && (
              <span className="text-sm text-gray-500">
                @{quoteGuest.guestId}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">{quoteContent}</div>
          
          {(mediaFileUrls?.length > 0 || youtubeUrls?.length > 0) && (
            <div className="mb-2">
              <MediaGrid 
                mediaFiles={mediaFileUrls} 
                youtubeUrls={youtubeUrls} 
                id={quoteId.toString()}
                isQuote={true} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotePost;

// import React from 'react';
// import MediaGrid from '@components/MediaGrid';
// import HoverCard from '@rd/HoverCard';
// import Userinfo from '@components/UserInfo';

// interface QuotePostProps {
//   quoteId: number;
//   quoteContent: string;
//   quotedate: string;
//   quoteName: string;
//   quoteUsername: string;
//   mediaFileUrls: string[];
//   youtubeUrls: string[];
//   onClick: () => void;
// }

// const QuotePost: React.FC<QuotePostProps> = ({
//   quoteId,
//   quoteContent,
//   quotedate,
//   quoteName,
//   quoteUsername,
//   mediaFileUrls,
//   youtubeUrls,
//   onClick
// }) => {
//   return (
//     <div 
//       className="border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick();
//       }}
//     >
//       <div className="flex flex-col gap-2">
//         <div className="flex items-center gap-2">
//           <span className="font-medium">{quoteName}</span>
//           <span className="text-gray-500">@{quoteUsername}</span>
//           <span className="text-gray-400 text-sm">
//             {new Date(quotedate).toLocaleString()}
//           </span>
//         </div>
        
//         <div className="text-sm text-gray-600">{quoteContent}</div>
        
//         {(mediaFileUrls?.length > 0 || youtubeUrls?.length > 0) && (
//           <div>
//             <MediaGrid 
//               mediaFiles={mediaFileUrls} 
//               youtubeUrls={youtubeUrls} 
//               id={quoteId.toString()}
//               isQuote={true} 
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuotePost;

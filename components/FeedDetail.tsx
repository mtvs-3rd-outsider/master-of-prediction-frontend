import React, { useState } from 'react';  // useState 추가
import { FeedResponseDTO } from '@components/types/feedResponseDTO';
import Post from '@ui/Post';
import BackButton from '@components/BackButton';
import FeedComments from './FeedComments';
interface FeedDetailProps {
  feed: FeedResponseDTO;
}

const FeedDetail: React.FC<{ feed: FeedResponseDTO }> = ({ feed }) => {
  const [commentsCount, setCommentsCount] = useState(feed.commentsCount);

  const handleCommentAdd = () => {
    setCommentsCount(prev => prev + 1);
  };

  const mediaFiles = feed.mediaFiles.map(file => file.fileUrl);
  const youtubeUrls = feed.youTubeVideos.map(video => video.youtubeUrl);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <BackButton />
      <div className="my-4">
        <Post
          id={feed.id.toString()}
          content={feed.content}
          name={feed.user?.displayName || feed.guest?.guestId || 'Unknown'}
          username={feed.user?.userName || feed.guest?.guestId || 'Unknown'}
          date={new Date(feed.createdAt).toLocaleString()}
          src={feed.user?.userImg || ''}
          initials={(feed.user?.userName?.[0] || feed.guest?.guestId?.[0] || 'U').toUpperCase()}
          description={""}
          followers=""
          following=""
          viewCount={(feed.viewCount+1).toString()}
          mediaFiles={mediaFiles}
          youtubeUrls={youtubeUrls}
          commentsCount={commentsCount}
          likesCount={feed.likesCount}
          shareCount={feed.shareCount}
          onClick={() => {}}
          isLike={feed.isLike}
          userId={feed.user?.userId}
          isShare={feed.isShare}
          quoteFeed={feed.quoteFeed}
          isQuote={feed.isQuote}
          guest={feed.guest}
        />
      </div>
      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-bold mb-4">댓글</h2>
        <FeedComments 
          id={feed.id.toString()}
          onCommentAdd={handleCommentAdd}
        />
      </div>
    </div>
  );
};


export default FeedDetail;
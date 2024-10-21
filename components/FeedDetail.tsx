import React from 'react';
import { FeedResponseDTO } from '@components/types/feedResponseDTO';
import Post from '@ui/Post';
import BackButton from '@components/BackButton';
import FeedComments from './FeedComments';
import { faL } from '@fortawesome/free-solid-svg-icons';

interface FeedDetailProps {
  feed: FeedResponseDTO;
}

const FeedDetail: React.FC<FeedDetailProps> = ({ feed }) => {
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
          description={feed.title}
          followers={""}
          following={""}
          likesCount={feed.likesCount}
          commentsCount={feed.commentsCount}
          quoteCount={feed.commentsCount}
          viewCount={feed.viewCount.toString()}
          mediaFiles={feed.mediaFiles.map(file => file.fileUrl)}
          youtubeUrls={feed.youTubeVideos.map(video => video.youtubeUrl)}
          onClick={() => {}}
          isLike={feed.isLike || false} // 이 줄을 추가합니다
          userId={feed.user?.userId}
        />
      </div>
     {/* 댓글 섹션 */}
<div className="mt-8 border-t pt-4">
  <h2 className="text-xl font-bold mb-4">댓글</h2>
  <FeedComments id={feed.id.toString()}/>
</div>
    </div>
  );
};

export default FeedDetail;
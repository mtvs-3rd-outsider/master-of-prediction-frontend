// app/(home)/feed/[feedId]/page.tsx
import dynamic from 'next/dynamic';

const FeedDetailContainer = dynamic(() => import('@components/FeedDetailContainer'), { ssr: false });

export default function FeedPage({ params }: { params: { feedId: string } }) {
  return <FeedDetailContainer feedId={params.feedId} />;
}
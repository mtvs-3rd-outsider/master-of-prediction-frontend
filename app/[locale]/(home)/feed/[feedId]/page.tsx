// app/(home)/feed/[feedId]/page.tsx
import FeedDetailContainer from '@ui/FeedDetailContainer';
import dynamic from 'next/dynamic';


export default async function FeedPage({ params }: { params: { feedId: string } }) {
  const {feedId} = await params;
  return <FeedDetailContainer feedId={feedId} />;
}
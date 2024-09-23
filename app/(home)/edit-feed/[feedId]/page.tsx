import EditFeedPage from '@components/EditFeedPage';

interface EditFeedRouteProps {
  params: {
    feedId: string;
  };
}

export default function EditFeedRoute({ params }: EditFeedRouteProps) {
  return <EditFeedPage feedId={params.feedId} />;
}
import React from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Account from '@ui/Account';

interface SearchResultsProps {
  status: string;
  search: any;
  infiniteErrorSearch: any;
  fetchNextPageSearch: () => void;
  hasNextPageSearch: boolean;
  isFetchingNextPageSearch: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  status, 
  search, 
  infiniteErrorSearch, 
  fetchNextPageSearch, 
  hasNextPageSearch, 
  isFetchingNextPageSearch 
}) => {
  const { ref: loadMoreRef, inView: isInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (isInView && hasNextPageSearch) {
      fetchNextPageSearch();
    }
  }, [isInView, hasNextPageSearch, fetchNextPageSearch]);

  return (
    <div className="p-4">
      {status === 'pending' ? (
        <p></p>
      ) : status === 'error' ? (
        <p>Error: {infiniteErrorSearch.message}</p>
      ) : (
        search?.pages.map((page: any, pageIndex: number) => (
          <React.Fragment key={pageIndex}>
            {page.content.map((result: any) => (
              <Link key={result.user_id} href={`/channel/${result.user_id}`}>
                <Account
                  className="px-2 py-2"
                  userName={result.user_name}
                  avatarUrl={result.avatar_img}
                  displayName={result.display_name}
                  tier={result.tier}
                />
              </Link>
            ))}
          </React.Fragment>
        ))
      )}
      <div ref={loadMoreRef}>
        {isFetchingNextPageSearch ? 'Loading more...' : hasNextPageSearch ? 'Load More' : ''}
      </div>
    </div>
  );
};

export default SearchResults;

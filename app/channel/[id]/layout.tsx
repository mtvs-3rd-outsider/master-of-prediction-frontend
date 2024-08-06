"use client";

import React from 'react';
import { usePathname, useRouter, useSearchParams ,useParams  } from  'next/navigation';
import { query, where, limit } from 'firebase/firestore';
import { UserContextProvider } from '@lib/context/user-context';
import { useCollection } from '@lib/hooks/useCollection';
import { usersCollection } from '@lib/firebase/collections';
import { SEO } from '@components/common/seo';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { UserHeader } from '@components/user/user-header';
import { UserLayout, type LayoutProps } from '@components/layout/common-layout';
import { UserDataLayout } from '@/components/layout/user-data-layout';
import { UserHomeLayout } from '@/components/layout/user-home-layout';

export default  function RootLayout({ children }: LayoutProps): JSX.Element {
  const {
    back
  } = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;
  const { data, loading } = useCollection(
    query(usersCollection, where('username', '==', id), limit(1)),
    { allowNull: true }
  );

  const user = data ? data[0] : null;

  return (
    <UserContextProvider value={{ user, loading }}>
      {!user && !loading && <SEO title='User not found / Twitter' />}
      <MainContainer>
        <MainHeader useActionButton action={back}>
          <UserHeader />
        </MainHeader>
        <UserLayout>
        <UserDataLayout>
          <UserHomeLayout>{children}</UserHomeLayout>
        </UserDataLayout>
      </UserLayout>
      </MainContainer>
    </UserContextProvider>
  );
}

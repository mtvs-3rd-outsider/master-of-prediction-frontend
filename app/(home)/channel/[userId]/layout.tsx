import React from 'react';

import TanstackQueryProvider from '@ui/TanstackQueryProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
        <TanstackQueryProvider>
        {children}
        </TanstackQueryProvider>
    </>
  );
}

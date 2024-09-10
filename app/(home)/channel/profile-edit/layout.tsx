'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import TanstackQueryProvider from '@ui/TanstackQueryProvider';
import React, { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <TanstackQueryProvider >
      {children}
    </TanstackQueryProvider>
  );
}

import '@styles/styles.css';
import { ReactNode } from 'react';
import Nav from '@ui/Nav';
import type { Metadata, Viewport } from "next";
import Head from 'next/head';
import { NextUIProvider } from "@nextui-org/system";

type LayoutProps = {
  children: ReactNode;
};

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: LayoutProps): ReactNode {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <title>{APP_DEFAULT_TITLE}</title>
      </Head>
      <body>
        <NextUIProvider className="light text-foreground bg-background">
          <div className="min-h-screen flex max-w-7xl mx-auto xl:grid xl:grid-cols-10 gap-5">
            {/* Nav 컴포넌트가 로드되기 전에 공간을 확보하여 레이아웃 이동 방지 */}
              <Nav />
              {children}
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}

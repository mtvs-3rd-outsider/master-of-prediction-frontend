

import type { Metadata, Viewport } from "next";
import Head from 'next/head';
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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  
  return (
    <>
<html lang="en">
      <body>
      {children}
      </body>
      </html>
    </>
  );
}

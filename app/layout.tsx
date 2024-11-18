

import type { Metadata, Viewport } from "next";
import Head from 'next/head';
import {NextIntlClientProvider} from 'next-intl';
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import GoogleAdsense from "@ui/GoogleAdsense";
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
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
};
  export async function generateStaticParams() {
    unstable_setRequestLocale('ko'); // 기본 로케일을 설정하세요.
    return []; // 추가적인 정적 매개변수가 있으면 반환하세요.
  }
  
export default async  function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const messages = await getMessages();

  return (
    <>
<html lang={locale} suppressHydrationWarning={true}>
<head>
<Script
  type="text/javascript"
  src="/service-worker-register.js"
/>
        <GoogleAdsense pId="2358632947348636" />
      </head>
      <body  suppressHydrationWarning={true}>
      <NextIntlClientProvider messages={messages}>

          {children}
        </NextIntlClientProvider>
      </body>
      </html>
    </>
  );
}

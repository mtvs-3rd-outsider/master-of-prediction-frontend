// app/[locale]/(home)/betting/[id]/BettingDetailPage.tsx
'use client'; // Ensure this is a client-side component
// components/MyComponent.tsx
import dynamic from "next/dynamic";

// Dynamically import BettingDetailPage without SSR
const BettingDetailPage = dynamic(() => import("./BettingDetailPage"), {
  ssr: false,
});

const MyComponent = () => {
  return <BettingDetailPage />;
};

export default MyComponent;

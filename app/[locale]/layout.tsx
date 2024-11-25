import ClientWrapper from "@ui/ClientWrapper";

export default async  function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
  }) {
  const { locale } = await params;
  return (
    <>
        {/* 클라이언트 컴포넌트를 포함 */}
        <ClientWrapper locale={locale}>{children}</ClientWrapper>
    </>
  );
}

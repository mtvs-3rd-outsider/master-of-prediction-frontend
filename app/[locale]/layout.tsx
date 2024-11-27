import ClientWrapper from "@ui/ClientWrapper";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  return (
    <>
      <ClientWrapper locale={locale}>{children}</ClientWrapper>
    </>
  );
}

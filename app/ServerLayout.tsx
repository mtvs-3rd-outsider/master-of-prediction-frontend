// app/serverLayout.tsx
export default function ServerLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // 서버에서만 실행되는 로직이 있다면 여기에 넣습니다.
  
    return (
      <div>
        {children}
      </div>
    );
  }
  
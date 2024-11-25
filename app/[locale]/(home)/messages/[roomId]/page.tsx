import useDMThreadStatus from '@/hooks/useDMThreadStatus';
import ChatUI from '@ui/ChatUI';
import React from 'react';

export default async function Page({ params }: { params: { roomId: string} }) {
  const { roomId} = await params;


  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* roomId를 클라이언트 컴포넌트로 전달 */}
        <ChatUI  roomId={roomId} />
      </main>
    </>
  );
}

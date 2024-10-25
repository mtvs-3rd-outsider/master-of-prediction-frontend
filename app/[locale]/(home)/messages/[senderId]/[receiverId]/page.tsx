"use client"
import useDMThreadStatus from '@/hooks/useDMThreadStatus';
import DMChatUI from '@ui/DMChatUI';
import React from 'react';

export default function Page({ params }: { params: { senderId: string, receiverId: string } }) {
  const { senderId, receiverId } = params;


  return (
    <>
      <main className="col-span-5 w-full border-x border-slate-200">
        {/* roomId를 클라이언트 컴포넌트로 전달 */}
        <DMChatUI  senderId={senderId} receiverId={receiverId} />
      </main>
    </>
  );
}

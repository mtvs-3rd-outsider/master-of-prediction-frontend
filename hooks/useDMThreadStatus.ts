import { useEffect } from 'react';
import axios from 'axios';
import apiClient from '@handler/fetch/axios';

interface DMThreadKey {
  senderId: number;
  receiverId: number;
}

const useDMThreadStatus= (senderId: number, receiverId: number)=> {
  useEffect(() => {
    const threadKey: DMThreadKey = { senderId, receiverId };

    // 사용자 접속 상태 전송
    const joinThread = async () => {
      try {
        await apiClient.post('/dmthreads/join', threadKey);
      } catch (error) {
        console.error('Failed to join DM thread:', error);
      }
    };

    // 사용자 접속 종료 상태 전송
    const leaveThread = async () => {
      try {
        await apiClient.post('/dmthreads/leave', threadKey);
      } catch (error) {
        console.error('Failed to leave DM thread:', error);
      }
    };
    joinThread();
    // 컴포넌트가 언마운트될 때 DM 쓰레드에서 나가는 처리
    return () => {
      leaveThread();
    };
  }, [senderId, receiverId]);
}

export default useDMThreadStatus;

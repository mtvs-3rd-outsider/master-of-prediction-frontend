import apiClient from '@handler/fetch/axios';

// 함수의 매개변수 및 반환 타입 정의
const markMessageAsRead = async (senderId: number, receiverId: number): Promise<void> => {
  try {
    await apiClient.post('/dmthreads/read', { senderId, receiverId });
    console.log('Marked message as read');
  } catch (error) {
    console.error('Failed to mark message as read:', error);
  }
};

export default markMessageAsRead;
// updateLastMessage 함수 정의
export const updateLastMessage = async (senderId: number, receiverId: number, lastMessage: string) => {
    try {
      await apiClient.post('/dmthreads/update-message', {
        senderId,
        receiverId,
        lastMessage,
      });
    } catch (error) {
      console.error('Failed to update last message:', error);
    }
  };
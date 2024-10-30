
// 메시지 및 유저 타입 정의
export type User = {
  name?: string;
  userName?: string;
    avatarImageLink?: string;
    id: string | undefined;
  };
  export  interface ChatUIProps {
  
    receiverId: string; // receiverId도 string 또는 number일 수 있음
    senderId:string;
  }
  export type Message = {
    content: string;
    user: User;
    sent: string; // ISO 포맷의 날짜 문자열
    roomId: number;
    replyToMessageId: number |null,
    contentType: string
  };
  
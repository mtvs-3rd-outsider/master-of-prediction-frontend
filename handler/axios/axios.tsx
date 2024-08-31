import axios from 'axios';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL:  process.env.NEXT_PUBLIC_API_BASE_URL,  // API origin으로 설정
  withCredentials: true,  // 인증 정보가 필요할 경우
  headers: {
    'Content-Type': 'application/json',
    // 기타 공통 헤더를 여기에 추가 가능
  },
});

export default apiClient;

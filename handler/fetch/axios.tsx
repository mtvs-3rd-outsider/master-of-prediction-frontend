import axios from 'axios';
import useUserStore from '@store/useUserStore'; // Zustand 스토어 가져오기

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,  // API origin으로 설정
  withCredentials: true,  // 인증 정보가 필요할 경우
  headers: {
    'Content-Type': 'application/json',  // 기본은 JSON
  },
});

export default apiClient;

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userInfo?.token; // Zustand에서 토큰 가져오기

    if (token) {
      // 토큰이 있으면 Authorization 헤더 추가
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // 토큰이 없으면 Authorization 헤더를 제거
      delete config.headers['Authorization'];
    }

    return config;
  },
  (error) => {
    // 요청 오류가 발생한 경우 작업 수행
    return Promise.reject(error);
  }
);
// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  response => {
    // 응답 데이터를 처리하기 전에 작업 수행
    return response;
  },
  error => {
    // 응답 에러를 전역적으로 처리
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'Something went wrong';

      // 에러 상태 코드에 따라 적절한 조치를 취합니다.
      if (status === 401) {
        alert('Unauthorized access, please log in again.');
      } else if (status === 403) {
        alert('You do not have permission to perform this action.');
      } else if (status === 500) {
        alert('Internal server error, please try again later.');
      } else {
        alert(message);
      }
    } else if (error.request) {
      alert('No response from server, please check your network.');
    } else {
      alert('Error in setting up request: ' + error.message);
    }

    return Promise.reject(error); // 에러를 다시 던져 특정 컴포넌트에서 추가 처리 가능
  }
);

// 특정 요청을 보낼 때 headers 설정을 동적으로 변경하는 예시
export const sendMultipartForm = async (url: string, formData: FormData, method: 'post' | 'put') => {
  return apiClient({
    method: method,  // 메서드를 동적으로 설정 ('post' 또는 'put')
    url: url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

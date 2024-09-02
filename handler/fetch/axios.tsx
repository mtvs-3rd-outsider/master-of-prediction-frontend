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

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
  config => {
    // 요청을 보내기 전에 작업 수행 (예: 토큰 추가)
    return config;
  },
  error => {
    // 요청 오류가 발생한 경우 작업 수행
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    // 응답 데이터를 처리하기 전에 작업 수행
    return response;
  },
  error => {
    // 응답 에러를 전역적으로 처리
    if (error.response) {
      // 서버 응답이 있고, HTTP 상태 코드는 2xx 범위 이외의 경우
      const status = error.response.status;
      const message = error.response.data.message || 'Something went wrong';

      // 에러 상태 코드에 따라 적절한 조치를 취합니다.
      if (status === 401) {
        // 예: 인증 에러 - 로그아웃 처리
        // authService.logout();
        alert('Unauthorized access, please log in again.');
      } else if (status === 403) {
        // 예: 권한 부족 에러
        alert('You do not have permission to perform this action.');
      } else if (status === 500) {
        // 예: 서버 에러
        alert('Internal server error, please try again later.');
      } else {
        // 기타 에러 처리
        alert(message);
      }
    } else if (error.request) {
      // 요청이 만들어졌지만 응답을 받지 못한 경우
      alert('No response from server, please check your network.');
    } else {
      // 요청을 설정하는 동안 문제가 발생한 경우
      alert('Error in setting up request: ' + error.message);
    }

    return Promise.reject(error); // 에러를 다시 던져 특정 컴포넌트에서 추가 처리 가능
  }
);
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

 async function fetchWithBaseURL(endpoint: string, options: RequestInit = {}) {
    const url = `${baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,  // 예: 인증 토큰 추가
    };
  
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return response.json();
  }
  export default fetchWithBaseURL;
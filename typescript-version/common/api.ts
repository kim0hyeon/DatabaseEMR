import axios from 'axios';

const http = axios.create({
  baseURL: 'http://yunsseong.uk',
});

// 요청 인터셉터 추가
http.interceptors.request.use(function (config) {
  const token = sessionStorage.getItem('token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, function (error) {
  // 요청 오류가 있는 경우
  return Promise.reject(error);
});

export default http;

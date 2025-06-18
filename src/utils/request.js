import axios from 'axios';

const service = axios.create({
  baseURL: '/api', // 所有的请求都会自动加上 /api 前缀
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在这里可以添加一些请求头，例如 token
    // config.headers['Authorization'] = 'Bearer ' + getToken();
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 这里可以根据后端返回的 code 进行统一的错误处理
    // if (res.code !== 20000) {
    //   ElMessage.error(res.message || 'Error');
    //   return Promise.reject(new Error(res.message || 'Error'));
    // }
    return res;
  },
  error => {
    console.log('err ' + error); // for debug
    // ElMessage.error(error.message);
    return Promise.reject(error);
  }
);

export default service; 
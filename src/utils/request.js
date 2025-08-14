import axios from 'axios'

const baseURL = 'http://localhost:3000'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  withCredentials: true, // 关键：允许携带 Cookie
  timeout: 10000
})
// 请求拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  console.error('请求拦截器出错:', error)

  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  
  if (response.data.code === 200) {
    // console.log('响应数据:', response);
    return response
  }

  console.error('响应码非0:', response.data)

  return Promise.reject(response.data)
}, function (error) {
  // 对响应错误做点什么
  console.error('响应拦截器出错:', error)

  // if (error.response?.status === 401) {
  // }
  return Promise.reject(error)
})

export default instance
export { baseURL }
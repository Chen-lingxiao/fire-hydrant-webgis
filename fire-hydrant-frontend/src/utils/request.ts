import axios from 'axios'
// import { useUserStore } from '@/stores/index'
import router from '@/router'
const request = axios.create({
  baseURL: 'http://localhost:8080', // 基础路径
  timeout: 5000, // 请求超时时间
  headers: {
    // 请求头
    'Content-Type': 'application/json', // 默认请求头
  },
  withCredentials: true, // 核心：允许跨域请求携带Cookie
})
// 请求拦截器
// 删除请求拦截器中的Token添加逻辑（不再需要手动设置Authorization头）
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // // 添加token 从用户userStore中获取
    // const userStore = useUserStore()
    // if (userStore.token) {
    //   config.headers.Authorization = userStore.token
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    ElMessage.error('请求错误，请稍后再试')
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败，请稍后再试')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return response
  },
  (error) => {
    // 对响应错误做点什么
    // 特殊情况 权限不足 token过期
    if (error.response && error.response.status === 401) {
      ElMessage.error('登录已过期，请重新登录')
      // const userStore = useUserStore()
      // userStore.setToken('') // 清空token
      // 可选：跳转到登录页
      router.push('/login')
    }
    ElMessage.error('服务器响应错误')
    return Promise.reject(error)
  }
)
export default request

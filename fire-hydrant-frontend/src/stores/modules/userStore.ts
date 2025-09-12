import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 用户信息类型定义
interface UserInfo {
  id: number
  name: string
  sex: string
  birthDate: string
  department: string
  telephone: string
  email: string
  role: string
}
//
// 用户模块
export const useUserStore = defineStore(
  'user',
  () => {
    // 移除token相关代码：
    // 存储用户信息
    const userInfo = ref<UserInfo | null>(null)
    // 存储token
    // const token = ref('')
    // 计算属性：从用户信息中获取权限信息
    const role = computed(() => {
      return userInfo.value?.role || ''
    })
    // 判断是否登录
    const isLogin = computed(() => {
      // 登录状态可通过用户信息是否存在判断，或后端接口返回
      return !!userInfo.value
    })
    // 设置用户信息
    const setUserInfo = (info: UserInfo) => {
      userInfo.value = info
    }

    // // 设置token
    // const setToken = (t: string) => {
    //   token.value = t
    // }

    // 清除用户信息（退出登录）
    const clearUserInfo = () => {
      userInfo.value = null
      // token.value = ''
    }

    // 判断是否为管理员
    const isAdmin = () => {
      return role.value === 'ADMIN'
    }

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogin,
      isAdmin,
    }
  },
  {
    // 开启持久化存储，刷新页面后仍保留状态
    persist: {
      // 移除token的持久化配置，仅持久化用户信息（非敏感数据）
      key: 'user-store',
      storage: localStorage,
    },
  }
)

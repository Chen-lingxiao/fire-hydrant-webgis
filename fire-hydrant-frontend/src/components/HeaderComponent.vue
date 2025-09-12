<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index'
import { User } from '@element-plus/icons-vue'
import request from '@/utils/request'
const userStore = useUserStore()
const route = useRoute() // 获取当前路由信息
const router = useRouter() // 用于编程式导航
// 计算属性：应该激活的顶级菜单项
const activeMenu = computed(() => {
  const path = route.path
  if (path.includes('/map')) {
    return '/map'
  } else if (path.includes('/dashboard')) {
    return '/dashboard'
  } else if (path.includes('/user')) {
    return '/user'
  } else {
    return path
  }
})
// 退出登录
// 调用后端退出接口，由后端清除Cookie
// const logout = () => {
//   userStore.clearUserInfo() // 清空用户信息
//   // 跳转到登录页面
//   router.push('/login')
// }
// 退出登录方法
const logout = async () => {
  try {
    // 调用后端退出接口，由后端清除Cookie
    await request.post('/users/logout')
    userStore.clearUserInfo()
    router.push('/login')
    ElMessage.success('退出成功')
  } catch (error) {
    ElMessage.error('退出失败', error)
  }
}
const toInfo = () => {
  router.push(`/user/${userStore.userInfo?.id}`)
}
const toRepwd = () => {
  router.push('/user/repassword')
}
</script>
<template>
  <header class="header">
    <!-- logo -->
    <div class="header-logo">
      <img src="../assets/icons/logo.png" alt="" />
      <span class="logo-text">市政消防栓管理系统</span>
      <span class="logo-version">0.0.1</span>
    </div>
    <!-- 菜单栏 -->
    <div class="header-nav">
      <el-menu mode="horizontal" :default-active="activeMenu" router>
        <el-menu-item index="/map">首页</el-menu-item>
        <el-menu-item index="/dashboard">控制台</el-menu-item>
        <!-- 主题开关（示例：控制深色模式） -->
        <!-- <div class="header-actions">
          <theme-toggle></theme-toggle>
        </div> -->
        <el-dropdown>
          <div class="user-info">
            <div class="user-icon">
              <el-icon color="#fff" :size="24"><User /></el-icon>
            </div>
            <div class="user-name">
              <p>{{ userStore.userInfo?.name }}</p>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="toInfo()">基本资料</el-dropdown-item>
              <el-dropdown-item @click="toRepwd()">重置密码</el-dropdown-item>
              <el-dropdown-item @click="logout()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-menu>
    </div>
  </header>
</template>

<style>
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  position: relative;
  z-index: 10;
}

.header-logo {
  display: flex;
  align-items: center;
}

.header-logo img {
  width: 40px;
  margin-right: 10px;
}

.header-logo .logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.header-logo .logo-version {
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

/* 导航栏 */
.header-nav {
  margin-right: 10px;
  width: 350px;
}
.el-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
}
.el-dropdown .user-info {
  display: flex;
  align-items: center;
}
.el-dropdown .user-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #409eff;
  margin-right: 8px;
}

.el-dropdown .user-icon .el-icon {
  /* 居中 */
  height: 100%;
  width: 100%;
}
.el-dropdown .user-name {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
</style>

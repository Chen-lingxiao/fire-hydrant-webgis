import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'
import { ElMessage } from 'element-plus'

// 创建路由实例
const router = createRouter({
  // 使用HTML5历史模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由配置
  routes: [
    // 首页路由
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/Index.vue'),
      redirect: '/login', // 重定向到登录页
      children: [
        // 用户页面路由
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user/UserPage.vue'),
          redirect: '/user/info', // 重定向到用户信息页
          children: [
            // 用户信息页面
            {
              path: '/user/info',
              name: 'UserInfo',
              component: () => import('@/views/user/children/UserInfo.vue'),
            },
            // 修改密码页面
            {
              path: '/user/repassword',
              name: 'UserRePassword',
              component: () => import('@/views/user/children/UserResetPwd.vue'),
            },
          ],
        },
        // 控制台页面路由
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/DashboardPage.vue'),
          meta: { requiresAdmin: true }, // 需要管理员权限
          redirect: '/dashboard/user', // 重定向到用户管理页
          children: [
            // 用户管理页面
            {
              path: '/dashboard/user',
              name: 'UserInfoTable',
              component: () =>
                import('@/views/dashboard/children/UserInfoManage.vue'),
            },
            // 消防栓信息页面
            {
              path: '/dashboard/firehydrant',
              name: 'FireHydrantInfoTable',
              component: () =>
                import('@/views/dashboard/children/FireHydrantInfoTable.vue'),
            },
          ],
        },
        // 地图页面路由
        {
          path: '/map',
          name: 'map',
          component: () => import('@/views/map/MapPage.vue'),
        },
      ],
    },
    // 登录页面路由
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginPage.vue'),
    },
  ],
})

// 路由守卫 - 在每次路由跳转前执行
router.beforeEach((to, from, next) => {
  // 获取用户状态管理实例
  const userStore = useUserStore()

  // 判断目标路由是否需要登录
  const needLogin = to.path !== '/login'

  if (needLogin && !userStore.isLogin()) {
    // 需要登录但未登录，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && userStore.isLogin()) {
    // 已登录但访问登录页，跳转到地图页
    next('/map')
  } else if (to.matched.some((record) => record.meta.requiresAdmin)) {
    // 访问需要管理员权限的页面
    if (userStore.isAdmin()) {
      // 是管理员，正常访问
      next()
    } else {
      // 不是管理员，提示无权限并跳转到地图页
      ElMessage.error('无权限访问该页面')
      next('/map')
    }
  } else {
    // 其他情况，正常访问
    next()
  }
})

// 导出路由实例
export default router

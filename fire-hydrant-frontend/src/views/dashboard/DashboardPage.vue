<script setup lang="ts">
const NavList = [
  {
    title: '数据管理',
    subNav: [
      { navItem: '/dashboard/user', navName: '用户信息表' },
      { navItem: '/dashboard/firehydrant', navName: '消防栓信息表' },
    ],
  },
  {
    title: '系统设置',
    subNav: [],
  },
]
</script>

<template>
  <div class="layout">
    <!-- 左侧导航 - 200px宽度 -->
    <div class="nav">
      <!-- 通过 props 传递数据 -->
      <navigation-component :navList="NavList"></navigation-component>
    </div>
    <!-- 右侧内容区域 - 填充剩余空间 -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
.layout {
  height: 100%;
  display: flex;
  background-color: #f5f5f5;
}

.nav {
  width: 200px;
  background-color: #ffffff;
}
</style>

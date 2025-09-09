<script lang="ts" setup></script>
<template>
  <div class="common-layout">
    <!-- 头部 -->
    <header-component></header-component>
    <!-- 主体部分 -->
    <div class="container">
      <!-- 路由占位符 决定放地图 /用户界面 -->
      <router-view></router-view>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <p>Copyright © 2025 陈凌霄 用于webgis学习</p>
    </div>
  </div>
</template>
<style scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  /* 垂直方向 */
}

.container {
  flex: 1;
  /* 填充剩余空间 */
  overflow: hidden;
}

/* 浮动在底部 */
.footer {
  /* 浮动 */
  position: absolute;
  bottom: 1px;
  width: 100%;
  font-size: 12px;
  text-align: center;
}
</style>

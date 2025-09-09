<script setup lang="ts">
console.log('Hello World!')
</script>

<template>
  <div class="header">
    <h3>个人信息</h3>
  </div>
  <div class="main">
    <div class="aside">
      <el-menu>
        <el-menu-item index="/user/info">基本资料</el-menu-item>
        <el-menu-item index="/user/page">重置密码</el-menu-item>
      </el-menu>
    </div>
    <router-view></router-view>
  </div>
</template>
<style scoped>
.header {
  width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.main {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 20px 50px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.el-menu {
  border-right: none;
  width: 150px;
  height: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.aside {
  display: flex;
  width: 200px;
}
</style>

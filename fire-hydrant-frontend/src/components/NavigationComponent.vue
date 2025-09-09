<script lang="ts" setup>
import { defineProps } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 子菜单
interface subNavNavItem {
  navItem: string
  navName: string
}
// 菜单列表
interface NavList {
  title: string
  subNav: subNavNavItem[]
}
// 接收父组件传递的参数
const props = defineProps<{
  navList: NavList[]
}>()
</script>
<template>
  <el-menu
    :default-active="route.path"
    router
    class="el-menu-vertical-demo"
    :unique-opened="true"
  >
    <el-sub-menu :index="i + ''" v-for="(item, i) in props.navList" :key="i">
      <template #title>
        <span>{{ item.title }}</span>
      </template>
      <el-menu-item
        :index="nav.navItem"
        v-for="(nav, j) in item.subNav"
        :key="j"
      >
        {{ nav.navName }}
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<style scoped></style>

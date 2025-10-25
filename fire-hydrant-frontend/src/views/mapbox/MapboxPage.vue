<script setup lang="ts">
import { ref } from 'vue'
import MapComponent from '@/components/MapComponent.vue'

// 获取地图组件实例
const mapComponentRef = ref<InstanceType<typeof MapComponent> | null>(null)

// 处理重置地图事件
const handleResetMap = () => {
  // 调用地图组件的重置方法
  if (mapComponentRef.value) {
    mapComponentRef.value.resetMapView()
  }
}
</script>

<template>
  <div class="map-page">
    <!-- 地图 -->
    <map-component ref="mapComponentRef"></map-component>

    <map-toolbar @reset-map="handleResetMap"></map-toolbar>
    <!-- 地图信息 -->
    <map-info></map-info>
  </div>
</template>

<style scoped></style>

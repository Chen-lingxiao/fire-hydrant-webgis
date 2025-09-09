<script lang="ts" setup>
import { useMapStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
const mapStore = useMapStore() // 获取store实例
const { zoomLevel, center, pitch, bearing, TiandituType, projection } =
  storeToRefs(mapStore) // 获取地图状态
console.log(center)
// 计算属性：格式化中心点坐标显示
const formattedCenter = computed(() => {
  if (!center.value) return '无数据'
  return `经度: ${center.value[0].toFixed(4)}, 纬度: ${center.value[1].toFixed(4)}`
})
</script>
<template>
  <div class="mapinfo">
    <p>缩放级别：{{ zoomLevel }}</p>
    <p>地图中心：{{ formattedCenter }}</p>
    <p>倾斜角度：{{ pitch.toFixed(4) }}</p>
    <p>旋转角度：{{ bearing.toFixed(4) }}</p>
    <p>投影方式：{{ projection }}</p>
    <p>地图样式：{{ TiandituType }}</p>
  </div>
</template>
<style scoped>
.mapinfo {
  position: absolute;
  bottom: 10px;
  left: 5px;
  background: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 20;
}
</style>

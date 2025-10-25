<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as Cesium from 'cesium'

const cesiumContainer = ref<HTMLElement | null>(null)
let viewer: Cesium.Viewer | null = null
const JNposition = Cesium.Cartesian3.fromDegrees(117.0, 36.0, 0.0)
onMounted(async () => {
  if (cesiumContainer.value) {
    viewer = new Cesium.Viewer(cesiumContainer.value, {
      terrainProvider: await Cesium.createWorldTerrainAsync(), // 使用地形(异步加载，返回一个Promise对象)
      baseLayerPicker: true, // 底图选择器
      geocoder: true, // 地名查找
      homeButton: true, // 首页按钮
      sceneModePicker: true, // 场景模式选择器
      navigationHelpButton: false, // 帮助按钮
      animation: false, // 动画控件
      timeline: false, // 时间线控件
      fullscreenButton: false, // 全屏按钮
    })
    // 飞到济南位置
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(117.0, 36.0, 1000000.0), // 济南位置，1000000米高度
      orientation: {
        heading: Cesium.Math.toRadians(0.0), // 朝向 默认北
        pitch: Cesium.Math.toRadians(-90.0), // 俯仰 默认45度
        roll: 0.0, // 旋转 默认0度
      },
    })
    // 添加一个标记点
    viewer.entities.add({
      position: JNposition,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
      },
      label: {
        text: '济南',
        font: '14pt monospace',
      },
    })
  }
})
</script>

<template>
  <!-- cesium 地图 -->
  <div ref="cesiumContainer" style="width: 100%; height: 100vh"></div>
</template>

<style scoped></style>

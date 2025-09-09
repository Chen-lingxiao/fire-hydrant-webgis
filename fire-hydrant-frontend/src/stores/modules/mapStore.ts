import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 地图相关状态
export const useMapStore = defineStore('mapStore', () => {
  // 新增：标记是否是用户直接操作地图（鼠标/手势）导致的更新
  const isUserInteraction = ref(false)
  // 定义一个mapbox空白样式
  const blankStyle = {
    version: 8,
    name: 'BlankMap',
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        paint: {
          // 'background-color': '#08294A' /* 背景颜色 */
          'background-color': 'rgba(255, 255, 255, 0)' /* 背景颜色-透明 */,
        },
      },
    ],
  }
  const initialState = {
    zoomLevel: 16, // 初始缩放级别
    center: [117.1772, 36.6826] as [number, number], // 初始中心点坐标 [经度, 纬度]
    pitch: 0, // 初始倾斜角度
    bearing: 0, // 初始旋转角度
  }
  // 定义状态
  const zoomLevel = ref(16) // 地图缩放级别
  const center = ref<[number, number]>([117.1772, 36.6826]) // 地图中心点坐标 [经度, 纬度]
  const pitch = ref(0) // 地图俯仰角度
  const bearing = ref(0) // 地图旋转角度
  const style = blankStyle // 地图样式
  const projection = ref('globe') // 地图投影方式
  // 地图类型状态
  const TiandituType = ref<'vector' | 'image'>('vector')
  // 定义计算属性
  const getMapState = computed(() => ({
    zoomLevel: zoomLevel.value,
    center: center.value,
    pitch: pitch.value,
    bearing: bearing.value,
    projection: projection.value,
  }))
  // 定义方法
  // 新增设置地图类型方法
  const setTiandituType = (newTiandituType: 'vector' | 'image') => {
    TiandituType.value = newTiandituType
  }
  // 添加fromUser参数，标记是否是用户直接操作
  const setZoomLevel = (newZoomLevel: number, fromUser = false) => {
    if (fromUser) isUserInteraction.value = true
    zoomLevel.value = newZoomLevel
    if (fromUser) {
      // 延迟重置标记，避免同步冲突
      setTimeout(() => (isUserInteraction.value = false), 0)
    }
  }
  const setPitch = (newPitch: number, fromUser = false) => {
    if (fromUser) isUserInteraction.value = true
    pitch.value = newPitch
    if (fromUser) {
      setTimeout(() => (isUserInteraction.value = false), 0)
    }
  }

  const setBearing = (newBearing: number, fromUser = false) => {
    if (fromUser) isUserInteraction.value = true
    bearing.value = newBearing
    if (fromUser) {
      setTimeout(() => (isUserInteraction.value = false), 0)
    }
  }

  const setCenter = (newCenter: [number, number], fromUser = false) => {
    if (fromUser) isUserInteraction.value = true
    center.value = newCenter
    if (fromUser) {
      setTimeout(() => (isUserInteraction.value = false), 0)
    }
  }
  const setProjection = (newProjection: string) => {
    projection.value = newProjection
  }
  return {
    // 状态
    isUserInteraction,
    zoomLevel,
    center,
    pitch,
    bearing,
    style,
    projection,
    initialState,
    // 计算属性
    getMapState,
    TiandituType,
    // 方法
    setZoomLevel,
    setCenter,
    setPitch,
    setBearing,
    setProjection,
    setTiandituType,
  }
})

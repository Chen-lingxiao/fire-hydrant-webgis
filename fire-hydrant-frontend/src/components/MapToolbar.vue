<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import { useMapStore } from '@/stores/index'
import { Event } from 'mapbox-gl'
import { Close, Operation } from '@element-plus/icons-vue'
import { debounce } from 'lodash' // 导入lodash的防抖函数

const mapStore = useMapStore()
const collapsed = ref(false) // 工具栏折叠状态
// 切换工具栏折叠状态的函数
const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}
// 底图样式选项
const options = [
  {
    value: 'vector',
    label: '矢量地图',
  },
  {
    value: 'image',
    label: '影像地图',
  },
]
// 处理缩放滑块变化的函数（明确事件类型）
const updateZoom = debounce((event: Event) => {
  if (!event.target) return // 增加空值检查
  // 将事件目标断言为 HTMLInputElement（滑块是输入框类型）
  const inputElement = event.target as HTMLInputElement
  const newZoom = Number(inputElement.value) // 获取输入值并转为数字
  mapStore.setZoomLevel(newZoom) // 调用 store 方法更新缩放级别
}, 50) // 50毫秒防抖延迟
// 处理旋转滑块变化的函数
const updateBearing = debounce((event: Event) => {
  if (!event.target) return
  const inputElement = event.target as HTMLInputElement
  const newBearing = Number(inputElement.value) // 获取输入值并转为数
  mapStore.setBearing(newBearing) // 调用 store 方法更新旋转角度
}, 50)
// 倾斜滑块变化的函数
const updatePitch = debounce((event: Event) => {
  if (!event.target) return
  const inputElement = event.target as HTMLInputElement
  const newPitch = Number(inputElement.value) // 获取输入值并转为数
  mapStore.setPitch(newPitch) // 调用 store 方法更新倾斜角度
}, 50)

// 定义要触发的事件
const emit = defineEmits(['reset-map'])
// 点击重置按钮时触发事件
const handleResetClick = () => {
  emit('reset-map')
}
</script>
<template>
  <!-- 侧边栏容器 -->
  <div class="map-toolbox">
    <!-- 折叠状态：只显示一个按钮 -->
    <div v-if="collapsed" class="collapsed-state">
      <button @click="toggleCollapse" class="expand-btn" title="展开工具栏">
        <el-icon><Operation /></el-icon>
      </button>
    </div>

    <!-- 展开状态：显示完整工具栏 -->
    <div v-else class="expanded-state">
      <div class="toolbox-header">
        <h3>地图工具</h3>
        <button @click="toggleCollapse" class="collapse-btn" title="收起工具栏">
          <el-icon><Close /></el-icon>
        </button>
      </div>

      <div class="toolbox-content">
        <!-- 视图控制组 -->
        <div class="control-group">
          <h4>视图控制</h4>

          <div class="control-item">
            <label>缩放级别: {{ mapStore.zoomLevel.toFixed(2) }}</label>
            <el-slider
              :min="1"
              :max="18"
              :step="0.5"
              v-model="mapStore.zoomLevel"
              @input="updateZoom"
            />
          </div>

          <div class="control-item">
            <label>倾斜角度: {{ mapStore.pitch.toFixed(2) }}°</label>
            <el-slider
              :min="0"
              :max="60"
              :step="1"
              v-model="mapStore.pitch"
              @input="updatePitch"
            />
          </div>

          <div class="control-item">
            <label>旋转角度: {{ mapStore.bearing.toFixed(2) }}°</label>
            <el-slider
              :min="-180"
              :max="180"
              :step="1"
              v-model="mapStore.bearing"
              @input="updateBearing"
            />
          </div>
        </div>
        <div class="control-item">
          <el-button type="primary" @click="handleResetClick"
            >重置视图</el-button
          >
        </div>
        <!-- 图层控制组 -->
        <div class="control-group">
          <h4>图层控制</h4>

          <div class="control-item">
            <label>底图样式:</label>
            <el-select
              v-model="mapStore.TiandituType"
              placeholder="选择图层"
              style="width: 240px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 侧边栏状态样式 */
.map-toolbox {
  position: absolute;
  top: 60px;
  left: 5px;
  height: calc(100vh - 60px);
  z-index: 10;
  transition: all 0.3s ease;
  opacity: 0.95;
}
/* 折叠状态样式 */
.collapsed-state {
  padding-top: 10px;
}
/* 折叠按钮样式 */
.collapsed-state .expand-btn {
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  margin-left: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 展开状态样式 */
.expanded-state {
  width: 280px;
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(5px);
  border-right: 1px solid #e0e0e0;
}
/* 工具栏头部样式 */
.toolbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.toolbox-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}
/* 折叠按钮样式 */
.toolbox-header .collapse-btn {
  width: 30px;
  height: 30px;
  color: #f7f9f7;
  background-color: #439bf5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  justify-content: center;
}
/* 工具栏内容样式 */
.toolbox-content {
  flex: 1;
  overflow-y: auto;
}
/* 控制组样式 */
.control-group {
  margin-bottom: 20px;
}
.control-group h4 {
  margin-bottom: 10px;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}
/* 控制项样式 */
.control-item {
  margin-bottom: 15px;
}
.control-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}
/* 滑块样式 */
.control-item .el-slider {
  width: 190px;
  margin-top: 5px;
  margin-left: 10px;
}
/* 下拉框样式 */
.control-item .el-select {
  width: 200px !important;
}
</style>

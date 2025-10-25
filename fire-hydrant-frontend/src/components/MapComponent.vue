引用
<script lang="ts" setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { StyleSpecification } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '@/stores/index' //导入状态管理
import { loadFeatures, editFeatures } from '@/api/geoserver' //geoserver要素API
import * as echarts from 'echarts'
// 导入 Element Plus 表单类型
import type { FormInstance } from 'element-plus'

// 导入环境变量（Vite项目）
const tiandituToken = import.meta.env.VITE_TIANDITU_TOKEN //天地图token
const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN // Mapbox token

// 地图相关状态
const mapStore = useMapStore() //使用mapStore状态管理
const mapContainer = ref<HTMLDivElement | null>(null) //地图容器引用
let map: mapboxgl.Map | null = null // Mapbox地图实例引用
const markers: mapboxgl.Marker[] = [] // 存储所有标记的数组

//GeoJSON数据 geoserver数据源
const geoJSONData = ref<GeoJSON.FeatureCollection>({
  type: 'FeatureCollection',
  features: [],
})
// 临时存储数据 存储增加、更新、删除的要素
const tempGeoJSONData = ref<GeoJSON.FeatureCollection>({
  type: 'FeatureCollection',
  features: [],
})
const selectedFeature = ref<GeoJSON.Feature | null>(null) // 当前选中的要素
const selectedFeatureCoord = ref<[number, number] | null>(null) // 当前要素经纬度
const selectedProperties = ref<HydrantProperties>({}) // 选中要素的属性表单
const tempCoordinates = ref<[number, number] | null>(null) // 临时添加要素经纬度
const showFeatureInfo = ref(false) // 是否显示要素信息对话框

const isEditingMode = ref(false) // 是否处于编辑模式
const isAddingMode = ref(false) // 是否处于添加模式
const isUpdatingMode = ref(false) // 是否处于更新模式
const isDeletingMode = ref(false) // 是否处于删除模式

const currentOptions = ref() // 当前编辑模式
const showEditFeatureDialog = ref(false) // 控制添加要素弹窗显示
// 编辑表单数据
const FeatureForm = ref({
  id: '',
  currentStatus: '',
  currentPressure: 0.0,
  managementUnit: '',
  installationDate: '',
  managementUserNo: '',
})
// 编辑表单验证规则
const FeatureFormRules = ref({
  currentPressure: [
    {
      required: true,
      type: 'number',
      message: '请输入压力值',
      trigger: 'blur',
    },
  ],
  managementUnit: [
    { required: true, message: '请输入管理单位', trigger: 'blur' },
  ],
  installationDate: [
    { required: true, message: '请选择安装日期', trigger: 'change' },
  ],
  managementUserNo: [
    { required: true, message: '请输入管理员编号', trigger: 'blur' },
  ],
})
const formRef = ref<FormInstance>() // 表单引用，明确指定类型
// 新增：处理要素点击

const echartsData = ref<{ [key: string]: number }>({}) // echarts数据
// 声明 HydrantProperties 属性信息接口（仅展示用）
interface HydrantProperties {
  id?: string
  currentStatus?: string
  currentPressure?: string
  managementUnit?: string
  managementUserNo?: string
  installationDate?: string
}

// 更新鼠标样式
const updateMapCursor = () => {
  if (!map) return
  //编辑、添加、删除、更新、默认
  if (isEditingMode.value) {
    map.getCanvas().style.cursor = 'default' //箭头
    if (isAddingMode.value) {
      map.getCanvas().style.cursor = 'crosshair' // 添加十字准星
    }
    if (isDeletingMode.value) {
      map.getCanvas().style.cursor = 'default' // 删除，箭头样式
    }
    if (isUpdatingMode.value) {
      map.getCanvas().style.cursor = '' // 更新
    }
  } else {
    map.getCanvas().style.cursor = '' // 默认
  }
}

// 事件：点击"开始编辑"按钮
const handleEditClick = async () => {
  const newEditingState = !isEditingMode.value // 计算新的编辑状态
  if (newEditingState) {
    ElMessage.success('当前状态: 启动编辑模式')
    isEditingMode.value = newEditingState // 设置新状态
  } else {
    // 如果正在添加模式，询问是否取消添加
    if (isAddingMode.value) {
      try {
        await ElMessageBox.confirm(
          '当前正在添加要素，退出将丢失未保存的更改，是否确认退出？',
          '确认退出',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        console.log('点击了确认退出按钮')
        isAddingMode.value = false // 停止添加模式
        resetEditData()
        isEditingMode.value = newEditingState // 设置新状态
      } catch {
        console.log('点击了取消按钮')
        // 用户取消操作，不退出编辑模式，保持原有状态
        return
      }
      // 如果正在更新模式，询问是否取消添加
    } else if (isUpdatingMode.value) {
      try {
        await ElMessageBox.confirm(
          '当前正在更新要素，退出将丢失未保存的更改，是否确认退出？',
          '确认退出',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        console.log('点击了确认退出按钮')
        isUpdatingMode.value = false
        resetEditData() // 停止更新模式
        isEditingMode.value = newEditingState // 设置新状态
      } catch {
        console.log('点击了取消按钮')
        // 用户取消操作，不退出编辑模式，保持原有状态
        return
      }
      // 如果正在删除模式，询问是否取消添加
    } else if (isDeletingMode.value) {
      try {
        await ElMessageBox.confirm(
          '当前正在删除要素，退出将丢失未保存的更改，是否确认退出？',
          '确认退出',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        console.log('点击了确认退出按钮')
        isDeletingMode.value = false
        resetEditData() // 停止删除模式
        isEditingMode.value = newEditingState // 设置新状态
      } catch {
        console.log('点击了取消按钮')
        // 用户取消操作，不退出编辑模式，保持原有状态
        return
      }
    } else {
      isEditingMode.value = newEditingState // 设置新状态
      ElMessage.error('当前状态: 关闭编辑模式')
      loadGeoJSONData()
    }
  }
  updateMapCursor() // 更新鼠标样式
}
const resetEditData = () => {
  // 1. 清空添加模式下的临时要素数据
  if (tempGeoJSONData.value.features.length > 0) {
    tempGeoJSONData.value.features = []
  }
  // 2. 清空添加时存储的临时坐标
  tempCoordinates.value = null
  // 3. 关闭可能未关闭的要素编辑弹窗
  if (showEditFeatureDialog.value) {
    showEditFeatureDialog.value = false
  }
  // 4. 清空更新模式下的要素选中状态
  selectedFeature.value = null
  selectedFeatureCoord.value = null
  selectedProperties.value = {} as HydrantProperties // 按接口类型重置空对象
  // 5. 重新加载原始数据，确保地图显示与正式数据源一致
  loadGeoJSONData()
}
// 事件：点击添加按钮
const handleAddClick = () => {
  isAddingMode.value = !isAddingMode.value // 切换添加状态
  if (isAddingMode.value) {
    ElMessage.primary('请在地图上点击添加新点')
    currentOptions.value = 'insert'
    isUpdatingMode.value = false
    isDeletingMode.value = false
    resetEditData()
  } else {
    isAddingMode.value = false // 关闭添加模式
  }
  updateMapCursor() // 同步光标
}

// 方法：点击更新按钮
const handleUpdateClick = async () => {
  isUpdatingMode.value = !isUpdatingMode.value
  if (isUpdatingMode.value) {
    ElMessage.primary('请在地图上点击需要修改的要素')
    isAddingMode.value = false
    isDeletingMode.value = false
    currentOptions.value = 'update'
    resetEditData()
  } else {
    ElMessage.success('已停止更新模式')
    isUpdatingMode.value = false
    // 停止更新模式
  }
  updateMapCursor()
}

// 方法：点击删除按钮
const handleDeleteClick = async () => {
  isDeletingMode.value = !isDeletingMode.value
  if (isDeletingMode.value) {
    ElMessage.primary('请在地图上点击需要删除的要素')
    currentOptions.value = 'delete'
    isAddingMode.value = false // 停止添加模式
    isUpdatingMode.value = false // 停止更新模式
    resetEditData() // 重置编辑数据
  } else {
    isDeletingMode.value = false // 停止删除模式
  }
  updateMapCursor()
}
// 方法：创建单个marker标记
const creatMarker = (feature: GeoJSON.Feature): mapboxgl.Marker | null => {
  let coordinates: [number, number] | null = null // 初始化坐标变
  // 处理MultiPoint类型
  if (
    feature.geometry.type === 'MultiPoint' &&
    feature.geometry.coordinates.length > 0
  ) {
    // 使用第一个点作为标记位置
    coordinates = feature.geometry.coordinates[0] as [number, number]
  }
  // 处理Point类型
  else if (feature.geometry.type === 'Point') {
    coordinates = feature.geometry.coordinates as [number, number]
  }

  if (!coordinates) {
    console.log('无法从要素中提取坐标:', feature)
    return null
  }
  // 创建自定义HTML元素作为标记
  const markerHtml = document.createElement('div')
  markerHtml.className = 'custom-marker' // 自定义样式类
  // 根据currentStatus属性设置不同颜色
  // normal、Abnormal、Error

  markerHtml.style.backgroundColor =
    feature.properties?.currentStatus === 'Abnormal'
      ? '#FFC107'
      : feature.properties?.currentStatus === 'Error'
        ? '#F44336'
        : '#4CAF50'
  markerHtml.textContent = `ID:${feature.id} ` // 显示要素ID
  const marker = new mapboxgl.Marker({
    element: markerHtml,
    anchor: 'bottom',
  })
    .setLngLat(coordinates)
    .addTo(map as mapboxgl.Map)
  // 添加自定义属性存储feature.id，通过HTMLElement的dataset属性
  marker.getElement().dataset.featureId = String(feature.id)
  return marker
}
// 方法：加载GeoJSON数据
const loadGeoJSONData = async () => {
  try {
    const data = await loadFeatures() // 从GeoServer加载数据
    // 遍历循环，分割id fire_hydrants.1 --> 1
    data.features.forEach((feature: GeoJSON.Feature) => {
      if (feature.id) {
        const idParts = String(feature.id).split('.')
        feature.id = idParts.length > 1 ? idParts[1] : feature.id
      }
      if (feature.properties?.installationDate) {
        // 移除末尾的 Z（如果存在）
        feature.properties.installationDate =
          feature.properties.installationDate.replace('Z', '')
      }
    })
    geoJSONData.value = data
    console.log('加载GeoJSON数据成功', data)
    // 添加数据到地图
    addGeoJSONToMap()
  } catch (error) {
    console.error('加载GeoJSON数据出错:', error)
    ElMessage.error('加载数据失败，请稍后重试')
  }
}
// 方法：将GeoJSON数据和图层添加到地图
const addGeoJSONToMap = () => {
  if (!map) return
  // 使用统一的清理方法
  cleanupMapLayersAndSources()
  // 添加数据源
  map.addSource('hydrants', {
    type: 'geojson',
    data: geoJSONData.value,
    cluster: false,
  })
  // 清除markers数组中的旧标记
  if (markers.length > 0) {
    markers.forEach((marker) => marker.remove())
    markers.length = 0 // 清空数组
  }
  // 添加图层
  map.addLayer({
    id: 'hydrants-layer',
    type: 'circle',
    source: 'hydrants',
    paint: {
      'circle-radius': 8,
      // 根据currentStatus属性设置不同颜色
      'circle-color': [
        'match',
        ['get', 'currentStatus'], // 获取currentStatus属性值
        'normal',
        '#4CAF50', // 正常状态 - 绿色
        'Abnormal',
        '#FFC107', // 异常状态 - 黄色
        'Error',
        '#F44336', // 错误状态 - 红色
        '#9E9E9E', // 默认颜色 - 灰色（如果属性值不在上述列表中）
      ],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff',
    },
  })
  // 遍历属性currentStatus统计数据
  const statusCounts = {
    normal: 0,
    Abnormal: 0,
    Error: 0,
  }
  // 为每个要素创建并存储marker
  geoJSONData.value.features.forEach((feature: GeoJSON.Feature) => {
    if (
      feature.geometry.type === 'Point' ||
      feature.geometry.type === 'MultiPoint'
    ) {
      const status = feature.properties?.currentStatus
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++
      }
      echartsData.value = {
        normal: statusCounts.normal,
        Abnormal: statusCounts.Abnormal,
        Error: statusCounts.Error,
      }
      const marker = creatMarker(feature)
      // 只有成功创建标记时才添加到数组和地图
      if (marker) {
        // 给marker添加自定义属性存储feature.id
        markers.push(marker)
      }
    }
  })
  // 更新 echarts 图表数据
  updateECharts()
}

// 映射要素属性值
const mapFeatureProperties = (
  selectedFeature: GeoJSON.Feature
): HydrantProperties => {
  const properties = selectedFeature.properties
  // 根据不同properties?.currentStatus映射不同的显示值
  const statusMap: { [key: string]: string } = {
    normal: '正常',
    Abnormal: '异常',
    Error: '错误',
  }

  const displayStatus = properties?.currentStatus
    ? statusMap[properties.currentStatus] || properties.currentStatus
    : undefined

  return {
    id: String(selectedFeature.id || ''),
    currentStatus: displayStatus,
    currentPressure: properties?.currentPressure,
    managementUnit: properties?.managementUnit,
    installationDate: properties?.installationDate,
    managementUserNo: properties?.managementUserNo,
  }
}
// 获取点击的要素
const GetClickFeature = async (e: mapboxgl.MapMouseEvent) => {
  const features = e.features
  if (features && features.length > 0) {
    selectedFeature.value = features[0] as GeoJSON.Feature
    // 修复类型推断过深的问题
    selectedProperties.value = mapFeatureProperties(selectedFeature.value)
    const geometry = selectedFeature.value?.geometry
    if (geometry && geometry.type === 'Point') {
      selectedFeatureCoord.value = geometry.coordinates as [number, number]
    }
    map?.flyTo({
      center: selectedFeatureCoord.value as [number, number],
      zoom: 17,
    })
  }
}

// 处理 点击要素查看信息
const handleFeatureClickForInfo = (e: mapboxgl.MapMouseEvent) => {
  GetClickFeature(e) // 获取点击的要素
  console.log('当前点击要素:', selectedFeature.value)
  console.log('当前点击要素属性:', selectedProperties.value)
}
// 处理点击要素添加
const handleFeatureClickForAdd = async (e: mapboxgl.MapMouseEvent) => {
  if (!map || !isAddingMode.value) return // 非添加模式不执行

  // 1. 获取点击位置的经纬度（Mapbox 坐标格式）
  tempCoordinates.value = e.lngLat.toArray() as [number, number]

  // 3. 重置表单（清空旧数据）
  FeatureForm.value = {
    id: '',
    currentStatus: '',
    currentPressure: 0.0,
    managementUnit: '',
    installationDate: '',
    managementUserNo: '',
  }
  // 3.显示弹窗
  showEditFeatureDialog.value = true
  console.log('当前编辑状态:', currentOptions.value)
}
// 处理 点击要素更新
const handleFeatureClickForUpdate = async (e: mapboxgl.MapMouseEvent) => {
  if (!map || !isUpdatingMode.value) return // 非更新模式不执行
  GetClickFeature(e)
  console.log('当前点击更新要素:', selectedFeature.value)
  console.log('当前点击更新要素属性:', selectedProperties.value)
  // 重置表单数据为当前选中要素属性，并显示弹窗
  if (selectedFeature.value) {
    FeatureForm.value = {
      id: String(selectedFeature.value.id || ''),
      currentStatus: selectedProperties.value.currentStatus || '',
      currentPressure:
        Number(selectedFeature.value.properties?.currentpressure) || 0,
      managementUnit: selectedProperties.value.managementUnit || '',
      installationDate: selectedProperties.value.installationDate || '',
      managementUserNo: selectedProperties.value.managementUserNo || '',
    }
    showEditFeatureDialog.value = true
    console.log('当前编辑状态:', currentOptions.value)
  }
}
// 处理点击要素删除
const handleFeatureClickForDelete = async (e: mapboxgl.MapMouseEvent) => {
  if (!isDeletingMode.value) return // 非删除模式下不处理
  GetClickFeature(e)
  try {
    await ElMessageBox.confirm(
      '是否确认删除要素id :' + selectedFeature.value?.id,
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    console.log('点击了确认按钮')
    HandleDeleteFeature()
  } catch {
    console.log('点击了取消按钮')
    // 用户取消操作，不退出编辑模式，保持原有状态
    return
  }
  console.log('当前点击删除要素完整信息:', selectedFeature.value)
  console.log('当前点击删除属性:', selectedProperties.value)
}

// 处理 删除要素表单提交
const HandleDeleteFeature = async () => {
  if (!selectedFeature.value) return
  // 1. 删除的要素
  const deleteFeature: GeoJSON.Feature = {
    type: 'Feature',
    id: selectedFeature.value.id, // 正式数据对应 ID
    geometry: selectedFeature.value.geometry,
    properties: {
      // 表单数据映射到要素属性
      currentStatus: FeatureForm.value.currentStatus,
      currentPressure: FeatureForm.value.currentPressure,
      managementUnit: FeatureForm.value.managementUnit,
      installationDate: FeatureForm.value.installationDate,
      managementUserNo: FeatureForm.value.managementUserNo,
    },
  }
  // 2. 更新临时数据并刷新地图
  tempGeoJSONData.value.features.push(deleteFeature)
  // 4. 删除要素删除marker
  tempGeoJSONData.value.features.forEach((feature: GeoJSON.Feature) => {
    // 根据自定义属性匹配marker id
    if (markers.length > 0) {
      markers.forEach((marker) => {
        if (marker.getElement().dataset.featureId === String(feature.id)) {
          marker.remove()
        }
      })
    }
  })
  // 5. 更新地图渲染：合并原始数据和临时数据，确保所有要素都显示在地图上
  const source = map?.getSource('hydrants')
  if (source && 'setData' in source) {
    const allFeatures: GeoJSON.Feature[] = [...geoJSONData.value.features] // 创建一个包含所有要素的新数据集

    const deleteFeatureIds = tempGeoJSONData.value.features.map((f) => f.id) // 遍历提取每一个删除元素id属性值
    // 过滤掉包含删除元素id对应的元素
    const filteredFeatures = allFeatures.filter(
      (feature) => !deleteFeatureIds.includes(feature.id)
    )
    // 添加原始未修改的要素和已修改的要素
    const combinedData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [...filteredFeatures, ...tempGeoJSONData.value.features],
    }
    ;(source as mapboxgl.GeoJSONSource).setData(combinedData)
  }
  // 6. 交互反馈：关闭弹窗，提示用户“需点击保存提交更改”
  ElMessage.success('修改成功，点击保存提交更改')
  showEditFeatureDialog.value = false
  updateMapCursor()
}

// 处理表单提交
const handleFeatureFormSubmit = async (operation: 'insert' | 'update') => {
  // 1. 表单验证：调用 Element Plus 表单验证方法，不通过则终止
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (error) {
    console.error('表单验证失败:', error)
    return
  }
  if (operation === 'insert') {
    handleAddFeatureFormSubmit()
  } else if (operation === 'update') {
    handleUpdateFeatureFormSubmit()
  }
  updateMapCursor()
}

// 处理添加要素表单提交
const handleAddFeatureFormSubmit = async () => {
  console.log('点击了添加提交:')
  if (!tempCoordinates.value) {
    ElMessage.error('请先在地图上选择位置')
    return
  }
  // 1. 创建临时要素：生成临时 ID（时间戳避免冲突），构造 GeoJSON 格式
  const newFeature: GeoJSON.Feature = {
    type: 'Feature',
    id: `temp_${Date.now()}`, // 临时 ID：避免与正式数据 ID 冲突
    geometry: { type: 'MultiPoint', coordinates: [tempCoordinates.value] }, // 几何类型为多点（取第一个点）
    properties: {
      // 表单数据映射到要素属性
      currentStatus: FeatureForm.value.currentStatus,
      currentPressure: FeatureForm.value.currentPressure,
      managementUnit: FeatureForm.value.managementUnit,
      installationDate: FeatureForm.value.installationDate,
      managementUserNo: FeatureForm.value.managementUserNo,
    },
  }

  // 2. 更新临时数据：将新要素添加到临时数据源（tempGeoJSONData）
  tempGeoJSONData.value.features.push(newFeature)

  // 3. 更新地图渲染：合并原始数据和临时数据，确保所有要素都显示在地图上
  const source = map?.getSource('hydrants')
  if (source && 'setData' in source) {
    // 创建一个包含所有要素的新数据集
    const allFeatures: GeoJSON.Feature[] = [...geoJSONData.value.features]

    // 添加临时数据（包括新增和修改的要素）
    const combinedData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [...allFeatures, ...tempGeoJSONData.value.features],
    }

    // 更新地图数据源
    ;(source as mapboxgl.GeoJSONSource).setData(combinedData)
  }

  // 4. 创建自定义标记：调用前文的 creatMarker 方法，添加到地图和标记数组
  const marker = creatMarker(newFeature)
  if (marker) {
    markers.push(marker)
  }

  // 5. 交互反馈：关闭弹窗，提示用户"需点击保存提交更改"
  ElMessage.success('添加成功，点击保存提交更改')
  showEditFeatureDialog.value = false
  updateMapCursor()
}

// 处理更新要素表单提交
const handleUpdateFeatureFormSubmit = async () => {
  console.log('点击更新提交')
  if (!selectedFeature.value) return
  // 1. 创建更新临时要素
  const updatedFeature: GeoJSON.Feature = {
    type: 'Feature',
    id: selectedFeature.value?.id, // 正式数据对应 ID
    geometry: selectedFeature.value.geometry,
    properties: {
      // 表单数据映射到要素属性
      currentStatus: FeatureForm.value.currentStatus,
      currentPressure: FeatureForm.value.currentPressure,
      managementUnit: FeatureForm.value.managementUnit,
      installationDate: FeatureForm.value.installationDate,
      managementUserNo: FeatureForm.value.managementUserNo,
    },
  }

  // 2. 更新临时数据：将修改要素替换到临时数据中
  tempGeoJSONData.value.features.push(updatedFeature)
  // 3. 为修改的每个要素重新创建marker
  tempGeoJSONData.value.features.forEach((feature: GeoJSON.Feature) => {
    // 清除markers数组中的旧标记
    if (markers.length > 0) {
      markers.forEach((marker) => {
        if (marker.getElement().dataset.featureId === String(feature.id)) {
          marker.remove()
        }
      })
    }
  })
  const marker = creatMarker(updatedFeature)
  console.log(marker)
  // 只有成功创建标记时才添加到数组和地图
  if (marker) {
    markers.push(marker)
    marker.addTo(map as mapboxgl.Map)
  }
  // 4. 更新地图渲染：合并原始数据和临时数据，确保所有要素都显示在地图上
  const source = map?.getSource('hydrants')
  if (source && 'setData' in source) {
    // 创建一个包含所有要素的新数据集
    const allFeatures: GeoJSON.Feature[] = [...geoJSONData.value.features]
    // map方法遍历tempGeoJSONData.value.features数组，提取每个要素的id属性
    const editFeatureIds = tempGeoJSONData.value.features.map((f) => f.id)
    // 检查每个要素的id是否存在于editFeatureIds数组中,选出未被编辑的要素
    const filteredFeatures = allFeatures.filter(
      (feature) => !editFeatureIds.includes(feature.id)
    )

    // 将原始筛选出的未修改的要素和已修改的要素组合在一起
    const combinedData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [...filteredFeatures, ...tempGeoJSONData.value.features],
    }
    console.log(combinedData)
    // 更新地图数据源
    ;(source as mapboxgl.GeoJSONSource).setData(combinedData)
  }

  // 5. 交互反馈：关闭弹窗，提示用户"需点击保存提交更改"
  ElMessage.success('修改成功，点击保存提交更改')
  showEditFeatureDialog.value = false
  updateMapCursor()
}
// 保存所有更改（区分新增/更新/删除）
const saveChanges = async (operation: 'insert' | 'update' | 'delete') => {
  if (!tempGeoJSONData.value) return
  try {
    ElMessage.info('正在保存数据...')
    switch (operation) {
      case 'insert':
        await editFeatures(tempGeoJSONData.value.features, 'insert')
        console.log('执行新增 insert 操作')
        break
      case 'update':
        await editFeatures(tempGeoJSONData.value.features, 'update')
        console.log('执行更新 update 操作')
        break
      case 'delete':
        await editFeatures(tempGeoJSONData.value.features, 'delete')
        console.log('执行删除 delete 操作')
        break
    }
    ElMessage.success('数据保存成功')
    // 保存成功后，清空临时数据并重新加载正式数据（更新地图显示）
    tempGeoJSONData.value.features = []
    await loadGeoJSONData()
  } catch (error) {
    ElMessage.error('数据保存失败，请重试')
    console.error('保存失败:', error)
  }
}

// 方法：清理地图图层和数据源方法
const cleanupMapLayersAndSources = () => {
  if (!map) return

  // 如果图层已存在则移除（必须先移除图层再移除数据源）
  if (map.getLayer('hydrants-layer')) {
    map.removeLayer('hydrants-layer')
  }

  // 如果数据源已存在则移除
  if (map.getSource('hydrants')) {
    map.removeSource('hydrants')
  }
}
// 初始化 echarts 实例
let myChartInstance: echarts.ECharts | null = null

// 配置echarts图表的选项
const echartsOptions = {
  // 配置echarts图表的选项
  title: {
    text: '设备运行状态统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '设备运行状态',
      type: 'pie',
      radius: '50%',
      data: [
        { value: echartsData.value.normal || 0, name: '正常' },
        { value: echartsData.value.Abnormal || 0, name: '异常' },
        { value: echartsData.value.Error || 0, name: '错误' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
      // 更新配色方案
      color: ['#4CAF50', '#FFC107', '#F44336'], // 绿色、黄色、红色
    },
  ],
}

// 确保 DOM 元素存在后再设置选项
const initECharts = () => {
  setTimeout(() => {
    const chartDom = document.querySelector('.echarts') as HTMLElement | null
    if (chartDom) {
      myChartInstance = echarts.init(chartDom)
      myChartInstance.setOption(echartsOptions)
    }
  }, 0)
}

// 更新 echarts 数据的方法
const updateECharts = () => {
  if (myChartInstance) {
    const updatedOptions = {
      series: [
        {
          data: [
            { value: echartsData.value.normal || 0, name: '正常' },
            { value: echartsData.value.Abnormal || 0, name: '异常' },
            { value: echartsData.value.Error || 0, name: '错误' },
          ],
        },
      ],
    }
    myChartInstance.setOption(updatedOptions)
  }
}

// 天地图图层类型定义
type TiandituLayerType = 'vec' | 'cva' | 'img' | 'cia'
type TiandituMapType = 'vector' | 'image'
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'] // 天地图子域名列表
// 生成单个图层的URL集合
const generateLayerUrls = (layerType: TiandituLayerType, token: string) => {
  // 天地图WMTS服务基础URL模板
  const urlTemplate = `https://t{s}.tianditu.gov.cn/${layerType}_w/wmts?service=WMTS&request=GetTile&version=1.0.0&LAYER=${layerType}&style=default&tilematrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&format=tiles&tk=${token}`
  // 生成包含所有子域名的URL数组
  return subdomains.map((sub) => urlTemplate.replace('{s}', sub))
}
// 天地图图层配置生成器
const createTiandituLayers = (token: string) => ({
  // 矢量图层组（底图+注记）
  vector: {
    base: {
      name: 'tdt-vector-base',
      url: generateLayerUrls('vec', token),
      maxZoom: 18,
    },
    label: {
      name: 'tdt-vector-label',
      url: generateLayerUrls('cva', token),
      maxZoom: 18,
    },
  },
  // 影像图层组（底图+注记）
  image: {
    base: {
      name: 'tdt-image-base',
      url: generateLayerUrls('img', token),
      maxZoom: 18,
    },
    label: {
      name: 'tdt-image-label',
      url: generateLayerUrls('cia', token),
      maxZoom: 18,
    },
  },
})

// 初始化天地图图层配置
const tiandituLayers = createTiandituLayers(tiandituToken)
console.log('Tianditu Layers Config:', tiandituLayers)
// 添加天地图数据源和图层
const addTiandituSourceAndLayer = (type: TiandituMapType) => {
  if (!map) return
  try {
    console.log(`切换到天地图${type}图层`)
    const layers = tiandituLayers[type]
    // 移除已存在的同名图层和数据源
    if (map.getLayer(layers.base.name)) {
      map.removeLayer(layers.base.name)
      map.removeSource(layers.base.name)
    }
    if (map.getLayer(layers.label.name)) {
      map.removeLayer(layers.label.name)
      map.removeSource(layers.label.name)
    }
    // 获取GeoJSON图层（hydrants-layer）是否存在
    const geoJSONLayerId = 'hydrants-layer'
    const beforeId = map.getLayer(geoJSONLayerId) ? geoJSONLayerId : undefined
    // 添加底图数据源和图层
    map.addSource(layers.base.name, {
      type: 'raster',
      tiles: layers.base.url,
      tileSize: 256,
      maxzoom: layers.base.maxZoom,
    })
    map.addLayer(
      {
        id: layers.base.name,
        type: 'raster',
        source: layers.base.name,
        layout: {
          visibility: 'visible',
        },
      },
      beforeId
    )

    // 添加注记数据源和图层
    map.addSource(layers.label.name, {
      type: 'raster',
      tiles: layers.label.url,
      tileSize: 256,
      maxzoom: layers.label.maxZoom,
    })
    map.addLayer(
      {
        id: layers.label.name,
        type: 'raster',
        source: layers.label.name,
        layout: {
          visibility: 'visible',
        },
      },
      beforeId
    )
  } catch (error) {
    console.error('切换天地图图层时出错:', error)
  }
}
// 方法：初始化地图
const initMap = () => {
  // 返回一个新的Mapbox地图实例
  return new mapboxgl.Map({
    container: mapContainer.value as HTMLElement,
    style: mapStore.style as StyleSpecification,
    center: mapStore.center,
    zoom: mapStore.zoomLevel,
    projection: mapStore.projection,
  })
}
// 生命周期钩子：onMounted
onMounted(() => {
  mapboxgl.accessToken = mapboxToken
  console.log('Mapbox Token:', mapboxToken)
  console.log('Tianditu Token:', tiandituToken)
  // 初始化单地图实例
  map = initMap()
  // 地图加载完成事件
  map.on('load', () => {
    console.log('地图加载完成')
    // 初始默认加载天地图矢量影像与注记
    addTiandituSourceAndLayer('vector')
    loadGeoJSONData() // 加载消防栓数据
    initECharts() // 初始化 echarts 图表
    map?.setFog({})
    map?.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14,
    })
    map?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
  })
  map.on('error', (e) => {
    if (e.error && e.error.message && e.error.message.includes('aborted')) {
      // 忽略AbortError
      return
    }
    console.error('地图加载错误:', e.error)
  })
  // 监听地图移动事件, 实时更新状态管理中的地图信息
  map.on('move', () => {
    if (!map) return
    // 获取当前地图的经纬度、缩放级别和旋转角度
    const newZoom = map.getZoom()
    const newCenter = map.getCenter().toArray()
    const newPitch = map.getPitch()
    const newBearing = map.getBearing()
    // 更新状态管理中的地图信息
    mapStore.setZoomLevel(newZoom, true)
    mapStore.setCenter(newCenter, true)
    mapStore.setPitch(newPitch, true)
    mapStore.setBearing(newBearing, true)
  })
  // 监听地图点击事件
  map.on('click', (e) => {
    // 只在添加模式下处理地图点击事件
    if (isAddingMode.value) {
      handleFeatureClickForAdd(e)
    }
    showFeatureInfo.value = false // 点击地图空白区域时关闭hydrants-layer图层信息弹窗
  })
  // 监听hydrants-layer图层点击事件
  map.on('click', 'hydrants-layer', (e) => {
    // 监听默认模式下的点击事件
    if (!isUpdatingMode.value && !isDeletingMode.value) {
      handleFeatureClickForInfo(e)
      showFeatureInfo.value = true // 打开信息弹窗
    }
    // 监听更新模式下的点击事件
    if (isUpdatingMode.value) {
      handleFeatureClickForUpdate(e)
    }
    // 监听删除模式下的点击事件
    if (isDeletingMode.value) {
      handleFeatureClickForDelete(e)
    }
  })
  // 改变鼠标样式
  map.on('mouseenter', 'hydrants-layer', () => {
    if (map) {
      // 只有在非编辑模式下才改变鼠标样式
      if (!isAddingMode.value) {
        map.getCanvas().style.cursor = 'pointer'
      }
    }
  })

  map.on('mouseleave', 'hydrants-layer', () => {
    if (map) {
      // 只有在非编辑模式下才恢复鼠标样式
      if (!isAddingMode.value) {
        map.getCanvas().style.cursor = ''
      }
    }
  })
})
onUnmounted(() => {
  if (map) {
    map.remove() // 移除地图实例
  }
  // 清除markers数组中的旧标记
  if (markers.length > 0) {
    markers.forEach((marker) => marker.remove())
    markers.length = 0 // 清空数组
  }
  // 清理 echarts 实例
  if (myChartInstance) {
    myChartInstance.dispose()
    myChartInstance = null
  }
})
// 监听状态变化，同步到地图实例
// 监听地图类型变化
watch(
  () => mapStore.TiandituType,
  (newType) => {
    addTiandituSourceAndLayer(newType)
  }
)
// 2. 优化watch监听，避免循环触发
// 监听缩放级别变化
watch(
  () => mapStore.zoomLevel,
  (newZoom) => {
    // 只有非用户直接操作时，才通过store更新地图
    if (map && !mapStore.isUserInteraction) {
      map.setZoom(newZoom)
    }
  }
)

// 监听俯仰角变化
watch(
  () => mapStore.pitch,
  (newPitch) => {
    if (map && !mapStore.isUserInteraction) {
      map.setPitch(newPitch)
    }
  }
)

// 监听旋转角变化
watch(
  () => mapStore.bearing,
  (newBearing) => {
    if (map && !mapStore.isUserInteraction) {
      map.setBearing(newBearing)
    }
  }
)
// 监听中心点变化
watch(
  () => mapStore.center,
  (newCenter) => {
    if (map && !mapStore.isUserInteraction) {
      map.setCenter(newCenter)
    }
  }
)
// 地图实例重置方法
const resetMapView = () => {
  if (map) {
    map.flyTo({
      center: mapStore.initialState.center,
      zoom: mapStore.initialState.zoomLevel,
      pitch: mapStore.initialState.pitch,
      bearing: mapStore.initialState.bearing,
    })
  }
  console.log('地图视图已重置')
}
// 暴露方法供外部调用
defineExpose({
  addTiandituSourceAndLayer,
  resetMapView,
})
</script>
<template>
  <div>
    <div ref="mapContainer" class="map-container"></div>
    <!-- 要素信息弹窗 -->
    <div class="feature-info-container" v-if="showFeatureInfo">
      <div class="info-title">
        <span class="info-title-text"
          >当前选择要素ID：{{ selectedProperties.id }}</span
        >
      </div>
      <div class="info-content">
        <span class="info-item"
          >当前状态：{{ selectedProperties.currentStatus }}</span
        >
        <span class="info-item"
          >当前压力：{{ selectedProperties.currentPressure }}</span
        >
        <span class="info-item"
          >安装日期：{{ selectedProperties.installationDate }}</span
        >
        <span class="info-item"
          >管理单位：{{ selectedProperties.managementUnit }}</span
        >
        <span class="info-item"
          >管理用户：{{ selectedProperties.managementUserNo }}</span
        >
      </div>
    </div>
    <!-- 编辑功能 -->
    <div class="edit-controls">
      <!-- 1. 全局编辑模式开关：根据 isEditing 切换按钮文本和类型 -->
      <el-button
        :type="isEditingMode ? 'danger' : 'primary'"
        @click="handleEditClick()"
        >{{ isEditingMode ? '结束编辑' : '开始编辑' }}</el-button
      >

      <!-- 2. 编辑模式下显示的工具按钮（添加/删除/更新/保存） -->
      <div v-if="isEditingMode" class="edit-tool">
        <!-- 要素添加按钮：根据 isAddingMode 切换文本和类型 -->
        <el-button
          :type="isAddingMode ? 'danger' : 'primary'"
          @click="handleAddClick()"
          >{{ isAddingMode ? '结束添加' : '添加要素' }}</el-button
        >

        <!-- 要素更新按钮：根据 isUpdatingMode 切换文本和类型 -->
        <el-button
          :type="isUpdatingMode ? 'danger' : 'primary'"
          @click="handleUpdateClick()"
          >{{ isUpdatingMode ? '结束更新' : '更新要素' }}</el-button
        >
        <!-- 要素删除按钮：根据 isDeletingMode 切换文本和类型 -->
        <el-button
          :type="isDeletingMode ? 'danger' : 'primary'"
          @click="handleDeleteClick()"
          >{{ isDeletingMode ? '结束删除' : '删除要素' }}</el-button
        >

        <!-- 保存更改按钮：触发数据持久化 -->
        <el-button type="primary" @click="saveChanges(currentOptions)"
          >保存更改</el-button
        >
      </div>
    </div>
    <div class="echarts"></div>
    <!-- 添加要素弹窗表单 -->
    <!-- 由响应式变量控制显示/隐藏 -->
    <!-- 点击弹窗外部不关闭（避免误操作） -->

    <el-dialog
      :title="
        isAddingMode ? '添加要素信息' : '更新要素信息 id:' + selectedFeature?.id
      "
      v-model="showEditFeatureDialog"
      width="400px"
      :close-on-click-modal="false"
    >
      <!-- 表单：绑定表单实例、数据、验证规则 -->
      <el-form
        ref="formRef"
        :model="FeatureForm"
        :rules="FeatureFormRules"
        label-width="120px"
      >
        <!-- 1. 设备状态：下拉选择（正常/异常/错误） -->
        <el-form-item label="设备状态" prop="currentStatus">
          <el-select v-model="FeatureForm.currentStatus">
            <el-option label="正常" value="normal"></el-option>
            <el-option label="异常" value="Abnormal"></el-option>
            <el-option label="错误" value="Error"></el-option>
          </el-select>
        </el-form-item>

        <!-- 2. 当前压力：数字输入（步长 0.01，验证必填+数字类型） -->
        <el-form-item label="当前压力" prop="currentPressure">
          <el-input
            v-model.number="FeatureForm.currentPressure"
            type="number"
            step="0.01"
            placeholder="请输入压力值"
          ></el-input>
        </el-form-item>

        <!-- 3. 管理单位：文本输入（验证必填） -->
        <el-form-item label="管理单位" prop="managementUnit">
          <el-input
            v-model="FeatureForm.managementUnit"
            placeholder="请输入管理单位"
          ></el-input>
        </el-form-item>

        <!-- 4. 安装日期：日期选择器（格式 YYYY-MM-DD，验证必填） -->
        <el-form-item label="安装日期" prop="installationDate">
          <el-date-picker
            v-model="FeatureForm.installationDate"
            type="date"
            placeholder="选择安装日期"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>

        <!-- 5. 管理员编号：文本输入（验证必填） -->
        <el-form-item label="管理员编号" prop="managementUserNo">
          <el-input
            v-model="FeatureForm.managementUserNo"
            placeholder="请输入管理员编号"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 弹窗底部按钮：取消/确认添加 -->
      <template #footer>
        <el-button @click="showEditFeatureDialog = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleFeatureFormSubmit(currentOptions)"
          >确认</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.map-container {
  height: calc(100vh - 60px);
  width: 100%;
}
.feature-info-container {
  position: absolute;
  top: 70px;
  right: 10px;
  width: 350px;
  height: 250px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffffd5;
  border: 1px solid #4c9ff4;
}
.feature-info-container .info-title {
  padding-bottom: 15px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.feature-info-container .info-item {
  display: block;
  margin-bottom: 10px;
}
.edit-controls {
  position: absolute;
  top: 70px;
  left: 300px;
  z-index: 1;
}
.edit-tool {
  padding: 5px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-top: 10px;
  /* 子元素横向排列 */
  display: flex;
  justify-content: space-between;
}
.echarts {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 340px;
  height: 255px;
  background: rgba(255, 255, 255, 0);
  border-radius: 4px;
  padding: 10px;
}

/* 表单元素样式统一 */
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}
</style>
<!-- 为动态创建的marker元素添加非scoped样式 -->
<style>
.custom-marker {
  position: absolute;
  color: #ffffff;
  background-color: #1bd961;
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 2px 5px;
  font-size: 12px;
  top: -15px;
}

.custom-marker::after {
  content: '';
}
.el-dialog {
  position: relative;
  left: 18%;
  top: 15%;
}
</style>

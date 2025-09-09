import { createApp } from 'vue'
import pinia from './stores/index' // 导入已配置的pinia实例

import App from './App.vue'
import router from './router'
import '@/assets/style/main.scss' // 全局样式

// 引入Element Plus及其中文语言包
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app.use(pinia) // 使用已配置的pinia实例
app.use(router)
// 使用Element Plus并设置中文语言
app.use(ElementPlus, {
  locale: zhCn,
})

app.mount('#app')

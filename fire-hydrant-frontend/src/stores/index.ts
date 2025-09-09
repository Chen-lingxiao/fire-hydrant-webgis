import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate' // 引入持久化插件
const pinia = createPinia() // 创建 Pinia 实例
pinia.use(persist) // 使用持久化插件
export default pinia // 导出 Pinia 实例
export * from './modules/mapStore'
export * from './modules/userStore'

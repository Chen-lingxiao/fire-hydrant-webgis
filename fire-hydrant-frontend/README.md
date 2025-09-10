# 消防栓 WebGIS 管理系统

基于 Vue 3 和 Vite 构建的消防栓 WebGIS（网络地理信息系统）管理系统，为消防管理和 GIS 地图操作人员提供可视化地图操作界面，支持消防栓信息管理、用户权限控制和数据展示等功能。

## 功能特性

- 🗺️ 地图展示与交互（使用 Mapbox GL）
- 🚨 消防栓信息展示与管理（表格与地图结合）
- 👥 用户管理与权限控制
- 📊 数据可视化（使用 ECharts）
- 🧭 路由导航与页面管理
- 🎨 响应式设计，支持多设备访问

## 技术栈

- [Vue 3](https://v3.cn.vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://cn.vitejs.dev/) - 前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集，添加静态类型定义
- [Element Plus](https://element-plus.org/zh-CN/) - Vue 3 UI 组件库
- [Mapbox GL](https://docs.mapbox.com/mapbox-gl-js/api/) - 地图展示与交互
- [ECharts](https://echarts.apache.org/zh/index.html) - 数据可视化图表库
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理
- [Axios](https://axios-http.com/) - HTTP 客户端
- [Turf.js](https://turfjs.org/) - 地理空间分析

## 推荐开发环境

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用 Vetur)
- [Node.js](https://nodejs.org/) 版本要求：^20.19.0 || >=22.12.0
- [pnpm](https://pnpm.io/) 包管理器

## 项目设置

### 安装依赖

```sh
pnpm install
```

### 启动开发服务器

```sh
pnpm dev
```

### 构建生产版本

```sh
pnpm build
```

### 预览生产构建

```sh
pnpm preview
```

### 类型检查

```sh
pnpm type-check
```

### 代码检查与修复

```sh
pnpm lint
```

### 代码格式化

```sh
pnpm format
```

## 项目结构

```
src/
├── api/              # API 接口定义
├── assets/           # 静态资源
├── components/       # 可复用组件
├── router/           # 路由配置
├── stores/           # 状态管理
├── utils/            # 工具函数
└── views/            # 页面视图
```

## TypeScript 支持

由于 TypeScript 默认无法处理 `.vue` 导入的类型信息，我们使用 `vue-tsc` 替代 `tsc` 进行类型检查。在编辑器中，需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 插件来使 TypeScript 语言服务识别 `.vue` 类型。

## 浏览器兼容性

该项目使用 Vite 构建，支持现代浏览器。如需支持旧版浏览器，请根据需要配置 [构建目标](https://cn.vitejs.dev/config/build-options.html#build-target)。

## 许可证

[MIT](./LICENSE) © 2025 消防栓 WebGIS 项目团队
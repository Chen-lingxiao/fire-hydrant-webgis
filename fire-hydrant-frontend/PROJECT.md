# 消防栓 WebGIS 项目说明文档

## 1. 项目概述

本项目是一个基于 Vue 3 和 Vite 构建的前端应用，用于开发消防栓相关的 WebGIS（网络地理信息系统）应用。该系统为消防管理和 GIS 地图操作人员提供可视化地图操作界面，支持消防栓信息管理、用户权限控制和数据展示等功能。

### 1.1 核心功能

- 地图展示与交互（使用 Mapbox GL）
- 消防栓信息展示与管理（表格与地图结合）
- 用户管理与权限控制
- 数据可视化（使用 ECharts）
- 路由导航与页面管理

### 1.2 技术架构

- 前端框架：Vue 3.5.18 + TypeScript 5.8.0
- 构建工具：Vite 7.0.6
- UI 框架：Element Plus 2.11.1
- 地图库：Mapbox GL 3.14.0
- 数据可视化：ECharts 6.0.0
- 状态管理：Pinia 3.0.3
- HTTP 客户端：Axios 1.11.0
- 包管理器：pnpm
- 代码规范：ESLint + Prettier

## 2. 项目目录结构

```
fire-hydrant-frontend/
├── src/                           # 源代码主目录
│   ├── api/                       # API 接口定义
│   │   ├── geoserver.ts          # 地理信息系统相关 API
│   │   └── user.ts               # 用户相关 API
│   ├── assets/                    # 静态资源
│   │   └── style/                # 样式文件
│   │       └── main.scss         # 主样式文件
│   ├── components/                # 可复用组件
│   │   ├── HeaderComponent.vue   # 页面头部组件
│   │   ├── MapComponent.vue      # 地图组件（核心）
│   │   ├── MapInfo.vue           # 地图信息显示组件
│   │   ├── MapToolbar.vue        # 地图工具栏组件
│   │   ├── NavigationComponent.vue # 导航组件
│   │   └── TableComponent.vue    # 表格组件
│   ├── router/                   # 路由配置
│   │   └── index.ts              # 路由定义文件
│   ├── stores/                   # 状态管理
│   │   ├── modules/              # 状态模块
│   │   │   ├── counter.ts        # 计数器状态示例
│   │   │   ├── mapStore.ts       # 地图相关状态
│   │   │   └── userStore.ts      # 用户相关状态
│   │   └── index.ts              # 状态管理入口
│   ├── utils/                    # 工具函数
│   │   └── request.ts            # 请求封装工具
│   ├── views/                    # 页面视图
│   │   ├── Index.vue             # 首页
│   │   ├── auth/                 # 认证相关页面
│   │   │   └── LoginPage.vue     # 登录页面
│   │   ├── dashboard/            # 仪表板页面
│   │   │   ├── DashboardPage.vue # 仪表板主页
│   │   │   └── children/         # 仪表板子页面
│   │   │       ├── FireHydrantInfoTable.vue # 消防栓信息表
│   │   │       └── UserInfoManage.vue       # 用户信息管理
│   │   ├── map/                  # 地图相关页面
│   │   │   └── MapPage.vue       # 地图页面
│   │   └── user/                 # 用户相关页面
│   │       ├── UserPage.vue      # 用户主页
│   │       └── children/         # 用户子页面
│   │           ├── UserHome.vue  # 用户首页
│   │           ├── UserInfo.vue  # 用户信息
│   │           └── UserResetPwd.vue # 用户重置密码
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 应用入口文件
├── public/                       # 公共静态资源目录
├── .env                          # 环境变量配置
├── .gitignore                    # Git 忽略文件配置
├── README.md                     # 项目说明文档
├── index.html                    # HTML 模板文件
├── package.json                  # 项目配置和依赖定义
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 构建配置
└── eslint.config.ts              # ESLint 代码检查配置
```

## 3. 核心模块介绍

### 3.1 API 模块 (`src/api/`)

存放所有与后端交互的 API 接口定义：
- `geoserver.ts`: 与地理信息系统相关的 API 接口
- `user.ts`: 用户认证和管理相关的 API 接口

### 3.2 组件模块 (`src/components/`)

存放可复用的 Vue 组件：
- `HeaderComponent.vue`: 页面头部组件，包含标题和用户信息
- `MapComponent.vue`: 核心地图组件，集成 Mapbox GL 实现地图展示和交互
- `MapInfo.vue`: 显示地图相关信息
- `MapToolbar.vue`: 地图工具栏，提供地图操作功能
- `NavigationComponent.vue`: 导航组件
- `TableComponent.vue`: 通用表格组件

### 3.3 状态管理 (`src/stores/`)

使用 Pinia 进行状态管理：
- `modules/counter.ts`: 计数器状态示例
- `modules/mapStore.ts`: 管理地图相关状态
- `modules/userStore.ts`: 管理用户认证和信息状态

### 3.4 路由配置 (`src/router/`)

- `index.ts`: 定义应用的所有路由，包括登录、仪表板、地图、用户等页面路由

### 3.5 页面视图 (`src/views/`)

按照功能模块组织页面组件：
- `auth/`: 认证相关页面，如登录页面
- `dashboard/`: 仪表板页面，包含消防栓信息表和用户管理
- `map/`: 地图主页面
- `user/`: 用户个人中心相关页面

## 4. 开发环境

### 4.1 必需工具

- Node.js (版本要求：^20.19.0 || >=22.12.0)
- pnpm (包管理器)
- VSCode + Volar 插件（推荐 IDE）

### 4.2 常用命令

- `pnpm dev`: 启动本地开发服务器
- `pnpm build`: 构建生产环境版本
- `pnpm preview`: 预览构建结果
- `pnpm type-check`: 类型检查
- `pnpm lint`: 代码检查
- `pnpm format`: 代码格式化

## 5. 部署说明

1. 执行 `pnpm build` 命令构建项目
2. 构建完成后，所有静态资源将生成在 `dist/` 目录下
3. 将 `dist/` 目录下的所有文件部署到静态服务器（如 Nginx、CDN 或其他静态服务器）

## 6. 注意事项

1. `.vue` 文件的类型检查需依赖 `vue-tsc` 替代默认 `tsc`
2. 需要安装 Volar 插件以支持 Vue 文件类型提示
3. 部分依赖版本需注意兼容性（如 Pinia 插件版本需与 Pinia 主版本匹配）
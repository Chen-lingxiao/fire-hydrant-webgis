Based on the repository structure and components provided, here's the README.md content for the project:

---

# Fire Hydrant WebGIS

这是一个基于WebGIS的消防栓管理系统，结合了前端可视化与后端数据管理，旨在提供高效的消防栓信息管理与地图交互功能。

## 项目结构

本项目分为两个主要部分：

- **fire-hydrant-frontend**：前端部分，基于Vue.js构建，提供用户界面和地图交互功能。
- **fire-hydrant-management**：后端部分，基于Spring Boot构建，提供RESTful API和数据库交互。

## 技术栈

- **前端**: Vue.js, TypeScript, Vite, Pinia, Vue Router, OpenLayers/Leaflet (地图库)
- **后端**: Spring Boot, MyBatis Plus, JWT, Maven
- **数据库**: PostgreSQL/MySQL (根据实际配置)
- **其他工具**: ESLint, Prettier, Husky (用于代码规范和提交前检查)

## 功能模块

### 前端功能

- **地图展示**：集成地图组件，展示消防栓位置及相关信息。
- **用户认证**：登录、注册、密码重置等功能。
- **信息管理**：用户信息管理、消防栓信息表格展示。
- **仪表盘**：提供系统概览和数据统计。
- **响应式设计**：支持多种设备访问。

### 后端功能

- **用户管理**：注册、登录、更新、删除用户信息。
- **JWT认证**：基于Token的用户身份验证。
- **RESTful API**：提供标准化接口供前端调用。
- **MyBatis Plus集成**：简化数据库操作。
- **跨域支持**：允许前端与后端跨域通信。

## 安装与部署

### 前端安装

1. 安装依赖：
   ```bash
   pnpm install
   ```

2. 启动开发服务器：
   ```bash
   pnpm dev
   ```

3. 构建生产环境版本：
   ```bash
   pnpm build
   ```

4. 类型检查：
   ```bash
   pnpm lint
   ```

### 后端安装

1. 使用Maven构建项目：
   ```bash
   mvn clean install
   ```

2. 启动Spring Boot应用：
   ```bash
   java -jar fire-hydrant-management.jar
   ```

3. 配置数据库连接：
   修改`application.properties`文件中的数据库配置。

## 使用说明

- 访问前端页面，通过登录或注册进入系统。
- 在地图页面查看消防栓分布。
- 在仪表盘中查看统计信息。
- 使用用户管理页面进行用户信息维护。

## 贡献指南

欢迎贡献代码和建议。请遵循以下步骤：

1. Fork本项目。
2. 创建新分支 (`git checkout -b feature/new-feature`)
3. 提交更改 (`git commit -m 'Add new feature'`)
4. 推送分支 (`git push origin feature/new-feature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证。详情请查看`LICENSE`文件。

---

如需进一步了解具体模块的实现细节，可以查看对应的源代码文件。
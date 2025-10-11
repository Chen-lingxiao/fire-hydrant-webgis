Based on the repository structure and components provided, here's the README.md content for the project:

---

# Fire Hydrant WebGIS

这是一个基于 WebGIS 的消防栓管理系统，结合了前端可视化地图交互、后端数据管理、微信小程序移动端应用，旨在提供高效的消防栓信息查询与运维支持。

开发流程文档为语雀导出，转 md 格式稍微有点问题，语雀在线：

学习笔记：https://www.yuque.com/lingxiao-yugup/cm3baa?# 《WebGIS》 密码：blgs

开发手册：https://www.yuque.com/lingxiao-yugup/cm3baa/ylx3vrpvlhx65kuc?singleDoc# 《开发手册》 密码：blgs

## 项目结构

本项目分为三个主要部分：

- **fire-hydrant-frontend**：前端部分，基于 Vue.js 构建，提供数据管理界面和地图交互功能。
- **fire-hydrant-management**：后端部分，基于 Spring Boot 构建，提供 RESTful API 和数据库交互。
- **wx-miniprogramt**：微信小程序端，面向用户端的轻量应用，支持现场扫码查询、故障上报等功能

## 技术栈

- **GIS**: MapboxGL, Turf.js, GeoServer, ArcGIS,QGIS, WMS, WFS
- **前端**: Vue.js, TypeScript, Vite, Pinia, Vue Router,Element Plus,ECharts,Axios,微信小程序原生框架
- **后端**: Spring Boot, MyBatis Plus, JWT, Maven
- **数据库**: PostgreSQL (含 PostGIS 空间扩展)
- **其他工具**: ESLint, Prettier, Husky (用于代码规范和提交前检查)

## 功能模块

### 前端功能

- **地图展示**：集成第三方地图服务(天地图)，展示消防栓位置及相关信息。
- **数据维护**：支持消防栓要素的添加（点击地图添加新点）、编辑（修改属性信息）、删除（点击删除要素），并同步到后端。
- **用户认证**：登录、注册、密码重置等功能。
- **信息管理**：用户信息管理、消防栓信息表格展示,支持分页控制、关键字搜索、行操作（编辑、删除）。
- **仪表盘**：提供系统概览和数据统计。

### 微信小程序功能

- **地图展示**：集成地图组件，展示消防栓位置及相关信息。
- **用户认证**：登录、注册、密码重置等功能。
- **消防栓查询**：扫码获取设备详情、地图定位附近消防栓。
- **故障上报**：定位故障消防栓、上报进度跟踪。
- **个人中心**：用户信息管理、上报记录查询

### 后端功能

- **用户管理**：注册、登录、更新、删除用户信息。
- **JWT 认证**：基于 Token 的用户身份验证。
- **RESTful API**：提供标准化接口供前端调用。
- **MyBatis Plus 集成**：简化数据库操作。
- **跨域支持**：允许前端与后端跨域通信。

## 页面预览

### PC 端

<img width="1631" height="748" alt="image" src="https://github.com/user-attachments/assets/dffc1885-a1dc-40f9-b7ad-a2608f8dbbf4" />
<img width="1631" height="744" alt="image" src="https://github.com/user-attachments/assets/cadbeb1e-9a3b-4642-ac6d-ac7230b254a7" />
<img width="1631" height="745" alt="image" src="https://github.com/user-attachments/assets/a765db86-6562-433a-979e-c803f410e108" />

### 小程序端

- **首页**：图层控制、要素展示、按范围查询要素、地图定位
  <img width="318" height="677" alt="地图信息" src="https://github.com/user-attachments/assets/a859ceae-d513-4996-bc7d-dd114327596d" />
  <img width="318" height="673" alt="信息查询" src="https://github.com/user-attachments/assets/6df7f5fa-519b-4652-bb6c-30f59d0bd366" />

- **故障上报**：消防栓故障上报
  <img width="318" height="671" alt="上报" src="https://github.com/user-attachments/assets/8267c78b-6e5b-407b-b6f9-ab89f9dde03d" />

- **个人中心**：用户注册登录、个人资料、上报记录
  <img width="314" height="677" alt="个人信息" src="https://github.com/user-attachments/assets/7b7ccc4e-c1ca-4ab3-bbb8-9301e5bb9763" />
  <img width="318" height="677" alt="记录" src="https://github.com/user-attachments/assets/bc14f519-87c3-425a-ab9f-dc5be55fed14" />

## 安装与部署

### 前端安装

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

构建生产环境版本：

```bash
pnpm build
```

类型检查：

```bash
pnpm lint
```

### 后端安装

**数据库配置**

系统使用 PostgreSQL 数据库，相关配置在`application.properties`中：

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fire_hydrant_data

spring.datasource.username=postgres

spring.datasource.password=123456
```

请确保已安装并运行 PostgreSQL 数据库，并创建名为`fire_hydrant_data`的数据库。

**JWT 配置**

系统使用 JWT 进行身份验证，相关配置在[application.properties](file://F:\Project\fire-hydrant-webgis\fire-hydrant-management\src\main\resources\application.properties)中：

```properties
jwt.secret=your-very-long-secret-key-should-be-at-least-32-chars

jwt.expire=7200000 # 2小时过期
```

**API 接口**

用户相关接口

- `POST /users/register` - 用户注册
- `POST /users/login` - 用户登录
- `PUT /users/update` - 更新用户信息
- `DELETE /users/delete/{id}` - 删除用户
- `GET /users/{id}` - 根据 ID 获取用户信息
- `GET /users/page` - 分页获取用户列表
- `GET /users/getAllUsers` - 获取所有用户

**快速开始**

1. 克隆项目到本地

2. 确保已安装 Java 17 和 Maven

3. 配置 PostgreSQL 数据库

4. 修改[application.properties](file://F:\Project\fire-hydrant-webgis\fire-hydrant-management\src\main\resources\application.properties)中的数据库连接信息

5. 运行项目：

   ```bash
   mvn spring-boot:run
   ```

**依赖说明**

项目主要依赖包括：

- Spring Boot Web Starter
- MyBatis-Plus Spring Boot 3 Starter
- PostgreSQL Driver
- Lombok
- JWT (jjwt-api, jjwt-impl, jjwt-jackson)

**注意事项**

1. 数据库表名和字段名使用了双引号转义，以避免与数据库关键字冲突
2. JWT 密钥在生产环境中应替换为更安全的密钥
3. 用户密码在数据库中应加密存储，当前版本可能需要进一步完善安全性

### 小程序端完善中

## 使用说明

- 访问前端页面，通过登录或注册进入系统。
- 在地图页面查看消防栓分布及数据编辑。
- 在仪表盘中查看统计信息。
- 使用用户管理页面进行用户信息维护。

## 贡献指南

欢迎贡献代码和建议。请遵循以下步骤：

1. Fork 本项目。
2. 创建新分支 (`git checkout -b feature/new-feature`)
3. 提交更改 (`git commit -m 'Add new feature'`)
4. 推送分支 (`git push origin feature/new-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。详情请查看`LICENSE`文件。

---

如需进一步了解具体模块的实现细节，可以查看对应的源代码文件。

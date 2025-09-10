# 消防栓管理系统 (Fire Hydrant Management System)

## 项目简介

消防栓管理系统是一个基于Spring Boot的后端管理系统，用于管理消防栓相关的用户信息。该系统提供了用户注册、登录、信息管理等基础功能，并使用JWT进行身份验证。

## 技术栈

- **后端框架**: Spring Boot 3.5.5
- **编程语言**: Java 17
- **数据库**: PostgreSQL
- **持久层框架**: MyBatis-Plus 3.5.13
- **安全认证**: JWT (JSON Web Token)
- **项目构建工具**: Maven
- **其他工具**: Lombok

## 功能特性

1. 用户注册
2. 用户登录 (JWT Token认证)
3. 用户信息更新
4. 用户删除
5. 用户查询 (按ID查询、分页查询、全部查询)

## 项目结构

![image-20250910143005469](C:\Users\ChenL\AppData\Roaming\Typora\typora-user-images\image-20250910143005469.png)

## 数据库配置

系统使用PostgreSQL数据库，相关配置在`application.properties`中：

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fire_hydrant_data 

spring.datasource.username=postgres 

spring.datasource.password=123456
```

请确保已安装并运行PostgreSQL数据库，并创建名为`fire_hydrant_data`的数据库。

## JWT配置

系统使用JWT进行身份验证，相关配置在[application.properties](file://F:\Project\fire-hydrant-webgis\fire-hydrant-management\src\main\resources\application.properties)中：

```properties
jwt.secret=your-very-long-secret-key-should-be-at-least-32-chars 

jwt.expire=7200000 # 2小时过期
```

## API接口

### 用户相关接口

- `POST /users/register` - 用户注册
- `POST /users/login` - 用户登录
- `PUT /users/update` - 更新用户信息
- `DELETE /users/delete/{id}` - 删除用户
- `GET /users/{id}` - 根据ID获取用户信息
- `GET /users/page` - 分页获取用户列表
- `GET /users/getAllUsers` - 获取所有用户

## 快速开始

1. 克隆项目到本地

2. 确保已安装Java 17和Maven

3. 配置PostgreSQL数据库

4. 修改[application.properties](file://F:\Project\fire-hydrant-webgis\fire-hydrant-management\src\main\resources\application.properties)中的数据库连接信息

5. 运行项目：

   ```bash
   mvn spring-boot:run
   ```

## 依赖说明

项目主要依赖包括：
- Spring Boot Web Starter
- MyBatis-Plus Spring Boot 3 Starter
- PostgreSQL Driver
- Lombok
- JWT (jjwt-api, jjwt-impl, jjwt-jackson)

## 注意事项

1. 数据库表名和字段名使用了双引号转义，以避免与数据库关键字冲突
2. JWT密钥在生产环境中应替换为更安全的密钥
3. 用户密码在数据库中应加密存储，当前版本可能需要进一步完善安全性

## 许可证

本项目为示例项目，可根据需要进行修改和分发。
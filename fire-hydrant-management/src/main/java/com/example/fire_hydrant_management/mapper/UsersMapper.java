package com.example.fire_hydrant_management.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.fire_hydrant_management.entity.Users;
import org.apache.ibatis.annotations.Mapper;

@Mapper // 标记为MyBatis mapper接口
// Spring 会自动扫描并将其注册为 Bean，使得 Service 层可以通过依赖注入使用它
public interface UsersMapper extends BaseMapper<Users> {
    // BaseMapper已包含基本CRUD方法，无需额外编写
    // 例如：
    // insert(User entity)：新增一条记录
    // updateById(User entity)：根据 ID 更新记录
    // selectById(Serializable id)：根据 ID 查询记录
    // deleteById(Serializable id)：根据 ID 删除记录
    // selectList(Wrapper<User> queryWrapper)：条件查询列表
    // 如果基础 CRUD 无法满足需求（例如复杂查询、多表关联等）
    // 可以在UserMapper中自定义方法。有两种实现方式：注解方式（简单 SQL）和XML 映射文件方式（复杂 SQL）
//    用户注册
    boolean register(Users user);
//    用户登录
    Users login(String name, String password);
    // 获取用户信息
}

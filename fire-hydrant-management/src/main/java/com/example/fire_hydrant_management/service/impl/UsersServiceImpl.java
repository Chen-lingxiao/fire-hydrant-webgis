package com.example.fire_hydrant_management.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.fire_hydrant_management.entity.Users;
import com.example.fire_hydrant_management.mapper.UsersMapper;
import com.example.fire_hydrant_management.service.UsersService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
// // UserMapper 是 MyBatis 的 Mapper 接口（负责数据库交互），User 是实体类（对应数据库表）
public class UsersServiceImpl extends ServiceImpl<UsersMapper, Users> implements UsersService {
    //注册接口
    @Override // 重写父类的方法
    public boolean register(Users users) {
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>(); // 创建查询条件
        queryWrapper.eq("name", users.getName()); // 设置查询条件为用户名
        Users existUser = baseMapper.selectOne(queryWrapper); // 查询用户
        if (existUser != null) {
            return false; // 用户名已存在
        }
        return save(users); // 保存用户信息
    }
    // 登录接口
    @Override
    public Users login(String name, String password) {
        QueryWrapper< Users> queryWrapper = new QueryWrapper<>(); // 创建查询条件
        queryWrapper.eq("name", name);
        queryWrapper.eq("password", password);
        return baseMapper.selectOne(queryWrapper); // 查询用户
    }
    // 编辑用户（根据ID更新）
    @Override
    public boolean updateUser(Users user) {
        // 先检查用户是否存在
        if (baseMapper.selectById(user.getId()) == null) {
            return false;
        }
        return baseMapper.updateById(user) > 0;
    }

    // 删除用户（根据ID）
    @Override
    public boolean deleteUser(Integer id) {
        // 先检查用户是否存在
        if (baseMapper.selectById(id) == null) {
            return false;
        }
        return baseMapper.deleteById(id) > 0;
    }

    // 按ID查询用户
    @Override
    public Users getUserById(Integer id) {
        return baseMapper.selectById(id);
    }

    // 分页查询用户
    @Override
    public IPage<Users> getUserPage(Page<Users> page) {
        // 无条件分页查询（可根据需求添加查询条件）
        // 添加排序条件：按 id 升序（或按 updateTime 降序）
        QueryWrapper<Users> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByAsc("\"id\""); // 按 id 升序（推荐，id 唯一且自增，顺序稳定）
        return baseMapper.selectPage(page,queryWrapper);
    }
}


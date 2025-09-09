package com.example.fire_hydrant_management.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.fire_hydrant_management.entity.Users;

import java.util.List;

public interface UsersService extends IService<Users> {
    // 注册接口
    boolean register(Users user);
    // 登录接口
    Users login(String name, String password);
    // 新增功能接口
    boolean updateUser(Users user); // 编辑用户
    boolean deleteUser(Integer id); // 删除用户
    Users getUserById(Integer id); // 按ID查询用户
    IPage<Users> getUserPage(Page<Users> page); // 分页查询用户
}

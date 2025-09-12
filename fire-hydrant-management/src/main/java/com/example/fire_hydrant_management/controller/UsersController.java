package com.example.fire_hydrant_management.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.fire_hydrant_management.entity.Users;
import com.example.fire_hydrant_management.service.UsersService;
import com.example.fire_hydrant_management.utils.JwtUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
@RestController // 表示该类是一个 RESTful 控制器
@RequestMapping("/users") // 定义 RESTful 接口路径
public class UsersController {
    @Autowired // 自动注入
    private JwtUtils jwtUtils; // 注入JWT工具类
    @Autowired
    private UsersService usersService; // 创建 UsersService 对象
    // 注册接口
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Users user) {
        Map<String, Object> result = new HashMap<>(); // 创建结果对象
        try {
            boolean success = usersService.register(user);
            if (success) {
                result.put("code", 200);
                result.put("message", "注册成功");
            } else {
                result.put("code", 400);
                result.put("message", "用户名已存在");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "注册失败：" + e.getMessage());
        }
        return result;
    }
    // 登录接口
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginInfo,HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();
        try {
            String name = loginInfo.get("name");
            String password = loginInfo.get("password");
            Users user = usersService.login(name, password);
            if (user != null) {
                // 生成Token
                String token = jwtUtils.generateToken(name);
                // 使用httpOnlyCookie()方法将Token保存在Cookie中，并设置过期时间为7天
                Cookie cookie = new Cookie("token", token);
                cookie.setHttpOnly( true); // 设置Cookie为HttpOnly
                cookie.setMaxAge(7200); // 设置Cookie的过期时间为2小时
                cookie.setPath("/"); // 设置Cookie的生效路径为根目录
                response.addCookie(cookie); // 写入响应
                result.put("code", 200);
                result.put("message", "登录成功");
                result.put("data", user);

                //result.put("token", token); // 返回Token给前端
            }
            else {
                result.put("code", 401);
                result.put("message", "用户名或密码错误");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "登录失败：" + e.getMessage());
        }
        return result;
    }
    // 后端退出接口（UsersController.java）
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpServletResponse response) {
        Map<String, Object> result = new HashMap<>();
        // 清除Cookie（设置过期时间为0）
        Cookie cookie = new Cookie("jwt-token", null);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        result.put("code", 200);
        result.put("message", "退出成功");
        return result;
    }
    // 编辑用户信息（PUT请求）
    @PutMapping("/update")
    public Map<String, Object> updateUser(@RequestBody Users user) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = usersService.updateUser(user);
            if (success) {
                result.put("code", 200);
                result.put("message", "更新成功");
            } else {
                result.put("code", 404);
                result.put("message", "用户不存在");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "更新失败：" + e.getMessage());
        }
        return result;
    }

    // 删除用户（DELETE请求）
    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteUser(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = usersService.deleteUser(id);
            if (success) {
                result.put("code", 200);
                result.put("message", "删除成功");
            } else {
                result.put("code", 404);
                result.put("message", "用户不存在");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "删除失败：" + e.getMessage());
        }
        return result;
    }

    // 按ID查询用户
    @GetMapping("/{id}")
    public Map<String, Object> getUserById(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Users user = usersService.getUserById(id);
            if (user != null) {
                result.put("code", 200);
                result.put("message", "查询成功");
                result.put("data", user);
            } else {
                result.put("code", 404);
                result.put("message", "用户不存在");
            }
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "查询失败：" + e.getMessage());
        }
        return result;
    }

    // 4. 分页查询用户
    @GetMapping("/page")
    public Map<String, Object> getUserPage(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Map<String, Object> result = new HashMap<>();
        try {
            Page<Users> page = new Page<>(pageNum, pageSize);
            IPage<Users> userPage = usersService.getUserPage(page);
            result.put("code", 200);
            result.put("message", "查询成功");
            result.put("data", userPage.getRecords()); // 当前页数据
            result.put("total", userPage.getTotal()); // 总条数
            result.put("pages", userPage.getPages()); // 总页数
            result.put("current", userPage.getCurrent()); // 当前页码
            result.put("size", userPage.getSize()); // 每页条数
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "分页查询失败：" + e.getMessage());
        }
        return result;
    }

    // 5. 查询全部用户（补充之前的全量查询）
    @GetMapping("/getAllUsers")
    public Map<String, Object> getAllUsers() {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Users> usersList = usersService.list(); // 使用MyBatis-Plus的list()方法
            result.put("code", 200);
            result.put("message", "查询成功");
            result.put("data", usersList);
            result.put("count", usersList.size());
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", "查询失败：" + e.getMessage());
        }
        return result;
    }
}

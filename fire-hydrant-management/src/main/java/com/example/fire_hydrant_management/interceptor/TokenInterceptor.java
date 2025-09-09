package com.example.fire_hydrant_management.interceptor;

import com.example.fire_hydrant_management.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

public class TokenInterceptor implements HandlerInterceptor {
    @Autowired
    private JwtUtils jwtUtils;
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 排除登录和注册接口
        String path = request.getRequestURI();
        if (path.contains("/users/login") || path.contains("/users/register")) {
            return true;
        }

        // 从请求头获取Token
        String token = request.getHeader("Authorization");
        if (token == null || !jwtUtils.validateToken(token)) {
            // Token无效或不存在，返回401
            response.setContentType("application/json;charset=UTF-8");
            PrintWriter out = response.getWriter();
            out.write("{\"code\":401,\"message\":\"未授权访问，请先登录\"}");
            out.flush();
            out.close();
            return false;
        }
        return true;
    }
}

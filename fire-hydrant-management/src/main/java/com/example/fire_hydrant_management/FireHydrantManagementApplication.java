package com.example.fire_hydrant_management;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.fire_hydrant_management.mapper") // 扫描mapper接口
public class FireHydrantManagementApplication {
	public static void main(String[] args) {
		SpringApplication.run(FireHydrantManagementApplication.class, args);
	}
}

package com.example.fire_hydrant_management.entity; // 实体类所在的包名
import java.util.Date; //用于处理日期类型数据（对应数据库的日期字段)
//MyBatis-Plus 的核心注解，用于实体类与数据库表的映射配置
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@TableName("\"users\"") // （MyBatis-Plus 注解）
// 表示实体类对应的数据库表名 "\"users\""使用双引号转义
// 很多数据库（如 MySQL、PostgresSQL）的关键字（保留字），直接使用可能导致 SQL 语法错误，通过转义可以明确表示表名为users
public class Users {
    // @TableId：标识当前字段是数据库表的主键
    // type属性 指定主键生成策略为 "自增"，即数据库会自动为该列生成递增的唯一值（需数据库表的id列本身设置为自增）
    @TableId(value = "\"id\"", type = IdType.AUTO) // 为id字段添加转义的双引号
    private Integer id;
    // @TableField("\"列名\"")用于指定非主键字段与数据库列的映射关系，同样通过转义处理可能的关键字
    @TableField("\"name\"")
    private String name;

    @TableField("\"password\"")
    private String password;

    @TableField("\"sex\"")
    private String sex;

    @TableField("\"birth_date\"")
    private Date birthDate;

    @TableField("\"department\"")
    private String department;

    @TableField("\"telephone\"")
    private String telephone;

    @TableField("\"email\"")
    private String email;
    // 新增角色字段：ADMIN-管理员，USER-普通用户
    @TableField("\"role\"")
    private String role;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    @JsonIgnore
    public String getPassword() {
        return password;
    }
    @JsonProperty
    public void setPassword(String password) {
        this.password = password;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

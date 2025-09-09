import request from '@/utils/request'

// 用户登录参数类型
export interface LoginParams {
  name: string
  password: string
}

// 用户注册参数类型
export interface RegisterParams {
  name: string
  password: string
}

// 登录响应数据类型
export interface LoginResponse {
  code: number
  data: {
    id: number
    name: string
    password: string
    sex: string
    birthDate: string
    department: string
    telephone: string
    email: string
    role: string
  }
  message: string
  token: string
}

// 注册响应数据类型
export interface RegisterResponse {
  code: number
  message: string
}

// 登录接口
export const login = (data: LoginParams) => {
  return request<LoginResponse>({
    url: '/users/login',
    method: 'POST',
    data,
  })
}

// 注册接口
export const register = (data: RegisterParams) => {
  return request<RegisterResponse>({
    url: '/users/register',
    method: 'POST',
    data,
  })
}
// 分页查询参数类型
export interface PageQueryParams {
  pageNum: string | number
  pageSize: string | number
}

// 分页查询响应类型
export interface PageResponse {
  total: number
  current: number
  code: number
  pages: number
  data: User[]
  size: number
  message: string
}

// 用户信息类型
export interface User {
  id: number
  name: string
  password?: string
  sex: string | null
  birthDate: string | null
  department: string | null
  telephone: string | null
  email: string | null
}

// 分页查询用户
export const getUserPage = (params: PageQueryParams) => {
  return request<PageResponse>({
    url: '/users/page',
    method: 'GET',
    params,
  })
}

// 按ID查询用户
export const getUserById = (id: number) => {
  return request<{
    code: number
    data: User
    message: string
  }>({
    url: `/users/${id}`,
    method: 'GET',
  })
}

// 按ID删除用户
export const deleteUser = (id: number) => {
  return request<{
    code: number
    message: string
  }>({
    url: `/users/delete/${id}`,
    method: 'DELETE',
  })
}

// 更新用户信息
export const updateUser = (data: User) => {
  return request<{
    code: number
    message: string
  }>({
    url: '/users/update',
    method: 'PUT',
    data,
  })
}

<script setup lang="ts">
// 定义用户数据类型
interface User {
  id: number
  name: string
  sex: string | null
  birthDate: string | null
  department: string | null
  telephone: string | null
  email: string | null
  role?: string
}

// 导入所需的API方法和组件
import { getUserPage, deleteUser, getUserById, updateUser } from '@/api/user'
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 用户数据和分页相关变量
const userData = ref<User[]>([]) // 用户数据列表
const totalUsers = ref(0) // 总用户数
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页显示数量

// 编辑表单相关变量
const dialogVisible = ref(false) // 控制编辑对话框显示/隐藏
const editFormRef = ref() // 编辑表单引用

// 编辑表单数据
const editForm = reactive({
  id: 0,
  name: '',
  sex: '',
  birthDate: '',
  department: '',
  telephone: '',
  email: '',
  role: '',
})

// 编辑表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 5,
      max: 10,
      message: '用户名长度在 5 到 10 个字符',
      trigger: 'blur',
    },
  ],
  sex: [], // 性别字段为可选
  birthDate: [], // 出生日期字段为可选
  department: [], // 部门字段为可选
  telephone: [
    // 电话号码格式验证（如果填写了的话）
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的电话号码',
      trigger: 'blur',
    },
  ],
  email: [
    // 邮箱格式验证（如果填写了的话）
    {
      type: 'email' as const,
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
}

// 获取用户数据函数
const fetchUserData = async (page = 1, size = 10) => {
  try {
    // 调用API获取用户分页数据
    const response = await getUserPage({ pageNum: page, pageSize: size })
    totalUsers.value = response.data.total // 设置总用户数
    userData.value = response.data.data // 设置用户数据列表
    currentPage.value = page // 设置当前页码
    pageSize.value = size // 设置每页显示数量

    // 处理日期格式
    userData.value.forEach((user) => {
      if (user.birthDate) {
        // 格式化为xxxx-xx-xx
        const date = new Date(user.birthDate)
        user.birthDate = `${date.getFullYear()}年-${(date.getMonth() + 1).toString().padStart(2, '0')}月-${date.getDate().toString().padStart(2, '0')}日`
      }
    })
  } catch (error) {
    console.error('获取用户数据失败', error)
  }
}

// 删除用户函数
const deleteUserById = async (id: number) => {
  try {
    await deleteUser(id)
    console.log('删除用户成功')
    // 删除后刷新当前页数据
    fetchUserData(currentPage.value, pageSize.value)
  } catch (error) {
    console.error('删除用户失败', error)
  }
}

// 页面挂载时获取用户数据
onMounted(() => {
  fetchUserData()
})

// 表格列配置
const userColumns = [
  { label: '用户名', prop: 'name' },
  { label: '权限', prop: 'role' },
  { label: '性别', prop: 'sex' },
  { label: '生日', prop: 'birthDate' },
  { label: '部门', prop: 'department' },
  { label: '电话', prop: 'telephone' },
  { label: '邮箱', prop: 'email' },
]

// 处理编辑事件
const handleEditUser = async (index: number, row: User) => {
  try {
    // 获取用户详细信息
    const response = await getUserById(row.id)
    if (response.data.code === 200) {
      Object.assign(editForm, response.data.data)
      // 处理日期格式
      if (editForm.birthDate) {
        const date = new Date(editForm.birthDate)
        editForm.birthDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      }
      dialogVisible.value = true
    } else {
      ElMessage.error('获取用户信息失败：' + response.data.message)
    }
  } catch (error) {
    console.error('获取用户信息出错：', error)
    ElMessage.error('获取用户信息失败，请稍后重试')
  }
}

// 处理删除事件
const handleDeleteUser = (index: number, row: User) => {
  console.log('删除用户:', index, row)
  console.log(row.id)
  deleteUserById(row.id)
}

// 处理分页变化
const handlePageChange = (page: number, size: number) => {
  fetchUserData(page, size)
}

// 提交编辑表单
const submitEditForm = async () => {
  if (!editFormRef.value) return
  try {
    await editFormRef.value.validate()

    // 准备提交的数据
    const submitData = { ...editForm }

    const response = await updateUser(submitData)
    if (response.data.code === 200) {
      ElMessage.success('用户信息更新成功')
      dialogVisible.value = false
      // 刷新当前页数据，保持数据顺序
      fetchUserData(currentPage.value, pageSize.value)
    } else {
      ElMessage.error('更新失败：' + response.data.message)
    }
  } catch (error) {
    console.error('更新用户信息出错：', error)
    ElMessage.error('更新用户信息失败，请稍后重试')
  }
}

// 重置表单
const resetEditForm = () => {
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
}
</script>

<template>
  <!-- 用户信息表格组件 -->
  <table-component
    :data="userData"
    :columns="userColumns"
    :totalUsers="totalUsers"
    :searchKeys="[
      'name',
      'sex',
      'birthDate',
      'department',
      'telephone',
      'email',
    ]"
    @edit="handleEditUser"
    @delete="handleDeleteUser"
    @page-change="handlePageChange"
  ></table-component>

  <!-- 编辑用户对话框 -->
  <el-dialog v-model="dialogVisible" title="编辑用户信息" width="500px">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-width="80px"
    >
      <!-- 用户名输入框 -->
      <el-form-item label="用户名" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入用户名" />
      </el-form-item>

      <!-- 性别选择框 -->
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="editForm.sex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 出生日期选择器 -->
      <el-form-item label="出生日期" prop="birthDate">
        <el-date-picker
          v-model="editForm.birthDate"
          type="date"
          placeholder="选择出生日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <!-- 部门输入框 -->
      <el-form-item label="部门" prop="department">
        <el-input v-model="editForm.department" placeholder="请输入部门" />
      </el-form-item>

      <!-- 电话输入框 -->
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="editForm.telephone" placeholder="请输入电话号码" />
      </el-form-item>

      <!-- 邮箱输入框 -->
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="editForm.email"
          type="email"
          placeholder="请输入邮箱"
        />
      </el-form-item>
    </el-form>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetEditForm">重置</el-button>
        <el-button type="primary" @click="submitEditForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 样式作用域限制在当前组件 */
</style>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { useUserStore } from '@/stores'
import { getUserById, updateUser } from '@/api/user'

// 获取用户状态管理实例
const userStore = useUserStore()

// 表单引用，用于表单验证和重置
const userFormRef = ref<InstanceType<typeof ElForm> | null>(null)

// 用户信息数据对象
const userInfo = reactive({
  id: 0,
  name: '',
  sex: '',
  birthDate: '',
  department: '',
  telephone: '',
  email: '',
  role: '',
})

// 表单验证规则
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

// 获取当前用户ID的方法
const getUserId = () => {
  // 从用户状态中获取用户ID，如果未登录则返回默认值1
  return userStore.userInfo?.id || 1
}

// 根据ID获取用户信息
const getUserInfo = async () => {
  try {
    const userId = getUserId()
    const response = await getUserById(userId)
    if (response.data.code === 200) {
      const data = response.data.data
      // 处理日期格式，转换为YYYY-MM-DD
      if (data.birthDate) {
        const date = new Date(data.birthDate)
        data.birthDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      }
      Object.assign(userInfo, data)
    } else {
      ElMessage.error('获取用户信息失败：' + response.data.message)
    }
  } catch (error) {
    console.error('获取用户信息出错：', error)
    ElMessage.error('获取用户信息失败，请稍后重试')
  }
}

// 提交更新用户信息
const handleSubmit = async () => {
  if (!userFormRef.value) return
  try {
    await userFormRef.value.validate()

    // 准备提交的数据（不包含role字段）
    const submitData = { ...userInfo }
    const response = await updateUser(submitData)
    if (response.data.code === 200) {
      ElMessage.success('用户信息更新成功')
    } else {
      ElMessage.error('更新失败：' + response.data.message)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // 表单验证失败
      if (error.name === 'Error') {
        return
      }
    }
    console.error('更新用户信息出错：', error)
    ElMessage.error('更新用户信息失败，请稍后重试')
  }
}

// 重置表单
const handleReset = () => {
  getUserInfo()
}

// 页面挂载时获取用户信息
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="user-info-container">
    <!-- 用户信息卡片 -->
    <el-card title="用户信息编辑" class="user-card">
      <!-- 用户信息表单 -->
      <el-form
        ref="userFormRef"
        :model="userInfo"
        :rules="rules"
        label-width="120px"
        class="user-form"
      >
        <!-- 用户名输入框 -->
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userInfo.name" placeholder="请输入用户名" />
        </el-form-item>

        <!-- 性别选择框 -->
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="userInfo.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 出生日期选择器 -->
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            v-model="userInfo.birthDate"
            type="date"
            placeholder="选择出生日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <!-- 部门输入框 -->
        <el-form-item label="部门" prop="department">
          <el-input v-model="userInfo.department" placeholder="请输入部门" />
        </el-form-item>

        <!-- 电话输入框 -->
        <el-form-item label="电话" prop="telephone">
          <el-input v-model="userInfo.telephone" placeholder="请输入电话号码" />
        </el-form-item>

        <!-- 邮箱输入框 -->
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userInfo.email"
            type="email"
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <!-- 操作按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交更新</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
/* 用户信息容器样式 */
.user-info-container {
  width: 100%;
  margin: 0 auto;
  padding: 5 10px;
}

/* 用户卡片样式 */
.user-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 用户表单样式 */
.user-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

/* 表单项样式 */
.el-form-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

/* 输入框样式 */
.el-input {
  width: 220px;
}
</style>

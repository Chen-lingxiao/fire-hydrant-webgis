<script lang="ts" setup generic="T extends Record<string, any>">
import { computed, ref, defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'

// 当前页码和每页显示数量
const currentPage = ref(1)
const pageSize = ref(10)

// 定义表格列配置类型
interface TableColumn {
  label: string // 列标题
  prop: string // 对应数据字段
  width?: string | number // 列宽度（可选）
}

// 定义组件 props
const props = defineProps({
  // 表格数据
  data: {
    type: Array as PropType<T[]>,
    required: true,
  },
  // 列配置
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true,
  },
  // 总用户数（用于分页）
  totalUsers: {
    type: Number,
    default: 0,
  },
  // 搜索关键字列表
  searchKeys: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

// 定义组件事件
const emit = defineEmits<{
  (e: 'edit', index: number, row: T): void // 编辑事件
  (e: 'delete', index: number, row: T): void // 删除事件
  (e: 'page-change', page: number, pageSize: number): void // 分页变化事件
}>()

// 搜索关键字
const search = ref('')

// 过滤表格数据
const filterTableData = computed(() => {
  // 如果没有搜索关键字，返回所有数据
  if (!search.value) {
    return props.data
  }

  // 根据搜索关键字过滤数据
  return props.data.filter((item) =>
    props.searchKeys.some((key) => {
      const value = item[key]
      // 检查字段值是否包含搜索关键字（不区分大小写）
      return (
        value &&
        value.toString().toLowerCase().includes(search.value.toLowerCase())
      )
    })
  )
})

// 处理编辑事件
const handleEdit = (index: number, row: T) => {
  emit('edit', index, row)
}

// 处理删除事件
const handleDelete = (index: number, row: T) => {
  emit('delete', index, row)
}

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  currentPage.value = 1 // 重置到第一页
  emit('page-change', currentPage.value, val)
}

// 处理当前页变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('page-change', val, pageSize.value)
}
</script>

<template>
  <div class="content">
    <!-- 标题 -->
    <div class="title">用户信息表</div>
    <div class="table-wrapper">
      <!-- Element Plus 表格组件 -->
      <el-table :data="filterTableData" class="table">
        <!-- 动态生成表格列 -->
        <el-table-column
          v-for="(col, index) in columns"
          :key="index"
          :label="col.label"
          :prop="col.prop"
          :width="col.width"
        />
        <!-- 操作列 -->
        <el-table-column align="center">
          <!-- 表头搜索框 -->
          <template #header>
            <el-input
              v-model="search"
              size="small"
              placeholder="输入进行搜索"
            />
          </template>
          <!-- 操作按钮 -->
          <template #default="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="page">
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10]"
            :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="props.totalUsers"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 内容容器样式 */
.content {
  flex: 1;
  padding: 20px;
  margin: 20px;
  background-color: #ffffff;
  border: 1px solid #ebeef5;
}

/* 标题样式 */
.content .title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 20px;
}

/* 表格容器样式 */
.table-wrapper {
  position: relative;
  border: 1px solid #ebeef5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

/* 分页样式 */
.page {
  position: absolute;
  bottom: -70px;
  right: 20px;
  margin-top: 20px;
  text-align: right;
}
</style>

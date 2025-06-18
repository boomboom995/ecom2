<template>
  <div class="customer-management-page">
    <h1>用户管理</h1>

    <el-card class="box-card">
      <div class="search-area">
        <el-input
          v-model="searchQuery"
          placeholder="输入用户名称搜索"
          clearable
          style="width: 300px; margin-right: 10px;"
          @clear="fetchCustomers"
          @keyup.enter="fetchCustomers"
        ></el-input>
        <el-button type="primary" @click="fetchCustomers">搜索</el-button>
        <el-button type="success" @click="handleAdd">新增用户</el-button>
      </div>

      <el-table
        :data="customers"
        v-loading="loading"
        style="width: 100%; margin-top: 20px;"
        border
      >
        <el-table-column prop="customerId" label="用户ID" width="180"></el-table-column>
        <el-table-column prop="customerName" label="用户名称"></el-table-column>
        <el-table-column prop="contactInfo" label="联系方式" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除此用户吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.customerId)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页占位符 -->
      <div class="pagination-placeholder" style="margin-top: 20px; text-align: center;">
        <el-text class="mx-1" type="info">注：后端API未提供分页，此处为分页组件占位符。</el-text>
      </div>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formTitle"
      width="500px"
      :before-close="resetForm"
    >
      <el-form
        :model="customerForm"
        :rules="rules"
        ref="customerFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名称" prop="customerName">
          <el-input v-model="customerForm.customerName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactInfo">
          <el-input v-model="customerForm.contactInfo"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            type="textarea"
            v-model="customerForm.address"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/api/customer';

const customers = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const dialogVisible = ref(false);
const formTitle = ref('');
const customerFormRef = ref(null); // 表单引用

const customerForm = reactive({
  customerId: null,
  customerName: '',
  contactInfo: '',
  address: '',
});

const rules = reactive({
  customerName: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
  ],
  contactInfo: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
});

// 获取用户列表
const fetchCustomers = async () => {
  loading.value = true;
  try {
    const params = searchQuery.value ? { name: searchQuery.value } : {};
    const data = await getCustomers(params);
    customers.value = data;
  } catch (error) {
    ElMessage.error('获取用户列表失败: ' + (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 新增用户
const handleAdd = () => {
  resetForm();
  formTitle.value = '新增用户';
  dialogVisible.value = true;
};

// 编辑用户
const handleEdit = (row) => {
  formTitle.value = '修改用户';
  Object.assign(customerForm, row);
  dialogVisible.value = true;
};

// 删除用户
const handleDelete = async (id) => {
  try {
    await deleteCustomer(id);
    ElMessage.success('用户删除成功！');
    fetchCustomers(); // 刷新列表
  } catch (error) {
    ElMessage.error('用户删除失败: ' + (error.message || '未知错误'));
  }
};

// 提交表单（新增/编辑）
const submitForm = () => {
  customerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (customerForm.customerId) {
          // 编辑
          await updateCustomer(customerForm.customerId, customerForm);
          ElMessage.success('用户信息修改成功！');
        } else {
          // 新增
          await addCustomer(customerForm);
          ElMessage.success('用户新增成功！');
        }
        dialogVisible.value = false;
        fetchCustomers(); // 刷新列表
      } catch (error) {
        ElMessage.error(
          (customerForm.customerId ? '修改' : '新增') +
            '用户失败: ' +
            (error.message || '未知错误')
        );
      }
    } else {
      console.log('表单验证失败');
      return false;
    }
  });
};

// 重置表单
const resetForm = () => {
  if (customerFormRef.value) {
    customerFormRef.value.resetFields();
  }
  customerForm.customerId = null;
  customerForm.customerName = '';
  customerForm.contactInfo = '';
  customerForm.address = '';
  dialogVisible.value = false;
};

onMounted(() => {
  fetchCustomers();
});
</script>

<style scoped>
.customer-management-page {
  padding: 20px;
}

.search-area {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style> 
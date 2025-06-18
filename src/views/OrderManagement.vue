<template>
  <div class="order-management-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>订单管理</h2>
        </div>
      </template>

      <div class="search-area">
        <el-input
          v-model="searchQuery.customerId"
          placeholder="输入客户ID搜索"
          clearable
          style="width: 200px;"
          @clear="fetchOrders"
          @keyup.enter="fetchOrders"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="searchQuery.orderStatus"
          placeholder="选择订单状态"
          clearable
          style="width: 150px;"
          @clear="fetchOrders"
        >
          <el-option label="已支付" value="已支付"></el-option>
          <el-option label="待支付" value="待支付"></el-option>
          <el-option label="已取消" value="已取消"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
        <el-button type="primary" @click="fetchOrders" :icon="Search">搜索</el-button>
        <el-button type="success" @click="handleAdd" :icon="Plus">新增订单</el-button>
      </div>

      <el-table
        :data="orders"
        v-loading="loading"
        style="width: 100%;"
        border
        stripe
      >
        <el-table-column prop="orderId" label="订单ID" width="180"></el-table-column>
        <el-table-column prop="customerId" label="客户ID" width="180"></el-table-column>
        <el-table-column prop="productId" label="商品ID" width="180"></el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" align="center"></el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120" align="right">
          <template #default="scope">
            <span style="color: #f56c6c; font-weight: bold;">
              ¥{{ formatCurrency(scope.row.totalAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.orderStatus)" size="small">
              {{ scope.row.orderStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row.orderId)"
              :icon="Delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页占位符 -->
      <div class="pagination-placeholder" style="margin-top: 20px; text-align: center;">
        <el-text class="mx-1" type="info">注：后端API未提供分页，此处为分页组件占位符。</el-text>
      </div>
    </el-card>

    <!-- 新增/编辑订单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formTitle"
      width="500px"
      :before-close="resetForm"
    >
      <el-form
        :model="orderForm"
        :rules="rules"
        ref="orderFormRef"
        label-width="100px"
      >
        <el-form-item label="客户" prop="customerId">
          <el-select v-model="orderForm.customerId" placeholder="请选择客户" style="width: 100%;">
            <el-option
              v-for="customer in customers"
              :key="customer.customerId"
              :label="customer.customerName"
              :value="customer.customerId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" prop="productId">
          <el-select v-model="orderForm.productId" placeholder="请选择商品" style="width: 100%;">
            <el-option
              v-for="product in products"
              :key="product.productId"
              :label="product.productName"
              :value="product.productId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number
            v-model="orderForm.quantity"
            :min="1"
            :step="1"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="总金额" prop="totalAmount">
          <el-input-number
            v-model="orderForm.totalAmount"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="orderForm.orderStatus" placeholder="请选择订单状态" style="width: 100%;">
            <el-option label="已支付" value="已支付"></el-option>
            <el-option label="待支付" value="待支付"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue';
import request from '@/utils/request';

const orders = ref([]);
const loading = ref(true);
const searchQuery = reactive({ customerId: '', orderStatus: '' });

// 添加商品和用户列表
const products = ref([]);
const customers = ref([]);

const dialogVisible = ref(false);
const formTitle = ref('');
const orderFormRef = ref(null); // 表单引用

const orderForm = reactive({
  orderId: null,
  customerId: '',
  productId: '',
  quantity: 1,
  totalAmount: 0,
  orderStatus: '待支付',
});

const rules = reactive({
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  productId: [{ required: true, message: '请选择商品', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  totalAmount: [{ required: true, message: '请输入总金额', trigger: 'blur' }],
  orderStatus: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
});

// 格式化价格
const formatCurrency = (amount) => {
  return Number(amount).toFixed(2);
};

// 获取状态标签类型
const getStatusType = (status) => {
  const statusMap = {
    '已支付': 'success',
    '待支付': 'warning', 
    '已取消': 'danger',
    '已完成': 'info'
  };
  return statusMap[status] || '';
};

// 获取商品列表
const fetchProducts = async () => {
  try {
    const data = await request({
      url: '/products',
      method: 'get'
    });
    products.value = data;
  } catch (error) {
    ElMessage.error('获取商品列表失败: ' + (error.message || '未知错误'));
  }
};

// 获取用户列表
const fetchCustomers = async () => {
  try {
    const data = await request({
      url: '/customers',
      method: 'get'
    });
    customers.value = data;
  } catch (error) {
    ElMessage.error('获取用户列表失败: ' + (error.message || '未知错误'));
  }
};

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true;
  try {
    const params = {};
    if (searchQuery.customerId) {
      params.customerId = searchQuery.customerId;
    }
    if (searchQuery.orderStatus) {
      params.orderStatus = searchQuery.orderStatus;
    }
    const data = await request({
      url: '/orders',
      method: 'get',
      params
    });
    orders.value = data;
  } catch (error) {
    ElMessage.error('获取订单列表失败: ' + (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 新增订单
const handleAdd = async () => {
  // 确保在打开对话框前获取最新的商品和用户列表
  await Promise.all([fetchProducts(), fetchCustomers()]);
  resetForm();
  formTitle.value = '新增订单';
  dialogVisible.value = true;
};

// 编辑订单
const handleEdit = (row) => {
  formTitle.value = '修改订单';
  Object.assign(orderForm, row);
  dialogVisible.value = true;
};

// 删除订单 - 使用MessageBox确认
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该订单，是否继续？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    await request({
      url: `/orders/${id}`,
      method: 'delete'
    });
    ElMessage.success('订单删除成功！');
    fetchOrders(); // 刷新列表
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除');
    } else {
      ElMessage.error('订单删除失败: ' + (error.message || '未知错误'));
    }
  }
};

// 提交表单（新增/编辑）
const submitForm = () => {
  orderFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 创建提交数据对象，移除orderId字段
        const submitData = {
          customerId: orderForm.customerId,
          productId: orderForm.productId,
          quantity: orderForm.quantity,
          totalAmount: orderForm.totalAmount,
          orderStatus: orderForm.orderStatus
        };

        if (orderForm.orderId) {
          // 编辑
          await request({
            url: `/orders/${orderForm.orderId}`,
            method: 'put',
            data: submitData
          });
          ElMessage.success('订单信息修改成功！');
        } else {
          // 新增
          await request({
            url: '/orders',
            method: 'post',
            data: submitData
          });
          ElMessage.success('订单新增成功！');
        }
        dialogVisible.value = false;
        fetchOrders(); // 刷新列表
      } catch (error) {
        ElMessage.error(
          (orderForm.orderId ? '修改' : '新增') +
            '订单失败: ' +
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
  if (orderFormRef.value) {
    orderFormRef.value.resetFields();
  }
  orderForm.orderId = null;
  orderForm.customerId = '';
  orderForm.productId = '';
  orderForm.quantity = 1;
  orderForm.totalAmount = 0;
  orderForm.orderStatus = '待支付';
  dialogVisible.value = false;
};

onMounted(() => {
  fetchOrders();
  fetchProducts();
  fetchCustomers();
});
</script>

<style scoped>
.order-management-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style> 
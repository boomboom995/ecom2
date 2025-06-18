<template>
  <div class="delivery-management-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>配送管理</h2>
        </div>
      </template>

      <div class="search-area">
        <el-input
          v-model="searchQuery.orderId"
          placeholder="输入订单ID搜索"
          clearable
          style="width: 200px;"
          @clear="fetchDeliveries"
          @keyup.enter="fetchDeliveries"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="searchQuery.status"
          placeholder="选择配送状态"
          clearable
          style="width: 150px;"
          @clear="fetchDeliveries"
        >
          <el-option label="待发货" value="待发货"></el-option>
          <el-option label="运输中" value="运输中"></el-option>
          <el-option label="已送达" value="已送达"></el-option>
          <el-option label="已取消" value="已取消"></el-option>
        </el-select>
        <el-button type="primary" @click="fetchDeliveries" :icon="Search">搜索</el-button>
        <el-button type="success" @click="handleAdd" :icon="Plus">新增配送</el-button>
      </div>

      <el-table
        :data="deliveries"
        v-loading="loading"
        style="width: 100%;"
        border
        stripe
      >
        <el-table-column prop="deliveryId" label="配送ID" width="180"></el-table-column>
        <el-table-column prop="orderId" label="订单ID" width="180"></el-table-column>
        <el-table-column prop="deliveryStatus" label="配送状态" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getDeliveryStatusType(scope.row.deliveryStatus)" size="small">
              {{ scope.row.deliveryStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliverer" label="配送员">
          <template #default="scope">
            <div style="display: flex; align-items: center;">
              <el-icon style="margin-right: 8px; color: #409eff;"><User /></el-icon>
              {{ scope.row.deliverer }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryTime" label="配送时间" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center;">
              <el-icon style="margin-right: 8px; color: #67c23a;"><Clock /></el-icon>
              {{ formatDate(scope.row.deliveryTime) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row.deliveryId)"
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

    <!-- 新增/编辑配送对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formTitle"
      width="500px"
      :before-close="resetForm"
    >
      <el-form
        :model="deliveryForm"
        :rules="rules"
        ref="deliveryFormRef"
        label-width="100px"
      >
        <el-form-item label="订单ID" prop="orderId">
          <el-select
            v-model="deliveryForm.orderId"
            placeholder="选择订单"
            style="width: 100%;"
            @change="fetchDeliveries"
          >
            <el-option
              v-for="order in orders"
              :key="order.orderId"
              :label="order.orderId"
              :value="order.orderId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送状态" prop="deliveryStatus">
          <el-select
            v-model="deliveryForm.deliveryStatus"
            placeholder="请选择配送状态"
            style="width: 100%;"
          >
            <el-option label="待发货" value="待发货"></el-option>
            <el-option label="运输中" value="运输中"></el-option>
            <el-option label="已送达" value="已送达"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送员" prop="deliverer">
          <el-input v-model="deliveryForm.deliverer">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="配送时间" prop="deliveryTime">
          <el-date-picker
            v-model="deliveryForm.deliveryTime"
            type="datetime"
            placeholder="选择日期和时间"
            value-format="YYYY-MM-DDTHH:mm:ss.000+00:00"
            style="width: 100%;"
          ></el-date-picker>
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
import { Search, Plus, Edit, Delete, User, Clock } from '@element-plus/icons-vue';
import request from '@/utils/request';

const deliveries = ref([]);
const loading = ref(true);
const searchQuery = reactive({ orderId: '', status: '' });

// 添加订单列表
const orders = ref([]);

const dialogVisible = ref(false);
const formTitle = ref('');
const deliveryFormRef = ref(null); // 表单引用

const deliveryForm = reactive({
  deliveryId: null,
  orderId: '',
  deliveryStatus: '待发货',
  deliverer: '',
  deliveryTime: '',
});

const rules = reactive({
  orderId: [{ required: true, message: '请选择订单', trigger: 'change' }],
  deliveryStatus: [
    { required: true, message: '请选择配送状态', trigger: 'change' },
  ],
  deliverer: [{ required: true, message: '请输入配送员姓名', trigger: 'blur' }],
  deliveryTime: [{ required: true, message: '请选择配送时间', trigger: 'change' }],
});

// 获取配送状态类型
const getDeliveryStatusType = (status) => {
  const statusMap = {
    '待发货': 'warning',
    '运输中': 'primary',
    '已送达': 'success',
    '已取消': 'danger'
  };
  return statusMap[status] || '';
};

// 格式化日期时间
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取订单列表
const fetchOrders = async () => {
  try {
    const data = await request({
      url: '/orders',
      method: 'get'
    });
    orders.value = data;
  } catch (error) {
    ElMessage.error('获取订单列表失败: ' + (error.message || '未知错误'));
  }
};

// 获取配送列表
const fetchDeliveries = async () => {
  loading.value = true;
  try {
    const params = {};
    if (searchQuery.orderId) {
      params.orderId = searchQuery.orderId;
    }
    if (searchQuery.status) {
      params.status = searchQuery.status;
    }
    const data = await request({
      url: '/deliveries',
      method: 'get',
      params
    });
    deliveries.value = data;
  } catch (error) {
    ElMessage.error('获取配送列表失败: ' + (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 新增配送
const handleAdd = async () => {
  await fetchOrders(); // 确保在打开对话框前获取最新的订单列表
  resetForm();
  formTitle.value = '新增配送';
  dialogVisible.value = true;
};

// 编辑配送
const handleEdit = (row) => {
  formTitle.value = '修改配送';
  Object.assign(deliveryForm, row);
  dialogVisible.value = true;
};

// 删除配送 - 使用MessageBox确认
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该配送记录，是否继续？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    await request({
      url: `/deliveries/${id}`,
      method: 'delete'
    });
    ElMessage.success('配送删除成功！');
    fetchDeliveries(); // 刷新列表
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除');
    } else {
      ElMessage.error('配送删除失败: ' + (error.message || '未知错误'));
    }
  }
};

// 提交表单（新增/编辑）
const submitForm = () => {
  deliveryFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 创建提交数据对象，移除deliveryId字段
        const submitData = {
          orderId: deliveryForm.orderId,
          deliveryStatus: deliveryForm.deliveryStatus,
          deliverer: deliveryForm.deliverer,
          deliveryTime: deliveryForm.deliveryTime
        };

        if (deliveryForm.deliveryId) {
          // 编辑
          await request({
            url: `/deliveries/${deliveryForm.deliveryId}`,
            method: 'put',
            data: submitData
          });
          ElMessage.success('配送信息修改成功！');
        } else {
          // 新增
          await request({
            url: '/deliveries',
            method: 'post',
            data: submitData
          });
          ElMessage.success('配送新增成功！');
        }
        dialogVisible.value = false;
        fetchDeliveries(); // 刷新列表
      } catch (error) {
        ElMessage.error(
          (deliveryForm.deliveryId ? '修改' : '新增') +
            '配送失败: ' +
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
  if (deliveryFormRef.value) {
    deliveryFormRef.value.resetFields();
  }
  deliveryForm.deliveryId = null;
  deliveryForm.orderId = '';
  deliveryForm.deliveryStatus = '待发货';
  deliveryForm.deliverer = '';
  deliveryForm.deliveryTime = '';
  dialogVisible.value = false;
};

onMounted(() => {
  fetchDeliveries();
  fetchOrders();
});
</script>

<style scoped>
.delivery-management-page {
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
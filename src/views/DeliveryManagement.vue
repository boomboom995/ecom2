<template>
  <div class="delivery-management-page">
    <h1>配送管理</h1>

    <el-card class="box-card">
      <div class="search-area">
        <el-input
          v-model="searchQuery.orderId"
          placeholder="输入订单ID搜索"
          clearable
          style="width: 200px; margin-right: 10px;"
          @clear="fetchDeliveries"
          @keyup.enter="fetchDeliveries"
        ></el-input>
        <el-select
          v-model="searchQuery.status"
          placeholder="选择配送状态"
          clearable
          style="width: 150px; margin-right: 10px;"
          @clear="fetchDeliveries"
        >
          <el-option label="待发货" value="待发货"></el-option>
          <el-option label="运输中" value="运输中"></el-option>
          <el-option label="已送达" value="已送达"></el-option>
          <el-option label="已取消" value="已取消"></el-option>
        </el-select>
        <el-button type="primary" @click="fetchDeliveries">搜索</el-button>
        <el-button type="success" @click="handleAdd">新增配送</el-button>
      </div>

      <el-table
        :data="deliveries"
        v-loading="loading"
        style="width: 100%; margin-top: 20px;"
        border
      >
        <el-table-column prop="deliveryId" label="配送ID" width="180"></el-table-column>
        <el-table-column prop="orderId" label="订单ID" width="180"></el-table-column>
        <el-table-column prop="deliveryStatus" label="配送状态" width="120"></el-table-column>
        <el-table-column prop="deliverer" label="配送员"></el-table-column>
        <el-table-column prop="deliveryTime" label="配送时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.deliveryTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除此配送吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.deliveryId)"
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
          <el-input v-model="deliveryForm.deliverer"></el-input>
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
import { ElMessage } from 'element-plus';
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

// 格式化日期时间
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString(); // 或根据需要格式化
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
  // 确保在打开对话框前获取最新的订单列表
  await fetchOrders();
  resetForm();
  formTitle.value = '新增配送';
  dialogVisible.value = true;
};

// 编辑配送
const handleEdit = (row) => {
  formTitle.value = '修改配送';
  // 注意：后端返回的 ISO 8601 字符串可能需要转换为 Date 对象才能被 el-date-picker 正常显示
  const tempRow = { ...row };
  if (tempRow.deliveryTime) {
    tempRow.deliveryTime = new Date(tempRow.deliveryTime);
  }
  Object.assign(deliveryForm, tempRow);
  dialogVisible.value = true;
};

// 删除配送
const handleDelete = async (id) => {
  try {
    await request({
      url: `/deliveries/${id}`,
      method: 'delete'
    });
    ElMessage.success('配送删除成功！');
    fetchDeliveries(); // 刷新列表
  } catch (error) {
    ElMessage.error('配送删除失败: ' + (error.message || '未知错误'));
  }
};

// 提交表单（新增/编辑）
const submitForm = () => {
  deliveryFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 确保 deliveryTime 格式是后端需要的 ISO 8601 字符串
        const submitData = { ...deliveryForm };
        if (submitData.deliveryTime instanceof Date) {
          // 如果是 Date 对象，转换为 ISO 8601 字符串
          submitData.deliveryTime = submitData.deliveryTime.toISOString();
        } else if (typeof submitData.deliveryTime === 'string' && submitData.deliveryTime.length > 0 && !submitData.deliveryTime.endsWith('Z')) {
          // 如果是日期字符串但没有时区信息，假设为本地时间并转换为 ISO 8601 UTC
          submitData.deliveryTime = new Date(submitData.deliveryTime).toISOString();
        }

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
});
</script>

<style scoped>
.delivery-management-page {
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
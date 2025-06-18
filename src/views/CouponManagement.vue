<template>
  <div class="coupon-management-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>优惠券管理</h2>
        </div>
      </template>

      <div class="search-area">
        <el-input
          v-model="searchQuery.userId"
          placeholder="输入用户ID搜索"
          clearable
          style="width: 200px;"
          @clear="fetchCoupons"
          @keyup.enter="fetchCoupons"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-input
          v-model="searchQuery.couponCode"
          placeholder="输入优惠券码搜索"
          clearable
          style="width: 200px;"
          @clear="fetchCoupons"
          @keyup.enter="fetchCoupons"
        >
          <template #prefix>
            <el-icon><Ticket /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="fetchCoupons" :icon="Search">搜索</el-button>
        <el-button type="success" @click="handleAdd" :icon="Plus">新增优惠券</el-button>
      </div>

      <el-table
        :data="coupons"
        v-loading="loading"
        style="width: 100%;"
        border
        stripe
      >
        <el-table-column prop="couponId" label="优惠券ID" width="180"></el-table-column>
        <el-table-column prop="couponName" label="优惠券名称" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="couponCode" label="优惠券码" width="150">
          <template #default="scope">
            <el-tag type="info" size="small">{{ scope.row.couponCode }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="discountAmount" label="折扣金额" width="120" align="right">
          <template #default="scope">
            <span style="color: #f56c6c; font-weight: bold;">
              ¥{{ formatCurrency(scope.row.discountAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="expiryDate" label="有效期至" width="180">
          <template #default="scope">
            <div style="display: flex; align-items: center;">
              <el-icon style="margin-right: 8px; color: #e6a23c;"><Calendar /></el-icon>
              <span :style="{ color: isExpired(scope.row.expiryDate) ? '#f56c6c' : '#606266' }">
                {{ formatDate(scope.row.expiryDate) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="180">
          <template #default="scope">
            <span v-if="scope.row.userId">{{ scope.row.userId }}</span>
            <el-tag v-else type="success" size="small">通用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">编辑</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row.couponId)"
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

    <!-- 新增/编辑优惠券对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formTitle"
      width="500px"
      :before-close="resetForm"
    >
      <el-form
        :model="couponForm"
        :rules="rules"
        ref="couponFormRef"
        label-width="100px"
      >
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="couponForm.couponName">
            <template #prefix>
              <el-icon><Present /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠券码" prop="couponCode">
          <el-input v-model="couponForm.couponCode">
            <template #prefix>
              <el-icon><Ticket /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="折扣金额" prop="discountAmount">
          <el-input-number
            v-model="couponForm.discountAmount"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="有效期至" prop="expiryDate">
          <el-date-picker
            v-model="couponForm.expiryDate"
            type="date"
            placeholder="选择有效期"
            value-format="YYYY-MM-DD"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="couponForm.userId" placeholder="留空表示通用优惠券">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
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
import { Search, Plus, Edit, Delete, Present, Ticket, Calendar, User } from '@element-plus/icons-vue';
import {
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from '@/api/coupon';

const coupons = ref([]);
const loading = ref(true);
const searchQuery = reactive({ userId: '', couponCode: '' });

const dialogVisible = ref(false);
const formTitle = ref('');
const couponFormRef = ref(null); // 表单引用

const couponForm = reactive({
  couponId: null,
  couponName: '',
  couponCode: '',
  discountAmount: 0,
  expiryDate: '',
  userId: null, // null 表示通用优惠券
});

const rules = reactive({
  couponName: [
    { required: true, message: '请输入优惠券名称', trigger: 'blur' },
  ],
  couponCode: [
    { required: true, message: '请输入优惠券码', trigger: 'blur' },
  ],
  discountAmount: [
    { required: true, message: '请输入折扣金额', trigger: 'blur' },
  ],
  expiryDate: [
    { required: true, message: '请选择有效期', trigger: 'change' },
  ],
});

// 格式化价格
const formatCurrency = (amount) => {
  return Number(amount).toFixed(2);
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 检查是否过期
const isExpired = (dateString) => {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiryDate < today;
};

// 获取优惠券列表
const fetchCoupons = async () => {
  loading.value = true;
  try {
    const params = {};
    if (searchQuery.userId) {
      params.userId = searchQuery.userId;
    }
    if (searchQuery.couponCode) {
      params.couponCode = searchQuery.couponCode;
    }
    const data = await getCoupons(params);
    coupons.value = data;
  } catch (error) {
    ElMessage.error('获取优惠券列表失败: ' + (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 新增优惠券
const handleAdd = () => {
  resetForm();
  formTitle.value = '新增优惠券';
  dialogVisible.value = true;
};

// 编辑优惠券
const handleEdit = (row) => {
  formTitle.value = '修改优惠券';
  // 复制对象属性，确保响应式更新
  const tempRow = { ...row };
  Object.assign(couponForm, tempRow);
  dialogVisible.value = true;
};

// 删除优惠券 - 使用MessageBox确认
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该优惠券，是否继续？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    await deleteCoupon(id);
    ElMessage.success('优惠券删除成功！');
    fetchCoupons(); // 刷新列表
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消删除');
    } else {
      ElMessage.error('优惠券删除失败: ' + (error.message || '未知错误'));
    }
  }
};

// 提交表单（新增/编辑）
const submitForm = () => {
  couponFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (couponForm.couponId) {
          // 编辑
          await updateCoupon(couponForm.couponId, couponForm);
          ElMessage.success('优惠券信息修改成功！');
        } else {
          // 新增
          await addCoupon(couponForm);
          ElMessage.success('优惠券新增成功！');
        }
        dialogVisible.value = false;
        fetchCoupons(); // 刷新列表
      } catch (error) {
        ElMessage.error(
          (couponForm.couponId ? '修改' : '新增') +
            '优惠券失败: ' +
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
  if (couponFormRef.value) {
    couponFormRef.value.resetFields();
  }
  couponForm.couponId = null;
  couponForm.couponName = '';
  couponForm.couponCode = '';
  couponForm.discountAmount = 0;
  couponForm.expiryDate = '';
  couponForm.userId = null;
  dialogVisible.value = false;
};

onMounted(() => {
  fetchCoupons();
});
</script>

<style scoped>
.coupon-management-page {
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
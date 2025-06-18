<template>
  <div class="product-management-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>{{ $t('menu.products') }}</h2>
        </div>
      </template>

      <div class="search-area">
        <el-input
          v-model="searchQuery"
          :placeholder="$t('product.searchPlaceholder') || '输入商品名称搜索'"
          clearable
          style="width: 300px;"
          @clear="fetchProducts"
          @keyup.enter="fetchProducts"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="fetchProducts" :icon="Search">{{ $t('common.search') }}</el-button>
        <el-button type="success" @click="handleAdd" :icon="Plus">{{ $t('product.addProduct') }}</el-button>
      </div>

      <el-table
        :data="products"
        v-loading="loading"
        style="width: 100%;"
        border
        stripe
      >
        <el-table-column prop="productId" :label="$t('product.id')" width="180"></el-table-column>
        <el-table-column prop="productName" :label="$t('product.name')" width="180"></el-table-column>
        <el-table-column prop="price" :label="$t('product.price')" width="120" align="right">
          <template #default="scope">
            <span style="color: #f56c6c; font-weight: bold;">
              ¥{{ formatCurrency(scope.row.price) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" :label="$t('product.description')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stock" :label="$t('product.stock')" width="120" align="center">
          <template #default="scope">
            <el-tag :type="getStockType(scope.row.stock)" size="small">
              {{ scope.row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="180" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)" :icon="Edit">{{ $t('common.edit') }}</el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(scope.row.productId)"
              :icon="Delete"
            >{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页占位符 -->
      <div class="pagination-placeholder" style="margin-top: 20px; text-align: center;">
        <el-text class="mx-1" type="info">{{ $t('common.paginationPlaceholder') || '注：后端API未提供分页，此处为分页组件占位符。' }}</el-text>
      </div>
    </el-card>

    <!-- 新增/编辑商品对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formTitle"
      width="500px"
      :before-close="resetForm"
    >
      <el-form
        :model="productForm"
        :rules="rules"
        ref="productFormRef"
        label-width="100px"
      >
        <el-form-item :label="$t('product.name')" prop="productName">
          <el-input v-model="productForm.productName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('product.price')" prop="price">
          <el-input-number
            v-model="productForm.price"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
        <el-form-item :label="$t('product.description')" prop="description">
          <el-input
            type="textarea"
            v-model="productForm.description"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('product.stock')" prop="stock">
          <el-input-number
            v-model="productForm.stock"
            :min="0"
            :step="1"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ $t('common.submit') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue';
import request from '@/utils/request';

const { t } = useI18n();

const products = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const dialogVisible = ref(false);
const productFormRef = ref(null); // 表单引用

const formTitle = computed(() => {
  return productForm.productId ? t('product.editProduct') : t('product.addProduct');
});

const productForm = reactive({
  productId: null,
  productName: '',
  price: 0,
  description: '',
  stock: 0,
});

const rules = reactive({
  productName: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
  ],
  price: [{ required: true, message: t('validation.required'), trigger: 'blur' }],
  description: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
  ],
  stock: [{ required: true, message: t('validation.required'), trigger: 'blur' }],
});

// 格式化价格
const formatCurrency = (amount) => {
  return Number(amount).toFixed(2);
};

// 获取库存状态类型
const getStockType = (stock) => {
  if (stock === 0) return 'danger';
  if (stock <= 10) return 'warning'; 
  return 'success';
};

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = searchQuery.value ? { name: searchQuery.value } : {};
    const data = await request({
      url: '/products',
      method: 'get',
      params
    });
    products.value = data;
  } catch (error) {
    ElMessage.error(t('common.fetchDataFailed') + ': ' + (error.message || t('common.unknownError') || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 新增商品
const handleAdd = () => {
  resetForm();
  dialogVisible.value = true;
};

// 编辑商品
const handleEdit = (row) => {
  Object.assign(productForm, row);
  dialogVisible.value = true;
};

// 删除商品 - 使用MessageBox确认
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      t('confirm.deleteMessage').replace('{type}', t('product.name')),
      t('confirm.deleteTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    );
    
    await request({
      url: `/products/${id}`,
      method: 'delete'
    });
    ElMessage.success(t('product.deleteSuccess') || '商品删除成功！');
    fetchProducts(); // 刷新列表
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info(t('common.cancelDelete') || '已取消删除');
    } else {
      ElMessage.error(t('product.deleteFailed') || '商品删除失败: ' + (error.message || '未知错误'));
    }
  }
};

// 提交表单（新增/编辑）
const submitForm = () => {
  productFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (productForm.productId) {
          // 编辑
          await request({
            url: `/products/${productForm.productId}`,
            method: 'put',
            data: productForm
          });
          ElMessage.success(t('product.updateSuccess') || '商品信息修改成功！');
        } else {
          // 新增
          await request({
            url: '/products',
            method: 'post',
            data: productForm
          });
          ElMessage.success(t('product.createSuccess') || '商品新增成功！');
        }
        dialogVisible.value = false;
        fetchProducts(); // 刷新列表
      } catch (error) {
        const operation = productForm.productId ? t('common.update') : t('common.create');
        ElMessage.error(
          operation + t('common.failed') + ': ' + (error.message || t('common.unknownError') || '未知错误')
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
  if (productFormRef.value) {
    productFormRef.value.resetFields();
  }
  productForm.productId = null;
  productForm.productName = '';
  productForm.price = 0;
  productForm.description = '';
  productForm.stock = 0;
  dialogVisible.value = false;
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-management-page {
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
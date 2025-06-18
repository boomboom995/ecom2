<template>
  <div class="product-management-page">
    <h1>商品管理</h1>

    <el-card class="box-card">
      <div class="search-area">
        <el-input
          v-model="searchQuery"
          placeholder="输入商品名称搜索"
          clearable
          style="width: 300px; margin-right: 10px;"
          @clear="fetchProducts"
          @keyup.enter="fetchProducts"
        ></el-input>
        <el-button type="primary" @click="fetchProducts">搜索</el-button>
        <el-button type="success" @click="handleAdd">新增商品</el-button>
      </div>

      <el-table
        :data="products"
        v-loading="loading"
        style="width: 100%; margin-top: 20px;"
        border
      >
        <el-table-column prop="productId" label="商品ID" width="180"></el-table-column>
        <el-table-column prop="productName" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="price" label="价格" width="120"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="stock" label="库存" width="120"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm
              title="确定删除此商品吗?"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="handleDelete(scope.row.productId)"
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
        <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination> -->
        <el-text class="mx-1" type="info">注：后端API未提供分页，此处为分页组件占位符。</el-text>
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
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="productForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number
            v-model="productForm.price"
            :precision="2"
            :step="0.1"
            :min="0"
            style="width: 100%;"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="productForm.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
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
import request from '@/utils/request';

const products = ref([]);
const loading = ref(true);
const searchQuery = ref('');

const dialogVisible = ref(false);
const formTitle = ref('');
const productFormRef = ref(null); // 表单引用

const productForm = reactive({
  productId: null,
  productName: '',
  price: 0,
  description: '',
  stock: 0,
});

const rules = reactive({
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
  ],
  price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
  ],
  stock: [{ required: true, message: '请输入库存数量', trigger: 'blur' }],
});

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
    ElMessage.error('获取商品列表失败: ' + (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 新增商品
const handleAdd = () => {
  resetForm();
  formTitle.value = '新增商品';
  dialogVisible.value = true;
};

// 编辑商品
const handleEdit = (row) => {
  formTitle.value = '修改商品';
  Object.assign(productForm, row);
  dialogVisible.value = true;
};

// 删除商品
const handleDelete = async (id) => {
  try {
    await request({
      url: `/products/${id}`,
      method: 'delete'
    });
    ElMessage.success('商品删除成功！');
    fetchProducts(); // 刷新列表
  } catch (error) {
    ElMessage.error('商品删除失败: ' + (error.message || '未知错误'));
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
          ElMessage.success('商品信息修改成功！');
        } else {
          // 新增
          await request({
            url: '/products',
            method: 'post',
            data: productForm
          });
          ElMessage.success('商品新增成功！');
        }
        dialogVisible.value = false;
        fetchProducts(); // 刷新列表
      } catch (error) {
        ElMessage.error(
          (productForm.productId ? '修改' : '新增') +
            '商品失败: ' +
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

.search-area {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style> 
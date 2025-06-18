<template>
  <div class="blacklist-management-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>{{ $t('blacklist.title') }}</h2>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="border-card">
        <!-- IP黑名单 -->
        <el-tab-pane :label="$t('blacklist.ipBlacklist')" name="ip">
          <div class="tab-content">
            <div class="search-area">
              <el-input
                v-model="ipSearchQuery"
                :placeholder="$t('blacklist.searchIp') || '搜索IP地址'"
                clearable
                style="width: 300px;"
                @keyup.enter="fetchIpBlacklist"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="fetchIpBlacklist" :icon="Search">{{ $t('common.search') }}</el-button>
              <el-button type="danger" @click="showAddIpDialog" :icon="Plus">{{ $t('blacklist.addIpBlacklist') }}</el-button>
            </div>

            <el-table :data="ipBlacklist" v-loading="ipLoading" stripe border style="width: 100%;">
              <el-table-column prop="ipAddress" :label="$t('blacklist.ipAddress')" width="150"></el-table-column>
              <el-table-column prop="reason" :label="$t('blacklist.reason')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createdAt" :label="$t('blacklist.addTime')" width="180">
                <template #default="scope">
                  {{ formatDateTime(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column prop="expiresAt" :label="$t('blacklist.expireTime')" width="180">
                <template #default="scope">
                  <span v-if="scope.row.expiresAt">{{ formatDateTime(scope.row.expiresAt) }}</span>
                  <el-tag v-else type="warning" size="small">{{ $t('blacklist.permanent') }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" :label="$t('user.status')" width="100" align="center">
                <template #default="scope">
                  <el-tag :type="getIpStatusType(scope.row)" size="small">
                    {{ getIpStatusText(scope.row) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.actions')" width="120" align="center">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    type="danger" 
                    @click="removeIpFromBlacklist(scope.row.ipAddress)"
                    :icon="Delete"
                  >{{ $t('blacklist.remove') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 用户黑名单 -->
        <el-tab-pane :label="$t('blacklist.userBlacklist')" name="user">
          <div class="tab-content">
            <div class="search-area">
              <el-input
                v-model="userSearchQuery"
                :placeholder="$t('blacklist.searchUser') || '搜索用户名或ID'"
                clearable
                style="width: 300px;"
                @keyup.enter="fetchUserBlacklist"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="fetchUserBlacklist" :icon="Search">{{ $t('common.search') }}</el-button>
              <el-button type="danger" @click="showAddUserDialog" :icon="Plus">{{ $t('blacklist.addUserBlacklist') }}</el-button>
            </div>

            <el-table :data="userBlacklist" v-loading="userLoading" stripe border style="width: 100%;">
              <el-table-column prop="userId" :label="$t('user.id') || '用户ID'" width="100"></el-table-column>
              <el-table-column prop="username" :label="$t('user.username')" width="150"></el-table-column>
              <el-table-column prop="email" :label="$t('user.email')" width="200"></el-table-column>
              <el-table-column prop="reason" :label="$t('blacklist.banReason')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createdAt" :label="$t('blacklist.addTime')" width="180">
                <template #default="scope">
                  {{ formatDateTime(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.actions')" width="120" align="center">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    type="success" 
                    @click="removeUserFromBlacklist(scope.row.userId)"
                    :icon="CircleCheck"
                  >{{ $t('blacklist.unban') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 商品黑名单 -->
        <el-tab-pane :label="$t('blacklist.productBlacklist')" name="product">
          <div class="tab-content">
            <div class="search-area">
              <el-input
                v-model="productSearchQuery"
                :placeholder="$t('blacklist.searchProduct') || '搜索商品名称或ID'"
                clearable
                style="width: 300px;"
                @keyup.enter="fetchProductBlacklist"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="fetchProductBlacklist" :icon="Search">{{ $t('common.search') }}</el-button>
              <el-button type="danger" @click="showAddProductDialog" :icon="Plus">{{ $t('blacklist.addProductBlacklist') }}</el-button>
            </div>

            <el-table :data="productBlacklist" v-loading="productLoading" stripe border style="width: 100%;">
              <el-table-column prop="productId" :label="$t('product.id')" width="100"></el-table-column>
              <el-table-column prop="productName" :label="$t('product.name')" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="category" :label="$t('product.category')" width="120"></el-table-column>
              <el-table-column prop="reason" :label="$t('blacklist.reason')" show-overflow-tooltip></el-table-column>
              <el-table-column prop="createdAt" :label="$t('blacklist.addTime')" width="180">
                <template #default="scope">
                  {{ formatDateTime(scope.row.createdAt) }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.actions')" width="120" align="center">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    type="success" 
                    @click="removeProductFromBlacklist(scope.row.productId)"
                    :icon="CircleCheck"
                  >{{ $t('blacklist.restore') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加IP黑名单对话框 -->
    <el-dialog v-model="addIpDialogVisible" :title="$t('blacklist.addIpBlacklist')" width="500px">
      <el-form :model="ipForm" :rules="ipRules" ref="ipFormRef" label-width="100px">
        <el-form-item :label="$t('blacklist.ipAddress')" prop="ipAddress">
          <el-input v-model="ipForm.ipAddress" placeholder="请输入IP地址，如：192.168.1.1"></el-input>
        </el-form-item>
        <el-form-item :label="$t('blacklist.banReason')" prop="reason">
          <el-input type="textarea" v-model="ipForm.reason" :rows="3" placeholder="请说明封禁原因"></el-input>
        </el-form-item>
        <el-form-item :label="$t('blacklist.expireTime')">
          <el-date-picker
            v-model="ipForm.expiresAt"
            type="datetime"
            placeholder="留空表示永久封禁"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addIpDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addIpToBlacklist">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 添加用户黑名单对话框 -->
    <el-dialog v-model="addUserDialogVisible" :title="$t('blacklist.addUserBlacklist')" width="500px">
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
        <el-form-item :label="$t('user.username')" prop="userId">
          <el-select
            v-model="userForm.userId"
            placeholder="搜索并选择用户"
            filterable
            remote
            :remote-method="searchUsers"
            style="width: 100%;"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="`${user.username} (${user.email})`"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('blacklist.banReason')" prop="reason">
          <el-input type="textarea" v-model="userForm.reason" :rows="3" placeholder="请说明封禁原因"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addUserDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addUserToBlacklist">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 添加商品黑名单对话框 -->
    <el-dialog v-model="addProductDialogVisible" :title="$t('blacklist.addProductBlacklist')" width="500px">
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="100px">
        <el-form-item :label="$t('product.name')" prop="productId">
          <el-select
            v-model="productForm.productId"
            placeholder="搜索并选择商品"
            filterable
            remote
            :remote-method="searchProducts"
            style="width: 100%;"
          >
            <el-option
              v-for="product in productOptions"
              :key="product.id"
              :label="`${product.name} (ID: ${product.id})`"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('blacklist.reason')" prop="reason">
          <el-input type="textarea" v-model="productForm.reason" :rows="3" placeholder="请说明下架原因"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addProductDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addProductToBlacklist">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Search, Plus, Delete, CircleCheck } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import request from '@/utils/request'

const { t } = useI18n()

// 响应式数据
const activeTab = ref('ip')
const ipSearchQuery = ref('')
const userSearchQuery = ref('')
const productSearchQuery = ref('')
const ipLoading = ref(false)
const userLoading = ref(false)
const productLoading = ref(false)

// 对话框状态
const addIpDialogVisible = ref(false)
const addUserDialogVisible = ref(false)
const addProductDialogVisible = ref(false)

// 表单引用
const ipFormRef = ref(null)
const userFormRef = ref(null)
const productFormRef = ref(null)

// 表单数据
const ipForm = reactive({
  ipAddress: '',
  reason: '',
  expiresAt: null
})

const userForm = reactive({
  userId: null,
  reason: ''
})

const productForm = reactive({
  productId: null,
  reason: ''
})

// 选项数据
const userOptions = ref([])
const productOptions = ref([])

// 黑名单数据
const ipBlacklist = ref([
  {
    ipAddress: '192.168.1.100',
    reason: '恶意刷单攻击',
    createdAt: '2024-01-15 14:30:00',
    expiresAt: null
  },
  {
    ipAddress: '10.0.0.50',
    reason: '频繁爬取商品信息',
    createdAt: '2024-01-10 09:15:00',
    expiresAt: '2024-02-10 09:15:00'
  }
])

const userBlacklist = ref([
  {
    userId: 1001,
    username: 'baduser01',
    email: 'baduser01@example.com',
    reason: '恶意退货，虚假投诉',
    createdAt: '2024-01-20 16:45:00'
  },
  {
    userId: 1025,
    username: 'spammer99',
    email: 'spammer99@example.com',
    reason: '发布违规评论，恶意刷评',
    createdAt: '2024-01-18 11:30:00'
  }
])

const productBlacklist = ref([
  {
    productId: 2001,
    productName: '违规商品A',
    category: '电子产品',
    reason: '涉嫌虚假宣传',
    createdAt: '2024-01-22 10:20:00'
  },
  {
    productId: 2015,
    productName: '禁售商品B',
    category: '其他',
    reason: '违反平台销售政策',
    createdAt: '2024-01-19 15:10:00'
  }
])

// 表单验证规则
const ipRules = {
  ipAddress: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
    { pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, message: t('validation.ip'), trigger: 'blur' }
  ],
  reason: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
    { min: 5, max: 200, message: t('validation.minLength').replace('{min}', '5') + ' - ' + t('validation.maxLength').replace('{max}', '200'), trigger: 'blur' }
  ]
}

const userRules = {
  userId: [{ required: true, message: t('validation.required'), trigger: 'change' }],
  reason: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
    { min: 5, max: 200, message: t('validation.minLength').replace('{min}', '5') + ' - ' + t('validation.maxLength').replace('{max}', '200'), trigger: 'blur' }
  ]
}

const productRules = {
  productId: [{ required: true, message: t('validation.required'), trigger: 'change' }],
  reason: [
    { required: true, message: t('validation.required'), trigger: 'blur' },
    { min: 5, max: 200, message: t('validation.minLength').replace('{min}', '5') + ' - ' + t('validation.maxLength').replace('{max}', '200'), trigger: 'blur' }
  ]
}

// 方法
const formatDateTime = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')
}

const getIpStatusType = (row) => {
  if (!row.expiresAt) return 'danger'
  return dayjs().isAfter(dayjs(row.expiresAt)) ? 'info' : 'danger'
}

const getIpStatusText = (row) => {
  if (!row.expiresAt) return t('blacklist.permanent')
  return dayjs().isAfter(dayjs(row.expiresAt)) ? t('blacklist.expired') : t('blacklist.active')
}

const fetchIpBlacklist = async () => {
  ipLoading.value = true
  try {
    // const response = await request({
    //   url: '/api/v1/admin/blacklist/ips',
    //   method: 'get',
    //   params: { search: ipSearchQuery.value }
    // })
    // ipBlacklist.value = response.data
    ElMessage.success(t('common.dataRefreshed') || 'IP黑名单数据已刷新')
  } catch (error) {
    ElMessage.error(t('common.fetchDataFailed') || '获取IP黑名单失败: ' + (error.message || '未知错误'))
  } finally {
    ipLoading.value = false
  }
}

const fetchUserBlacklist = async () => {
  userLoading.value = true
  try {
    // const response = await request({
    //   url: '/api/v1/admin/blacklist/users',
    //   method: 'get',
    //   params: { search: userSearchQuery.value }
    // })
    // userBlacklist.value = response.data
    ElMessage.success(t('common.dataRefreshed') || '用户黑名单数据已刷新')
  } catch (error) {
    ElMessage.error(t('common.fetchDataFailed') || '获取用户黑名单失败: ' + (error.message || '未知错误'))
  } finally {
    userLoading.value = false
  }
}

const fetchProductBlacklist = async () => {
  productLoading.value = true
  try {
    // const response = await request({
    //   url: '/api/v1/admin/blacklist/products',
    //   method: 'get',
    //   params: { search: productSearchQuery.value }
    // })
    // productBlacklist.value = response.data
    ElMessage.success(t('common.dataRefreshed') || '商品黑名单数据已刷新')
  } catch (error) {
    ElMessage.error(t('common.fetchDataFailed') || '获取商品黑名单失败: ' + (error.message || '未知错误'))
  } finally {
    productLoading.value = false
  }
}

const showAddIpDialog = () => {
  ipForm.ipAddress = ''
  ipForm.reason = ''
  ipForm.expiresAt = null
  addIpDialogVisible.value = true
}

const showAddUserDialog = () => {
  userForm.userId = null
  userForm.reason = ''
  userOptions.value = []
  addUserDialogVisible.value = true
}

const showAddProductDialog = () => {
  productForm.productId = null
  productForm.reason = ''
  productOptions.value = []
  addProductDialogVisible.value = true
}

const searchUsers = async (query) => {
  if (query) {
    try {
      // const response = await request({
      //   url: '/api/v1/admin/users/search',
      //   method: 'get',
      //   params: { q: query, limit: 10 }
      // })
      // userOptions.value = response.data
      // 模拟数据
      userOptions.value = [
        { id: 1001, username: 'testuser1', email: 'test1@example.com' },
        { id: 1002, username: 'testuser2', email: 'test2@example.com' }
      ]
    } catch (error) {
      ElMessage.error(t('common.searchFailed') || '搜索用户失败')
    }
  }
}

const searchProducts = async (query) => {
  if (query) {
    try {
      // const response = await request({
      //   url: '/api/v1/admin/products/search',
      //   method: 'get',
      //   params: { q: query, limit: 10 }
      // })
      // productOptions.value = response.data
      // 模拟数据
      productOptions.value = [
        { id: 2001, name: '测试商品1' },
        { id: 2002, name: '测试商品2' }
      ]
    } catch (error) {
      ElMessage.error(t('common.searchFailed') || '搜索商品失败')
    }
  }
}

const addIpToBlacklist = async () => {
  try {
    await ipFormRef.value.validate()
    // const response = await request({
    //   url: '/api/v1/admin/blacklist/ips',
    //   method: 'post',
    //   data: ipForm
    // })
    ElMessage.success(t('blacklist.ipAdded') || 'IP已添加到黑名单')
    addIpDialogVisible.value = false
    fetchIpBlacklist()
  } catch (error) {
    if (error.message) {
      ElMessage.error(t('common.operationFailed') || '添加失败: ' + error.message)
    }
  }
}

const addUserToBlacklist = async () => {
  try {
    await userFormRef.value.validate()
    // const response = await request({
    //   url: `/api/v1/admin/blacklist/users/${userForm.userId}`,
    //   method: 'post',
    //   data: { reason: userForm.reason }
    // })
    ElMessage.success(t('blacklist.userAdded') || '用户已添加到黑名单')
    addUserDialogVisible.value = false
    fetchUserBlacklist()
  } catch (error) {
    if (error.message) {
      ElMessage.error(t('common.operationFailed') || '添加失败: ' + error.message)
    }
  }
}

const addProductToBlacklist = async () => {
  try {
    await productFormRef.value.validate()
    // const response = await request({
    //   url: `/api/v1/admin/blacklist/products/${productForm.productId}`,
    //   method: 'post',
    //   data: { reason: productForm.reason }
    // })
    ElMessage.success(t('blacklist.productAdded') || '商品已添加到黑名单')
    addProductDialogVisible.value = false
    fetchProductBlacklist()
  } catch (error) {
    if (error.message) {
      ElMessage.error(t('common.operationFailed') || '添加失败: ' + error.message)
    }
  }
}

const removeIpFromBlacklist = async (ipAddress) => {
  try {
    await ElMessageBox.confirm(
      t('confirm.removeMessage').replace('{item}', ipAddress),
      t('confirm.removeTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    // await request({
    //   url: `/api/v1/admin/blacklist/ips/${encodeURIComponent(ipAddress)}`,
    //   method: 'delete'
    // })
    ElMessage.success(t('blacklist.ipRemoved') || 'IP已从黑名单中移除')
    fetchIpBlacklist()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.operationFailed') || '移除失败: ' + (error.message || '未知错误'))
    }
  }
}

const removeUserFromBlacklist = async (userId) => {
  try {
    await ElMessageBox.confirm(
      t('confirm.unbanMessage'),
      t('confirm.unbanTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    // await request({
    //   url: `/api/v1/admin/blacklist/users/${userId}`,
    //   method: 'delete'
    // })
    ElMessage.success(t('blacklist.userUnbanned') || '用户已解封')
    fetchUserBlacklist()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.operationFailed') || '解封失败: ' + (error.message || '未知错误'))
    }
  }
}

const removeProductFromBlacklist = async (productId) => {
  try {
    await ElMessageBox.confirm(
      t('confirm.restoreMessage'),
      t('confirm.restoreTitle'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    // await request({
    //   url: `/api/v1/admin/blacklist/products/${productId}`,
    //   method: 'delete'
    // })
    ElMessage.success(t('blacklist.productRestored') || '商品已恢复')
    fetchProductBlacklist()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.operationFailed') || '恢复失败: ' + (error.message || '未知错误'))
    }
  }
}

onMounted(() => {
  fetchIpBlacklist()
})
</script>

<style scoped>
.blacklist-management-page {
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

.tab-content {
  padding: 20px 0;
}
</style> 
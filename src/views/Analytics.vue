<template>
  <div class="analytics-page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>{{ $t('analytics.title') }}</h2>
          <div class="filter-controls">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              :start-placeholder="$t('common.startDate') || '开始日期'"
              :end-placeholder="$t('common.endDate') || '结束日期'"
              value-format="YYYY-MM-DD"
              style="margin-right: 10px;"
              @change="handleDateRangeChange"
            />
            <el-select v-model="selectedCategory" :placeholder="$t('product.category') || '选择商品品类'" style="width: 150px; margin-right: 10px;" @change="fetchData">
              <el-option :label="$t('common.all') || '全部品类'" value=""></el-option>
              <el-option label="电子产品" value="electronics"></el-option>
              <el-option label="服装鞋包" value="fashion"></el-option>
              <el-option label="家居用品" value="home"></el-option>
              <el-option label="食品饮料" value="food"></el-option>
            </el-select>
            <el-button type="primary" @click="fetchData" :icon="Refresh">{{ $t('common.refresh') }}</el-button>
          </div>
        </div>
      </template>

      <!-- 概览指标卡片 -->
      <div class="overview-cards">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card class="metric-card sales">
              <div class="metric-content">
                <div class="metric-icon">
                  <el-icon><TrendCharts /></el-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-value">¥{{ formatCurrency(salesOverview.totalSales) }}</div>
                  <div class="metric-label">{{ $t('analytics.totalSales') }}</div>
                  <div class="metric-change" :class="{ positive: salesOverview.salesGrowth >= 0 }">
                    <el-icon v-if="salesOverview.salesGrowth >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(salesOverview.salesGrowth) }}%
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="metric-card orders">
              <div class="metric-content">
                <div class="metric-icon">
                  <el-icon><List /></el-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-value">{{ salesOverview.totalOrders }}</div>
                  <div class="metric-label">{{ $t('analytics.totalOrders') }}</div>
                  <div class="metric-change" :class="{ positive: salesOverview.orderGrowth >= 0 }">
                    <el-icon v-if="salesOverview.orderGrowth >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(salesOverview.orderGrowth) }}%
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="metric-card users">
              <div class="metric-content">
                <div class="metric-icon">
                  <el-icon><User /></el-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-value">{{ userMetrics.activeUsers }}</div>
                  <div class="metric-label">{{ $t('analytics.activeUsers') }}</div>
                  <div class="metric-change" :class="{ positive: userMetrics.userGrowth >= 0 }">
                    <el-icon v-if="userMetrics.userGrowth >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(userMetrics.userGrowth) }}%
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="metric-card conversion">
              <div class="metric-content">
                <div class="metric-icon">
                  <el-icon><Promotion /></el-icon>
                </div>
                <div class="metric-info">
                  <div class="metric-value">{{ userMetrics.conversionRate }}%</div>
                  <div class="metric-label">{{ $t('analytics.conversionRate') }}</div>
                  <div class="metric-change" :class="{ positive: userMetrics.conversionChange >= 0 }">
                    <el-icon v-if="userMetrics.conversionChange >= 0"><ArrowUp /></el-icon>
                    <el-icon v-else><ArrowDown /></el-icon>
                    {{ Math.abs(userMetrics.conversionChange) }}%
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <el-row :gutter="20">
          <!-- 销售趋势图 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="chart-header">
                  <h3>{{ $t('analytics.salesTrend') }}</h3>
                  <el-radio-group v-model="salesChartType" size="small" @change="updateSalesChart">
                    <el-radio-button value="sales">{{ $t('analytics.revenue') }}</el-radio-button>
                    <el-radio-button value="orders">{{ $t('order.id') }}</el-radio-button>
                  </el-radio-group>
                </div>
              </template>
              <v-chart :option="salesTrendOption" :style="{ height: '300px' }" />
            </el-card>
          </el-col>

          <!-- 商品品类分布 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <h3>{{ $t('analytics.categoryDistribution') }}</h3>
              </template>
              <v-chart :option="categoryDistributionOption" :style="{ height: '300px' }" />
            </el-card>
          </el-col>

          <!-- 用户增长趋势 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <h3>{{ $t('analytics.userGrowth') }}</h3>
              </template>
              <v-chart :option="userGrowthOption" :style="{ height: '300px' }" />
            </el-card>
          </el-col>

          <!-- 转化漏斗 -->
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <h3>{{ $t('analytics.conversionFunnel') }}</h3>
              </template>
              <v-chart :option="conversionFunnelOption" :style="{ height: '300px' }" />
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 详细数据表格 -->
      <div class="data-tables">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="table-card">
              <template #header>
                <div class="table-header">
                  <h3>{{ $t('analytics.topProducts') }}</h3>
                  <el-button type="primary" size="small" @click="exportTopProducts">{{ $t('analytics.exportExcel') }}</el-button>
                </div>
              </template>
              <el-table :data="topProducts" stripe height="250">
                <el-table-column prop="rank" :label="$t('analytics.rank')" width="60" align="center">
                  <template #default="scope">
                    <el-tag :type="getRankTagType(scope.row.rank)" size="small">{{ scope.row.rank }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="productName" :label="$t('product.name')" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sales" :label="$t('analytics.sales')" width="80" align="center"></el-table-column>
                <el-table-column prop="revenue" :label="$t('analytics.revenue')" width="100" align="right">
                  <template #default="scope">
                    <span style="color: #f56c6c; font-weight: bold;">¥{{ formatCurrency(scope.row.revenue) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card class="table-card">
              <template #header>
                <div class="table-header">
                  <h3>{{ $t('analytics.lowStock') }}</h3>
                  <el-button type="warning" size="small" @click="exportLowStock">{{ $t('analytics.exportWarning') }}</el-button>
                </div>
              </template>
              <el-table :data="lowStockProducts" stripe height="250">
                <el-table-column prop="productName" :label="$t('product.name')" show-overflow-tooltip></el-table-column>
                <el-table-column prop="currentStock" :label="$t('analytics.currentStock')" width="80" align="center">
                  <template #default="scope">
                    <el-tag :type="getStockTagType(scope.row.currentStock)" size="small">
                      {{ scope.row.currentStock }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="threshold" :label="$t('analytics.threshold')" width="80" align="center"></el-table-column>
                <el-table-column :label="$t('common.actions')" width="100" align="center">
                  <template #default="scope">
                    <el-button type="primary" size="small" @click="handleRestockProduct(scope.row)">{{ $t('analytics.restock') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Refresh, TrendCharts, List, User, Promotion, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, FunnelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import dayjs from 'dayjs'
import request from '@/utils/request'

const { t } = useI18n()

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  FunnelChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 响应式数据
const dateRange = ref([
  dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD')
])
const selectedCategory = ref('')
const salesChartType = ref('sales')

// 概览数据
const salesOverview = ref({
  totalSales: 1250000,
  salesGrowth: 12.5,
  totalOrders: 3540,
  orderGrowth: 8.3
})

const userMetrics = ref({
  activeUsers: 15680,
  userGrowth: 15.2,
  conversionRate: 3.8,
  conversionChange: 0.5
})

// 图表数据
const topProducts = ref([
  { rank: 1, productName: 'iPhone 15 Pro Max', sales: 156, revenue: 234000 },
  { rank: 2, productName: '小米13 Ultra', sales: 134, revenue: 201000 },
  { rank: 3, productName: 'MacBook Pro M3', sales: 89, revenue: 178000 },
  { rank: 4, productName: 'AirPods Pro 2', sales: 245, revenue: 147000 },
  { rank: 5, productName: 'iPad Air 5', sales: 167, revenue: 125000 }
])

const lowStockProducts = ref([
  { productName: 'iPhone 15 Pro Max 512GB', currentStock: 5, threshold: 20 },
  { productName: 'MacBook Pro M3 16寸', currentStock: 3, threshold: 10 },
  { productName: 'AirPods Pro 2代', currentStock: 8, threshold: 25 },
  { productName: 'Apple Watch Ultra 2', currentStock: 2, threshold: 15 }
])

// 图表配置
const salesTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: salesChartType.value === 'sales' 
      ? [820000, 932000, 901000, 934000, 1090000, 1200000]
      : [820, 932, 901, 934, 1090, 1200],
    type: 'line',
    smooth: true,
    itemStyle: {
      color: '#409EFF'
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
          { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
        ]
      }
    }
  }]
}))

const categoryDistributionOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  series: [{
    name: t('analytics.revenue'),
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { value: 450000, name: '电子产品' },
      { value: 300000, name: '服装鞋包' },
      { value: 250000, name: '家居用品' },
      { value: 200000, name: '食品饮料' },
      { value: 150000, name: '其他' }
    ],
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
})

const userGrowthOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新用户', '活跃用户']
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新用户',
      type: 'bar',
      data: [1200, 1400, 1100, 1500, 1800, 2000],
      itemStyle: { color: '#67C23A' }
    },
    {
      name: '活跃用户',
      type: 'line',
      data: [8000, 8500, 8200, 9000, 9500, 10000],
      itemStyle: { color: '#E6A23C' }
    }
  ]
})

const conversionFunnelOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}%'
  },
  series: [{
    name: t('analytics.conversionFunnel'),
    type: 'funnel',
    left: '10%',
    width: '80%',
    data: [
      { value: 100, name: '访问' },
      { value: 35, name: '浏览商品' },
      { value: 15, name: '加入购物车' },
      { value: 8, name: '下单' },
      { value: 6, name: '支付完成' }
    ]
  }]
})

// 方法
const formatCurrency = (amount) => {
  return Number(amount).toLocaleString()
}

const getRankTagType = (rank) => {
  if (rank === 1) return 'danger'
  if (rank === 2) return 'warning'
  if (rank === 3) return 'success'
  return 'info'
}

const getStockTagType = (stock) => {
  if (stock <= 5) return 'danger'
  if (stock <= 15) return 'warning'
  return 'success'
}

const handleDateRangeChange = () => {
  fetchData()
}

const updateSalesChart = () => {
  // 图表会自动响应 salesChartType 的变化
}

const fetchData = async () => {
  try {
    // 这里调用后端API获取数据
    // const data = await request({
    //   url: '/api/v1/admin/analytics/sales-overview',
    //   method: 'get',
    //   params: {
    //     startDate: dateRange.value[0],
    //     endDate: dateRange.value[1],
    //     category: selectedCategory.value
    //   }
    // })
    ElMessage.success(t('common.dataRefreshed') || '数据已刷新')
  } catch (error) {
    ElMessage.error(t('common.fetchDataFailed') || '获取数据失败: ' + (error.message || '未知错误'))
  }
}

const exportTopProducts = () => {
  ElMessage.success(t('analytics.exportingTopProducts') || '热门商品数据导出中...')
  // 实现Excel导出逻辑
}

const exportLowStock = () => {
  ElMessage.success(t('analytics.exportingLowStock') || '库存预警数据导出中...')
  // 实现Excel导出逻辑
}

const handleRestockProduct = (product) => {
  ElMessage.info((t('analytics.restockingProduct') || '正在为 {name} 发起补货申请...').replace('{name}', product.productName))
  // 实现补货逻辑
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.analytics-page {
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

.filter-controls {
  display: flex;
  align-items: center;
}

.overview-cards {
  margin-bottom: 20px;
}

.metric-card {
  border-radius: 12px;
  overflow: hidden;
}

.metric-card.sales {
  border-left: 4px solid #409EFF;
}

.metric-card.orders {
  border-left: 4px solid #67C23A;
}

.metric-card.users {
  border-left: 4px solid #E6A23C;
}

.metric-card.conversion {
  border-left: 4px solid #F56C6C;
}

.metric-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.metric-icon {
  font-size: 32px;
  margin-right: 16px;
  opacity: 0.8;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.metric-change {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #F56C6C;
}

.metric-change.positive {
  color: #67C23A;
}

.metric-change .el-icon {
  margin-right: 2px;
}

.charts-section {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  color: #303133;
}

.data-tables .table-card {
  height: 350px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h3 {
  margin: 0;
  color: #303133;
}
</style> 
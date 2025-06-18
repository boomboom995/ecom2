import { createI18n } from 'vue-i18n'

// 中文语言包
const zh = {
  // 通用
  common: {
    confirm: '确定',
    cancel: '取消',
    submit: '提交',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    add: '新增',
    search: '搜索',
    refresh: '刷新',
    export: '导出',
    import: '导入',
    reset: '重置',
    loading: '加载中...',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '提示',
    total: '总计',
    actions: '操作',
    all: '全部',
    startDate: '开始日期',
    endDate: '结束日期',
    dataRefreshed: '数据已刷新',
    fetchDataFailed: '获取数据失败',
    operationFailed: '操作失败',
    searchFailed: '搜索失败',
    ecommerceManagement: '电商后台管理系统',
    paginationPlaceholder: '注：后端API未提供分页，此处为分页组件占位符。',
    unknownError: '未知错误',
    cancelDelete: '已取消删除',
    update: '修改',
    create: '新增',
    failed: '失败'
  },
  // 导航菜单
  menu: {
    dashboard: '数据概览',
    products: '商品管理',
    customers: '用户管理',
    orders: '订单管理',
    deliveries: '配送管理',
    coupons: '优惠券管理',
    analytics: '数据分析',
    blacklist: '安全管理',
    settings: '系统设置'
  },
  // 用户相关
  user: {
    profile: '个人中心',
    logout: '退出登录',
    admin: '管理员',
    username: '用户名',
    email: '邮箱',
    phone: '手机号',
    address: '地址',
    status: '状态',
    id: '用户ID'
  },
  // 商品管理
  product: {
    id: '商品ID',
    name: '商品名称',
    price: '价格',
    stock: '库存',
    category: '品类',
    description: '描述',
    addProduct: '新增商品',
    editProduct: '编辑商品',
    deleteProduct: '删除商品',
    outOfStock: '缺货',
    lowStock: '库存不足',
    inStock: '库存充足',
    searchPlaceholder: '输入商品名称搜索',
    deleteSuccess: '商品删除成功！',
    deleteFailed: '商品删除失败',
    updateSuccess: '商品信息修改成功！',
    createSuccess: '商品新增成功！'
  },
  // 订单管理
  order: {
    id: '订单ID',
    customerId: '客户ID',
    productId: '商品ID',
    quantity: '数量',
    totalAmount: '总金额',
    status: '订单状态',
    createTime: '下单时间',
    paid: '已支付',
    pending: '待支付',
    cancelled: '已取消',
    completed: '已完成'
  },
  // 数据分析
  analytics: {
    title: '数据分析中心',
    salesOverview: '销售概览',
    userAnalysis: '用户分析',
    productAnalysis: '商品分析',
    totalSales: '总销售额',
    totalOrders: '总订单数',
    activeUsers: '活跃用户',
    conversionRate: '转化率',
    salesTrend: '销售趋势',
    categoryDistribution: '商品品类销售分布',
    userGrowth: '用户增长趋势',
    conversionFunnel: '购买转化漏斗',
    topProducts: '热门商品排行',
    lowStock: '库存预警',
    rank: '排名',
    sales: '销量',
    revenue: '销售额',
    currentStock: '当前库存',
    threshold: '预警阈值',
    restock: '补货',
    exportExcel: '导出Excel',
    exportWarning: '导出预警',
    exportingTopProducts: '热门商品数据导出中...',
    exportingLowStock: '库存预警数据导出中...',
    restockingProduct: '正在为 {name} 发起补货申请...'
  },
  // 黑名单管理
  blacklist: {
    title: '安全管理 - 黑名单管理',
    ipBlacklist: 'IP黑名单',
    userBlacklist: '用户黑名单',
    productBlacklist: '商品黑名单',
    ipAddress: 'IP地址',
    reason: '原因',
    banReason: '封禁原因',
    addTime: '添加时间',
    expireTime: '过期时间',
    permanent: '永久',
    active: '封禁中',
    expired: '已过期',
    remove: '移除',
    unban: '解封',
    restore: '恢复',
    addIpBlacklist: '添加IP黑名单',
    addUserBlacklist: '添加用户黑名单',
    addProductBlacklist: '添加商品黑名单',
    searchIp: '搜索IP地址',
    searchUser: '搜索用户名或ID',
    searchProduct: '搜索商品名称或ID',
    ipAdded: 'IP已添加到黑名单',
    userAdded: '用户已添加到黑名单',
    productAdded: '商品已添加到黑名单',
    ipRemoved: 'IP已从黑名单中移除',
    userUnbanned: '用户已解封',
    productRestored: '商品已恢复'
  },
  // 表单验证
  validation: {
    required: '此项为必填项',
    email: '请输入正确的邮箱格式',
    phone: '请输入正确的手机号格式',
    ip: '请输入正确的IP地址格式',
    minLength: '长度不能少于{min}个字符',
    maxLength: '长度不能超过{max}个字符'
  },
  // 确认对话框
  confirm: {
    deleteTitle: '确认删除',
    deleteMessage: '此操作将永久删除该{type}，是否继续？',
    removeTitle: '确认移除',
    removeMessage: '确定要将{item}从黑名单中移除吗？',
    unbanTitle: '确认解封',
    unbanMessage: '确定要解封此用户吗？',
    restoreTitle: '确认恢复',
    restoreMessage: '确定要恢复此商品吗？'
  }
}

// 英文语言包
const en = {
  // 通用
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    submit: 'Submit',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    search: 'Search',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    reset: 'Reset',
    loading: 'Loading...',
    success: 'Operation successful',
    error: 'Operation failed',
    warning: 'Warning',
    info: 'Info',
    total: 'Total',
    actions: 'Actions',
    all: 'All',
    startDate: 'Start Date',
    endDate: 'End Date',
    dataRefreshed: 'Data refreshed',
    fetchDataFailed: 'Failed to fetch data',
    operationFailed: 'Operation failed',
    searchFailed: 'Search failed',
    ecommerceManagement: 'E-commerce Management System',
    paginationPlaceholder: 'Note: Backend API does not provide pagination, this is a placeholder for pagination component.',
    unknownError: 'Unknown error',
    cancelDelete: 'Delete cancelled',
    update: 'Update',
    create: 'Create',
    failed: 'failed'
  },
  // 导航菜单
  menu: {
    dashboard: 'Dashboard',
    products: 'Product Management',
    customers: 'Customer Management',
    orders: 'Order Management',
    deliveries: 'Delivery Management',
    coupons: 'Coupon Management',
    analytics: 'Analytics',
    blacklist: 'Security Management',
    settings: 'Settings'
  },
  // 用户相关
  user: {
    profile: 'Profile',
    logout: 'Logout',
    admin: 'Administrator',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    status: 'Status',
    id: 'User ID'
  },
  // 商品管理
  product: {
    id: 'Product ID',
    name: 'Product Name',
    price: 'Price',
    stock: 'Stock',
    category: 'Category',
    description: 'Description',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    inStock: 'In Stock',
    searchPlaceholder: 'Enter product name to search',
    deleteSuccess: 'Product deleted successfully!',
    deleteFailed: 'Failed to delete product',
    updateSuccess: 'Product updated successfully!',
    createSuccess: 'Product created successfully!'
  },
  // 订单管理
  order: {
    id: 'Order ID',
    customerId: 'Customer ID',
    productId: 'Product ID',
    quantity: 'Quantity',
    totalAmount: 'Total Amount',
    status: 'Order Status',
    createTime: 'Order Time',
    paid: 'Paid',
    pending: 'Pending',
    cancelled: 'Cancelled',
    completed: 'Completed'
  },
  // 数据分析
  analytics: {
    title: 'Analytics Center',
    salesOverview: 'Sales Overview',
    userAnalysis: 'User Analysis',
    productAnalysis: 'Product Analysis',
    totalSales: 'Total Sales',
    totalOrders: 'Total Orders',
    activeUsers: 'Active Users',
    conversionRate: 'Conversion Rate',
    salesTrend: 'Sales Trend',
    categoryDistribution: 'Category Sales Distribution',
    userGrowth: 'User Growth Trend',
    conversionFunnel: 'Conversion Funnel',
    topProducts: 'Top Products',
    lowStock: 'Low Stock Alert',
    rank: 'Rank',
    sales: 'Sales',
    revenue: 'Revenue',
    currentStock: 'Current Stock',
    threshold: 'Threshold',
    restock: 'Restock',
    exportExcel: 'Export Excel',
    exportWarning: 'Export Warning',
    exportingTopProducts: 'Exporting top products data...',
    exportingLowStock: 'Exporting low stock data...',
    restockingProduct: 'Initiating restock request for {name}...'
  },
  // 黑名单管理
  blacklist: {
    title: 'Security Management - Blacklist',
    ipBlacklist: 'IP Blacklist',
    userBlacklist: 'User Blacklist',
    productBlacklist: 'Product Blacklist',
    ipAddress: 'IP Address',
    reason: 'Reason',
    banReason: 'Ban Reason',
    addTime: 'Add Time',
    expireTime: 'Expire Time',
    permanent: 'Permanent',
    active: 'Active',
    expired: 'Expired',
    remove: 'Remove',
    unban: 'Unban',
    restore: 'Restore',
    addIpBlacklist: 'Add IP Blacklist',
    addUserBlacklist: 'Add User Blacklist',
    addProductBlacklist: 'Add Product Blacklist',
    searchIp: 'Search IP address',
    searchUser: 'Search username or ID',
    searchProduct: 'Search product name or ID',
    ipAdded: 'IP added to blacklist',
    userAdded: 'User added to blacklist',
    productAdded: 'Product added to blacklist',
    ipRemoved: 'IP removed from blacklist',
    userUnbanned: 'User unbanned',
    productRestored: 'Product restored'
  },
  // 表单验证
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email format',
    phone: 'Please enter a valid phone number format',
    ip: 'Please enter a valid IP address format',
    minLength: 'Length cannot be less than {min} characters',
    maxLength: 'Length cannot exceed {max} characters'
  },
  // 确认对话框
  confirm: {
    deleteTitle: 'Confirm Delete',
    deleteMessage: 'This operation will permanently delete this {type}, continue?',
    removeTitle: 'Confirm Remove',
    removeMessage: 'Are you sure to remove {item} from blacklist?',
    unbanTitle: 'Confirm Unban',
    unbanMessage: 'Are you sure to unban this user?',
    restoreTitle: 'Confirm Restore',
    restoreMessage: 'Are you sure to restore this product?'
  }
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用Composition API模式
  locale: localStorage.getItem('locale') || 'zh', // 默认语言
  fallbackLocale: 'zh', // 回退语言
  messages: {
    zh,
    en
  }
})

export default i18n 
<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" style="background-color: #545c64;">
      <el-menu
        default-active="/products"
        router
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right: none;"
      >
        <el-menu-item index="/products">
          <el-icon><Box /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/customers">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/deliveries">
          <el-icon><Van /></el-icon>
          <span>配送管理</span>
        </el-menu-item>
        <el-menu-item index="/coupons">
          <el-icon><Present /></el-icon>
          <span>优惠券管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="border-bottom: 1px solid #eee; padding: 0 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; height: 100%;">
          <div style="display: flex; align-items: center;">
            <h2 style="margin: 0; margin-right: 20px; color: #303133;">电商后台管理系统</h2>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="item.path">
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-dropdown>
            <div style="display: flex; align-items: center; cursor: pointer;">
              <el-avatar size="small" style="margin-right: 8px;">
                <el-icon><Avatar /></el-icon>
              </el-avatar>
              <span style="margin-right: 5px;">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="User">个人中心</el-dropdown-item>
                <el-dropdown-item icon="Setting">系统设置</el-dropdown-item>
                <el-dropdown-item divided icon="SwitchFilled">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Box, 
  User, 
  List, 
  Van, 
  Present, 
  Avatar, 
  ArrowDown 
} from '@element-plus/icons-vue'

const route = useRoute()

// 路由标题映射
const routeTitleMap = {
  '/products': '商品管理',
  '/customers': '用户管理', 
  '/orders': '订单管理',
  '/deliveries': '配送管理',
  '/coupons': '优惠券管理'
}

// 动态生成面包屑
const breadcrumbItems = computed(() => {
  const items = [{ title: '首页', path: '/' }]
  const currentPath = route.path
  if (currentPath !== '/' && routeTitleMap[currentPath]) {
    items.push({ title: routeTitleMap[currentPath], path: currentPath })
  }
  return items
})
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden; /* 防止出现双滚动条 */
}

.el-aside {
  color: var(--el-text-color-primary);
}

.el-menu-item .el-icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
}

.el-header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.el-breadcrumb {
  font-size: 14px;
}

.el-dropdown {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>

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
          <span>{{ $t('menu.products') }}</span>
        </el-menu-item>
        <el-menu-item index="/customers">
          <el-icon><User /></el-icon>
          <span>{{ $t('menu.customers') }}</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <span>{{ $t('menu.orders') }}</span>
        </el-menu-item>
        <el-menu-item index="/deliveries">
          <el-icon><Van /></el-icon>
          <span>{{ $t('menu.deliveries') }}</span>
        </el-menu-item>
        <el-menu-item index="/coupons">
          <el-icon><Present /></el-icon>
          <span>{{ $t('menu.coupons') }}</span>
        </el-menu-item>
        <el-menu-item index="/analytics">
          <el-icon><TrendCharts /></el-icon>
          <span>{{ $t('menu.analytics') }}</span>
        </el-menu-item>
        <el-menu-item index="/blacklist">
          <el-icon><Lock /></el-icon>
          <span>{{ $t('menu.blacklist') }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="border-bottom: 1px solid #eee; padding: 0 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; height: 100%;">
          <div style="display: flex; align-items: center;">
            <h2 style="margin: 0; margin-right: 20px; color: #303133;">{{ $t('common.ecommerceManagement') || '电商后台管理系统' }}</h2>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="item.path">
                {{ item.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="display: flex; align-items: center;">
            <!-- 语言切换器 -->
            <el-dropdown @command="changeLanguage" style="margin-right: 20px;">
              <div style="display: flex; align-items: center; cursor: pointer;">
                <el-icon style="margin-right: 5px;"><Translation /></el-icon>
                <span>{{ currentLanguageText }}</span>
                <el-icon style="margin-left: 5px;"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="zh">中文</el-dropdown-item>
                  <el-dropdown-item command="en">English</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- 用户菜单 -->
            <el-dropdown>
              <div style="display: flex; align-items: center; cursor: pointer;">
                <el-avatar size="small" style="margin-right: 8px;">
                  <el-icon><Avatar /></el-icon>
                </el-avatar>
                <span style="margin-right: 5px;">{{ $t('user.admin') }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="User">{{ $t('user.profile') }}</el-dropdown-item>
                  <el-dropdown-item icon="Setting">{{ $t('menu.settings') }}</el-dropdown-item>
                  <el-dropdown-item divided icon="SwitchFilled">{{ $t('user.logout') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
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
import { useI18n } from 'vue-i18n'
import { 
  Box, 
  User, 
  List, 
  Van, 
  Present, 
  TrendCharts,
  Lock,
  Avatar, 
  ArrowDown,
  Translation
} from '@element-plus/icons-vue'

const route = useRoute()
const { t, locale } = useI18n()

// 路由标题映射
const routeTitleMap = {
  '/products': 'menu.products',
  '/customers': 'menu.customers', 
  '/orders': 'menu.orders',
  '/deliveries': 'menu.deliveries',
  '/coupons': 'menu.coupons',
  '/analytics': 'menu.analytics',
  '/blacklist': 'menu.blacklist'
}

// 动态生成面包屑
const breadcrumbItems = computed(() => {
  const items = [{ title: t('menu.dashboard') || '首页', path: '/' }]
  const currentPath = route.path
  if (currentPath !== '/' && routeTitleMap[currentPath]) {
    items.push({ title: t(routeTitleMap[currentPath]), path: currentPath })
  }
  return items
})

// 当前语言显示文本
const currentLanguageText = computed(() => {
  return locale.value === 'zh' ? '中文' : 'English'
})

// 切换语言
const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
  
  // 设置请求头的Accept-Language
  if (window.axios) {
    window.axios.defaults.headers.common['Accept-Language'] = lang === 'zh' ? 'zh-CN' : 'en-US'
  }
}
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

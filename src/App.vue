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
          <el-icon><i class="el-icon-goods"></i></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/customers">
          <el-icon><i class="el-icon-user"></i></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><i class="el-icon-s-order"></i></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/deliveries">
          <el-icon><i class="el-icon-truck"></i></el-icon>
          <span>配送管理</span>
        </el-menu-item>
        <el-menu-item index="/coupons">
          <el-icon><i class="el-icon-present"></i></el-icon>
          <span>优惠券管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px; border-bottom: 1px solid #eee;">
        <div style="display: flex; justify-content: space-between; align-items: center; height: 100%;">
          <span>后台管理系统</span>
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px"><i class="el-icon-setting"></i></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>查看</el-dropdown-item>
                <el-dropdown-item>新增</el-dropdown-item>
                <el-dropdown-item>删除</el-dropdown-item>
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

.el-menu-item [class^="el-icon-"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
</style>

<script setup>
// We will add imports for Element Plus icons here if needed, but for now we use <i> tags.
</script>

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/products', // 默认重定向到商品管理页面
  },
  {
    path: '/products',
    name: 'ProductManagement',
    component: () => import('../views/ProductManagement.vue'), // 稍后创建
    meta: { title: '商品管理' },
  },
  {
    path: '/customers',
    name: 'CustomerManagement',
    component: () => import('../views/CustomerManagement.vue'), // 稍后创建
    meta: { title: '用户管理' },
  },
  {
    path: '/orders',
    name: 'OrderManagement',
    component: () => import('../views/OrderManagement.vue'), // 稍后创建
    meta: { title: '订单管理' },
  },
  {
    path: '/deliveries',
    name: 'DeliveryManagement',
    component: () => import('../views/DeliveryManagement.vue'), // 稍后创建
    meta: { title: '配送管理' },
  },
  {
    path: '/coupons',
    name: 'CouponManagement',
    component: () => import('../views/CouponManagement.vue'), // 稍后创建
    meta: { title: '优惠券管理' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 
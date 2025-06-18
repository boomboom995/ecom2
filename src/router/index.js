import { createRouter, createWebHistory } from 'vue-router';
import ProductManagement from '../views/ProductManagement.vue';
import CustomerManagement from '../views/CustomerManagement.vue';
import OrderManagement from '../views/OrderManagement.vue';
import DeliveryManagement from '../views/DeliveryManagement.vue';
import CouponManagement from '../views/CouponManagement.vue';
import Analytics from '../views/Analytics.vue';
import BlacklistManagement from '../views/BlacklistManagement.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products'
    },
    {
      path: '/products',
      name: 'products',
      component: ProductManagement,
      meta: {
        title: 'menu.products'
      }
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomerManagement,
      meta: {
        title: 'menu.customers'
      }
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderManagement,
      meta: {
        title: 'menu.orders'
      }
    },
    {
      path: '/deliveries',
      name: 'deliveries',
      component: DeliveryManagement,
      meta: {
        title: 'menu.deliveries'
      }
    },
    {
      path: '/coupons',
      name: 'coupons',
      component: CouponManagement,
      meta: {
        title: 'menu.coupons'
      }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics,
      meta: {
        title: 'menu.analytics'
      }
    },
    {
      path: '/blacklist',
      name: 'blacklist',
      component: BlacklistManagement,
      meta: {
        title: 'menu.blacklist'
      }
    }
  ]
});

export default router; 
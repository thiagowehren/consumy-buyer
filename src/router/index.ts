import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { Auth } from '@/auth'

function redirectIfGuest(){
  const auth = new Auth()
  if(!auth.isLoggedIn()){
    return '/login'
  }
}

function redirectIfAuthorized(){
  const auth = new Auth()
  if(auth.isLoggedIn()){
    return '/'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Delivery' }
    },
    {
      path: '/about',
      name: 'about',
      beforeEnter: redirectIfGuest,
      component: () => import('../views/AboutView.vue'),
      meta: { title: 'About - Delivery' }
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: redirectIfAuthorized,
      component: () => import('@/components/LogIn.vue'),
      meta: { title: 'Login - Delivery' }
    },
    {
      path: '/signup',
      name: 'signup',
      beforeEnter: redirectIfAuthorized,
      component: () => import('@/components/SignUp.vue'),
      meta: { title: 'Sign up - Delivery' }
    },
    {
      path: '/stores',
      name: 'stores',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/StoresList.vue'),
      meta: { title: 'Stores - Delivery' }
    },
    {
      path: '/stores/:storeId',
      name: 'store-details',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/StoreDetails.vue'),
      props: true,
      meta: { title: 'Store - Delivery' }
    },
    {
      path: '/stores/new',
      name: 'store-new',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/StoresForm.vue'),
      meta: { title: 'New Store - Delivery' }
    },
    {
      path: '/stores/:storeId/edit',
      name: 'store-edit',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/StoresForm.vue'),
      props: true,
      meta: { title: 'Edit Store - Delivery' }
    },
    {
      path: '/stores/:storeId/products/:productId/edit',
      name: 'product-edit',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/ProductsForm.vue'),
      props: true,
      meta: { title: 'Edit Product - Delivery' }
    },
    {
      path: '/stores/:storeId/products/new',
      name: 'product-new',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/ProductsForm.vue'),
      props: true,
      meta: { title: 'New Product - Delivery' }
    },
    {
      path: '/orders',
      name: 'orders',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/OrdersPage.vue'),
      meta: { title: 'Orders - Delivery' }
    },
    {
      path: '/orders/:orderId',
      name: 'order-details',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/OrderDetails.vue'),
      meta: { title: 'Order - Delivery' }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      beforeEnter: redirectIfGuest,
      component: () => import('@/components/DashboardPage.vue'),
      meta: { title: 'Dashboard - Delivery' }
    },
  ]
})

router.beforeEach((to, from) => {
  const title = to.meta?.title ?? 'Delivery';
  document.title = typeof title === 'string' ? title : 'Delivery';
})

export default router

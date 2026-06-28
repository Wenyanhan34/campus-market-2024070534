import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// 给路由数组增加TS类型 RouteRecordRaw[]
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  // 1.集市列表页
  {
    path: '/list',
    name: 'list',
    component: () => import('@/views/ListView.vue')
  },
  // 2.信息详情页
  {
    path: '/detail/:id',// 动态路由：携带商品id
    name: 'detail',
    component: () => import('@/views/DetailView.vue')
  },
  // 3.信息发布页
  {
    path: '/publish',
    name: 'publish',
    component: () => import('@/views/PublishView.vue')
  },
  // 4.消息中心页
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/MessageView.vue')
  },
  // 5.个人中心页
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/UserView.vue')
  },
  // 6.趋势看板页
  {
    path: '/chart',
    name: 'chart',
    component: () => import('@/views/ChartView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router

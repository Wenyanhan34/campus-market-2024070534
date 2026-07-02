import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import TradeView from '../views/TradeView.vue'
import TradeDetailView from '../views/TradeDetailView.vue'
import LostFoundView from '../views/LostFoundView.vue'
import LostFoundDetailView from '../views/LostFoundDetailView.vue'
import GroupBuyView from '../views/GroupBuyView.vue'
import GroupBuyDetailView from '../views/GroupBuyDetailView.vue'
import ErrandView from '../views/ErrandView.vue'
import ErrandDetailView from '../views/ErrandDetailView.vue'
import PublishView from '../views/PublishView.vue'
import MessageView from '../views/MessageView.vue'
import ChatDetailView from '../views/ChatDetailView.vue'
import UserCenterView from '../views/UserCenterView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页',
      },
    },
    {
      path: '/trade',
      name: 'trade',
      component: TradeView,
      meta: {
        title: '二手交易',
      },
    },
    {
      path: '/trade/:id',
      name: 'tradeDetail',
      component: TradeDetailView,
      meta: {
        title: '商品详情',
      },
    },
    {
      path: '/lost-found',
      name: 'lostFound',
      component: LostFoundView,
      meta: {
        title: '失物招领',
      },
    },
    {
      path: '/lost-found/:id',
      name: 'lostFoundDetail',
      component: LostFoundDetailView,
      meta: {
        title: '失物招领详情',
      },
    },
    {
      path: '/group-buy',
      name: 'groupBuy',
      component: GroupBuyView,
      meta: {
        title: '拼单搭子',
      },
    },
    {
      path: '/group-buy/:id',
      name: 'groupBuyDetail',
      component: GroupBuyDetailView,
      meta: {
        title: '拼单详情',
      },
    },
    {
      path: '/errand',
      name: 'errand',
      component: ErrandView,
      meta: {
        title: '跑腿委托',
      },
    },
    {
      path: '/errand/:id',
      name: 'errandDetail',
      component: ErrandDetailView,
      meta: {
        title: '跑腿任务详情',
      },
    },
    {
      path: '/publish',
      name: 'publish',
      component: PublishView,
      meta: {
        title: '发布信息',
      },
    },
    {
      path: '/message',
      name: 'message',
      component: MessageView,
      meta: {
        title: '消息中心',
      },
    },
    {
      path: '/chat/:contact',
      name: 'chatDetail',
      component: ChatDetailView,
      meta: {
        title: '聊天',
      },
    },
    {
      path: '/user',
      name: 'user',
      component: UserCenterView,
      meta: {
        title: '个人中心',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        title: '账号设置',
      },
    },
  ],
})

router.beforeEach((to) => {
  const title = (to.meta?.title as string) || '校园轻集市'
  document.title = `${title} — 校园轻集市`
})

export default router

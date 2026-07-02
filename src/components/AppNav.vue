<template>
  <nav class="app-nav">
    <RouterLink
      v-for="link in navLinks"
      :key="link.path"
      :to="link.path"
      class="nav-item"
    >
      <el-icon :size="18"><component :is="link.icon" /></el-icon>
      <span>{{ link.label }}</span>
      <span v-if="link.badge" class="nav-badge">{{ link.badge }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const allLinks = [
  { path: '/', label: '首页', icon: 'HomeFilled' },
  { path: '/trade', label: '二手交易', icon: 'Goods' },
  { path: '/lost-found', label: '失物招领', icon: 'Search' },
  { path: '/group-buy', label: '拼单搭子', icon: 'UserFilled' },
  { path: '/errand', label: '跑腿委托', icon: 'Van' },
  { path: '/publish', label: '发布', icon: 'Plus' },
  { path: '/message', label: '消息', icon: 'Message', badge: '2' },
]

const navLinks = computed(() => {
  if (userStore.isLoggedIn) return allLinks
  return allLinks.filter(l => l.path === '/')
})
</script>

<style scoped>
.app-nav {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 10px;
  max-width: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 22px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.nav-item.router-link-active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 3px;
  background: var(--color-primary);
  border-radius: 3px 3px 0 0;
}

.nav-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--color-danger);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  border-radius: 8px;
}
</style>

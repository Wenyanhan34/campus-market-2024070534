<template>
  <nav class="app-nav">
    <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" class="nav-item">
      <el-icon :size="18"><component :is="link.icon" /></el-icon>
      <span>{{ link.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
const navLinks = [
  { path: '/', label: '首页', icon: 'HomeFilled' },
  { path: '/trade', label: '二手交易', icon: 'Goods' },
  { path: '/lost-found', label: '失物招领', icon: 'Search' },
  { path: '/group-buy', label: '拼单搭子', icon: 'UserFilled' },
  { path: '/errand', label: '跑腿委托', icon: 'Van' },
  { path: '/publish', label: '发布', icon: 'Plus' },
  { path: '/message', label: '消息', icon: 'Message' },
  { path: '/user', label: '我的', icon: 'Avatar' },
]
</script>

<style scoped>
.app-nav {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.25s ease;
  position: relative;
}

.nav-item:hover {
  background: #f0f4ff;
  color: #2563eb;
}

.nav-item.router-link-active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: #2563eb;
  border-radius: 3px 3px 0 0;
}
</style>

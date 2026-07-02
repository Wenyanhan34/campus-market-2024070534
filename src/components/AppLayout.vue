<template>
  <div class="app-layout">
    <AppHeader />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-links">
          <a href="/">首页</a>
          <a href="/trade">二手交易</a>
          <a href="/lost-found">失物招领</a>
          <a href="/group-buy">拼单搭子</a>
          <a href="/errand">跑腿委托</a>
        </div>
        <p>校园轻集市 &copy; {{ year }} — 轻量、可信、面向校园生活</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'

const year = new Date().getFullYear()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.app-main {
  flex: 1;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 28px 24px 40px;
  width: 100%;
}

.app-footer {
  background: var(--color-bg-white);
  border-top: 1px solid var(--color-border);
}

.footer-inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 24px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.footer-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 13px;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-primary);
}

.app-footer p {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

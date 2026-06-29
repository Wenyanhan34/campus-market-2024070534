<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <span>校园轻集市 &copy; {{ year }} — 轻量、可信、面向校园生活</span>
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
  background: #f5f7fb;
}

.app-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
}

.app-footer {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: #9ca3af;
  border-top: 1px solid #e8ecf4;
  background: #fff;
}
</style>

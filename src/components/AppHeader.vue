<template>
  <header class="app-header">
    <div class="header-left">
      <div class="brand">
        <el-icon :size="26" color="#2563eb"><School /></el-icon>
        <span class="logo">校园轻集市</span>
        <span class="slogan">轻量 · 可信 · 面向校园</span>
      </div>
      <AppNav />
    </div>

    <div class="header-right">
      <el-input
        v-model="searchText"
        placeholder="搜索商品、失物、拼单..."
        :prefix-icon="Search"
        class="search-box"
        size="large"
        clearable
      />
      <el-avatar :size="36" class="user-avatar">
        <el-icon><Avatar /></el-icon>
      </el-avatar>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import AppNav from './AppNav.vue'

const searchText = ref('')
</script>

<style scoped>
.app-header {
  height: 64px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-bottom: 1px solid #e8ecf4;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slogan {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  width: 260px;
}

.user-avatar {
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s;
}

.user-avatar:hover {
  border-color: #2563eb;
}
</style>

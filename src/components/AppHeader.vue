<template>
  <header class="app-header">
    <div class="header-left">
      <div class="brand" @click="$router.push('/')" style="cursor: pointer">
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
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-mini">
          <el-avatar :size="36" class="user-avatar">
            {{ userStore.userInitial }}
          </el-avatar>
          <span class="user-name">{{ userStore.displayName }}</span>
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="/user">
              <el-icon><Avatar /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item command="/publish">
              <el-icon><Plus /></el-icon>发布信息
            </el-dropdown-item>
            <el-dropdown-item command="/message">
              <el-icon><Message /></el-icon>消息中心
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const searchText = ref('')

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    return
  }
  router.push(command)
}
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
.user-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}
.user-mini:hover {
  background: #f0f4ff;
}
.user-avatar {
  border: 2px solid #e5e7eb;
  transition: border-color 0.2s;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}
.user-avatar:hover {
  border-color: #2563eb;
}
.user-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}
</style>

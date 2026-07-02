<template>
  <header ref="headerRef" class="app-header" :class="{ scrolled }">
    <div class="header-inner">
      <div class="header-left">
        <div class="brand" @click="$router.push('/')">
          <div class="brand-icon">
            <el-icon :size="22" color="#fff"><School /></el-icon>
          </div>
          <div class="brand-text">
            <span class="logo">校园轻集市</span>
            <span class="slogan">轻量 · 可信 · 面向校园</span>
          </div>
        </div>
        <AppNav />
      </div>
      <div class="header-right">
        <div v-if="userStore.isLoggedIn" class="search-wrapper">
          <el-input
            v-model="searchText"
            placeholder="搜索商品、失物、拼单..."
            :prefix-icon="Search"
            class="search-box"
            size="large"
            clearable
          />
        </div>
        <template v-if="userStore.isLoggedIn">
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
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <div class="auth-links">
            <router-link to="/login" class="auth-link login-link">登录</router-link>
            <router-link to="/register" class="auth-link register-link">注册</router-link>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const searchText = ref('')
const headerRef = ref<HTMLElement>()
const scrolled = ref(false)

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    return
  }
  router.push(command)
}

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  transition: box-shadow var(--transition-normal);
}

.app-header.scrolled {
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
}

.header-inner {
  height: var(--header-height);
  max-width: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.brand-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: var(--radius-md);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.slogan {
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 0.5px;
  display: none;
}

@media (min-width: 1400px) {
  .slogan {
    display: inline;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-wrapper {
  transition: all var(--transition-fast);
}

.search-box {
  width: 180px;
}

.search-box :deep(.el-input__wrapper) {
  border-radius: var(--radius-xl);
  background: #f3f4f6;
  border: 1px solid transparent;
  transition: all var(--transition-fast);
}

.search-box :deep(.el-input__wrapper:hover) {
  background: #fff;
  border-color: var(--color-primary-lighter);
}

.search-box :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.user-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.user-mini:hover {
  background: var(--color-primary-light);
}

.user-avatar {
  border: 2px solid var(--color-border);
  transition: border-color var(--transition-fast);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.user-mini:hover .user-avatar {
  border-color: var(--color-primary);
}

.user-name {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}

.msg-badge {
  margin-left: 4px;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-link {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.login-link {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.login-link:hover {
  background: var(--color-primary-lighter);
}

.register-link {
  color: #fff;
  background: var(--color-primary);
}

.register-link:hover {
  background: var(--color-primary-hover);
}
</style>

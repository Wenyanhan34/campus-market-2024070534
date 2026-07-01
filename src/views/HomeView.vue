<template>
  <div class="home-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-bg">
        <div class="hero-shape hero-shape-1" />
        <div class="hero-shape hero-shape-2" />
        <div class="hero-shape hero-shape-3" />
      </div>
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">{{ welcomeText }}</h1>
          <p class="hero-desc">轻量、可信、面向校园生活 — 交易 · 失物 · 拼单 · 跑腿</p>
          <div class="hero-search">
            <el-input
              v-model="searchText"
              placeholder="搜索商品、失物、拼单..."
              :prefix-icon="SearchIcon"
              size="large"
              class="hero-input"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </template>
            </el-input>
          </div>
          <div class="hero-stats">
            <div class="stat-item" v-for="s in stats" :key="s.label">
              <span class="stat-number">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-illustration">
            <el-icon :size="120" color="rgba(37,99,235,0.15)"><School /></el-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类入口 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">快捷入口</h2>
        <p class="section-subtitle">选择你需要的校园服务</p>
      </div>
      <div class="category-grid">
        <div
          v-for="cat in categories"
          :key="cat.path"
          class="category-card"
          :style="{ '--card-color': cat.color, '--card-bg': cat.bg }"
          @click="$router.push(cat.path)"
        >
          <div class="category-icon-wrap">
            <el-icon :size="32" :color="cat.color"><component :is="cat.icon" /></el-icon>
          </div>
          <h3>{{ cat.label }}</h3>
          <p>{{ cat.desc }}</p>
          <span class="category-arrow">
            <el-icon><ArrowRight /></el-icon>
          </span>
        </div>
      </div>
    </section>

    <!-- 平台动态 -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">平台动态</h2>
        <p class="section-subtitle">校园轻集市的最新消息</p>
      </div>
      <div class="news-timeline">
        <div v-for="(item, idx) in news" :key="item.title" class="news-item" :style="{ '--delay': idx * 0.1 + 's' }">
          <div class="news-dot" :style="{ background: item.tagType === 'danger' ? 'var(--color-danger)' : 'var(--color-success)' }" />
          <div class="news-card">
            <div class="news-meta">
              <el-tag :type="item.tagType" size="small" round>{{ item.tag }}</el-tag>
              <span class="news-time">{{ item.time }}</span>
            </div>
            <p class="news-text">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search as SearchIcon } from '@element-plus/icons-vue'

const $router = useRouter()
const searchText = ref('')

function handleSearch() {
  if (searchText.value.trim()) {
    $router.push(`/trade?search=${encodeURIComponent(searchText.value.trim())}`)
  }
}

const welcomeText = ref('欢迎来到校园轻集市')
const displayText = ref('')
let charIndex = 0

onMounted(() => {
  const interval = setInterval(() => {
    if (charIndex < welcomeText.value.length) {
      displayText.value += welcomeText.value[charIndex]
      charIndex++
    } else {
      clearInterval(interval)
    }
  }, 80)
})

const stats = [
  { value: '1,234', label: '发布信息' },
  { value: '892', label: '成功交易' },
  { value: '456', label: '失物找回' },
  { value: '2,567', label: '注册用户' },
]

const categories = [
  { path: '/trade', label: '二手交易', icon: 'Goods', color: '#2563eb', bg: '#eff6ff', desc: '教材、数码、生活好物' },
  { path: '/lost-found', label: '失物招领', icon: 'Search', color: '#f59e0b', bg: '#fffbeb', desc: '寻物启事与拾物登记' },
  { path: '/group-buy', label: '拼单搭子', icon: 'UserFilled', color: '#10b981', bg: '#ecfdf5', desc: '拼单、组队、找搭子' },
  { path: '/errand', label: '跑腿委托', icon: 'Van', color: '#8b5cf6', bg: '#f5f3ff', desc: '代取、代送、代办' },
]

const news = [
  { title: 'notice1', tag: '公告', tagType: 'danger' as const, time: '2026-06-28', text: '校园轻集市 v2.0 即将上线，新增拼单搭子消息通知功能！' },
  { title: 'notice2', tag: '活动', tagType: 'success' as const, time: '2026-06-27', text: '毕业季二手交易专区火热进行中，大量教材低价转让。' },
  { title: 'notice3', tag: '公告', tagType: 'danger' as const, time: '2026-06-26', text: '请勿在平台发布违规信息，共同维护诚信校园交易环境。' },
  { title: 'notice4', tag: '活动', tagType: 'success' as const, time: '2026-06-25', text: '失物招领功能升级，现已支持图片上传与智能匹配。' },
]
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ===== Hero ===== */
.hero-section {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%);
  padding: 48px 48px 40px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
}

.hero-shape-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #2563eb 0%, transparent 70%);
  top: -80px;
  right: -60px;
  animation: float 6s ease-in-out infinite;
}

.hero-shape-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
  bottom: -40px;
  left: 20%;
  animation: float 8s ease-in-out infinite reverse;
}

.hero-shape-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: 20%;
  left: 60%;
  animation: float 7s ease-in-out infinite 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

.hero-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #1e40af, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.hero-desc {
  margin: 0 0 24px;
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.hero-search {
  margin-bottom: 28px;
  max-width: 520px;
}

.hero-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.hero-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.hero-input :deep(.el-input-group__append) {
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  background: transparent;
  border: none;
}

.hero-input :deep(.el-input-group__append .el-button) {
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  min-width: 80px;
  height: 40px;
  font-weight: 600;
}

.hero-stats {
  display: flex;
  gap: 36px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-size: 24px;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.hero-visual {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-illustration {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  backdrop-filter: blur(8px);
}

/* ===== Sections ===== */
.section-header {
  text-align: center;
  margin-bottom: 28px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 6px;
  color: var(--color-text);
}

.section-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-muted);
}

/* ===== Category ===== */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--color-border-light);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-color);
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: transparent;
}

.category-card:hover::before {
  opacity: 1;
}

.category-icon-wrap {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast);
}

.category-card:hover .category-icon-wrap {
  transform: scale(1.1) rotate(-5deg);
}

.category-card h3 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
}

.category-card p {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.category-arrow {
  position: absolute;
  right: 16px;
  top: 16px;
  color: var(--color-text-muted);
  opacity: 0;
  transition: all var(--transition-fast);
}

.category-card:hover .category-arrow {
  opacity: 1;
  right: 12px;
}

/* ===== News Timeline ===== */
.news-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 28px;
}

.news-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--color-border);
}

.news-item {
  position: relative;
  padding-bottom: 20px;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: var(--delay);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.news-item:last-child {
  padding-bottom: 0;
}

.news-dot {
  position: absolute;
  left: -24px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--color-bg-white);
  box-shadow: 0 0 0 2px currentColor;
}

.news-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  transition: all var(--transition-fast);
  border: 1px solid var(--color-border-light);
}

.news-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-lighter);
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.news-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.news-text {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>

<template>
  <div class="home-page">
    <!-- Banner 区域 -->
    <el-card class="banner-card" shadow="never">
      <div class="banner-content">
        <div class="banner-text">
          <h1>欢迎来到校园轻集市</h1>
          <p>轻量、可信、面向校园生活 — 交易 · 失物 · 拼单 · 跑腿</p>
        </div>
        <el-icon :size="80" color="#2563eb" class="banner-icon"><School /></el-icon>
      </div>
    </el-card>

    <!-- 分类入口 -->
    <h2 class="section-title">快捷入口</h2>
    <el-row :gutter="20" class="category-grid">
      <el-col :span="6" v-for="cat in categories" :key="cat.path">
        <el-card shadow="hover" class="category-card" @click="$router.push(cat.path)">
          <el-icon :size="36" :color="cat.color"><component :is="cat.icon" /></el-icon>
          <h3>{{ cat.label }}</h3>
          <p>{{ cat.desc }}</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 平台动态 -->
    <h2 class="section-title">平台动态</h2>
    <el-row :gutter="20">
      <el-col :span="12" v-for="item in news" :key="item.title">
        <el-card shadow="hover" class="news-card">
          <div class="news-meta">
            <el-tag :type="item.tagType" size="small">{{ item.tag }}</el-tag>
            <span class="news-time">{{ item.time }}</span>
          </div>
          <p class="news-text">{{ item.text }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const $router = useRouter()

const categories = [
  { path: '/trade', label: '二手交易', icon: 'Goods', color: '#2563eb', desc: '教材、数码、生活好物' },
  { path: '/lost-found', label: '失物招领', icon: 'Search', color: '#f59e0b', desc: '寻物启事与拾物登记' },
  { path: '/group-buy', label: '拼单搭子', icon: 'UserFilled', color: '#10b981', desc: '拼单、组队、找搭子' },
  { path: '/errand', label: '跑腿委托', icon: 'Van', color: '#8b5cf6', desc: '代取、代送、代办' },
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
  gap: 28px;
}

.banner-card {
  border-radius: 14px;
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  border: none;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.banner-text h1 {
  font-size: 28px;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-text p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.category-grid {
  margin-bottom: 4px;
}

.category-card {
  text-align: center;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 12px;
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
}

.category-card h3 {
  margin: 12px 0 4px;
  font-size: 16px;
  color: #1f2937;
}

.category-card p {
  margin: 0;
  font-size: 13px;
  color: #9ca3af;
}

.news-card {
  border-radius: 10px;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.news-time {
  font-size: 12px;
  color: #9ca3af;
}

.news-text {
  margin: 0;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}
</style>

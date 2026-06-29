<template>
  <div class="page">
    <!-- 用户信息卡片 -->
    <el-card shadow="never" class="user-profile">
      <div class="profile-inner">
        <el-avatar :size="72" class="profile-avatar">
          <el-icon :size="36"><Avatar /></el-icon>
        </el-avatar>
        <div class="profile-info">
          <h2>校园用户</h2>
          <p class="profile-meta">XX 大学 | 加入于 2026年</p>
          <div class="profile-stats">
            <span><strong>12</strong> 发布</span>
            <span><strong>8</strong> 收藏</span>
            <span><strong>6</strong> 成交</span>
          </div>
        </div>
        <el-button type="primary" plain>编辑资料</el-button>
      </div>
    </el-card>

    <!-- 功能入口 -->
    <el-row :gutter="20" class="menu-grid">
      <el-col :span="8" v-for="item in menuItems" :key="item.label">
        <el-card shadow="hover" class="menu-card">
          <el-icon :size="28" :color="item.color"><component :is="item.icon" /></el-icon>
          <span class="menu-label">{{ item.label }}</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
const menuItems = [
  { label: '我的发布', icon: 'List', color: '#2563eb' },
  { label: '我的收藏', icon: 'Star', color: '#f59e0b' },
  { label: '交易记录', icon: 'Document', color: '#10b981' },
  { label: '浏览历史', icon: 'Clock', color: '#8b5cf6' },
  { label: '账号设置', icon: 'Setting', color: '#6b7280' },
  { label: '反馈与帮助', icon: 'QuestionFilled', color: '#ef4444' },
]
</script>

<style scoped>
.page { padding: 0; display: flex; flex-direction: column; gap: 24px; }

.user-profile {
  border-radius: 14px;
}

.profile-inner {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  border: 3px solid #eff6ff;
}

.profile-info h2 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #1f2937;
}

.profile-meta {
  margin: 0 0 12px;
  font-size: 13px;
  color: #9ca3af;
}

.profile-stats {
  display: flex;
  gap: 24px;
}

.profile-stats span {
  font-size: 13px;
  color: #6b7280;
}

.profile-stats strong {
  font-size: 18px;
  color: #1f2937;
  margin-right: 4px;
}

.menu-grid {
  margin-bottom: 4px;
}

.menu-card {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 10px;
  transition: transform 0.2s;
  margin-bottom: 16px;
}

.menu-card:hover {
  transform: translateY(-2px);
}

.menu-label {
  flex: 1;
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
}

.menu-arrow {
  color: #d1d5db;
}
</style>

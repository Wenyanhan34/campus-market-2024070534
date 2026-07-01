<template>
  <el-card class="item-card" shadow="hover">
    <div class="card-body">
      <div class="card-img">
        <el-icon :size="40" color="#d1d5db"><Picture /></el-icon>
      </div>
      <div class="card-info">
        <div class="card-header">
          <h3 class="card-title">{{ title }}</h3>
          <slot name="tag" />
        </div>
        <p class="card-desc">{{ description }}</p>
        <div v-if="location" class="card-location">
          <el-icon :size="14"><Location /></el-icon>
          <span>{{ location }}</span>
        </div>
        <div class="card-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  location?: string
}>()
</script>

<style scoped>
.item-card {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.item-card:hover {
  transform: translateY(-2px);
}
.card-body {
  display: flex;
  gap: 16px;
}
.card-img {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f3f4f6;
}
.card-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-desc {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}
.card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>

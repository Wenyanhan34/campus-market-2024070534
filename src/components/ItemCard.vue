<template>
  <el-card class="item-card" shadow="hover">
    <div class="card-body">
      <div class="card-img">
        <el-icon :size="40" color="#d1d5db"><Picture /></el-icon>
      </div>
      <div class="card-info">
        <h3 class="card-title">{{ item.title }}</h3>
        <slot></slot>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  item: Record<string, unknown>
}>()
</script>

<style scoped>
.item-card {
  margin-bottom: 12px;
  border-radius: 10px;
  overflow: hidden;
}

.card-body {
  display: flex;
  gap: 16px;
}

.card-img {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #f3f4f6;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #1f2937;
}

:deep(.card-info p) {
  margin: 4px 0;
  font-size: 13px;
  color: #6b7280;
}
</style>

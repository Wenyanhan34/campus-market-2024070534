<template>
  <el-card class="item-card" shadow="hover" body-style="padding: 0">
    <div class="card-inner">
      <div class="card-img" :style="{ background: imgGradient }">
        <div class="img-placeholder">
          <el-icon :size="36" color="rgba(255,255,255,0.5)"><Picture /></el-icon>
        </div>
        <div class="img-category-tag">
          <slot name="tag" />
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-desc">{{ description }}</p>
        <div v-if="location" class="card-location">
          <el-icon :size="13"><Location /></el-icon>
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
import { computed } from 'vue'

const props = defineProps<{
  title: string
  description: string
  location?: string
  categoryColor?: string
}>()

const gradients: Record<string, string> = {
  trade: 'linear-gradient(135deg, #2563eb, #7c3aed)',
  lost: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  found: 'linear-gradient(135deg, #10b981, #059669)',
  groupBuy: 'linear-gradient(135deg, #10b981, #06b6d4)',
  errand: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  default: 'linear-gradient(135deg, #6366f1, #2563eb)',
}

const imgGradient = computed(() => {
  return props.categoryColor || gradients.default
})
</script>

<style scoped>
.item-card {
  margin-bottom: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-inner {
  display: flex;
  gap: 0;
}

.card-img {
  width: 200px;
  min-height: 160px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.img-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.img-category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 4px;
}

.img-category-tag :deep(.el-tag) {
  border: none;
  font-weight: 600;
}

.card-body {
  flex: 1;
  min-width: 0;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary);
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
  color: var(--color-text-muted);
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 4px;
}
</style>

<template>
  <div class="loading-state">
    <div class="spinner"></div>
    <p>{{ text || '正在加载...' }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<style scoped>
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  color: var(--color-text-secondary);
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
}

.spinner {
  width: 32px;
  height: 32px;
  margin-bottom: 16px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-state p {
  margin: 0;
  font-size: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div class="error-state">
    <div class="error-icon-wrap">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="28" fill="#FEF2F2" stroke="#FECACA" stroke-width="2"/>
        <path d="M32 20v16M32 42v2" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </div>
    <h3 class="error-title">加载失败</h3>
    <p class="error-message">{{ message }}</p>
    <button
      v-if="showRetry"
      type="button"
      class="retry-btn"
      @click="$emit('retry')"
    >
      重新加载
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  showRetry?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  color: var(--color-danger);
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-lg);
}

.error-icon-wrap {
  margin-bottom: 12px;
}

.error-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #991b1b;
}

.error-message {
  margin: 0 0 20px;
  font-size: 14px;
  color: #b91c1c;
  text-align: center;
  max-width: 400px;
  line-height: 1.6;
}

.retry-btn {
  border: none;
  border-radius: var(--radius-md);
  padding: 10px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: var(--color-danger);
  color: #fff;
  transition: background var(--transition-fast);
}

.retry-btn:hover {
  background: #dc2626;
}

.retry-btn:active {
  background: #b91c1c;
}
</style>

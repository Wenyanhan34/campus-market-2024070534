<template>
  <div class="empty-state">
    <div class="empty-icon-wrap">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="10" y="20" width="60" height="48" rx="8" fill="#E5E7EB"/>
        <rect x="18" y="30" width="44" height="4" rx="2" fill="#D1D5DB"/>
        <rect x="18" y="38" width="32" height="4" rx="2" fill="#D1D5DB"/>
        <rect x="18" y="46" width="24" height="4" rx="2" fill="#D1D5DB"/>
        <circle cx="40" cy="56" r="16" fill="#F3F4F6"/>
        <path d="M40 48v16M32 56h16" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <p class="empty-text">{{ text }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon-wrap {
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-muted);
}
</style>

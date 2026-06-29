<template>
  <div class="item-card">
    <h3>{{ item.title }}</h3>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  item: Record<string, unknown>
}>()
</script>
<style scoped>
.item-card {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 12px;
}
</style>

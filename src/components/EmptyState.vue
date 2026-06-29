<template>
  <el-empty :description="text" :image-size="120">
    <el-icon :size="48" color="#d1d5db"><Inbox /></el-icon>
  </el-empty>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style scoped>
</style>

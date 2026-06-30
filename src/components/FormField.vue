<template>
  <el-form-item
    :label="label"
    :required="required"
    :error="error"
    :class="{ 'is-error': !!error }"
  >
    <slot />
    <template v-if="error" #error>
      <span class="form-field-error">{{ error }}</span>
    </template>
  </el-form-item>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  required?: boolean
  error?: string
}>()
</script>

<style scoped>
.form-field-error {
  font-size: 12px;
  line-height: 1.2;
}
</style>

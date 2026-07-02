<template>
  <div class="search-bar">
    <div class="search-input-wrap">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="#9CA3AF" stroke-width="1.5"/>
        <path d="M11 11l3.5 3.5" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @input="handleInput"
      />
      <button
        v-if="modelValue"
        type="button"
        class="clear-btn"
        @click="$emit('update:modelValue', '')"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3l8 8M11 3l-8 8" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  {
    placeholder: '请输入关键词搜索',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.search-bar {
  width: 100%;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.search-input-wrap:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-icon {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 10px 0;
  font-size: 14px;
  color: var(--color-text);
  background: transparent;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background var(--transition-fast);
}

.clear-btn:hover {
  background: var(--color-bg);
}
</style>

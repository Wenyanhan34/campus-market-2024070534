<template>
  <div class="page">
    <div class="page-header">
      <h1>跑腿委托</h1>
    </div>

    <EmptyState v-if="errands.length === 0" text="暂无跑腿任务" />

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in errands"
        :key="item.id"
        :title="item.title"
        :description="item.description"
      >
        <template #tag>
          <div class="item-tags">
            <el-tag type="warning" size="small">{{ item.taskType }}</el-tag>
            <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small">
              {{ item.status === 'open' ? '进行中' : '已完成' }}
            </el-tag>
          </div>
        </template>
        <template #footer>
          <el-tag type="danger" size="small" effect="dark" class="reward-tag">¥{{ item.reward }}</el-tag>
          <span class="item-meta">
            <el-icon><Position /></el-icon> {{ item.from }}
          </span>
          <span class="item-meta">
            <el-icon><Location /></el-icon> {{ item.to }}
          </span>
          <span class="item-meta">
            <el-icon><Clock /></el-icon> {{ item.deadline }}
          </span>
          <el-button
            :type="favoriteStore.isFavorite('errand', item.id) ? 'warning' : 'default'"
            :icon="favoriteStore.isFavorite('errand', item.id) ? 'StarFilled' : 'Star'"
            size="small"
            round
            @click="favoriteStore.toggleFavorite({
              id: item.id,
              type: 'errand',
              title: item.title,
              description: item.description
            })"
          >
            {{ favoriteStore.isFavorite('errand', item.id) ? '已收藏' : '收藏' }}
          </el-button>
        </template>
      </ItemCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getErrands, type ErrandItem } from '@/api/errand'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  const res = await getErrands()
  errands.value = res.data
})
</script>

<style scoped>
.page { padding: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 22px; color: #1f2937; }
.item-tags { display: flex; gap: 6px; flex-shrink: 0; }
.reward-tag { margin-right: 4px; }
.item-meta { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 4px; }
</style>

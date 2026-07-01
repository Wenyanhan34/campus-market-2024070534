<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1>跑腿委托</h1>
        <el-tag v-if="errands.length" type="info" effect="plain" round>
          共 {{ errands.length }} 个任务
        </el-tag>
      </div>
    </div>

    <LoadingSkeleton v-if="loading" :count="4" />

    <EmptyState v-else-if="errands.length === 0" text="暂无跑腿任务">
      <template #action>
        <el-button type="primary" size="small" @click="$router.push('/publish')">去发布</el-button>
      </template>
    </EmptyState>

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in errands"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        category-color="errand"
      >
        <template #tag>
          <el-tag type="warning" size="small" round>{{ item.taskType }}</el-tag>
          <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small" round>
            {{ item.status === 'open' ? '进行中' : '已完成' }}
          </el-tag>
        </template>
        <template #footer>
          <el-tag type="danger" size="small" effect="dark" round class="reward-tag">¥{{ item.reward }}</el-tag>
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
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const errands = ref<ErrandItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getErrands()
    errands.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.page { padding: 0; }

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-header-left h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
  font-weight: 700;
}

.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reward-tag {
  margin-right: 4px;
  font-weight: 600;
}

.item-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

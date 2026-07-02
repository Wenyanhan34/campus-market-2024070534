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

    <SearchBar v-model="keyword" placeholder="搜索标题、任务类型、取件地、送达地或描述..." />

    <LoadingState v-if="loading" text="正在加载跑腿任务..." />

    <ErrorState
      v-else-if="error"
      message="跑腿数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadErrands"
    />

    <EmptyState v-else-if="filteredList.length === 0" text="暂无跑腿任务">
      <template #action>
        <el-button type="primary" size="small" @click="$router.push('/publish')">去发布</el-button>
      </template>
    </EmptyState>

    <div v-else class="list-wrap">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="list-item"
        @click="$router.push(`/errand/${item.id}`)"
      >
      <ItemCard
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getErrands, type ErrandItem } from '@/api/errand'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const errands = ref<ErrandItem[]>([])
const keyword = ref('')
const loading = ref(true)
const error = ref(false)

const filteredList = computed(() => {
  let list = errands.value
  if (keyword.value.trim()) {
    const q = keyword.value.trim().toLowerCase()
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.taskType.toLowerCase().includes(q) ||
      i.from.toLowerCase().includes(q) ||
      i.to.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    )
  }
  return list
})

async function loadErrands() {
  loading.value = true
  error.value = false
  try {
    const res = await getErrands()
    errands.value = res.data
  } catch {
    error.value = true
    errands.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadErrands()
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

.list-item {
  cursor: pointer;
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

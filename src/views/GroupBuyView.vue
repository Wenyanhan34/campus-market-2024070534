<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1>拼单搭子</h1>
        <el-tag v-if="groupBuys.length" type="info" effect="plain" round>
          共 {{ groupBuys.length }} 条
        </el-tag>
      </div>
    </div>

    <SearchBar v-model="keyword" placeholder="搜索标题、拼单类型、地点或描述..." />

    <LoadingState v-if="loading" text="正在加载拼单信息..." />

    <ErrorState
      v-else-if="error"
      message="拼单数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadGroupBuys"
    />

    <EmptyState v-else-if="filteredList.length === 0" text="暂无拼单信息">
      <template #action>
        <el-button type="primary" size="small" @click="$router.push('/publish')">去发布</el-button>
      </template>
    </EmptyState>

    <div v-else class="list-wrap">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="list-item"
        @click="$router.push(`/group-buy/${item.id}`)"
      >
      <ItemCard
        :title="item.title"
        :description="item.description"
        :location="item.location"
        :image="item.image"
        category-color="groupBuy"
      >
        <template #tag>
          <el-tag type="success" size="small" round>{{ item.type }}</el-tag>
          <el-tag :type="item.status === 'open' ? 'primary' : 'info'" size="small" round>
            {{ item.status === 'open' ? '招募中' : '已结束' }}
          </el-tag>
        </template>
        <template #footer>
          <div class="progress-info">
            <span class="item-meta">
              <el-icon><UserFilled /></el-icon> {{ item.currentCount }}/{{ item.targetCount }} 人
            </span>
            <el-progress
              :percentage="Math.round((item.currentCount / item.targetCount) * 100)"
              :stroke-width="6"
              :color="item.currentCount / item.targetCount >= 0.8 ? 'var(--color-success)' : 'var(--color-primary)'"
              class="progress-bar"
            />
          </div>
          <span class="item-meta">
            <el-icon><Clock /></el-icon> 截止：{{ item.deadline }}
          </span>
          <el-button
            :type="favoriteStore.isFavorite('groupBuy', item.id) ? 'warning' : 'default'"
            :icon="favoriteStore.isFavorite('groupBuy', item.id) ? 'StarFilled' : 'Star'"
            size="small"
            round
            @click="favoriteStore.toggleFavorite({
              id: item.id,
              type: 'groupBuy',
              title: item.title,
              description: item.description,
              location: item.location
            })"
          >
            {{ favoriteStore.isFavorite('groupBuy', item.id) ? '已收藏' : '收藏' }}
          </el-button>
        </template>
      </ItemCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const groupBuys = ref<GroupBuyItem[]>([])
const keyword = ref('')
const loading = ref(true)
const error = ref(false)

const filteredList = computed(() => {
  let list = groupBuys.value
  if (keyword.value.trim()) {
    const q = keyword.value.trim().toLowerCase()
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    )
  }
  return list
})

async function loadGroupBuys() {
  loading.value = true
  error.value = false
  try {
    const res = await getGroupBuys()
    groupBuys.value = res.data
  } catch {
    error.value = true
    groupBuys.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGroupBuys()
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

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.progress-bar {
  max-width: 200px;
}

.item-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

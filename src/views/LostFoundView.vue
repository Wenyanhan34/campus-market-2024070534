<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1>失物招领</h1>
        <el-tag v-if="filteredList.length" type="info" effect="plain" round>
          共 {{ filteredList.length }} 条
        </el-tag>
      </div>
      <div class="page-header-right">
        <el-radio-group v-model="filterType" size="small">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="lost">寻物</el-radio-button>
          <el-radio-button value="found">拾物</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <SearchBar v-model="keyword" placeholder="搜索标题、物品名称、地点或描述..." />

    <LoadingState v-if="loading" text="正在加载失物招领信息..." />

    <ErrorState
      v-else-if="error"
      message="失物招领数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadLostFounds"
    />

    <EmptyState v-else-if="filteredList.length === 0" text="暂无失物招领信息">
      <template #action>
        <el-button type="primary" size="small" @click="$router.push('/publish')">去发布</el-button>
      </template>
    </EmptyState>

    <div v-else class="list-wrap">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="list-item"
        @click="$router.push(`/lost-found/${item.id}`)"
      >
      <ItemCard
        :title="item.title"
        :description="item.description"
        :location="item.location"
        :category-color="item.type === 'lost' ? 'lost' : 'found'"
      >
        <template #tag>
          <el-tag :type="item.type === 'lost' ? 'danger' : 'success'" size="small" round>
            {{ item.type === 'lost' ? '寻物' : '拾物' }}
          </el-tag>
          <el-tag :type="item.status === 'open' ? 'warning' : 'info'" size="small" round>
            {{ item.status === 'open' ? '待认领' : '已完成' }}
          </el-tag>
        </template>
        <template #footer>
          <span class="item-meta">
            <el-icon><Goods /></el-icon> {{ item.itemName }}
          </span>
          <span class="item-meta">
            <el-icon><Phone /></el-icon> {{ item.contact }}
          </span>
          <el-button
            :type="favoriteStore.isFavorite('lostFound', item.id) ? 'warning' : 'default'"
            :icon="favoriteStore.isFavorite('lostFound', item.id) ? 'StarFilled' : 'Star'"
            size="small"
            round
            @click="favoriteStore.toggleFavorite({
              id: item.id,
              type: 'lostFound',
              title: item.title,
              description: item.description,
              location: item.location
            })"
          >
            {{ favoriteStore.isFavorite('lostFound', item.id) ? '已收藏' : '收藏' }}
          </el-button>
        </template>
      </ItemCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const filterType = ref('')
const keyword = ref('')
const lostFounds = ref<LostFoundItem[]>([])
const loading = ref(true)
const error = ref(false)

const filteredList = computed(() => {
  let list = lostFounds.value
  if (filterType.value) {
    list = list.filter(i => i.type === filterType.value)
  }
  if (keyword.value.trim()) {
    const q = keyword.value.trim().toLowerCase()
    list = list.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.itemName.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    )
  }
  return list
})

async function loadLostFounds() {
  loading.value = true
  error.value = false
  try {
    const res = await getLostFounds()
    lostFounds.value = res.data
  } catch {
    error.value = true
    lostFounds.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLostFounds()
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

.item-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

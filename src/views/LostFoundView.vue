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

    <LoadingSkeleton v-if="loading" :count="4" />

    <EmptyState v-else-if="filteredList.length === 0" text="暂无失物招领信息">
      <template #action>
        <el-button type="primary" size="small" @click="$router.push('/publish')">去发布</el-button>
      </template>
    </EmptyState>

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in filteredList"
        :key="item.id"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const filterType = ref('')
const lostFounds = ref<LostFoundItem[]>([])
const loading = ref(true)

const filteredList = computed(() => {
  if (!filterType.value) return lostFounds.value
  return lostFounds.value.filter(i => i.type === filterType.value)
})

onMounted(async () => {
  try {
    const res = await getLostFounds()
    lostFounds.value = res.data
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

.item-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

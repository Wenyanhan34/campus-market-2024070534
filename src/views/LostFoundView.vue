<template>
  <div class="page">
    <div class="page-header">
      <h1>失物招领</h1>
      <div class="header-actions">
        <el-radio-group v-model="filterType" size="small">
          <el-radio-button value="">全部</el-radio-button>
          <el-radio-button value="lost">寻物</el-radio-button>
          <el-radio-button value="found">拾物</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <EmptyState v-if="filteredList.length === 0" text="暂无失物招领信息" />

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in filteredList"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :location="item.location"
      >
        <template #tag>
          <div class="item-tags">
            <el-tag :type="item.type === 'lost' ? 'danger' : 'success'" size="small">
              {{ item.type === 'lost' ? '寻物' : '拾物' }}
            </el-tag>
            <el-tag :type="item.status === 'open' ? 'warning' : 'info'" size="small">
              {{ item.status === 'open' ? '待认领' : '已完成' }}
            </el-tag>
          </div>
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
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const filterType = ref('')
const lostFounds = ref<LostFoundItem[]>([])

const filteredList = computed(() => {
  if (!filterType.value) return lostFounds.value
  return lostFounds.value.filter(i => i.type === filterType.value)
})

onMounted(async () => {
  const res = await getLostFounds()
  lostFounds.value = res.data
})
</script>

<style scoped>
.page { padding: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 22px; color: #1f2937; }
.item-tags { display: flex; gap: 6px; flex-shrink: 0; }
.item-meta { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 4px; }
</style>

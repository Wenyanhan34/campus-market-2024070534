<template>
  <div class="page">
    <div class="page-header">
      <h1>二手交易</h1>
      <el-input v-model="searchText" placeholder="搜索商品..." :prefix-icon="Search" clearable class="page-search" />
    </div>

    <EmptyState v-if="trades.length === 0" text="暂无二手交易信息" />

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in trades"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :location="item.location"
      >
        <template #tag>
          <div class="item-tags">
            <el-tag type="primary" size="small">{{ item.category }}</el-tag>
            <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small">
              {{ item.status === 'open' ? '进行中' : '已结束' }}
            </el-tag>
          </div>
        </template>
        <template #footer>
          <span class="item-price">¥{{ item.price }}</span>
          <span class="item-condition">{{ item.condition }}</span>
          <span class="item-publisher">
            <el-icon><User /></el-icon> {{ item.publisher }}
          </span>
          <el-button
            :type="favoriteStore.isFavorite('trade', item.id) ? 'warning' : 'default'"
            :icon="favoriteStore.isFavorite('trade', item.id) ? 'StarFilled' : 'Star'"
            size="small"
            round
            @click="favoriteStore.toggleFavorite({
              id: item.id,
              type: 'trade',
              title: item.title,
              description: item.description,
              location: item.location
            })"
          >
            {{ favoriteStore.isFavorite('trade', item.id) ? '已收藏' : '收藏' }}
          </el-button>
        </template>
      </ItemCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getTrades, type TradeItem } from '@/api/trade'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const searchText = ref('')
const trades = ref<TradeItem[]>([])

onMounted(async () => {
  const res = await getTrades()
  trades.value = res.data
})
</script>

<style scoped>
.page { padding: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 22px; color: #1f2937; }
.page-search { width: 240px; }
.item-tags { display: flex; gap: 6px; flex-shrink: 0; }
.item-price { font-size: 18px; font-weight: 700; color: #ef4444; }
.item-condition { font-size: 13px; color: #6b7280; }
.item-publisher { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 4px; }
</style>

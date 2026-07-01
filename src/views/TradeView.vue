<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1>二手交易</h1>
        <el-tag v-if="trades.length" type="info" effect="plain" round>
          共 {{ trades.length }} 件商品
        </el-tag>
      </div>
      <div class="page-header-right">
        <el-radio-group v-model="sortOrder" size="small">
          <el-radio-button value="default">默认</el-radio-button>
          <el-radio-button value="price-asc">价格从低</el-radio-button>
          <el-radio-button value="price-desc">价格从高</el-radio-button>
        </el-radio-group>
        <el-input
          v-model="searchText"
          placeholder="搜索商品..."
          :prefix-icon="Search"
          clearable
          class="page-search"
        />
      </div>
    </div>

    <LoadingSkeleton v-if="loading" :count="4" />

    <EmptyState v-else-if="filteredTrades.length === 0" text="暂无二手交易信息">
      <template #action>
        <el-button type="primary" size="small" @click="$router.push('/publish')">去发布</el-button>
      </template>
    </EmptyState>

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in filteredTrades"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :location="item.location"
        category-color="trade"
      >
        <template #tag>
          <el-tag type="primary" size="small" round>{{ item.category }}</el-tag>
          <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small" round>
            {{ item.status === 'open' ? '进行中' : '已结束' }}
          </el-tag>
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
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getTrades, type TradeItem } from '@/api/trade'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const searchText = ref('')
const sortOrder = ref('default')
const trades = ref<TradeItem[]>([])
const loading = ref(true)

const filteredTrades = computed(() => {
  let list = trades.value
  if (searchText.value.trim()) {
    const q = searchText.value.trim().toLowerCase()
    list = list.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  }
  if (sortOrder.value === 'price-asc') {
    return [...list].sort((a, b) => a.price - b.price)
  }
  if (sortOrder.value === 'price-desc') {
    return [...list].sort((a, b) => b.price - a.price)
  }
  return list
})

onMounted(async () => {
  try {
    const res = await getTrades()
    trades.value = res.data
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

.page-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-search {
  width: 200px;
}

.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item-price {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-danger);
}

.item-condition {
  font-size: 13px;
  color: var(--color-text-secondary);
  padding: 2px 8px;
  background: var(--color-bg);
  border-radius: var(--radius-sm);
}

.item-publisher {
  font-size: 13px;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

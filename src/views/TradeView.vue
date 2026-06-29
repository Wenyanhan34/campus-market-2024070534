<template>
  <div class="page">
    <div class="page-header">
      <h1>二手交易</h1>
      <el-input
        v-model="searchText"
        placeholder="搜索商品..."
        :prefix-icon="Search"
        clearable
        class="page-search"
      />
    </div>

    <EmptyState v-if="trades.length === 0" text="暂无二手交易信息" />
    <div v-else class="list-wrap">
      <ItemCard v-for="item in trades" :key="item.id" :item="item">
        <div class="item-tags">
          <el-tag type="primary" size="small">{{ item.category }}</el-tag>
          <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small">
            {{ item.status === 'open' ? '进行中' : '已结束' }}
          </el-tag>
        </div>
        <p><el-icon><Money /></el-icon> <strong>{{ item.price }}元</strong> | 成色：{{ item.condition }}</p>
        <p><el-icon><User /></el-icon> {{ item.publisher }} | <el-icon><Location /></el-icon> {{ item.location }}</p>
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

const searchText = ref('')
const trades = ref<TradeItem[]>([])

onMounted(async () => {
  const res = await getTrades()
  trades.value = res.data
})
</script>

<style scoped>
.page {
  padding: 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 22px;
  color: #1f2937;
}

.page-search {
  width: 240px;
}

.item-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

:deep(p) {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

<template>
  <main class="page">
    <h1>二手交易</h1>
    <EmptyState v-if="trades.length === 0" text="暂无二手交易信息" />
    <div v-else class="list-wrap">
      <ItemCard v-for="item in trades" :key="item.id" :item="item">
        <p>价格：{{ item.price }}元 | 成色：{{ item.condition }}</p>
        <p>发布人：{{ item.publisher }} | 地点：{{ item.location }}</p>
      </ItemCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTrades } from '@/api/trade'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

// 定义商品数据类型，解决所有红色报错
interface TradeItem {
  id: number
  price: number
  condition: string
  publisher: string
  location: string
}

// 这里不再用Record<string, unknown>，换成上面定义好的类型
const trades = ref<TradeItem[]>([])

onMounted(async () => {
  const res = await getTrades()
  trades.value = res.data
})
</script>

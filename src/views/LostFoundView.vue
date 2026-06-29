<template>
  <main class="page">
    <h1>失物招领</h1>
    <EmptyState v-if="lostFounds.length === 0" text="暂无失物招领信息" />
    <div v-else class="list-wrap">
      <ItemCard v-for="item in lostFounds" :key="item.id" :item="item">
        <p>物品：{{ item.goodsName }} | 地点：{{ item.location }}</p>
        <p>联系方式：{{ item.contact }}</p>
      </ItemCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getLostFounds } from '@/api/lostFound'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

// 定义当前页面数据类型，消除所有TS报错
interface LostItem {
  id: number
  goodsName: string
  location: string
  contact: string
  type: string
  status: string
}

const lostFounds = ref<LostItem[]>([])

onMounted(async () => {
  const res = await getLostFounds()
  lostFounds.value = res.data
})
</script>

<style scoped>
.page { padding: 24px; }
.list-wrap { margin-top: 20px; }
</style>

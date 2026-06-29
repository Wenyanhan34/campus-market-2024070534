<template>
  <main class="page">
    <h1>拼单搭子</h1>
    <EmptyState v-if="groupBuys.length === 0" text="暂无拼单信息" />
    <div v-else class="list-wrap">
      <ItemCard v-for="item in groupBuys" :key="item.id" :item="item">
        <p>活动：{{ item.type }} | 人数 {{ item.currentNum }}/{{ item.targetNum }}</p>
        <p>集合地点：{{ item.location }}</p>
      </ItemCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGroupBuys } from '@/api/groupBuy'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

interface GroupItem {
  id: number
  type: string
  currentNum: number
  targetNum: number
  location: string
  publisher: string
  deadline: string
  status: string
}

const groupBuys = ref<GroupItem[]>([])

onMounted(async () => {
  const res = await getGroupBuys()
  groupBuys.value = res.data
})
</script>

<style scoped>
.page { padding: 24px; }
.list-wrap { margin-top: 20px; }
</style>

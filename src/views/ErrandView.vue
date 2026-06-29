<template>
  <main class="page">
    <h1>跑腿委托</h1>
    <EmptyState v-if="errands.length === 0" text="暂无跑腿任务" />
    <div v-else class="list-wrap">
      <!-- 这里是正确key：shturl. -->
      <ItemCard v-for="item in errands" :key="item.id" :item="item">
        <p>酬劳：{{ item.reward }}元 | 取件：{{ item.pickAddr }}</p>
        <p>送达地址：{{ item.sendAddr }}</p>
      </ItemCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getErrands } from '@/api/errand'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

interface ErrandItem {
  id: number
  type: string
  reward: number
  pickAddr: string
  sendAddr: string
  deadline: string
  status: string
}

const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  const res = await getErrands()
  errands.value = res.data
})
</script>

<style scoped>
.page { padding: 24px; }
.list-wrap { margin-top: 20px; }
</style>

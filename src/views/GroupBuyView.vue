<template>
  <div class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
    </div>

    <EmptyState v-if="groupBuys.length === 0" text="暂无拼单信息" />
    <div v-else class="list-wrap">
      <ItemCard v-for="item in groupBuys" :key="item.id" :item="item">
        <div class="item-tags">
          <el-tag type="success" size="small">{{ item.type }}</el-tag>
          <el-tag :type="item.status === 'open' ? 'primary' : 'info'" size="small">
            {{ item.status === 'open' ? '招募中' : '已结束' }}
          </el-tag>
        </div>
        <p><el-icon><UserFilled /></el-icon> 进度：{{ item.currentCount }}/{{ item.targetCount }} 人</p>
        <el-progress
          :percentage="Math.round((item.currentCount / item.targetCount) * 100)"
          :stroke-width="8"
          striped
          striped-flow
          class="progress-bar"
        />
        <p><el-icon><Location /></el-icon> {{ item.location }} | <el-icon><Clock /></el-icon> 截止：{{ item.deadline }}</p>
      </ItemCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const groupBuys = ref<GroupBuyItem[]>([])

onMounted(async () => {
  const res = await getGroupBuys()
  groupBuys.value = res.data
})
</script>

<style scoped>
.page { padding: 0; }

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

.item-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.progress-bar {
  margin: 8px 0;
}

:deep(p) {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

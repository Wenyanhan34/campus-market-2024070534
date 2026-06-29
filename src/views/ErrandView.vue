<template>
  <div class="page">
    <div class="page-header">
      <h1>跑腿委托</h1>
    </div>

    <EmptyState v-if="errands.length === 0" text="暂无跑腿任务" />
    <div v-else class="list-wrap">
      <ItemCard v-for="item in errands" :key="item.id" :item="item">
        <div class="item-tags">
          <el-tag type="warning" size="small">{{ item.taskType }}</el-tag>
          <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small">
            {{ item.status === 'open' ? '进行中' : '已完成' }}
          </el-tag>
        </div>
        <p>
          <el-tag type="danger" size="small" effect="dark" class="reward-tag">
            ￥{{ item.reward }}
          </el-tag>
          <el-icon><Position /></el-icon> 取件：{{ item.from }}
        </p>
        <p><el-icon><Location /></el-icon> 送达：{{ item.to }} | <el-icon><Clock /></el-icon> 截止：{{ item.deadline }}</p>
      </ItemCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getErrands, type ErrandItem } from '@/api/errand'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'

const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  const res = await getErrands()
  errands.value = res.data
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

.reward-tag {
  margin-right: 4px;
}

:deep(p) {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

<template>
  <div class="page">
    <div class="page-header">
      <div class="page-header-left">
        <h1>拼单搭子</h1>
        <el-tag v-if="groupBuys.length" type="info" effect="plain" round>
          共 {{ groupBuys.length }} 条
        </el-tag>
      </div>
    </div>

    <LoadingSkeleton v-if="loading" :count="4" />

    <EmptyState v-else-if="groupBuys.length === 0" text="暂无拼单信息">
      <template #action>
        <el-button type="primary" size="small" @click="$router.push('/publish')">去发布</el-button>
      </template>
    </EmptyState>

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in groupBuys"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :location="item.location"
        category-color="groupBuy"
      >
        <template #tag>
          <el-tag type="success" size="small" round>{{ item.type }}</el-tag>
          <el-tag :type="item.status === 'open' ? 'primary' : 'info'" size="small" round>
            {{ item.status === 'open' ? '招募中' : '已结束' }}
          </el-tag>
        </template>
        <template #footer>
          <div class="progress-info">
            <span class="item-meta">
              <el-icon><UserFilled /></el-icon> {{ item.currentCount }}/{{ item.targetCount }} 人
            </span>
            <el-progress
              :percentage="Math.round((item.currentCount / item.targetCount) * 100)"
              :stroke-width="6"
              :color="item.currentCount / item.targetCount >= 0.8 ? 'var(--color-success)' : 'var(--color-primary)'"
              class="progress-bar"
            />
          </div>
          <span class="item-meta">
            <el-icon><Clock /></el-icon> 截止：{{ item.deadline }}
          </span>
          <el-button
            :type="favoriteStore.isFavorite('groupBuy', item.id) ? 'warning' : 'default'"
            :icon="favoriteStore.isFavorite('groupBuy', item.id) ? 'StarFilled' : 'Star'"
            size="small"
            round
            @click="favoriteStore.toggleFavorite({
              id: item.id,
              type: 'groupBuy',
              title: item.title,
              description: item.description,
              location: item.location
            })"
          >
            {{ favoriteStore.isFavorite('groupBuy', item.id) ? '已收藏' : '收藏' }}
          </el-button>
        </template>
      </ItemCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import ItemCard from '@/components/ItemCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const groupBuys = ref<GroupBuyItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getGroupBuys()
    groupBuys.value = res.data
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

.list-wrap {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.progress-bar {
  max-width: 200px;
}

.item-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

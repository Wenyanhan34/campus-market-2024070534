<template>
  <div class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
    </div>

    <EmptyState v-if="groupBuys.length === 0" text="暂无拼单信息" />

    <div v-else class="list-wrap">
      <ItemCard
        v-for="item in groupBuys"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :location="item.location"
      >
        <template #tag>
          <div class="item-tags">
            <el-tag type="success" size="small">{{ item.type }}</el-tag>
            <el-tag :type="item.status === 'open' ? 'primary' : 'info'" size="small">
              {{ item.status === 'open' ? '招募中' : '已结束' }}
            </el-tag>
          </div>
        </template>
        <template #footer>
          <div class="progress-info">
            <span class="item-meta">
              <el-icon><UserFilled /></el-icon> 进度：{{ item.currentCount }}/{{ item.targetCount }} 人
            </span>
            <el-progress
              :percentage="Math.round((item.currentCount / item.targetCount) * 100)"
              :stroke-width="6"
              striped
              striped-flow
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
import { useFavoriteStore } from '@/stores/favorite'

const favoriteStore = useFavoriteStore()
const groupBuys = ref<GroupBuyItem[]>([])

onMounted(async () => {
  const res = await getGroupBuys()
  groupBuys.value = res.data
})
</script>

<style scoped>
.page { padding: 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.page-header h1 { margin: 0; font-size: 22px; color: #1f2937; }
.item-tags { display: flex; gap: 6px; flex-shrink: 0; }
.progress-info { display: flex; flex-direction: column; gap: 4px; width: 100%; }
.progress-bar { max-width: 200px; }
.item-meta { font-size: 13px; color: #6b7280; display: flex; align-items: center; gap: 4px; }
</style>

<template>
  <div class="page">
    <el-card shadow="never" class="profile-card">
      <div class="profile-inner">
        <el-avatar :size="72" class="profile-avatar">
          {{ userStore.userInitial }}
        </el-avatar>
        <div class="profile-info">
          <h2>{{ userStore.displayName }}</h2>
          <p class="profile-meta">{{ userStore.userDescription }}</p>
          <p class="profile-bio">{{ userStore.currentUser.bio }}</p>
          <div class="profile-stats">
            <span><strong>{{ favoriteStore.favoriteCount }}</strong> 收藏</span>
            <span><strong>{{ publishedCount }}</strong> 发布</span>
          </div>
        </div>
        <el-button type="primary" plain @click="showEditDialog = true">编辑资料</el-button>
      </div>
    </el-card>

    <el-dialog v-model="showEditDialog" title="编辑个人资料" width="480px">
      <el-form label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="editForm.college" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="editForm.grade" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="editForm.bio" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </template>
    </el-dialog>

    <el-card shadow="never" class="panel">
      <div class="panel-header">
        <h2>我的收藏</h2>
        <span class="panel-count">共 {{ favoriteStore.favoriteCount }} 项</span>
      </div>

      <EmptyState
        v-if="favoriteStore.favorites.length === 0"
        text="暂无收藏内容，去逛逛吧"
      />

      <div v-else class="favorite-list">
        <ItemCard
          v-for="item in favoriteStore.favorites"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :location="item.location"
        >
          <template #tag>
            <el-tag :type="getTypeTagType(item.type)" size="small">
              {{ getTypeLabel(item.type) }}
            </el-tag>
          </template>
          <template #footer>
            <el-button
              type="danger"
              size="small"
              plain
              round
              @click="favoriteStore.removeFavorite(item.type, item.id)"
            >
              <el-icon><Delete /></el-icon> 取消收藏
            </el-button>
          </template>
        </ItemCard>
      </div>
    </el-card>

    <el-card shadow="never" class="panel">
      <div class="panel-header">
        <h2>我的发布</h2>
        <span class="panel-count">共 {{ publishedCount }} 项</span>
      </div>

      <EmptyState
        v-if="allPublished.length === 0"
        text="暂无发布记录，去发布信息吧"
      />

      <div v-else class="published-list">
        <ItemCard
          v-for="item in allPublished"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :location="'location' in item ? (item as any).location : undefined"
        >
          <template #tag>
            <el-tag :type="getTypeTagType(item.type)" size="small">
              {{ getTypeLabel(item.type) }}
            </el-tag>
          </template>
          <template #footer>
            <span class="publish-time">
              <el-icon><Clock /></el-icon>
              {{ 'publishTime' in item ? (item as any).publishTime : (('eventTime' in item) ? (item as any).eventTime : '') }}
            </span>
          </template>
        </ItemCard>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import EmptyState from '@/components/EmptyState.vue'
import ItemCard from '@/components/ItemCard.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'
import { getTrades, type TradeItem } from '@/api/trade'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, type ErrandItem } from '@/api/errand'

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const showEditDialog = ref(false)
const editForm = ref({
  name: userStore.currentUser.name,
  college: userStore.currentUser.college,
  grade: userStore.currentUser.grade,
  bio: userStore.currentUser.bio,
})

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  const [tradeRes, lostRes, groupRes, errandRes] = await Promise.all([
    getTrades(),
    getLostFounds(),
    getGroupBuys(),
    getErrands(),
  ])
  trades.value = tradeRes.data
  lostFounds.value = lostRes.data
  groupBuys.value = groupRes.data
  errands.value = errandRes.data
})

const publishedTrades = computed(() =>
  trades.value.filter((i) => i.publisher === userStore.displayName)
)
const publishedLostFounds = computed(() =>
  lostFounds.value.filter((i) => i.publisher === userStore.displayName)
)
const publishedGroupBuys = computed(() =>
  groupBuys.value.filter((i) => i.publisher === userStore.displayName)
)
const publishedErrands = computed(() =>
  errands.value.filter((i) => i.publisher === userStore.displayName)
)

interface PublishedItem {
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  id: number
  title: string
  description: string
  [key: string]: unknown
}

const allPublished = computed<PublishedItem[]>(() => {
  const items: PublishedItem[] = []
  publishedTrades.value.forEach((i) => items.push({ ...i, type: 'trade' }))
  publishedLostFounds.value.forEach((i) => items.push({ ...i, type: 'lostFound' }))
  publishedGroupBuys.value.forEach((i) => items.push({ ...i, type: 'groupBuy' }))
  publishedErrands.value.forEach((i) => items.push({ ...i, type: 'errand' }))
  return items
})

const publishedCount = computed(() => allPublished.value.length)

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }
  return map[type] || '校园信息'
}

function getTypeTagType(type: string) {
  const map: Record<string, string> = {
    trade: 'primary',
    lostFound: 'danger',
    groupBuy: 'success',
    errand: 'warning',
  }
  return map[type] || 'info'
}

function saveProfile() {
  userStore.updateProfile(editForm.value)
  showEditDialog.value = false
  ElMessage.success('个人资料已更新')
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.profile-card {
  border-radius: 14px;
}
.profile-inner {
  display: flex;
  align-items: center;
  gap: 24px;
}
.profile-avatar {
  border: 3px solid #eff6ff;
  background: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  font-size: 28px;
}
.profile-info h2 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #1f2937;
}
.profile-meta {
  margin: 0 0 4px;
  font-size: 13px;
  color: #9ca3af;
}
.profile-bio {
  margin: 0 0 12px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}
.profile-stats {
  display: flex;
  gap: 24px;
}
.profile-stats span {
  font-size: 13px;
  color: #6b7280;
}
.profile-stats strong {
  font-size: 18px;
  color: #1f2937;
  margin-right: 4px;
}
.panel {
  border-radius: 14px;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.panel-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}
.panel-count {
  font-size: 13px;
  color: #9ca3af;
}
.favorite-list,
.published-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.publish-time {
  font-size: 13px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

<template>
  <div class="page">
    <!-- 封面 + 个人信息 -->
    <el-card shadow="never" class="profile-card">
      <div class="profile-cover">
        <div class="cover-gradient" />
      </div>
      <div class="profile-body">
        <el-avatar :size="80" class="profile-avatar">
          {{ userStore.userInitial }}
        </el-avatar>
        <div class="profile-info">
          <div class="profile-name-row">
            <h2>{{ userStore.displayName }}</h2>
            <el-button type="primary" plain size="small" @click="showEditDialog = true">
              <el-icon><Edit /></el-icon> 编辑资料
            </el-button>
          </div>
          <p class="profile-meta">{{ userStore.userDescription }}</p>
          <p class="profile-bio">{{ userStore.currentUser.bio }}</p>
          <div class="profile-stats">
            <div class="stat-item">
              <strong>{{ favoriteStore.favoriteCount }}</strong>
              <span>收藏</span>
            </div>
            <div class="stat-item">
              <strong>{{ publishedCount }}</strong>
              <span>发布</span>
            </div>
            <div class="stat-item">
              <strong>12</strong>
              <span>浏览量</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 编辑资料弹窗 -->
    <el-dialog v-model="showEditDialog" title="编辑个人资料" width="480px" top="8vh">
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

    <!-- Tabs: 收藏 / 发布 -->
    <el-card shadow="never" class="panel">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="我的收藏" name="favorites">
          <div class="panel-header">
            <span class="panel-count">共 {{ favoriteStore.favoriteCount }} 项</span>
          </div>

          <EmptyState
            v-if="favoriteStore.favorites.length === 0"
            text="暂无收藏内容，去逛逛吧"
          />

          <div v-else class="item-list">
            <ItemCard
              v-for="item in favoriteStore.favorites"
              :key="`${item.type}-${item.id}`"
              :title="item.title"
              :description="item.description"
              :location="item.location"
            >
              <template #tag>
                <el-tag :type="getTypeTagType(item.type)" size="small" round>
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
        </el-tab-pane>

        <el-tab-pane label="我的发布" name="published">
          <div class="panel-header">
            <span class="panel-count">共 {{ publishedCount }} 项</span>
          </div>

          <EmptyState
            v-if="allPublished.length === 0"
            text="暂无发布记录，去发布信息吧"
          />

          <div v-else class="item-list">
            <ItemCard
              v-for="item in allPublished"
              :key="`${item.type}-${item.id}`"
              :title="item.title"
              :description="item.description"
              :location="'location' in item ? (item as any).location : undefined"
            >
              <template #tag>
                <el-tag :type="getTypeTagType(item.type)" size="small" round>
                  {{ getTypeLabel(item.type) }}
                </el-tag>
              </template>
              <template #footer>
                <span class="publish-time">
                  <el-icon><Clock /></el-icon>
                  {{ 'publishTime' in item ? (item as any).publishTime : (('eventTime' in item) ? (item as any).eventTime : '') }}
                </span>
                <el-tag v-if="'status' in item" :type="(item as any).status === 'open' ? 'success' : 'info'" size="small" round effect="plain">
                  {{ (item as any).status === 'open' ? '进行中' : '已结束' }}
                </el-tag>
              </template>
            </ItemCard>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'
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

const activeTab = ref('favorites')
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
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
  gap: 24px;
}

/* Profile Card */
.profile-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: 0;
}

.profile-cover {
  height: 120px;
  background: linear-gradient(135deg, #2563eb, #7c3aed, #06b6d4);
  position: relative;
  overflow: hidden;
}

.cover-gradient::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%);
}

.profile-body {
  display: flex;
  align-items: flex-end;
  gap: 28px;
  padding: 0 28px 28px;
  margin-top: -40px;
  position: relative;
}

.profile-avatar {
  border: 4px solid var(--color-bg-white);
  box-shadow: var(--shadow-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 30px;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  padding-top: 44px;
}

.profile-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.profile-name-row h2 {
  margin: 0;
  font-size: 22px;
  color: var(--color-text);
  font-weight: 700;
}

.profile-meta {
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.profile-bio {
  margin: 0 0 14px;
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.profile-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-item strong {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.stat-item span {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Panel */
.panel {
  border-radius: var(--radius-lg);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.panel-count {
  font-size: 13px;
  color: var(--color-text-muted);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.publish-time {
  font-size: 13px;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

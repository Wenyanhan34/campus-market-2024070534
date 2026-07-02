<template>
  <div class="page">
    <div class="layout-grid">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="profile-card">
          <el-avatar :size="80" class="sidebar-avatar">
            {{ userStore.userInitial }}
          </el-avatar>
          <div class="sidebar-name">{{ userStore.displayName }}</div>
          <div class="sidebar-meta">{{ userStore.userDescription }} · {{ userStore.campusLabel }}</div>
          <el-tag type="primary" effect="light" class="credit-tag">信用分 92</el-tag>
          <div class="sidebar-stats">
            <div class="stat-item">
              <strong>{{ publishedCount }}</strong>
              <span>发布</span>
            </div>
            <div class="stat-item">
              <strong>{{ favoriteStore.favoriteCount }}</strong>
              <span>收藏</span>
            </div>
            <div class="stat-item">
              <strong>4</strong>
              <span>消息</span>
            </div>
          </div>
        </div>

        <div class="menu-card">
          <div
            class="menu-item"
            :class="{ active: activeTab === 'posts' }"
            @click="activeTab = 'posts'"
          >
            <el-icon><Document /></el-icon> 我的发布
          </div>
          <div
            class="menu-item"
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
          >
            <el-icon><Star /></el-icon> 我的收藏
          </div>
          <div class="menu-item" @click="goMessage">
            <el-icon><ChatDotRound /></el-icon> 消息中心
          </div>
          <div class="menu-item" @click="goSettings">
            <el-icon><Setting /></el-icon> 账号设置
          </div>
        </div>
      </aside>

      <!-- Content -->
      <div class="content-card">
        <!-- Posts -->
        <template v-if="activeTab === 'posts'">
          <div class="content-header">
            <h3>我的发布</h3>
            <el-select v-model="postFilter" size="small" style="width:130px;">
              <el-option label="全部" value="all" />
              <el-option label="二手交易" value="trade" />
              <el-option label="失物招领" value="lostFound" />
              <el-option label="拼单搭子" value="groupBuy" />
              <el-option label="跑腿委托" value="errand" />
            </el-select>
          </div>

          <EmptyState v-if="filteredPublished.length === 0" text="暂无发布记录，去发布信息吧" />

          <div v-else class="post-list">
            <div v-for="item in filteredPublished" :key="`${item.type}-${item.id}`" class="post-item">
              <div class="post-img">
                <el-icon :size="28" color="rgba(255,255,255,0.5)"><Picture /></el-icon>
              </div>
              <div class="post-body">
                <div class="post-head">
                  <span class="post-title">{{ item.title }}</span>
                  <el-tag
                    size="small"
                    :type="(item as any).status === 'open' ? 'success' : 'info'"
                    effect="plain"
                  >
                    {{ (item as any).status === 'open' ? '进行中' : '已结束' }}
                  </el-tag>
                </div>
                <div class="post-meta">
                  {{ getTypeLabel(item.type) }}
                  <template v-if="'location' in item"> · {{ (item as any).location }}</template>
                  <template v-if="'publishTime' in item"> · {{ (item as any).publishTime }}</template>
                  <template v-else-if="'eventTime' in item"> · {{ (item as any).eventTime }}</template>
                </div>
                <div class="post-actions">
                  <el-button size="small" text @click="goDetail(item)">查看</el-button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Favorites -->
        <template v-else>
          <div class="content-header">
            <h3>我的收藏</h3>
            <span class="panel-count">共 {{ favoriteStore.favoriteCount }} 项</span>
          </div>

          <EmptyState v-if="favoriteStore.favorites.length === 0" text="暂无收藏内容，去逛逛吧" />

          <div v-else class="favorite-grid">
            <div
              v-for="item in favoriteStore.favorites"
              :key="`${item.type}-${item.id}`"
              class="favorite-card"
              @click="goDetail(item)"
            >
              <div class="fav-img">
                <el-icon :size="32" color="rgba(255,255,255,0.4)"><Picture /></el-icon>
              </div>
              <div class="fav-body">
                <div class="fav-title">{{ item.title }}</div>
                <div class="fav-meta">{{ item.location }}</div>
                <div class="fav-footer">
                  <el-tag :type="getTypeTagType(item.type)" size="small" round>
                    {{ getTypeLabel(item.type) }}
                  </el-tag>
                  <el-button
                    type="danger"
                    size="small"
                    plain
                    round
                    @click.stop="favoriteStore.removeFavorite(item.type as any, item.id)"
                  >
                    取消收藏
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Edit Dialog -->
    <el-dialog v-model="showEditDialog" title="编辑个人资料" width="520px" top="8vh" @open="syncEditForm">
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
        <el-form-item label="校区">
          <el-radio-group v-model="editForm.campus">
            <el-radio-button value="east">东区</el-radio-button>
            <el-radio-button value="west">西区</el-radio-button>
            <el-radio-button value="south">南区</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="editForm.contact" placeholder="微信 / 手机号" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document, Star, ChatDotRound, Setting, Picture } from '@element-plus/icons-vue'
import EmptyState from '@/components/EmptyState.vue'
import { useFavoriteStore } from '@/stores/favorite'
import { useUserStore } from '@/stores/user'
import { getTrades, type TradeItem } from '@/api/trade'
import { getLostFounds, type LostFoundItem } from '@/api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '@/api/groupBuy'
import { getErrands, type ErrandItem } from '@/api/errand'

const router = useRouter()
const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const activeTab = ref('favorites')
const postFilter = ref('all')
const showEditDialog = ref(false)
const editForm = ref({
  name: userStore.currentUser.name,
  college: userStore.currentUser.college,
  grade: userStore.currentUser.grade,
  campus: userStore.currentUser.campus,
  contact: userStore.currentUser.contact,
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

const filteredPublished = computed(() => {
  if (postFilter.value === 'all') return allPublished.value
  return allPublished.value.filter((p) => p.type === postFilter.value)
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

function goDetail(item: PublishedItem) {
  const routeMap: Record<string, string> = {
    trade: '/trade/',
    lostFound: '/lost-found/',
    groupBuy: '/group-buy/',
    errand: '/errand/',
  }
  const base = routeMap[item.type]
  if (base) router.push(`${base}${item.id}`)
}

function goMessage() {
  router.push('/message')
}

function goSettings() {
  router.push('/settings')
}

function syncEditForm() {
  editForm.value = {
    name: userStore.currentUser.name,
    college: userStore.currentUser.college,
    grade: userStore.currentUser.grade,
    campus: userStore.currentUser.campus,
    contact: userStore.currentUser.contact,
    bio: userStore.currentUser.bio,
  }
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
}

.layout-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 28px;
}

.profile-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.sidebar-avatar {
  border: 4px solid var(--color-bg-white);
  box-shadow: var(--shadow-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 30px;
  margin-bottom: 12px;
}

.sidebar-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.sidebar-meta {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

.credit-tag {
  margin-top: 12px;
  background: #f0fdfa !important;
  color: #0d9488 !important;
  border-color: #ccfbf1 !important;
}

.sidebar-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.stat-item {
  text-align: center;
}

.stat-item strong {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.stat-item span {
  font-size: 12px;
  color: #94a3b8;
  display: block;
  margin-top: 2px;
}

.menu-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  color: #475569;
  font-size: 14px;
}

.menu-item:hover {
  background: #f8fafc;
  color: #0d9488;
}

.menu-item.active {
  background: #f0fdfa;
  color: #0d9488;
  font-weight: 500;
}

/* Content */
.content-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  min-height: 500px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.content-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.panel-count {
  font-size: 13px;
  color: #94a3b8;
}

/* Post list */
.post-list {
  display: flex;
  flex-direction: column;
}

.post-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
}

.post-item:last-child {
  border-bottom: none;
}

.post-img {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #6366f1, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-body {
  flex: 1;
  min-width: 0;
}

.post-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.post-title {
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-meta {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

.post-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

/* Favorite grid */
.favorite-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.favorite-card {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  border: 1px solid var(--color-border-light);
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.fav-img {
  height: 140px;
  background: linear-gradient(135deg, #6366f1, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-body {
  padding: 12px;
}

.fav-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fav-meta {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.fav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
</style>

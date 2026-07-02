<template>
  <div class="page">
    <el-breadcrumb separator="/" class="detail-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/trade' }">二手交易</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>

    <LoadingState v-if="loading" text="正在加载商品详情..." />

    <ErrorState
      v-else-if="error"
      message="商品数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadData"
    />

    <template v-else-if="item">
      <div class="detail-layout">
        <div class="detail-main">
          <img class="detail-img" :src="mainImage" alt="商品图片" />
          <div class="thumb-list">
            <img
              v-for="(img, idx) in images"
              :key="idx"
              class="thumb-item"
              :class="{ active: mainImage === img }"
              :src="img"
              @click="mainImage = img"
            />
          </div>

          <div class="detail-body">
            <div class="tag-group">
              <el-tag size="small" type="primary">{{ item.category }}</el-tag>
              <el-tag size="small" :type="item.status === 'open' ? 'success' : 'info'" effect="plain">
                {{ item.status === 'open' ? '进行中' : '已结束' }}
              </el-tag>
              <el-tag size="small" effect="plain">{{ item.condition }}</el-tag>
            </div>

            <h1 class="detail-title">{{ item.title }}</h1>

            <div class="detail-meta">
              <span><el-icon><Location /></el-icon> {{ item.location }}</span>
              <span><el-icon><Clock /></el-icon> {{ item.publishTime }}</span>
              <span><el-icon><View /></el-icon> {{ viewCount }} 次浏览</span>
            </div>

            <div class="detail-desc">
              <h3>商品描述</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <el-button
                type="primary"
                size="large"
                class="action-btn-primary"
                @click="$router.push(`/chat/${encodeURIComponent(item.publisher)}?item=${encodeURIComponent(item.title)}&price=${item.price}`)"
              >
                <el-icon><ChatDotRound /></el-icon> 联系卖家
              </el-button>
              <el-button
                :type="isFav ? 'warning' : 'default'"
                size="large"
                class="action-btn"
                @click="toggleFav"
              >
                <el-icon><Star /></el-icon> {{ isFav ? '已收藏' : '收藏' }}
              </el-button>
              <el-button size="large" class="action-btn" @click="reportVisible = true">
                <el-icon><Warning /></el-icon> 举报
              </el-button>
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-box">
            <div class="price-big">¥{{ item.price }}</div>
            <div style="color: var(--color-text-muted); font-size: 13px; margin-top: 4px;">
              成色：{{ item.condition }}
            </div>
            <el-divider />
            <div class="seller-info">
              <el-avatar :size="48" class="seller-avatar">{{ item.publisher?.charAt(0) || '?' }}</el-avatar>
              <div>
                <div class="seller-name">{{ item.publisher }}</div>
                <div class="seller-desc">认证卖家</div>
              </div>
            </div>
            <el-button
              type="primary"
              style="width: 100%; margin-top: 12px;"
              @click="$router.push(`/chat/${encodeURIComponent(item.publisher)}?item=${encodeURIComponent(item.title)}&price=${item.price}`)"
            >
              <el-icon><ChatDotRound /></el-icon> 发消息
            </el-button>
          </div>

          <div class="sidebar-box">
            <h3 class="sidebar-title">商品信息</h3>
            <div class="info-grid">
              <span class="info-label">成色</span><span>{{ item.condition }}</span>
              <span class="info-label">分类</span><span>{{ item.category }}</span>
              <span class="info-label">交易地点</span><span>{{ item.location }}</span>
              <span class="info-label">发布时间</span><span>{{ item.publishTime }}</span>
              <span class="info-label">发布者</span><span>{{ item.publisher }}</span>
            </div>
          </div>

          <div class="sidebar-box sidebar-warning">
            <div class="warning-row">
              <el-icon color="#eab308" :size="20"><Warning /></el-icon>
              <div>
                <div class="warning-title">交易安全提醒</div>
                <div class="warning-text">建议选择公共场所交易，贵重物品注意验真，保护个人隐私，警惕异常低价。</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="related-section">
        <h2 class="related-title">相关推荐</h2>
        <div class="related-grid">
          <router-link
            v-for="r in relatedItems"
            :key="r.id"
            :to="`/trade/${r.id}`"
            class="related-card"
          >
            <div class="related-img-wrap">
              <img v-if="r.image" class="related-img-real" :src="r.image" alt="" loading="lazy" @error="relatedImgErrored[r.id] = true" />
              <svg v-if="!r.image || relatedImgErrored[r.id]" width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="40" height="40" rx="8" fill="#E5E7EB"/>
                <path d="M16 24h16M24 16v16" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="related-body">
              <div class="related-item-title">{{ r.title }}</div>
              <div class="related-price">¥{{ r.price }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </template>

    <el-dialog v-model="reportVisible" title="举报" width="400px" top="8vh">
      <el-form label-width="80px">
        <el-form-item label="举报原因">
          <el-select v-model="reportReason" placeholder="请选择" style="width: 100%">
            <el-option label="虚假信息" value="fake" />
            <el-option label="价格欺诈" value="price" />
            <el-option label="骚扰行为" value="harass" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input v-model="reportDesc" type="textarea" :rows="3" placeholder="请详细描述问题..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reportVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReport">提交举报</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTradeById, getTrades, type TradeItem } from '@/api/trade'
import { useFavoriteStore } from '@/stores/favorite'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()

const item = ref<TradeItem | null>(null)
const loading = ref(true)
const error = ref(false)

const mainImage = ref('')
const images = ref<string[]>([])

const reportVisible = ref(false)
const reportReason = ref('')
const reportDesc = ref('')
const relatedItems = ref<TradeItem[]>([])
const relatedImgErrored = ref<Record<number, boolean>>({})

const viewCount = computed(() => Math.floor(Math.random() * 200) + 30)

const isFav = computed(() => {
  if (!item.value) return false
  return favoriteStore.isFavorite('trade', item.value.id)
})

function toggleFav() {
  if (!item.value) return
  const i = item.value
  favoriteStore.toggleFavorite({
    id: i.id,
    type: 'trade',
    title: i.title,
    description: i.description,
    location: i.location,
  })
}

function submitReport() {
  ElMessage.success('举报已提交，平台将尽快处理')
  reportVisible.value = false
  reportReason.value = ''
  reportDesc.value = ''
}

async function loadData() {
  loading.value = true
  error.value = false
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      router.replace('/trade')
      return
    }
    const res = await getTradeById(id)
    item.value = res.data

    mainImage.value = res.data.image || `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&sig=${id}`
    images.value = [
      mainImage.value,
      `https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop&sig=${id}`,
      `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=600&fit=crop&sig=${id}`,
    ]

    const allRes = await getTrades()
    relatedItems.value = allRes.data
      .filter(t => t.id !== id && t.category === res.data.category)
      .slice(0, 4)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page { padding: 0; }

.detail-breadcrumb {
  margin-bottom: 20px;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

.detail-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  background: var(--color-bg);
}

.thumb-list {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.thumb-item {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all var(--transition-fast);
  background: var(--color-bg);
}

.thumb-item.active {
  border-color: var(--color-primary);
}

.detail-body {
  margin-top: 24px;
}

.tag-group {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.detail-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 16px;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.detail-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-desc {
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 24px;
}

.detail-desc h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px;
}

.detail-desc p {
  margin: 0;
  color: var(--color-text-secondary);
  line-height: 1.8;
  white-space: pre-wrap;
}

.action-bar {
  display: flex;
  gap: 12px;
}

.action-btn-primary {
  flex: 1;
  font-weight: 600;
}

.action-btn {
  flex: 1;
}

/* Sidebar */
.sidebar-box {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
}

.sidebar-warning {
  background: #fefce8;
  border: 1px solid #fde047;
}

.price-big {
  color: var(--color-danger);
  font-size: 32px;
  font-weight: 700;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-avatar {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 700;
}

.seller-name {
  font-weight: 600;
  color: var(--color-text);
}

.seller-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 10px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.info-label {
  color: var(--color-text-muted);
}

.warning-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.warning-title {
  font-weight: 600;
  color: #854d0e;
  font-size: 14px;
  margin-bottom: 4px;
}

.warning-text {
  font-size: 13px;
  color: #a16207;
  line-height: 1.6;
}

/* Related */
.related-section {
  margin-top: 40px;
}

.related-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.related-card {
  display: block;
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  color: inherit;
}

.related-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.related-img-wrap {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  overflow: hidden;
  position: relative;
}

.related-img-real {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-body {
  padding: 12px;
}

.related-item-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-price {
  color: var(--color-danger);
  font-weight: 700;
  font-size: 16px;
}

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

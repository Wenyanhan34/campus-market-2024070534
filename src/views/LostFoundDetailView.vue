<template>
  <div class="page">
    <el-breadcrumb separator="/" class="detail-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/lost-found' }">失物招领</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>

    <LoadingState v-if="loading" text="正在加载信息..." />

    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadData"
    />

    <template v-else-if="item">
      <div class="detail-layout">
        <div class="detail-main">
          <img class="detail-img" :src="mainImage" alt="失物图片" />

          <div class="detail-body">
            <div class="tag-group">
              <el-tag :type="item.type === 'lost' ? 'danger' : 'success'" size="small">
                {{ item.type === 'lost' ? '寻物' : '拾物' }}
              </el-tag>
              <el-tag :type="item.status === 'open' ? 'warning' : 'info'" size="small" effect="plain">
                {{ item.status === 'open' ? '待认领' : '已完成' }}
              </el-tag>
            </div>

            <h1 class="detail-title">{{ item.title }}</h1>

            <div class="detail-meta">
              <span><el-icon><Location /></el-icon> {{ item.location }}</span>
              <span><el-icon><Clock /></el-icon> {{ item.eventTime }}</span>
              <span><el-icon><View /></el-icon> {{ viewCount }} 次浏览</span>
            </div>

            <div class="detail-desc">
              <h3>物品描述</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <el-button
                type="primary"
                size="large"
                class="action-btn-primary"
                @click="$router.push(`/chat/${encodeURIComponent(item.publisher || '发布者')}?item=${encodeURIComponent(item.title)}`)"
              >
                <el-icon><ChatDotRound /></el-icon> 联系发布者
              </el-button>
              <el-button
                :type="isFav ? 'warning' : 'default'"
                size="large"
                class="action-btn"
                @click="toggleFav"
              >
                <el-icon><Star /></el-icon> {{ isFav ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-box">
            <div class="seller-info">
              <el-avatar :size="48" class="seller-avatar">{{ item.publisher?.charAt(0) || '?' }}</el-avatar>
              <div>
                <div class="seller-name">{{ item.publisher || '匿名用户' }}</div>
                <div class="seller-desc">热心同学</div>
              </div>
            </div>
            <el-button
              type="primary"
              style="width: 100%; margin-top: 12px;"
              @click="$router.push(`/chat/${encodeURIComponent(item.publisher || '发布者')}?item=${encodeURIComponent(item.title)}`)"
            >
              <el-icon><ChatDotRound /></el-icon> 发消息
            </el-button>
          </div>

          <div class="sidebar-box">
            <h3 class="sidebar-title">物品信息</h3>
            <div class="info-grid">
              <span class="info-label">类型</span>
              <span>{{ item.type === 'lost' ? '丢失物品' : '拾到物品' }}</span>
              <span class="info-label">物品名称</span><span>{{ item.itemName }}</span>
              <span class="info-label">发生时间</span><span>{{ item.eventTime }}</span>
              <span class="info-label">地点</span><span>{{ item.location }}</span>
              <span v-if="item.contact" class="info-label">联系方式</span>
              <span v-if="item.contact">{{ item.contact }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLostFoundById, type LostFoundItem } from '@/api/lostFound'
import { useFavoriteStore } from '@/stores/favorite'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()

const item = ref<LostFoundItem | null>(null)
const loading = ref(true)
const error = ref(false)

const mainImage = ref('')

const viewCount = computed(() => Math.floor(Math.random() * 150) + 20)

const isFav = computed(() => {
  if (!item.value) return false
  return favoriteStore.isFavorite('lostFound', item.value.id)
})

function toggleFav() {
  if (!item.value) return
  const i = item.value
  favoriteStore.toggleFavorite({
    id: i.id,
    type: 'lostFound',
    title: i.title,
    description: i.description,
    location: i.location,
  })
}

async function loadData() {
  loading.value = true
  error.value = false
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      router.replace('/lost-found')
      return
    }
    const res = await getLostFoundById(id)
    item.value = res.data
    mainImage.value = `https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=600&fit=crop&sig=${id}`
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
  height: 360px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  background: var(--color-bg);
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

@media (max-width: 900px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>

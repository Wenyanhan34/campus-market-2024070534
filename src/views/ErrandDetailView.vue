<template>
  <div class="page">
    <el-breadcrumb separator="/" class="detail-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/errand' }">跑腿委托</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>

    <LoadingState v-if="loading" text="正在加载任务详情..." />

    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadData"
    />

    <template v-else-if="item">
      <div class="detail-layout">
        <div class="detail-main">
          <img class="detail-img" :src="mainImage" alt="任务图片" />

          <div class="detail-body">
            <div class="tag-group">
              <el-tag type="warning" size="small">{{ item.taskType }}</el-tag>
              <el-tag :type="item.status === 'open' ? 'success' : 'info'" size="small" effect="plain">
                {{ item.status === 'open' ? '进行中' : '已完成' }}
              </el-tag>
            </div>

            <h1 class="detail-title">{{ item.title }}</h1>

            <div class="detail-meta">
              <span><el-icon><Position /></el-icon> {{ item.from }}</span>
              <span><el-icon><Location /></el-icon> {{ item.to }}</span>
              <span><el-icon><Clock /></el-icon> {{ item.deadline }}</span>
              <span><el-icon><View /></el-icon> {{ viewCount }} 次浏览</span>
            </div>

            <div class="detail-desc">
              <h3>任务详情</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <el-button
                type="primary"
                size="large"
                class="action-btn-primary"
                @click="$router.push(`/chat/${encodeURIComponent(item.publisher)}?item=${encodeURIComponent(item.title)}&price=${item.reward}`)"
              >
                <el-icon><ChatDotRound /></el-icon> 联系发布者
              </el-button>
              <el-button
                :type="accepted ? 'success' : 'default'"
                size="large"
                class="action-btn"
                :disabled="item.status !== 'open'"
                @click="acceptTask"
              >
                <el-icon><Check /></el-icon> {{ accepted ? '已接单' : '接单' }}
              </el-button>
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-box sidebar-reward">
            <div class="reward-amount">¥{{ item.reward }}</div>
            <div class="reward-label">任务酬劳</div>
            <el-divider />
            <div class="seller-info">
              <el-avatar :size="48" class="seller-avatar">{{ item.publisher.charAt(0) }}</el-avatar>
              <div>
                <div class="seller-name">{{ item.publisher }}</div>
                <div class="seller-desc">委托发布者</div>
              </div>
            </div>
            <el-button
              type="primary"
              style="width: 100%; margin-top: 12px;"
              @click="$router.push(`/chat/${encodeURIComponent(item.publisher)}?item=${encodeURIComponent(item.title)}&price=${item.reward}`)"
            >
              <el-icon><ChatDotRound /></el-icon> 发消息
            </el-button>
          </div>

          <div class="sidebar-box">
            <h3 class="sidebar-title">任务信息</h3>
            <div class="info-grid">
              <span class="info-label">任务内容</span><span>{{ item.taskType }}</span>
              <span class="info-label">取件地点</span><span>{{ item.from }}</span>
              <span class="info-label">送达地点</span><span>{{ item.to }}</span>
              <span class="info-label">截止时间</span><span>{{ item.deadline }}</span>
              <span class="info-label">酬劳</span><span>¥{{ item.reward }}</span>
              <span class="info-label">状态</span>
              <span>{{ item.status === 'open' ? '进行中' : '已完成' }}</span>
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
import { ElMessage } from 'element-plus'
import { getErrandById, type ErrandItem } from '@/api/errand'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()

const item = ref<ErrandItem | null>(null)
const loading = ref(true)
const error = ref(false)
const accepted = ref(false)

const mainImage = ref('')

const viewCount = computed(() => Math.floor(Math.random() * 100) + 10)

function acceptTask() {
  if (!item.value || item.value.status !== 'open') return
  accepted.value = !accepted.value
  ElMessage.success(accepted.value ? '接单成功！请及时联系发布者' : '已取消接单')
}

async function loadData() {
  loading.value = true
  error.value = false
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      router.replace('/errand')
      return
    }
    const res = await getErrandById(id)
    item.value = res.data
    mainImage.value = `https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=500&fit=crop&sig=${id}`
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

.sidebar-reward {
  background: #fefce8;
  border: 1px solid #fde047;
}

.reward-amount {
  font-size: 28px;
  font-weight: 700;
  color: #ca8a04;
  margin-bottom: 4px;
}

.reward-label {
  font-size: 13px;
  color: #a16207;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px;
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

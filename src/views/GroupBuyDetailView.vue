<template>
  <div class="page">
    <el-breadcrumb separator="/" class="detail-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/group-buy' }">拼单搭子</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>

    <LoadingState v-if="loading" text="正在加载拼单信息..." />

    <ErrorState
      v-else-if="error"
      message="数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadData"
    />

    <template v-else-if="item">
      <div class="detail-layout">
        <div class="detail-main">
          <img class="detail-img" :src="mainImage" alt="拼单图片" />

          <div class="detail-body">
            <div class="tag-group">
              <el-tag type="success" size="small">{{ item.type }}</el-tag>
              <el-tag :type="item.status === 'open' ? 'primary' : 'info'" size="small" effect="plain">
                {{ item.status === 'open' ? '招募中' : '已结束' }}
              </el-tag>
            </div>

            <h1 class="detail-title">{{ item.title }}</h1>

            <div class="detail-meta">
              <span><el-icon><Location /></el-icon> {{ item.location }}</span>
              <span><el-icon><Clock /></el-icon> 截止：{{ item.deadline }}</span>
              <span><el-icon><View /></el-icon> {{ viewCount }} 次浏览</span>
            </div>

            <div class="detail-desc">
              <h3>拼单详情</h3>
              <p>{{ item.description }}</p>
            </div>

            <div class="action-bar">
              <el-button
                type="primary"
                size="large"
                class="action-btn-primary"
                @click="$router.push(`/chat/${encodeURIComponent(item.publisher)}?item=${encodeURIComponent(item.title)}`)"
              >
                <el-icon><ChatDotRound /></el-icon> 联系发起者
              </el-button>
              <el-button
                :type="joined ? 'success' : 'default'"
                size="large"
                class="action-btn"
                :disabled="item.status !== 'open'"
                @click="joinGroup"
              >
                <el-icon><Check /></el-icon> {{ joined ? '已加入' : '加入拼单' }}
              </el-button>
            </div>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-box">
            <h3 class="sidebar-title">拼单进度</h3>
            <div class="progress-row">
              <el-progress
                type="circle"
                :percentage="percentage"
                :width="80"
                color="var(--color-primary)"
              />
              <div class="progress-text">
                <div class="progress-numbers">{{ item.currentCount }} / {{ item.targetCount }} 人</div>
                <div class="progress-remain">还差 {{ item.targetCount - item.currentCount }} 人成团</div>
              </div>
            </div>
            <el-divider />
            <div class="seller-info">
              <el-avatar :size="48" class="seller-avatar">{{ item.publisher.charAt(0) }}</el-avatar>
              <div>
                <div class="seller-name">{{ item.publisher }}</div>
                <div class="seller-desc">拼单发起者</div>
              </div>
            </div>
            <el-button
              type="primary"
              style="width: 100%; margin-top: 12px;"
              @click="$router.push(`/chat/${encodeURIComponent(item.publisher)}?item=${encodeURIComponent(item.title)}`)"
            >
              <el-icon><ChatDotRound /></el-icon> 发消息
            </el-button>
          </div>

          <div class="sidebar-box">
            <h3 class="sidebar-title">拼单信息</h3>
            <div class="info-grid">
              <span class="info-label">类型</span><span>{{ item.type }}</span>
              <span class="info-label">目标人数</span><span>{{ item.targetCount }} 人</span>
              <span class="info-label">当前人数</span><span>{{ item.currentCount }} 人</span>
              <span class="info-label">截止时间</span><span>{{ item.deadline }}</span>
              <span class="info-label">集合地点</span><span>{{ item.location }}</span>
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
import { getGroupBuyById, type GroupBuyItem } from '@/api/groupBuy'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()

const item = ref<GroupBuyItem | null>(null)
const loading = ref(true)
const error = ref(false)
const joined = ref(false)

const mainImage = ref('')

const percentage = computed(() => {
  if (!item.value) return 0
  return Math.round((item.value.currentCount / item.value.targetCount) * 100)
})

const viewCount = computed(() => Math.floor(Math.random() * 150) + 20)

function joinGroup() {
  if (!item.value || item.value.status !== 'open') return
  joined.value = !joined.value
  ElMessage.success(joined.value ? '已成功加入拼单！' : '已取消加入')
}

async function loadData() {
  loading.value = true
  error.value = false
  try {
    const id = Number(route.params.id)
    if (isNaN(id)) {
      router.replace('/group-buy')
      return
    }
    const res = await getGroupBuyById(id)
    item.value = res.data
    mainImage.value = `https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=500&fit=crop&sig=${id}`
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

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;
}

.progress-text {
  flex: 1;
}

.progress-numbers {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
}

.progress-remain {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 4px;
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

<template>
  <div class="page">
    <div class="page-header">
      <h1>消息中心</h1>
    </div>

    <el-card shadow="never" class="message-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="私信" name="private">
          <div v-for="msg in privateMsgs" :key="msg.name" class="msg-item">
            <el-avatar :size="44">{{ msg.name[0] }}</el-avatar>
            <div class="msg-content">
              <div class="msg-top">
                <span class="msg-name">{{ msg.name }}</span>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
              <p class="msg-text">{{ msg.text }}</p>
            </div>
          </div>
          <EmptyState v-if="privateMsgs.length === 0" text="暂无私信" />
        </el-tab-pane>

        <el-tab-pane label="系统通知" name="system">
          <div v-for="notif in notifications" :key="notif.title" class="msg-item">
            <el-avatar :size="44" icon="Bell" />
            <div class="msg-content">
              <div class="msg-top">
                <span class="msg-name">{{ notif.title }}</span>
                <span class="msg-time">{{ notif.time }}</span>
              </div>
              <p class="msg-text">{{ notif.text }}</p>
            </div>
          </div>
          <EmptyState v-if="notifications.length === 0" text="暂无系统通知" />
        </el-tab-pane>

        <el-tab-pane label="互动消息" name="interact">
          <div v-for="item in interactions" :key="item.text" class="msg-item">
            <el-avatar :size="44" icon="ChatDotSquare" />
            <div class="msg-content">
              <div class="msg-top">
                <span class="msg-time">{{ item.time }}</span>
              </div>
              <p class="msg-text">{{ item.text }}</p>
            </div>
          </div>
          <EmptyState v-if="interactions.length === 0" text="暂无互动消息" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmptyState from '@/components/EmptyState.vue'

const activeTab = ref('private')

const privateMsgs = ref([
  { name: '张三', text: '请问那个教材还在吗？', time: '10:32' },
  { name: '李四', text: '拼单还差一个人，来吗？', time: '昨天' },
])

const notifications = ref([
  { title: '系统通知', text: '您的二手商品"高等数学教材"已被浏览12次', time: '2026-06-28' },
  { title: '系统通知', text: '失物招领有新匹配，请查看', time: '2026-06-27' },
])

const interactions = ref([
  { text: '用户 student02 收藏了您的商品', time: '2026-06-26' },
])
</script>

<style scoped>
.page { padding: 0; }

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 22px;
  color: #1f2937;
}

.message-card {
  border-radius: 12px;
}

.msg-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;
}

.msg-item:last-child {
  border-bottom: none;
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.msg-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.msg-time {
  font-size: 12px;
  color: #9ca3af;
}

.msg-text {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}
</style>

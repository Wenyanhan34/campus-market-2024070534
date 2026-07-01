<template>
  <div class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p class="page-desc">选择发布类型，填写相关信息后提交</p>
    </div>

    <div class="publish-layout">
      <el-card shadow="never" class="form-card">
        <!-- 步骤条 -->
        <div class="steps-bar">
          <div
            v-for="(step, idx) in steps"
            :key="step.key"
            class="step-item"
            :class="{ active: currentStep === idx }"
          >
            <div class="step-circle" :class="{ completed: idx < currentStep }">
              <el-icon v-if="idx < currentStep"><Check /></el-icon>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="step-info">
              <span class="step-label">{{ step.label }}</span>
              <span class="step-desc">{{ step.desc }}</span>
            </div>
            <div v-if="idx < steps.length - 1" class="step-line" :class="{ active: idx < currentStep }" />
          </div>
        </div>

        <el-form
          label-width="100px"
          label-position="top"
          @submit.prevent="handleSubmit"
        >
          <!-- Step 1: 选择类型 -->
          <template v-if="currentStep === 0">
            <div class="type-grid">
              <div
                v-for="t in publishTypes"
                :key="t.value"
                class="type-card"
                :class="{ selected: publishType === t.value }"
                :style="{ '--card-color': t.color, '--card-bg': t.bg }"
                @click="publishType = t.value"
              >
                <el-icon :size="32" :color="t.color"><component :is="t.icon" /></el-icon>
                <h4>{{ t.label }}</h4>
                <p>{{ t.desc }}</p>
              </div>
            </div>
          </template>

          <!-- Step 2: 填写信息 -->
          <template v-if="currentStep === 1">
            <FormField label="标题" required :error="errors.title">
              <el-input
                v-model="form.title"
                placeholder="请输入标题，2-50个字符"
                maxlength="50"
                show-word-limit
              />
            </FormField>

            <FormField label="描述" required :error="errors.description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请详细描述，10-500个字符"
                maxlength="500"
                show-word-limit
              />
            </FormField>

            <FormField
              v-if="publishType !== 'errand'"
              label="地点"
              required
              :error="errors.location"
            >
              <el-input v-model="form.location" placeholder="交易 / 见面地点" />
            </FormField>

            <!-- 二手交易 -->
            <template v-if="publishType === 'trade'">
              <FormField label="分类" required :error="errors.category">
                <el-select v-model="form.category" placeholder="选择商品分类" style="width: 100%">
                  <el-option label="教材教辅" value="教材教辅" />
                  <el-option label="数码电子产品" value="数码电子产品" />
                  <el-option label="生活用品" value="生活用品" />
                  <el-option label="服饰鞋包" value="服饰鞋包" />
                  <el-option label="运动器材" value="运动器材" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </FormField>

              <el-row :gutter="20">
                <el-col :span="12">
                  <FormField label="价格" required :error="errors.price">
                    <el-input
                      v-model.number="form.price"
                      placeholder="请输入价格"
                      type="number"
                      min="0"
                      step="0.01"
                    >
                      <template #prefix>¥</template>
                    </el-input>
                  </FormField>
                </el-col>
                <el-col :span="12">
                  <FormField label="成色" required :error="errors.condition">
                    <el-select v-model="form.condition" placeholder="选择成色" style="width: 100%">
                      <el-option label="全新" value="全新" />
                      <el-option label="几乎全新" value="几乎全新" />
                      <el-option label="九成新" value="九成新" />
                      <el-option label="八成新" value="八成新" />
                      <el-option label="七成新及以下" value="七成新及以下" />
                    </el-select>
                  </FormField>
                </el-col>
              </el-row>
            </template>

            <!-- 失物招领 -->
            <template v-if="publishType === 'lost'">
              <FormField label="类型" required :error="errors.lfType">
                <el-radio-group v-model="form.lfType">
                  <el-radio value="lost">丢失</el-radio>
                  <el-radio value="found">捡到</el-radio>
                </el-radio-group>
              </FormField>

              <FormField label="物品名称" required :error="errors.itemName">
                <el-input v-model="form.itemName" placeholder="例如：蓝色校园一卡通" />
              </FormField>

              <el-row :gutter="20">
                <el-col :span="12">
                  <FormField label="发生时间" required :error="errors.eventTime">
                    <el-date-picker
                      v-model="form.eventTime"
                      type="datetime"
                      placeholder="选择时间"
                      style="width: 100%"
                      value-format="YYYY-MM-DD HH:mm"
                    />
                  </FormField>
                </el-col>
                <el-col :span="12">
                  <FormField label="联系方式" required :error="errors.contact">
                    <el-input v-model="form.contact" placeholder="微信 / 手机号 / 宿舍" />
                  </FormField>
                </el-col>
              </el-row>
            </template>

            <!-- 拼单搭子 -->
            <template v-if="publishType === 'group'">
              <FormField label="拼单类型" required :error="errors.groupType">
                <el-select v-model="form.groupType" placeholder="选择拼单类型" style="width: 100%">
                  <el-option label="餐饮拼单" value="餐饮拼单" />
                  <el-option label="饮品拼单" value="饮品拼单" />
                  <el-option label="水果拼单" value="水果拼单" />
                  <el-option label="运动搭子" value="运动搭子" />
                  <el-option label="学习搭子" value="学习搭子" />
                  <el-option label="游戏搭子" value="游戏搭子" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </FormField>

              <el-row :gutter="20">
                <el-col :span="12">
                  <FormField label="目标人数" required :error="errors.targetCount">
                    <el-input-number v-model="form.targetCount" :min="2" :max="50" style="width: 100%" />
                  </FormField>
                </el-col>
                <el-col :span="12">
                  <FormField label="截止时间" required :error="errors.deadline">
                    <el-date-picker
                      v-model="form.deadline"
                      type="datetime"
                      placeholder="选择截止时间"
                      style="width: 100%"
                      value-format="YYYY-MM-DD HH:mm"
                    />
                  </FormField>
                </el-col>
              </el-row>
            </template>

            <!-- 跑腿委托 -->
            <template v-if="publishType === 'errand'">
              <FormField label="任务类型" required :error="errors.taskType">
                <el-select v-model="form.taskType" placeholder="选择任务类型" style="width: 100%">
                  <el-option label="代取餐" value="代取餐" />
                  <el-option label="代取快递" value="代取快递" />
                  <el-option label="代购跑腿" value="代购跑腿" />
                  <el-option label="文件跑腿" value="文件跑腿" />
                  <el-option label="物品代送" value="物品代送" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </FormField>

              <el-row :gutter="20">
                <el-col :span="12">
                  <FormField label="取件地点" required :error="errors.from">
                    <el-input v-model="form.from" placeholder="取件 / 出发地点" />
                  </FormField>
                </el-col>
                <el-col :span="12">
                  <FormField label="送达地点" required :error="errors.to">
                    <el-input v-model="form.to" placeholder="送达 / 目的地" />
                  </FormField>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <FormField label="酬劳" :error="errors.reward">
                    <el-input
                      v-model.number="form.reward"
                      placeholder="请输入酬劳（元）"
                      type="number"
                      min="0"
                      step="0.5"
                    >
                      <template #prefix>¥</template>
                    </el-input>
                  </FormField>
                </el-col>
                <el-col :span="12">
                  <FormField label="截止时间" required :error="errors.deadline">
                    <el-date-picker
                      v-model="form.deadline"
                      type="datetime"
                      placeholder="选择截止时间"
                      style="width: 100%"
                      value-format="YYYY-MM-DD HH:mm"
                    />
                  </FormField>
                </el-col>
              </el-row>
            </template>
          </template>

          <!-- 按钮区 -->
          <div class="form-actions">
            <el-button v-if="currentStep > 0" size="large" @click="prevStep">
              上一步
            </el-button>
            <el-button
              v-if="currentStep < 1"
              type="primary"
              size="large"
              @click="nextStep"
            >
              下一步
            </el-button>
            <el-button
              v-if="currentStep === 1"
              type="primary"
              size="large"
              native-type="submit"
              :loading="submitting"
            >
              {{ submitting ? '发布中...' : '确认发布' }}
            </el-button>
            <el-button size="large" @click="resetForm">重置</el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import FormField from '../components/FormField.vue'
import { useUserStore } from '../stores/user'
import { createTrade } from '../api/trade'
import { createLostFound } from '../api/lostFound'
import { createGroupBuy } from '../api/groupBuy'
import { createErrand } from '../api/errand'

const router = useRouter()
const userStore = useUserStore()

const currentStep = ref(0)
const publishType = ref('trade')
const submitting = ref(false)

const steps = [
  { key: 'type', label: '选择类型', desc: '选择发布类别' },
  { key: 'form', label: '填写信息', desc: '填写详细内容' },
  { key: 'done', label: '完成发布', desc: '确认并提交' },
]

const publishTypes = [
  { value: 'trade', label: '二手交易', icon: 'Goods', color: '#2563eb', bg: '#eff6ff', desc: '出售闲置物品' },
  { value: 'lost', label: '失物招领', icon: 'WarningFilled', color: '#f59e0b', bg: '#fffbeb', desc: '寻物或招领' },
  { value: 'group', label: '拼单搭子', icon: 'UserFilled', color: '#10b981', bg: '#ecfdf5', desc: '一起拼单组队' },
  { value: 'errand', label: '跑腿委托', icon: 'Van', color: '#8b5cf6', bg: '#f5f3ff', desc: '代办代取任务' },
]

const initialState = {
  title: '',
  description: '',
  location: '',
  category: '',
  price: undefined as number | undefined,
  condition: '',
  lfType: 'lost',
  itemName: '',
  eventTime: '',
  contact: '',
  groupType: '',
  targetCount: 2,
  deadline: '',
  taskType: '',
  reward: undefined as number | undefined,
  from: '',
  to: '',
}

const form = reactive({ ...initialState })

const errors = reactive({
  title: '',
  description: '',
  location: '',
  category: '',
  price: '',
  condition: '',
  lfType: '',
  itemName: '',
  eventTime: '',
  contact: '',
  groupType: '',
  targetCount: '',
  deadline: '',
  taskType: '',
  reward: '',
  from: '',
  to: '',
})

function clearErrors() {
  for (const k of Object.keys(errors)) {
    (errors as Record<string, string>)[k] = ''
  }
}

function validateStep1(): boolean {
  return publishType.value.length > 0
}

function validateForm(): boolean {
  clearErrors()
  let valid = true

  function check(field: keyof typeof errors, ok: boolean, msg: string) {
    if (!ok) {
      (errors as Record<string, string>)[field] = msg
      valid = false
    }
  }

  check('title', form.title.trim().length >= 2, '标题至少2个字符')
  check('description', form.description.trim().length >= 10, '描述至少10个字符')

  if (publishType.value === 'trade') {
    check('location', form.location.trim().length > 0, '请输入地点')
    check('category', form.category.length > 0, '请选择商品分类')
    check('price', form.price !== undefined && form.price > 0, '请输入有效价格')
    check('condition', form.condition.length > 0, '请选择成色')
  } else if (publishType.value === 'lost') {
    check('location', form.location.trim().length > 0, '请输入地点')
    check('itemName', form.itemName.trim().length > 0, '请输入物品名称')
    check('eventTime', form.eventTime.length > 0, '请选择时间')
    check('contact', form.contact.trim().length > 0, '请输入联系方式')
  } else if (publishType.value === 'group') {
    check('location', form.location.trim().length > 0, '请输入地点')
    check('groupType', form.groupType.length > 0, '请选择拼单类型')
    check('targetCount', form.targetCount >= 2, '目标人数至少为2')
    check('deadline', form.deadline.length > 0, '请选择截止时间')
  } else if (publishType.value === 'errand') {
    check('taskType', form.taskType.length > 0, '请选择任务类型')
    check('from', form.from.trim().length > 0, '请输入取件地点')
    check('to', form.to.trim().length > 0, '请输入送达地点')
    check('deadline', form.deadline.length > 0, '请选择截止时间')
  }

  return valid
}

function nextStep() {
  if (currentStep.value === 0 && validateStep1()) {
    currentStep.value = 1
  } else if (currentStep.value === 0) {
    ElMessage.warning('请选择一个发布类型')
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function buildSubmitData() {
  const base = {
    publisher: userStore.displayName,
    status: 'open' as const,
  }

  if (publishType.value === 'trade') {
    return {
      ...base,
      title: form.title.trim(),
      price: form.price!,
      category: form.category,
      condition: form.condition,
      location: form.location.trim(),
      description: form.description.trim(),
      publishTime: new Date().toISOString().slice(0, 10),
      image: '',
    }
  }
  if (publishType.value === 'lost') {
    return {
      ...base,
      title: form.title.trim(),
      type: form.lfType,
      itemName: form.itemName.trim(),
      location: form.location.trim(),
      eventTime: form.eventTime,
      contact: form.contact.trim(),
      description: form.description.trim(),
    }
  }
  if (publishType.value === 'group') {
    return {
      ...base,
      title: form.title.trim(),
      type: form.groupType,
      targetCount: form.targetCount,
      currentCount: 1,
      deadline: form.deadline,
      location: form.location.trim(),
      description: form.description.trim(),
    }
  }
  return {
    ...base,
    title: form.title.trim(),
    taskType: form.taskType,
    reward: form.reward ?? 0,
    from: form.from.trim(),
    to: form.to.trim(),
    deadline: form.deadline,
    description: form.description.trim(),
  }
}

const routeMap: Record<string, string> = {
  trade: '/trade',
  lost: '/lost-found',
  group: '/group-buy',
  errand: '/errand',
}

const labelMap: Record<string, string> = {
  trade: '二手交易',
  lost: '失物招领',
  group: '拼单搭子',
  errand: '跑腿委托',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMap: Record<string, (data: any) => Promise<unknown>> = {
  trade: createTrade,
  lost: createLostFound,
  group: createGroupBuy,
  errand: createErrand,
}

async function handleSubmit() {
  if (!validateForm()) {
    ElMessage.warning('请完善表单后再提交')
    return
  }

  submitting.value = true
  try {
    const data = buildSubmitData()
    await createMap[publishType.value]!(data)
    currentStep.value = 2
    ElMessage.success(`${labelMap[publishType.value]}发布成功！`)
    setTimeout(() => router.push(routeMap[publishType.value]!), 1200)
  } catch {
    ElMessage.error('发布失败，请检查 Mock 服务是否正常运行')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.assign(form, initialState)
  clearErrors()
  currentStep.value = 0
}

watch(publishType, () => {
  resetForm()
})
</script>

<style scoped>
.page { padding: 0; }

.page-header {
  margin-bottom: 28px;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 24px;
  color: var(--color-text);
  font-weight: 700;
}

.page-desc {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 14px;
}

.publish-layout {
  max-width: 820px;
  margin: 0 auto;
}


.form-card {
  border-radius: var(--radius-lg);
  padding: 8px;
}

/* Steps */
.steps-bar {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
  margin-bottom: 36px;
  padding: 0 20px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  background: var(--color-bg);
  color: var(--color-text-muted);
  border: 2px solid var(--color-border);
  transition: all var(--transition-normal);
  flex-shrink: 0;
}

.step-item.active .step-circle {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.step-item .step-circle.completed {
  background: var(--color-success);
  color: #fff;
  border-color: var(--color-success);
}

.step-info {
  display: flex;
  flex-direction: column;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.step-item.active .step-label {
  color: var(--color-text);
}

.step-desc {
  font-size: 11px;
  color: var(--color-text-muted);
}

.step-line {
  width: 60px;
  height: 2px;
  background: var(--color-border);
  margin: 0 16px;
  align-self: center;
}

.step-line.active {
  background: var(--color-success);
}

/* Type grid */
.type-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.type-card {
  text-align: center;
  padding: 28px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid var(--color-border-light);
  background: var(--color-bg-white);
}

.type-card:hover {
  border-color: var(--card-color);
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.type-card.selected {
  border-color: var(--card-color);
  background: var(--card-bg);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--card-color) 20%, transparent);
}

.type-card h4 {
  margin: 12px 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
}

.type-card p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
}

.form-actions {
  padding-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.form-actions .el-button--primary {
  min-width: 120px;
}
</style>

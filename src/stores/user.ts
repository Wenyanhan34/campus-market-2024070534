import { defineStore } from 'pinia'

export interface CurrentUser {
  id: number
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
  campus: string
  role: string
  contact: string
}

const CAMPUS_LABELS: Record<string, string> = {
  east: '东区',
  west: '西区',
  south: '南区',
}

const ROLE_LABELS: Record<string, string> = {
  student: '学生',
  staff: '教职工',
}

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: true,
    currentUser: {
      id: 1,
      name: '校园用户',
      college: '计算机学院',
      grade: '2023 级',
      avatar: '',
      bio: '热爱校园生活，喜欢分享闲置好物。',
      campus: 'east',
      role: 'student',
      contact: '',
    } as CurrentUser,
  }),

  getters: {
    displayName: (state) => state.currentUser.name,
    userDescription: (state) => {
      return `${state.currentUser.college} · ${CAMPUS_LABELS[state.currentUser.campus] || state.currentUser.campus}`
    },
    campusLabel: (state) => CAMPUS_LABELS[state.currentUser.campus] || state.currentUser.campus,
    roleLabel: (state) => ROLE_LABELS[state.currentUser.role] || state.currentUser.role,
    userInitial: (state) => {
      return state.currentUser.name.slice(0, 1)
    },
  },

  actions: {
    updateProfile(payload: Partial<CurrentUser>) {
      this.currentUser = {
        ...this.currentUser,
        ...payload,
      }
    },
    logout() {
      this.isLoggedIn = false
    },
    login() {
      this.isLoggedIn = true
    },
  },
})

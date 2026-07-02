import http from './http'

export interface ErrandItem {
  id: number
  title: string
  taskType: string
  reward: number
  from: string
  to: string
  deadline: string
  publisher: string
  status: string
  description: string
  image?: string
}

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

export function createErrand(data: Omit<ErrandItem, 'id'>) {
  return http.post<ErrandItem>('/errands', data)
}

export function getErrandById(id: number) {
  return http.get<ErrandItem>(`/errands/${id}`)
}

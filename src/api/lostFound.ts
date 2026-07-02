import http from './http'

export interface LostFoundItem {
  id: number
  title: string
  type: string
  itemName: string
  location: string
  eventTime: string
  contact: string
  publisher?: string
  status: string
  description: string
  image?: string
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

export function createLostFound(data: Omit<LostFoundItem, 'id'>) {
  return http.post<LostFoundItem>('/lostFounds', data)
}

export function getLostFoundById(id: number) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}

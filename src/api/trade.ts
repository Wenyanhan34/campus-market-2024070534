import http from './http'

export interface TradeItem {
  id: number
  title: string
  price: number
  category: string
  condition: string
  publisher: string
  publishTime: string
  location: string
  image: string
  status: string
  description: string
}

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function createTrade(data: Omit<TradeItem, 'id'>) {
  return http.post<TradeItem>('/trades', data)
}

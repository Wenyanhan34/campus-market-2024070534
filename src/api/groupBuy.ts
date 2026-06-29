import http from './http'
export function getGroupBuys() {
  return http.get('/groupBuys')
}

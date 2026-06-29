import http from './http'
export function getLostFounds() {
  return http.get('/lostFounds')
}

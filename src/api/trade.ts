import http from './http'
export function getTrades() {
  return http.get('/trades')
}

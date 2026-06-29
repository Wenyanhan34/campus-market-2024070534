import http from './http'
export function getErrands() {
  return http.get('/errands')
}

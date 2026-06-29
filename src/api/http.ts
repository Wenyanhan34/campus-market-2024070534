import axios from 'axios'
const baseURL = 'http://localhost:3002'

const http = axios.create({
  baseURL,
  timeout: 5000
})
export default http

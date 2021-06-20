import axios from 'axios'

import store from '@/store'

const http = axios.create({
    baseURL: process.env.VUE_APP_API_HOST
})

http.interceptors.request.use((config) => {
    store.dispatch('LoadingStoreModule/start').then(() => {})
    return config
})

http.interceptors.response.use((response) => {
    store.dispatch('LoadingStoreModule/completed').then(() => {})
    return response
})

export default http
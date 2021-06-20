import Vue from 'vue'
import VueRouter from 'vue-router'

import BookSearchListPage from '@/view/book/BookSearchListPage.vue'

Vue.use(VueRouter)
const router = new VueRouter({
    routes: [{
        path: '/',
        redirect: '/search'
    }, {
        path: '/search',
        component: BookSearchListPage
    }]
})
export default router
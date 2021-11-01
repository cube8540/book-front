import Vue from 'vue'
import VueRouter from 'vue-router'

import BookSearchListPage from '@/view/book/BookSearchListPage.vue'
import BookDetailPage from '@/view/book/BookDetailPage.vue'

Vue.use(VueRouter)
const router = new VueRouter({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/books/search'
    }, {
        path: '/books/search',
        name: 'bookSearch',
        component: BookSearchListPage
    }, {
        path: '/books/:isbn',
        name: 'bookDetail',
        props: true,
        component: BookDetailPage
    }]
})
export default router
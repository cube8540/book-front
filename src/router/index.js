import Vue from 'vue'
import VueRouter from 'vue-router'

import HelloWorld from "@/components/HelloWorld";

Vue.use(VueRouter)
const router = new VueRouter({
    routes: [{
        path: '/',
        redirect: '/Hello'
    }, {
        path: '/hello',
        component: HelloWorld
    }]
})
export default router
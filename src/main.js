import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'

import App from './App.vue'

import vuetify from './plugins/vuetify'

import store from '@/store'
import router from '@/router'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)

new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app')

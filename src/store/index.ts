import Vue from 'vue'
import Vuex from 'vuex'

import { LoadingState, LoadingStoreModule } from '@/store/loading'

Vue.use(Vuex)

export interface RootState {
    LoadingState: LoadingState
}

export default new Vuex.Store({
    modules: {
        LoadingStoreModule
    }
})
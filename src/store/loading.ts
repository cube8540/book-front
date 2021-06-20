import { Module } from 'vuex'

import { RootState } from '@/store/index'

interface SetLoadingPayload {
    loading: boolean
}

export interface LoadingState {
    loading: boolean
}

export const LoadingStoreModule: Module<LoadingState, RootState> = {
    namespaced: true,
    state: () => ({
        loading: false
    }),
    mutations: {
        setLoading(state, payload: SetLoadingPayload) {
            state.loading = payload.loading
        }
    },
    getters: {
        isLoading(state): boolean {
            return state.loading
        }
    },
    actions: {
        start({ commit }) {
            commit('setLoading', { loading: true })
        },
        completed({ commit }) {
            commit('setLoading', { loading: false })
        }
    }
}
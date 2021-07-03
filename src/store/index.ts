import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import settings from './settings'
import userdata from './datas'

const state = () => ({
    showUi: true,
    showHistory: false,
    nowLineNumber: 0
})

const mutations = {
    toggleHistory(state: any) {
        state.toggleHistory = !state.showHistory
    },
    toggleUi(state: any) {
        state.showUi = !state.showUi
    },
    nextLine(state: any) {
        ++state.nowLineNumber
    },
    setLine(state: any, n: number) {
        state.nowLineNumber = n
    }
}

const store = createStore({
    state,
    mutations,
    actions: {},
    modules: {
        // settings
    },
    plugins: [createPersistedState()]
})

export default store

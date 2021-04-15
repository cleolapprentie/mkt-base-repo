import Vue from 'vue'
import Vuex from 'vuex'
import API from './apiModule'
import * as service from './service'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: []
  },
  mutations: {
    SET_DATA (state, { data }) {
      state.data = data
    }
  },
  actions: {
    async GET_DATA ({ dispatch, commit }, payload) {
      const result = await dispatch(
        'API/REQUEST',
        { reqContext: service.example() }
      )
      commit('SET_DATA', result)

      return result
    }
  },
  modules: {
    API
  }
})

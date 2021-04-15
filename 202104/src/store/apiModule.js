import axios from '@/plugins/axios'

const state = () => ({})
const getters = {}
const mutations = {}

const actions = {
  REQUEST (context, { reqContext, payload }) {
    const request = Object.assign({}, reqContext.request, payload)
    return axios
      .request(request)
      .then(reqContext.success)
      .catch(reqContext.error)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

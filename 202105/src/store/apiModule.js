import axios from '@/plugins/axios'

const state = () => ({})
const getters = {}
const mutations = {}

const actions = {
  request (context, { reqContext, payload }) {
    const reqConfig = Object.assign({}, reqContext.request, payload)
    return axios
      .request(reqConfig)
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

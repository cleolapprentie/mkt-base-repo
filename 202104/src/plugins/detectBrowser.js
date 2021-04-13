import { detect } from 'detect-browser'

export default {
  install (Vue, options) {
    Vue.prototype.$browser = detect()
  }
}

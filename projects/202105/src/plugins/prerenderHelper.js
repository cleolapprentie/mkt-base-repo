export default {
  install (Vue, options) {
    Vue.prototype.$prerenderStartPoint = dispatchRenderEvent
  }
}

function dispatchRenderEvent () {
  if (window.__PRERENDER_PROCESSING) {
    document.dispatchEvent(new Event('render-event'))
  }
}

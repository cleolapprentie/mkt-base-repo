<script>
// import axios from '@/plugins/axios'
import KonamiCode from '@/components/KonamiCode'

export default {
  name: 'Index',
  metaInfo () {
    return {
      title: 'title'
    }
  },
  components: {
    KonamiCode
  },
  data: () => ({
    event: null
  }),
  async mounted () {
    this.$prerenderStartPoint() // 通知prerender開始渲染

    const { data } = await this.$store.dispatch('GET_DATA')
    console.log(data.name)
  },
  methods: {
    konamiHandler (e) {
      if (this.event) return
      this.event = Date.now()
      console.log('%c konami!', 'color: orange; font-weight: bold; font-size: 20px;')

      window.requestAnimationFrame(() => {
        console.log('clear event')
        this.event = null
      })
    }
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

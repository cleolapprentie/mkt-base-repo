<script>
// import axios from '@/plugins/axios'

export default {
  name: 'About',
  metaInfo () {
    return {
      title: 'title'
    }
  },
  data: () => ({
    render: false
  }),
  mounted () {
    setTimeout(() => {
      this.render = true
      this.$prerenderStartPoint()
    }, 5000)
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

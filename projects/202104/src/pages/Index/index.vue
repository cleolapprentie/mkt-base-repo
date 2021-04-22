<script>
// import axios from '@/plugins/axios'

export default {
  name: 'Index',
  metaInfo () {
    return {
      title: 'title'
    }
  },
  async mounted () {
    this.$prerenderStartPoint() // 通知prerender開始渲染

    const { data } = await this.$store.dispatch('GET_DATA')
    console.log(data.name)
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

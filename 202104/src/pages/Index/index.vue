<script>
import { onMounted } from '@vue/composition-api'
// import axios from '@/plugins/axios'

export default {
  name: 'Index',
  metaInfo () {
    return {
      title: 'title'
    }
  },
  setup (props, context) {
    onMounted(async () => {
      const result = await context.root.$store.dispatch('GET_DATA')
      console.log(result)
    })
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

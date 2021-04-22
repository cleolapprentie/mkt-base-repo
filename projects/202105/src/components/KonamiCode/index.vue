<script>
import { onMounted, onBeforeUnmount } from '@vue/composition-api'

export default {
  name: 'KonamiCode',
  setup (props, context) {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyB']
    const userInput = []

    function onKeyPress (event) {
      const { code } = event
      userInput.push(code)

      const { passed, invalid } = validateCode()
      if (invalid) {
        userInput.splice(-userInput.length)
      } else if (passed) {
        userInput.splice(-userInput.length)
        context.emit('konami', context)
        // console.log('%c konami!', 'color: orange; font-weight: bold; font-size: 20px;')
      }
    }

    function validateCode () {
      const invalid = userInput.some((code, idx) => code !== konamiCode[idx])
      const passed = !invalid && (konamiCode.length === userInput.length)

      return {
        invalid,
        passed
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', onKeyPress)
    })

    onBeforeUnmount(() => {
      console.log('unmount!')
      document.removeEventListener('keydown', onKeyPress)
    })
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

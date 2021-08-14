<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-08-14 09:46:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/exception/404.vue
-->
<template>
  <exception-page home-route="/dashboard" :style="`min-height: ${minHeight}`" type="404" />
</template>

<script>
import ExceptionPage from '@/components/exception/ExceptionPage'
import {mapState} from 'vuex'
export default {
  name: 'Exp404',
  components: {ExceptionPage},
  computed: {
    ...mapState('setting', ['pageMinHeight']),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + 'px' : '100vh'
    }
  }
}
</script>

<style scoped lang="less">
</style>

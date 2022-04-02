<!--
 * @Author: max
 * @Date: 2022-03-30 16:51:17
 * @LastEditTime: 2022-04-02 14:25:13
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/layouts/header/HeaderHelp.vue
-->
<template>
  <div class="header-search">
    <a-icon type="question-circle" class="search-icon" @click="helpClick"/>
  </div>
</template>

<script>
export default {
  name: 'HeaderSearch',
  data () {
    return {
      
    }
  },
  methods: {
    helpClick(){
        window.open('http://192.168.1.245:8080/docs/')
    }
  }
}
</script>

<style lang="less">
  .header-search{
    .search-icon{
      font-size: 16px;
      cursor: pointer;
    }
    .search-input{
      border: 0;
      border-bottom: 1px solid @border-color-split;
      transition: width 0.3s ease-in-out;
      input{
        border: 0;
        box-shadow: 0 0 0 0;
      }
      &.leave{
        width: 0px;
        input{
          display: none;
        }
      }
      &.enter{
        width: 200px;
        input:focus{
          box-shadow: 0 0 0 0;
        }
      }
    }
  }
</style>

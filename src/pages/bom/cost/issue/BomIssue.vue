<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-07-19 10:38:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/bom/cost/issue/BomIssue.vue
-->
<template>
  <div class="content">
    <div class="search-input">
      <a-input-search
        class="search-ipt"
        style="width: 322px"
        placeholder="请输入产品品号"
        size="large"
        enterButton="搜索"
        @search="onSearch"
        :disabled="searchDisabled"
      />
    </div>
  </div>
</template>

<script>
export default {
  props:['searchDisabled'],
  data() {
    return {
     
    };
  },
  created() {
    console.log(this.inputList);
  },
  methods: {
    onSearch(value) {
      this.$emit('onSearch',value)
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  background-color: @base-bg-color;
  padding: 10px;
}
.search-input {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
.content-list {
  margin-top: 10px;
}
</style>

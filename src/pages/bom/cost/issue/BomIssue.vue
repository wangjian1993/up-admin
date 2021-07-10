<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-07-10 10:12:44
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
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.inputList);
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

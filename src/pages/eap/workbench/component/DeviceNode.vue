<!--
 * @Author: max
 * @Date: 2022-06-13 10:09:07
 * @LastEditTime: 2022-06-13 11:05:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/workbench/component/DeviceNode.vue
-->
<template>
  <div class="rank">
    <h4 class="title">{{ title }}</h4>
    <a-descriptions layout="vertical" size="small" bordered :column="10">
      <a-descriptions-item :label="item.name" v-for="(item, index) in list" :key="index">
        <span class="state-span" :class="'bg' + item.state">{{item.duration}}</span>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
export default {
  name: "RankList",
  // ['title', 'list']
  props: {
    title: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default: null,
    },
  },
};
</script>

<style lang="less" scoped>
.rank {
  padding: 10px 20px;
}
.bg1{
    background:#0ae82f;
}
.state-span{
    display: inline-block;
    width:60px;
    height:60px;
    border-radius: 50%;
    display: flex;
    justify-content:center;
    align-items: center;
    color:#fff;
    margin:0 auto;
}
</style>

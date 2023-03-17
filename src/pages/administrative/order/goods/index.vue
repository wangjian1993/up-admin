<!--
 * @Author: max
 * @Date: 2023-03-17 11:31:07
 * @LastEditTime: 2023-03-17 15:45:39
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/goods/index.vue
-->
<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="5"><Classify/></a-col>
      <a-col :span="19"><Goods/></a-col>
    </a-row>
  </div>
</template>

<script>
import Goods from "./goods.vue";
import Classify from "./classify.vue";
export default {
  data() {
    return {};
  },
  components: { Goods, Classify },
};
</script>

<style></style>

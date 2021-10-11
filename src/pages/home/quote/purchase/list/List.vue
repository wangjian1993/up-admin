<!--
 * @Author: max
 * @Date: 2021-08-17 10:59:02
 * @LastEditTime: 2021-10-11 10:46:35
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/List.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-tabs type="card" v-model="activeKey" default-active-key="1">
        <a-tab-pane key="1" tab="列表查询(公共端)" v-if="hasPerm('search_public')"><list-public :categoryList="categoryList"></list-public></a-tab-pane>
        <a-tab-pane key="2" tab="列表查询(采购端)" v-if="hasPerm('search_purchase')"><list-search :categoryList="categoryList"></list-search></a-tab-pane>
        <!-- <a-tab-pane key="3" tab="销售要求报价"> </a-tab-pane>
        <a-tab-pane key="4" tab="物料价格变动"> </a-tab-pane>
        <a-tab-pane key="5" tab="有Bom无成本价"> </a-tab-pane> -->
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import ListSearch from "./ListSearch.vue";
import ListPublic from "./ListPublic.vue";
import { getCostConfig } from "@/services/web.js";
export default {
  components: { ListSearch, ListPublic },
  data() {
    return {
      categoryList:[],
      activeKey: "1",
    };
  },
  created() {
    this.getCategory();
    console.log(this.$route.query.type)
    console.log(this.hasPerm('search_purchase'))
    if(this.$route.query.type == 2 && this.hasPerm('search_purchase')){
      this.activeKey= "2";
    }
  },
  methods: {
    getCategory() {
      getCostConfig("", "getcategoryoptions").then((res) => {
        if (res.data.success) {
          this.categoryList =res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>

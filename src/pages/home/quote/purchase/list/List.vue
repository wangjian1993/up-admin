<!--
 * @Author: max
 * @Date: 2021-08-17 10:59:02
 * @LastEditTime: 2022-05-05 14:13:31
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/List.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-tabs type="card" v-model="activeKey" default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="列表查询(公共端)" v-if="hasPerm('search_public')"></a-tab-pane>
        <a-tab-pane key="2" tab="列表查询(采购端)" v-if="hasPerm('search_purchase')"></a-tab-pane>
      </a-tabs>
      <list-public v-show="activeKey == 1 && hasPerm('search_public')" :categoryList="categoryList"></list-public>
      <list-search v-show="activeKey == 2 && hasPerm('search_purchase')" :categoryList="categoryList"></list-search>
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
      categoryList: [],
      activeKey: "1",
    };
  },
  created() {
    this.getCategory();
    if (this.$route.query.type == 2 && this.hasPerm("search_purchase")) {
      this.activeKey = "2";
    }
  },
  methods: {
    callback(key) {
      this.activeKey = key;
    },
    getCategory() {
      getCostConfig("", "getcategoryoptions").then((res) => {
        if (res.data.success) {
          this.categoryList = res.data.data;
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

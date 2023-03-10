<!--
 * @Author: max
 * @Date: 2022-04-04 13:38:31
 * @LastEditTime: 2023-01-05 17:33:12
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/process/components/orderList.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="选择工单" @cancel="close" :footer="null" centered width="40%">
      <a-list item-layout="horizontal" :data-source="orderData" class="list-box">
        <a-list-item slot="renderItem" slot-scope="item" class="list-box-item" @click="selectOrder(item)">
          <a-list-item-meta :description="item.ProName">
            <div slot="title">
              <span>工单号:{{ item.MoCode }}</span>
              <span style="margin-left:20px">数量:{{ item.ReportQty }}</span>
            </div>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-modal>
  </div>
</template>
<script>
import { getReleases } from "@/services/mes.js";
export default {
  props: ["orderInfo", "type",'defaultLine'],
  data() {
    return {
      orderData: [],
      visible: true,
    };
  },
  created() {
    this.getDocsList();
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    selectOrder(item) {
      console.log("item===", item);
      this.$emit("success", item);
    },
    getDocsList() {
      let params = {
        lineid: this.defaultLine,
        process: this.orderInfo.PROCESS_CODE,
      };
      let url = "process/" + this.type + "/getmos";
      console.log("params---",params)
      getReleases(params, url).then((res) => {
        if (res.data.success && res.data.data) {
          this.orderData = res.data.data.list;
        }
      });
    },
    close() {
      this.$emit("closeModal");
    },
  },
};
</script>

<style lang="less" scoped>
.list-box {
  height: 500px;
  overflow: auto;
}
.list-box-item {
  cursor: pointer;
}
.list-box-item:hover {
  background: #efefef;
}
</style>

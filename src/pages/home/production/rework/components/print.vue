<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2022-03-31 09:53:20
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/production/rework/components/print.vue
-->
<template>
  <a-modal v-model="visible" title="打印返工单" v-if="visible" @cancel="close" :footer="null" centered width="70%">
    <a-button style="float:right" type="primary" class="no-print" @click="updatedStatu" v-print="'#printTest'">打印</a-button>
    <div id="printTest">
      <div class="content always" v-for="item in printData" :key="item.id">
        <div class="content-top">
          <div class="head-img"><img src="@/assets/img/mb.png" alt="" /></div>
          <div class="head-title">
            <p>返工标识卡</p>
          </div>
          <div class="head-qr"><vue-qr :text="item.QrCode" :size="300"></vue-qr></div>
        </div>
        <div class="info">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="订单号">
              {{ item.BusinessOrderNo}}
            </a-descriptions-item>
            <a-descriptions-item label="工单号">
              {{ item.MoCode }}
            </a-descriptions-item>
            <a-descriptions-item label="日期">
              {{ item.DateTime }}
            </a-descriptions-item>
            <a-descriptions-item label="返工数量">
              {{ item.Qty }}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{ item.ProCode }}
            </a-descriptions-item>
            <a-descriptions-item label="品名">
              {{ item.ProName }}
            </a-descriptions-item>
            <a-descriptions-item label="返工车间">
              {{ item.WorkShopName }}
            </a-descriptions-item>
            <a-descriptions-item label="返工产线">
              {{ item.LineName }}
            </a-descriptions-item>
            <a-descriptions-item label="返工原因" :span="2">
              {{ item.Remarks }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { setPrintInfo } from "@/services/web.js";
import vueQr from "vue-qr";
export default {
  props: ["printData"],
  components: { vueQr },
  data() {
    return {
      data: [],
      isSearch: false,
      isUserList: false,
      visible: true,
    };
  },
  created() {
    console.log(this.printData);
  },
  methods: {
    close() {
      this.$emit("closeModal");
      this.data = [];
    },
    updatedStatu() {
      console.log("打印=====");
      let params = [];
      this.printData.map((item) => {
        params.push({
          Id: item.Id,
          Remarks: item.Remarks,
          Status: "PRINTED",
        });
      });
      setPrintInfo(params, "reworkupdate").then((res) => {
        if (res.data.success) {
          this.$message.success("打印成功!");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.content {
  width: 1086px;
  height: 756px;
  margin:0 auto;
  overflow: hidden;
  max-height: 756px;
  padding: 0;
  word-break: break-all;
}
.always {
  page-break-after: always;
}
.always:last-child {
  page-break-after: auto;
}
.head-img {
  text-align: center;
  width: 200px;
  height: 50px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-qr {
  text-align: center;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  margin-top: 5px;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-title {
  text-align: center;
  font-size: 30px;
  p {
    padding: 0;
    margin: 0;
    font-size: 30px;
    color: #000;
    font-weight: 700;
  }
}
.info {
  margin: 0 auto;
  // border: 1px #000 solid;
  padding: 5px 10px;
  border-bottom: none;
}
/deep/.ant-descriptions-item {
  padding-bottom: 2px;
}
/deep/.ant-descriptions-item-label {
  font-size: 26px;
  width: 14%;
}
/deep/.ant-descriptions-item-content {
  font-size: 26px;
}
/deep/.ant-checkbox-wrapper {
  font-size: 26px;
}
/deep/.ant-checkbox {
  font-size: 26px;
}
/deep/.ant-table-small {
  border: 2px #000 solid;
  // border-top: none;
  // border-bottom: none;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th {
  // border: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
  font-size: 10px;
}
/deep/.ant-table-body {
  margin: 0;
}
/deep/.ant-table-column-title {
  font-size: 10px;
}
/deep/.ant-table-thead > tr > th {
  border-bottom: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th,
.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
}
/deep/.ant-table-tbody > tr > td {
  border-bottom: 1px #000 solid;
}
/deep/.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label,
.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-content {
  padding: 15px 10px;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  border-right: 1px solid #b4b3b3;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-content {
  border-right: 1px solid #b4b3b3;
}
/deep/.ant-descriptions-bordered .ant-descriptions-row {
  border-bottom: 1px solid #b4b3b3;
}
/deep/.ant-descriptions-bordered .ant-descriptions-view {
  border: 1px solid #b4b3b3;
}
/deep/.ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
/deep/.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label,
.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-content {
  padding: 20px 10px;
}
.print-footer,
.content-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    flex: 3;
    text-align: center;
    padding: 2px 0;
    margin: 0;
  }
}
</style>

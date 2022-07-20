<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2022-07-18 10:35:53
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/arrival/list/print.vue
-->
<template>
  <a-modal v-model="visible" title="打印到货通知单" v-if="visible" @cancel="close" :footer="null" centered width="70%">
    <div style="display: flex;justify-content: flex-end;">
      <a-button type="primary" class="no-print" v-print="'#printTest'">打印</a-button>
    </div>
    <div id="printTest">
      <div v-for="(item, index) in printData" :key="index" style="page-break-after:always">
        <div class="content always">
          <div class="content-top">
            <div class="head-img"><img src="@/assets/img/mb.png" alt="" /></div>
            <div class="head-title">
              <p>深圳民爆光电股份有限公司</p>
              <p>到货通知单</p>
            </div>
            <div></div>
          </div>
          <div class="info">
            <ul class="print-top-info">
              <li>
                <span>供应商代码:</span>
                <span> {{ item.SupplierCode }}</span>
              </li>
              <li>
                <span>打印日期:</span>
                <span> {{ timeStr(item.PrintDate) }}</span>
              </li>
              <li>
                <span>供应商全称:</span>
                <span> {{ item.SupplierName }}</span>
              </li>
              <li>
                <span>对方单号:</span>
                <span> {{ item.OrderNo }}</span>
              </li>
              <li>
                <span>单号:</span>
                <span> {{ item.DocNo }}</span>
              </li>
            </ul>
            <a-descriptions :column="24" bordered size="small">
              <a-descriptions-item :span="6" label="暂放位置">
                <!-- {{ item.infoData.StorageLocation || "" }} -->
              </a-descriptions-item>
              <a-descriptions-item :span="6" label="交货日期">
                {{ splitData(item.infoData.ArrivalDate || "") }}
              </a-descriptions-item>
              <a-descriptions-item :span="6" label="工单备注">
                {{ item.infoData.Remark || "" }}
              </a-descriptions-item>
              <a-descriptions-item :span="6" label="检验结果"></a-descriptions-item>
            </a-descriptions>
            <a-table :columns="columns" :data-source="item.dataSource" size="small" :pagination="false" :rowKey="(data) => data.MitemCode" bordered style="page-break-after:always">
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ index + 1 }}</span>
                </div>
              </template>
              <template slot="OK" slot-scope="text">
                <div>
                  <span v-if="text"><a-icon type="check"/></span>
                </div>
              </template>
              <template slot="NG" slot-scope="text">
                <div>
                  <span v-if="text"><a-icon type="check"/></span>
                </div>
              </template>
            </a-table>
            <div class="table-footer">
              <p>制单:</p>
              <p>核准:</p>
              <p>品质:</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getArrivalList } from "@/services/web.js";
const columns = [
  {
    title: "采购订单号",
    dataIndex: "OrderNo",
    scopedSlots: { customRender: "OrderNo" },
    align: "center",
    width: 100,
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
    width: 100,
  },
  {
    title: "品名",
    dataIndex: "ItemDescription",
    scopedSlots: { customRender: "ItemDescription" },
    align: "center",
    width: 180,
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width: 280,
  },
  {
    title: "单位",
    dataIndex: "Unit",
    scopedSlots: { customRender: "Unit" },
    align: "center",
    width: 50,
  },
  {
    title: "交货数",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
  },
  {
    title: "业务单号",
    dataIndex: "DocNo",
    scopedSlots: { customRender: "DocNo" },
    align: "center",
    width: 90,
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
  {
    title: "图号",
    dataIndex: "DrawingNo",
    scopedSlots: { customRender: "DrawingNo" },
    align: "center",
    width: 80,
  },
  {
    title: "OK",
    dataIndex: "OK",
    scopedSlots: { customRender: "OK" },
    align: "center",
    width: 40,
  },
  {
    title: "NG",
    dataIndex: "NG",
    scopedSlots: { customRender: "NG" },
    align: "center",
    width: 40,
  },
];
import { splitData } from "@/utils/util";
export default {
  props: ["printData"],
  data() {
    return {
      data: [],
      infoData: [],
      columns,
      isSearch: false,
      isUserList: false,
      visible: true,
      barcodeValue: "",
      barcodeOptions: {
        width: 50,
        height: 50,
      },
    };
  },
  created() {
    this.getPrintData();
  },
  methods: {
    splitData,
    timeStr(text) {
      let str = text.split("T");
      let time = str[1].split(".");
      return str[0] + " " + time[0];
    },
    close() {
      this.$emit("closeModal");
      this.data = [];
    },
    getPrintData() {
      this.printData.forEach((item) => {
        let parmas = {
          docno: item.DocNo,
        };
        getArrivalList(parmas, "single").then((res) => {
          if (res.data.success) {
            item.dataSource = res.data.data.list;
            item.infoData = item.dataSource[0];
          }
        });
      });
      console.log(this.printData);
    },
  },
};
</script>

<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-table {
  min-height: 0;
}

.content {
  width: 1080px;
  margin: 0px auto;
  overflow: hidden;
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
  margin: 0 auto;
  img {
    width: 140px;
    height: 40px;
  }
}
.head-qr {
  text-align: center;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  margin-top: 15px;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-title {
  text-align: center;
  p {
    padding: 0;
    margin: 0;
    font-size: 20px;
    color: #000;
    font-weight: 700;
  }
}
.info {
  margin: 0 auto;
  // border: 1px #000 solid;
  // padding: 5px 10px;
  border-bottom: none;
}
/deep/.ant-descriptions-item {
  padding-bottom: 2px;
}

/deep/.ant-descriptions-item-label {
  font-size: 10px;
}
.ant-descriptions-row > td {
  font-size: 10px;
  padding: 0 10px;
}
/deep/ .ant-descriptions-item-content {
  font-size: 10px;
}
/deep/.ant-table-small {
  border: 1px #000 solid;
  border-top: none;
  // border-bottom: none;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th {
  // border: 1px #000 solid;
}
/deep/.ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td {
  padding: 2px;
}
/deep/.ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th {
  padding: 4px 2px;
}
/deep/.ant-table-body {
  margin: 0;
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
  padding: 0 4px;
}
/deep/.ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
/deep/.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-label,
.ant-descriptions-bordered.ant-descriptions-small .ant-descriptions-item-content {
  padding: 4px;
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
  border: 1px solid #333;
}
/deep/.ant-checkbox-inner {
  width: 25px;
  height: 25px;
  border: 1px solid #000;
}
/deep/.ant-checkbox-input {
  border: 1px solid #000;
}
.print-footer,
.content-top {
  display: flex;
  align-items: center;
  div {
    flex: 3;
  }
  p {
    flex: 3;
    text-align: center;
    padding: 2px 0;
    margin: 0;
  }
}
.print-top-info {
  display: flex;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
  li {
    width: 33.33%;
    list-style-type: none;
    padding: 5px;
    font-size: 10px;
    color: #000;
  }
}
.table-footer {
  width: 1080px;
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  p {
    width: 33.33%;
  }
}
</style>

<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2022-07-20 17:18:13
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/arrival/list/print.vue
-->
<template>
  <a-modal v-model="visible" title="打印到货通知单" v-if="visible" @cancel="close" :footer="null" centered width="70%">
    <div style="display: flex;justify-content: flex-end;">
      <a-button type="primary" class="no-print" @click="printBtn">打印</a-button>
    </div>
    <div id="printBox">
      <div v-for="(item, index) in printData" :key="index">
        <div>
          <DIV style="LINE-HEIGHT: 30px" class="size16" align="center"
            ><STRONG>
              <h2 color="#000">深圳民爆光电股份有限公司</h2>
              <H3 color="#000">生产领料单</H3>
            </STRONG></DIV
          >
          <table border="0" cellSpacing="0" cellPadding="0" width="100%">
            <tbody>
              <tr>
                <td width="43%">
                  <font color="#0000FF"
                    >供应商代码:<SPAN id="rpt_Pro_Order_List_ctl00_lbl_eShop_Name">{{ item.SupplierCode }}</SPAN></font
                  >
                </td>
                <td width="33%">
                  <!-- <font color="#0000FF">发货单号：<SPAN>2011050810372</SPAN></font> -->
                </td>
                <td>
                  <font color="#0000FF">打印时间:{{ timeStr(item.PrintDate) }}</font>
                </td>
              </tr>
              <tr>
                <td>
                  <font color="#0000FF"
                    >供应商全称：<SPAN>{{ item.SupplierName }}</SPAN></font
                  >
                </td>
                <td>
                  <font color="#0000FF"
                    >对方单号:<SPAN>{{ item.OrderNo }}</SPAN></font
                  >
                  <font color="#0000FF"></font>
                </td>
                <td>
                  <font color="#0000FF">单号:{{ item.DocNo }}</font>
                </td>
              </tr>
            </tbody>
          </table>
          <table cellSpacing="0" cellPadding="1" width="100%" style="border-collapse:collapse">
            <thead>
              <tr>
                <td width="33%"><b>入库单编号</b></td>
                <td width="33%"><b>产品名称</b></td>
                <td width="32%"><b>数量</b></td>
              </tr>
              <!-- <tr style="border:1px #000 solid">
                <td style="border:1px #000 solid" v-for="(item, index) in columns" :key="index" :width="item.width">
                  <DIV align="center"
                    ><b>{{ item.title }}</b></DIV
                  >
                </td>
              </tr> -->
            </thead>
            <tbody class="table-tbody">
              <!-- <tr v-for="items in item.dataSource" :key="items.MitemCode">
                <td width="10%" align="center">{{ items.OrderNo }}</td>
                <td width="10%" align="center">{{ items.ItemCode }}</td>
                <td width="20%" align="center">{{ items.ItemDescription }}</td>
                <td width="20%" align="center">{{ items.ItemSpecification }}</td>
                <td width="5%" align="center">{{ items.Unit }}</td>
                <td width="5%" align="center">{{ items.Qty }}</td>
                <td width="10%" align="center">{{ items.DocNo }}</td>
                <td width="10%" align="center">{{ items.Remark }}</td>
                <td width="5%" align="center">{{ items.DrawingNo }}</td>
                <td width="5%" align="center">{{ items.OK }}</td>
                <td width="5%" align="center">{{ items.NG }}</td>
              </tr> -->
              <tr>
                <td width="33%">1</td>
                <td width="33%">产品A</td>
                <td width="34%">100</td>
              </tr>
              <tr>
                <td width="33%">2</td>
                <td width="33%">产品B</td>
                <td width="34%">200</td>
              </tr>
            </tbody>
            <tfoot class="table-tfoot">
              <tr>
                <th width="33%" colspan="1"><b>制单：</b></th>
              </tr>
              <tr>
                <th width="33%" colspan="1"><b>核准：</b></th>
              </tr>
              <tr>
                <td width="33%" colspan="1"><b>品质:</b></td>
              </tr>
            </tfoot>
          </table>
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
    width: "10%",
  },
  {
    title: "品号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "center",
    width: "10%",
  },
  {
    title: "品名",
    dataIndex: "ItemDescription",
    scopedSlots: { customRender: "ItemDescription" },
    align: "center",
    width: "13%",
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width: "18%",
  },
  {
    title: "单位",
    dataIndex: "Unit",
    scopedSlots: { customRender: "Unit" },
    align: "center",
    width: "5%",
  },
  {
    title: "交货数",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: "5%",
  },
  {
    title: "业务单号",
    dataIndex: "DocNo",
    scopedSlots: { customRender: "DocNo" },
    align: "center",
    width: "9%",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
    width: "10%",
  },
  {
    title: "图号",
    dataIndex: "DrawingNo",
    scopedSlots: { customRender: "DrawingNo" },
    align: "center",
    width: "10%",
  },
  {
    title: "OK",
    dataIndex: "OK",
    scopedSlots: { customRender: "OK" },
    align: "center",
    width: "5%",
  },
  {
    title: "NG",
    dataIndex: "NG",
    scopedSlots: { customRender: "NG" },
    align: "center",
    width: "5%",
  },
];
import { splitData } from "@/utils/util";
import { getLodop } from "@/utils/LodopFuncs"; //导入模块
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
    printBtn() {
      let LODOP = getLodop();
      LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_无边线表格");
      LODOP.ADD_PRINT_TABLE(50, 10, "50%", 220, document.getElementById("printBox").innerHTML);
      //LODOP.SET_PRINT_STYLEA(0,"Top2Offset",-40); //这句可让次页起点向上移
      LODOP.ADD_PRINT_HTM(2, 0, "50%", 200, "<body style='margin-top:0'>表格后面用<font color=blue>ADD_PRINT_HTM</font>附加其它备注</body>");

      LODOP.SET_PRINT_STYLEA(0, "LinkedItem", -1);
      LODOP.PREVIEW();
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
.table-tbody td {
  border: 1px solid #000;
}
.table-tfoot {
  width: 1080px;
  position: absolute;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  tr {
    width: 33.33%;
  }
}
</style>

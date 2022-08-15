<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2022-07-26 16:25:08
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/arrival/list/print.vue
-->
<template>
  <a-modal v-model="visible" title="打印到货通知单" v-if="visible" @cancel="close" :footer="null" centered width="70%" :loading="loading">
    <div style="display: flex;justify-content: flex-end;">
      <a-button type="primary" class="no-print" @click="printBtn">打印</a-button>
    </div>
    <div id="printBox">
      <div v-for="(item, index) in listData" :key="index">
        <div :id="'div1_' + index">
          <DIV style="LINE-HEIGHT: 30px;" class="size16" align="center"
            ><STRONG
              ><font color="#000000" size="5" style="font-weight:700;">{{ item.company.CompanyName }}</font></STRONG
            ></DIV
          >
          <DIV style="LINE-HEIGHT: 30px;" class="size16" align="center"
            ><STRONG><font color="#000000" size="4" style="font-weight:700;">到货通知单</font></STRONG></DIV
          >
          <TABLE  cellSpacing="0" cellPadding="1" width="100%" style="border-collapse:collapse">
            <TBODY>
              <TR>
                <TD width="43%"
                  ><font color="#000000" size="1"
                    >供应商代码: <SPAN id="rpt_Pro_Order_List_ctl00_lbl_eShop_Name">{{ item.infoData.SupplierCode }}</SPAN></font
                  ></TD
                >
                <TD width="33%"
                  ><font color="#000000"><SPAN></SPAN></font
                ></TD>
                <TD
                  ><font color="#000000" size="1">打印时间: {{ item.infoData.PrintDate }}</font></TD
                ></TR
              >
              <TR>
                <TD style="padding-top:10px"
                  ><font color="#000000" size="1"
                    >供应商全称: <SPAN>{{ item.infoData.SupplierName }}</SPAN></font
                  ></TD
                >
                <TD style="padding-top:10px"
                  ><font color="#000000" size="1"
                    >对方单号: <SPAN>{{ item.infoData.OrderNo }}</SPAN></font
                  ></TD
                >
                <TD style="padding-top:10px"
                  ><font color="#000000" size="1">单号: {{ item.infoData.DocNo }}</font></TD
                ></TR
              >
            </TBODY></TABLE
          >
        </div>
        <div :id="'div3_' + index">
          <table cellSpacing="0" cellPadding="1" width="100%" style="border-collapse:collapse">
            <tr style="border:1px #000 solid;font-size:11px">
              <TD width="10%">
                <DIV align="center"><b>暂放位置</b></DIV></TD
              >
              <TD width="20%">
                <DIV align="center"
                  ><b>{{ item.infoData.SupplierCode }}</b></DIV
                ></TD
              >
              <TD width="10%">
                <DIV align="center"><b>交货日期</b></DIV></TD
              >
              <TD width="20%">
                <DIV align="center"
                  ><b>{{ item.infoData.PrintDate }}</b></DIV
                ></TD
              >
              <TD width="10%">
                <DIV align="center"><b>工单备注</b></DIV></TD
              >
              <TD width="20%">
                <DIV align="center"><b></b></DIV
              ></TD>
              <TD width="10%">
                <DIV align="center"><b>检验结果</b></DIV></TD
              >
            </tr>
          </table>
        </div>
        <div :id="'div2_' + index">
          <table cellSpacing="0" cellPadding="1" width="100%" style="border-collapse:collapse">
            <thead>
              <tr style="border:1px #000 solid;font-size:11px">
                <TD width="12%">
                  <DIV align="center"><b>采购订单号</b></DIV></TD
                >
                <TD width="10%">
                  <DIV align="center"><b>品号</b></DIV></TD
                >
                <TD width="15%">
                  <DIV align="center"><b>品名</b></DIV></TD
                >
                <TD width="20%">
                  <DIV align="center"><b>规格</b></DIV></TD
                >
                <TD width="5%">
                  <DIV align="center"><b>单位</b></DIV></TD
                >
                <TD width="5%">
                  <DIV align="center"><b>交货数</b></DIV></TD
                >
                <TD width="10%">
                  <DIV align="center"><b>业务单号</b></DIV></TD
                >
                <TD width="5%">
                  <DIV align="center"><b>备注</b></DIV></TD
                >
                <TD width="10%">
                  <DIV align="center"><b>图号</b></DIV></TD
                >
                <TD width="4%">
                  <DIV align="center"><b>OK</b></DIV></TD
                >
                <TD width="4%">
                  <DIV align="center"><b>NG</b></DIV></TD
                >
              </tr>
            </thead>
            <tbody class="table-tbody">
              <tr v-for="items in item.dataSource" :key="items.MitemCode" style="border:1px #000 solid;font-size:11px">
                <td style="border:1px #000 solid" align="center">{{ items.PuchaseOrderNo }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.ItemCode }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.ItemDescription }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.ItemSpecification }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.Unit }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.Qty }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.XdemandDocNo }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.Remark }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.DrawingNo }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.OK == true ? "✔️" : "" }}</td>
                <td style="border:1px #000 solid" align="center">{{ items.OK == true ? "✔️" : "" }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <TD colspan="10" format="#" align="center">
                  <p align="center">
                    <b  tdata="pageNO">第<font color="#0000FF" size="2" id="pageNO">#</font>页/</b><b tdata="pageCount">总<font color="#0000FF"  size="2" id="pageCount">##</font>页</b>
                  </p>
                </TD>
                <!-- <TD tdata="pageCount" format="#" align="right">
                  <p align="center">
                    <b>总<font color="#0000FF">##</font>页</b>
                  </p></TD
                > -->
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
    width: "5%",
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
    width: "15%",
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
    width: "20%",
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
    width: "10%",
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
    width: "5%",
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
var LODOP;
export default {
  props: ["printData"],
  data() {
    return {
      data: [],
      infoData: [],
      columns,
      loading: false,
      isSearch: false,
      isUserList: false,
      visible: true,
      barcodeValue: "",
      listData: [],
      dataSource: [],
      sheetTitle: "",
      barcodeOptions: {
        width: 50,
        height: 50,
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.getPrintData();
    });
  },
  methods: {
    splitData,
    timeStr(text) {
      console.log(text);
      console.log(text == undefined);
      if (text == null) {
        return "";
      }
      let str = text.split("T");
      let time = str[1].split(".");
      return str[0] + " " + time[0];
    },
    close() {
      this.$emit("closeModal");
      this.data = [];
    },
    printBtn() {
      LODOP = getLodop();
      if (!LODOP && document.readyState !== "complete") {
        this.$warning({
          title: "提示",
          content: "本机未安装Lodop控件,请先下载安装",
          onOk() {
            window.open("http://192.168.1.245:8080/static/CLodop_Setup_for_Win32NT.exe");
          },
        });
        return;
      }
      try {
        if (LODOP.VERSION) {
          if (LODOP.CVERSION) {
            LODOP.PRINT_INIT("到货通知单");
            var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>";
            LODOP.SET_PRINT_PAGESIZE(0, 2100, 1480, ""); //设置纸张A4打印 横向;
            for (let i = 0; i < this.listData.length; i++) {
              if (this.listData[i].company.LogoPath == "") {
                LODOP.ADD_PRINT_IMAGE(20, 60, 200, 30, "<img border='0' src='http://192.168.0.240:8080/static/mb.png' width='100' height='80'/>");
              } else {
                LODOP.ADD_PRINT_IMAGE(20, 60, 200, 30, `"<img border='0' :src='http://192.168.0.240:8080/${this.listData[i].company.LogoPath}' width='100' height='80'/>"`);
              }
              LODOP.SET_PRINT_STYLEA(0, "Stretch", 1); //(可变形)扩展缩放模式
              LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
              //标题
              LODOP.ADD_PRINT_HTM(26, "2%", "96%", 109, document.getElementById("div1_" + i).innerHTML);
              LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
              LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
              //暂放位置
              LODOP.ADD_PRINT_TABLE(115, "2%", "96%", 155, strStyle + document.getElementById("div3_" + i).innerHTML);
              LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
              LODOP.SET_PRINT_STYLEA(0, "LinkedItem", 1);
              //table
              // var stResult=LODOP.GET_VALUE("PRINTSETUP_PAGE_COUNT","0");//获取页数
              LODOP.ADD_PRINT_TABLE(130, "2%", "96%", 390, strStyle + document.getElementById("div2_" + i).innerHTML);
              console.log("pageNO====",document.getElementById("div2_" + i).innerHTML)
              LODOP.SET_PRINT_STYLEA(0, "Vorient", 3);
              LODOP.ADD_PRINT_TEXT(520, 100, "76.25%", 20, "制单:");
              LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
              LODOP.ADD_PRINT_TEXT(520, 300, "76.25%", 20, "核准:");
              LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
              LODOP.ADD_PRINT_TEXT(520, 500, "76.25%", 20, "品质:");
              LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
              LODOP.ADD_PRINT_HTM(1, 600, 300, 100, "总页号：<font color='#0000ff'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span></font>");
              LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
              LODOP.SET_PRINT_STYLEA(0, "Horient", 1);
              LODOP.NewPageA();
            }
            LODOP.PREVIEW();
            LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1);
            this.$message.success("打印成功!");
            this.$emit("closeModal");
          } else {
            this.$warning({
              title: "提示",
              content: "本机未安装Lodop控件,请先下载安装",
              onOk() {
                window.open("http://192.168.1.245:8080/static/CLodop_Setup_for_Win32NT.exe");
              },
            });
          }
        }
      } catch (err) {
        this.$message.error("打印出错了!");
      }
    },
    loadLodop() {
      window.open("http://192.168.1.245:8080/static/CLodop_Setup_for_Win32NT.exe");
    },
    getPrintData() {
      this.loading = true;
      console.log(this.printData);
      this.printData.forEach((item) => {
        let parmas = {
          docno: item.DocNo,
        };
        getArrivalList(parmas, "single").then((res) => {
          if (res.data.success) {
            let list = res.data.data.list;
            this.listData.push({
              company: res.data.data.company,
              dataSource: list,
              infoData: list[0],
            });
            this.loading = true;
          }
        });
      });
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
/deep/ .ant-modal-content {
  max-height: 800px;
  overflow: auto;
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
// .table-tfoot {
//   width: 1080px;
//   position: absolute;
//   bottom: 0px;
//   display: flex;
//   justify-content: space-between;
//   tr {
//     width: 33.33%;
//   }
// }
</style>

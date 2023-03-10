<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2023-03-09 18:07:09
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/specimen/registration/print.vue
-->
<template>
  <a-modal v-model="visible" title="物料样品标签打印" v-if="visible" @cancel="close" :footer="null" centered width="50%" :loading="loading">
    <div style="display: flex;justify-content: flex-end;">
      <a-button type="primary" class="no-print" @click="printBtn">打印</a-button>
    </div>
    <div id="printBox">
      <div v-for="(item, index) in dataSource" :key="index" :id="'div1_' + index">
        <div style="font-size:14px;text-align: center;font-weight: 700;width: 100%;margin:0 auto">
          <p style="margin:0 auto;">{{item.EnterpriseFullName}}(物料样品标签)</p>
        </div>
        <span style="font-size:12px;font-weight: 700;">流水号: {{ item.FlowCode }}</span>
        <table border="1" cellSpacing="0" cellPadding="1" width="100%" style="border-collapse:collapse" bordercolor="#333333">
          <tr>
            <td width="53" rowspan="2" style="font-size:12px;">样品类别</td>
            <td colspan="3" style="font-size:10px;">
              <div style="margin:0;padding:0" :id="'checkbox1_' + index">
                <span style="display: inline-block;float: right;line-height: 20px;font-size:10px;">(采购选)</span>
                <span @click="setChecked(0)"><input type="checkbox" id="cb1" name="cbClass" value="" />新产品</span>
                <span @click="setChecked(1)"><input type="checkbox" name="cbClass" value="" />版本升级</span>
                <span @click="setChecked(2)"><input type="checkbox" name="cbClass" value="" />更换供应商</span>
              </div>
            </td>
          </tr>
          <tr style="font-size:10px;">
            <td colspan="3">
              <div style="margin:0;padding:0">
                <span style="display: inline-block;float: right;line-height: 20px;font-size:10px;">(工程师勾选)</span>
                <!-- <span style="display: inline-block;float: right;line-height: 20px;font-size:8px;">未选默认深圳民爆,</span> -->
                <span @click="setChecked(3)"><input type="checkbox" name="cbClass" />深圳民爆</span>
                <span @click="setChecked(3)"><input type="checkbox" name="cbClass" />惠州民爆</span>
                <span @click="setChecked(4)"><input type="checkbox" name="cbClass" />惠州分公司</span>
                <span @click="setChecked(4)"><input type="checkbox" name="cbClass" />其他</span>
              </div>
            </td>
          </tr>
          <tr style="font-size:12px;height:25px;">
            <td>供应商</td>
            <td>{{ item.Supplier }}</td>
            <td>签样数量</td>
            <td>{{ item.Quantity }}</td>
          </tr>
          <tr style="font-size:12px;height:25px;">
            <td>品号</td>
            <td>{{ item.ItemCode }}</td>
            <td width="60px">图号</td>
            <td>{{ item.DrawingNo }}</td>
          </tr>
          <tr style="font-size:12px;height:25px;">
            <td>品名</td>
            <td colspan="3">{{ item.ItemName }}</td>
          </tr>
          <tr style="font-size:12px;height:50px;max-height: 50px;overflow: hidden;">
            <td>规格型号</td>
            <td colspan="3">
              <div style="height: 40px; overflow: hidden; word-break:break-all;">
                {{ item.ItemSpecification }}
              </div>
            </td>
          </tr>
          <tr style="font-size:12px;height:25px;">
            <td>签样结果</td>
            <td colspan="3"></td>
          </tr>

          <tr style="font-size:12px;">
            <td>外观</td>
            <td colspan="">
              <p style="margin:0;padding:0">
                <span><input type="checkbox" />OK</span>
                <span><input type="checkbox" />NG</span>
                <span><input type="checkbox" />试产样</span>
              </p>
            </td>
            <td>颜色</td>
            <td colspan="">
              <p style="margin:0;padding:0">
                <span><input type="checkbox" />OK</span>
                <span><input type="checkbox" />NG</span>
                <span><input type="checkbox" />试产样</span>
              </p>
            </td>
          </tr>

          <tr style="font-size:12px;">
            <td>结构</td>
            <td colspan="">
              <p style="margin:0;padding:0">
                <span><input type="checkbox" />OK</span>
                <span><input type="checkbox" />NG</span>
                <span><input type="checkbox" />试产样</span>
              </p>
            </td>
            <td>电参数</td>
            <td colspan="">
              <p style="margin:0;padding:0">
                <span><input type="checkbox" />OK</span>
                <span><input type="checkbox" />NG</span>
                <span><input type="checkbox" />试产样</span>
              </p>
            </td>
          </tr>
          <tr style="font-size:12px;height:25px;">
            <td>不良原因</td>
            <td colspan="3"></td>
          </tr>
          <tr style="font-size:12px;">
            <!-- <td colspan="2">
              <p style="margin-bottom:0px;padding:0;height:14px;">采购员:{{ item.Purchaser }}</p>
              <p style="margin:0;padding:0;height:14px;">送样时间:{{ item.DatetimePurchaseDeliver }}</p>
            </td> -->
            <td colspan="2" style="text-align: center">
              品质确认
            </td>
            <td colspan="2" style="text-align: center">
              工程确认
            </td>
          </tr>
          <tr style="font-size:12px;">
            <td colspan="2">
              <p style="margin-bottom:0px;padding:0;height:14px;"></p>
              <p style="margin:0;padding:0;font-size:12px;height:14px;">
                <span style="display: inline-block;float: right;line-height: 14px;font-size:12px;">{{ item.DatetimeSign || "年\u2003\u2003\u2003\u2003月\u2003\u2003\u2003\u2003日" }}</span>
                <span>签样时间:</span>
              </p>
            </td>
            <td colspan="2">
              <p style="margin-bottom:0px;padding:0;height:14px;"></p>
              <p style="margin:0;padding:0;font-size:12px;height:14px;">
                <span style="display: inline-block;float: right;line-height: 14px;font-size:12px;">{{ item.DatetimeSign || "年\u2003\u2003\u2003\u2003月\u2003\u2003\u2003\u2003日" }}</span>
                <span>签样时间:</span>
              </p>
            </td>
            <!-- <td>
              <p style="margin-bottom:0px;padding:0;height:14px;"></p>
              <p style="margin:0;padding:0;font-size:12px;height:14px;">{{ item.DatetimeSign || "\u2003\u2003\u2003\u2003\u2003\u2003\u2003\u2003\u2003\u2003\u2003\u2003年\u2003\u2003\u2003\u2003月\u2003\u2003\u2003\u2003日" }}</p>
            </td> -->
          </tr>
        </table>

        <!-- <a-descriptions bordered :column="2">
        <a-descriptions-item label="样品类别" :span="2">
          <a-checkbox>
            新产品
          </a-checkbox>
          <a-checkbox>
            版本升级
          </a-checkbox>
          <a-checkbox>
            更换供应商
          </a-checkbox>
          <a-checkbox> 惠州民爆 </a-checkbox
          ><a-checkbox>
            惠州分公司
          </a-checkbox>
          <a-checkbox>
            其他
          </a-checkbox>
        </a-descriptions-item>
        <a-descriptions-item label="供应商" :span="2">
          {{ dataSource.Supplier }}
        </a-descriptions-item>
        <a-descriptions-item label="品号">
          {{ dataSource.ItemCode }}
        </a-descriptions-item>
        <a-descriptions-item label="图号">
          {{ dataSource.DrawingNo }}
        </a-descriptions-item>
        <a-descriptions-item label="规格型号">
          {{ dataSource.ItemSpecification }}
        </a-descriptions-item>
        <a-descriptions-item label="签样结果">
          <a-checkbox>
            外观
          </a-checkbox>
          <a-checkbox>
            结构
          </a-checkbox>
          <a-checkbox>
            电参数
          </a-checkbox>
          <a-checkbox>
            OK
          </a-checkbox
          ><a-checkbox>
            NG
          </a-checkbox>
          <a-checkbox>
            其他
          </a-checkbox>
        </a-descriptions-item>
        <a-descriptions-item>
          <template v-slot:label>
            <p>采购员:</p>
            <p>送样时间:</p>
          </template>
          <p>{{ dataSource.Purchaser }}</p>
          <p>{{ dataSource.DatetimePurchaseDeliver }}</p>
        </a-descriptions-item>
        <a-descriptions-item>
          <template v-slot:label>
            <p>工程师:</p>
            <p>承认时间:</p>
          </template>
          <p>{{ dataSource.SignEngineer }}</p>
          <p>{{ dataSource.DatetimeSign }}</p>
        </a-descriptions-item>
        <a-descriptions-item label="备注">{{dataSource.Remark}}</a-descriptions-item>
      </a-descriptions> -->
      </div>
    </div>
  </a-modal>
</template>

<script>
import { getDepartmentApi } from "@/services/web.js";
import { splitData } from "@/utils/util";
import { getLodop } from "@/utils/LodopFuncs"; //导入模块
export default {
  props: ["registerid"],
  data() {
    return {
      cb1: false,
      data: [],
      infoData: [],
      loading: false,
      isSearch: false,
      isUserList: false,
      visible: true,
      barcodeValue: "",
      listData: [],
      dataSource: [],
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
    setChecked(index) {
      console.log(index);
      var itemElements = document.getElementsByName("cbClass");
      for (let i = 0; i < itemElements.length; i++) {
        if (itemElements[i].checked) {
          itemElements[i].setAttribute("checked", "checked");
        } else {
          itemElements[i].removeAttribute("checked");
        }
      }
    },
    printBtn() {
      this.dataSource.forEach((item, index) => {
        let id = "checkbox1_" + index;
        var inputList = document.getElementById(id).getElementsByTagName("input");
        console.log("inputList===", inputList);
        let checkedFlag = true;
        // console.log("inputList", inputList);
        for (let i = 0; i < inputList.length; ++i) {
          console.log("inputList===", inputList[i]);
          if (inputList[i].checked) {
            checkedFlag = false;
          }
        }
        // this.$message.error("请先勾选采购必填项,样品类别!");
        // console.log("checkedFlag===", checkedFlag);
        if (checkedFlag) {
          item.checkedFlag = true;
        } else {
          item.checkedFlag = false;
        }
      });
      for (let i = 0; i < this.dataSource.length; ++i) {
        if (this.dataSource[i].checkedFlag) {
          this.$message.error(this.dataSource[i].FlowCode + ",请先勾选采购必填项,样品类别!");
          return;
        }
      }
      // console.log("a===",a)
      // console.log(document.getElementsByClassName("checkbox-content").getElementsByTagName("input"))
      var LODOP;
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
            LODOP.PRINT_INIT("物料样品标签");
            LODOP.SET_PRINT_PAGESIZE(0, 1000, 850, ""); //设置纸张A4打印 横向;
            // LODOP.SET_PRINT_COPIES(this.dataSource.length); //设置打印三份
            var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>";
            for (let i = 0; i < this.dataSource.length; i++) {
              LODOP.NewPage();
              console.log("dom===", document.getElementById("div1_" + i));
              LODOP.ADD_PRINT_HTM(2, 5, "96%", 850, strStyle + document.getElementById("div1_" + i).innerHTML);
            }
            LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Full-Page");
            LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", 1);
            LODOP.PREVIEW();
            this.$message.success("打印成功!");
            this.$emit("closeModal");
            this.$emit("success");
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
    getPrintData() {
      this.loading = true;
      this.registerid.forEach((item) => {
        let params = {
          registerid: item,
        };
        getDepartmentApi(params, "printregister").then((res) => {
          if (res.data.success) {
            console.log("更新====", res);
            this.dataSource.push(res.data.data);
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

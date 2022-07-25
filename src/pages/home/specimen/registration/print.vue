<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2022-07-23 17:39:15
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
        <table cellSpacing="0" cellPadding="1" border="1" width="100%" style="border-collapse:collapse">
          <div style="font-size:14px;text-align: center;font-weight: 700;">
            <p style="margin:0 auto;">深圳民爆光电股份有限公司</p>
            <p style="margin:0 auto;">物料样品标签</p>
          </div>
          <span style="font-size:12px;font-weight: 700;">流水号: {{ item.FlowCode }}</span>
          <tr style="font-size:10px;height:30px">
            <td width="50">样品类别</td>
            <td colspan="3">
              <p style="margin:0;padding:0">
                <span><input type="checkbox" name="cb4" value="" />新产品</span>
                <span><input type="checkbox" name="cb4" value="" />版本升级</span>
                <span><input type="checkbox" name="cb4" value="" />更换供应商</span>
              </p>
              <p style="margin:0;padding:0">
                <span><input type="checkbox" name="cb4" value="" />惠州民爆</span>
                <span><input type="checkbox" name="cb4" value="" />惠州分公司</span>
                <span><input type="checkbox" name="cb4" value="" />其他</span>
              </p>
            </td>
          </tr>
          <tr style="font-size:10px;height:25px;">
            <td>供应商</td>
            <td colspan="3">{{ item.Supplier }}</td>
          </tr>
          <tr style="font-size:10px;height:25px;">
            <td>品号</td>
            <td>{{ item.ItemCode }}</td>
            <td width="50px">图号</td>
            <td width="140px">{{ item.DrawingNo }}</td>
          </tr>
          <tr style="font-size:10px;height:25px;">
            <td>品名</td>
            <td colspan="3">{{ item.ItemName }}</td>
          </tr>
          <tr style="font-size:10px;height:50px;max-height: 50px;overflow: hidden;">
            <td>规格型号</td>
            <td colspan="3">
              <div
                style="height: 40px;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;  /* 内容自动换行 */
			-webkit-box-orient: vertical; /* 垂直排列 */
			display: -webkit-box;	
			-webkit-line-clamp:2;"
              >
                {{ item.ItemSpecification }}
              </div>
            </td>
          </tr>
          <tr style="font-size:10px;">
            <td>签样结果</td>
            <td colspan="3">
              <p>
                <span><input type="checkbox" name="cb4" value="" />外观</span>
                <span><input type="checkbox" name="cb4" value="" />结构</span>
                <span><input type="checkbox" name="cb4" value="" />电参数</span>
                <span><input type="checkbox" name="cb4" value="" />OK</span>
                <span><input type="checkbox" name="cb4" value="" />NG</span>
                <span><input type="checkbox" name="cb4" value="" />其他</span>
              </p>
            </td>
          </tr>
          <tr style="font-size:10px;">
            <td>
              <p style="margin-bottom:5px;padding:0">
                采购员:
              </p>
              <p style="margin:0;padding:0">送样时间:</p>
            </td>
            <td>
              <p style="margin-bottom:5px;padding:0">{{ item.Purchaser }}</p>
              <p style="margin:0;padding:0">{{ item.DatetimePurchaseDeliver }}</p>
            </td>
            <td rowspan="2" colspan="2">
              <p>备注</p>
              <p>{{ item.Remark }}</p>
            </td>
          </tr>
          <tr style="font-size:10px;">
            <td>
              <p style="margin-bottom:5px;padding:0">
                工程师:
              </p>
              <p style="margin:0;padding:0">承认时间:</p>
            </td>
            <td>
              <p style="margin-bottom:5px;padding:0">{{ item.SignEngineer }}</p>
              <p style="margin:0;padding:0">{{ item.DatetimeSign }}</p>
            </td>
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
    printBtn() {
      var LODOP;
      LODOP = getLodop();
      try {
        if (!LODOP && document.readyState !== "complete") {
          this.$message.error("C-Lodop打印控件还没准备好，请稍后再试！");
          return;
        }
        if (LODOP.VERSION) {
          if (LODOP.CVERSION) {
            LODOP.SET_PRINT_COPIES(this.dataSource.length); //设置打印三份
            LODOP.PRINT_INIT("物料样品标签");
            LODOP.SET_PRINT_PAGESIZE(0, 1000, 850, ""); //设置纸张A4打印 横向;
            for (let i = 0; i < this.dataSource.length; i++) {
              LODOP.NewPage();
              var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>";
              console.log("dom===", document.getElementById("div1_" + i));
              LODOP.ADD_PRINT_HTM(5, 5, "98%", 840, strStyle + document.getElementById("div1_" + i).innerHTML);
            }
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
        let parmas = {
          registerid: item,
        };
        getDepartmentApi(parmas, "printregister").then((res) => {
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

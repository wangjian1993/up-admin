<!--
 * @Author: max
 * @Date: 2021-09-09 14:55:10
 * @LastEditTime: 2022-04-20 17:25:02
 * @LastEditors: max
 * @Description: 导入execl
 * @FilePath: /up-admin/src/pages/home/erp/BomList/ImportExecl.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入Bom号列表" @cancel="close" :footer="null" centered :width="800">
      <a-spin tip="导出中...." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
                <a-col :md="12" :sm="12">
                  <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select style="width: 150px" v-model="plantId" placeholder="请选择生产工厂">
                      <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="12">
                  <a-form-item label="导入文件" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <div style="display:flex;">
                      <a-upload name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload" :remove="removeFile" :fileList="fileList">
                        <a-button> <a-icon type="upload" />添加excel文件 </a-button>
                      </a-upload>
                    </div>
                    <a @click="downloadExcel">模板下载</a>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
          <!-- 列表 -->
          <div class="tab">
            <a-table :columns="columns" :data-source="excelArray" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(errorList) => errorList.bom" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ index + 1 }}</span>
                </div>
              </template>
            </a-table>
            <a-button :disabled="excelArray.length == 0" icon="export" type="primary" @click="handleExcel" style="margin-left: 8px">导出Excel</a-button>
          </div>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import excel from "@/utils/xlsxTool.js";
import { exportjsontoexcelMore } from "@/utils/ExportExcel";
import { getERPReportAction } from "@/services/erp.js";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "10%",
  },
  {
    title: "Bom号",
    dataIndex: "bom",
    align: "center",
  },
];
export default {
  props: ["plantList"],
  data() {
    return {
      size: "small",
      visible: true,
      errorList: [],
      pagination: false,
      tableTitle: [],
      columns,
      tableData: [],
      plantId: "",
      lineList: [],
      lineId: "",
      people: "",
      fileList: [],
      isUpload: false,
      excelArray: [],
      selectedRowKeys: [],
    };
  },
  created() {},
  methods: {
    downloadExcel() {
      // window.location.open = "./Upload/excel/20211008/物料需求计划导入模板.xlsx";
      window.open("./Upload/excel/bom号.xlsx", "_blank");
      // let a = document.createElement("a");
      // a.href = "./Upload/excel/20211008/物料需求计划导入模板.xlsx";
      // a.click();
    },
    //移除文件
    removeFile() {
      this.fileList = [];
      this.errorList = [];
    },
    close() {
      this.$emit("closeModal");
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //导入execl
    beforeUpload(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      let fileList = [...this.fileList, file];
      this.fileList = fileList.slice(-1);
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file);
        this.file = file;
        this.isUpload = true;
      } else {
        this.$Notice.warning({
          title: "文件类型错误",
          desc: "文件：" + file.name + "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。",
        });
      }
      return false;
    },
    // 读取文件
    readFile(file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        const tableTitle = header.map((item) => {
          let key = item.replace(/[\r\n]/g, "");
          return { key: key };
        });
        this.tableData = results; //这里的tableData就是拿到的excel表格中的数据
        this.tableTitle = tableTitle;
        console.log(this.tableData);
        this.tableData.forEach((item) => {
          this.excelArray.push({
            bom: item["Bom号"],
          });
        });
        this.isUpload = false;
      };
    },
    getBomInfo(bom) {
      return new Promise((resolve) => {
        let parmas = {
          pageindex: 1,
          pagesize: 1,
          plantid: this.plantId,
          itemcode: bom,
          itemname: "",
          drawingno: "",
          shortcut: "",
          approvestatus: "",
          itemspecification: "",
          itemcodesign: "包含(A,B,C)",
          itemspecificationsign: "",
          itemnamesign: "",
          drawingnosign: "",
          shortcutsign: "",
        };
        getERPReportAction(parmas, "getbominfo").then((res) => {
          if (res.data.success) {
            let list = res.data.data.list[0];
            resolve(list);
          }
        });
      });
    },
    async handleExcel() {
      if (this.plantId == "") {
        return this.$message.warning("请选择生产工厂");
      }
      this.isUpload = true;
      let arr = [];
      let promiseList = [];
      let sortArray = []
      this.excelArray.forEach((item) => {
        this.treeArray = [];
        this.excelList = [];
        arr.push(this.waitData(item.bom));
        sortArray.push(item.bom)
        this.getBomInfo(item.bom).then((res) => {
          promiseList.push(res);
        });
        // console.log("arr===", arr);
      });
      //跳转数据顺序
      Promise.all(arr)
        .then((res) => {
          // let list = res.flat();
          console.log("promiseList1", promiseList);
          console.log("sortArray",sortArray);
          promiseList.sort((a, b) => {
            return sortArray.indexOf(a.ITEM_CODE) - sortArray.indexOf(b.ITEM_CODE);
          });
          console.log("promiseList2", promiseList);
          res.forEach((items, index) => {
            // console.log("====", items);
            promiseList[index].childrenArray = items;
          });
          // console.log("promiseList---", promiseList);
          this.formattingExcel(promiseList).then((r) => {
            try {
              var timestamp = Date.parse(new Date());
              exportjsontoexcelMore({
                dataList: r,
                bookType: "xlsx", // 导出类型
                filename: `BOM批量导出_${timestamp}`, // 导出标题名
              });
              this.$message.success("导出数据成功!");
              this.$emit("closeModal");
            } catch (error) {
              console.log(error);
              this.$message.error("导出数据失败");
            }
            this.isUpload = false;
          });
        })
        .catch((err) => {
          //  loading.close();
          console.log("error", err);
        });
    },
    async formattingExcel(excelData) {
      return new Promise((resolve) => {
        console.log("excelData", excelData);
        let excelArray = [];
        let formStyle = {};
        const sheetCols = [
          { wch: 3 }, // 序号
          { wch: 12 }, // 阶次
          { wch: 12 }, // 类型
          { wch: 32 }, // 上阶BOM号
          { wch: 10 }, // 品号
          { wch: 3 }, // 料名
          { wch: 3 }, //  产品规格
          { wch: 3 }, // 单位
          { wch: 8 }, // 价格来源
          { wch: 8 }, // E10单价
        ];
        excelData.forEach((item) => {
          console.log("item===", item);
          let _data = [];
          let mergeTitle = []; //合并单元格
          for (let i = 0; i < 3; i++) {
            mergeTitle.push({
              s: { r: i, c: 0 },
              e: { r: i, c: 8 },
            });
          }
          _data.push([`产品代码:  ${item.ITEM_CODE}`, null, null, null, null, null, null, null, null]);
          _data.push([`产品名称:  ${item.ITEM_NAME}`, null, null, null, null, null, null, null, null]);
          _data.push([`产品规格:   ${item.ITEM_SPECIFICATION}`, null, null, null, null, null, null, null, null]);
          _data.push(["阶层", "元件品号", "元件品名", "元件规格", "元件图号", "单位", "组成用量", "底数", "插件位置"]);
          item.childrenArray.map((items) => {
            let array = [];
            if (items.LOWLEVEL) {
              var str = "";
              for (let i = 1; i <= items.LOWLEVEL; i++) {
                str += ".";
              }
              array.push(str + items.LOWLEVEL);
            }
            // array.push(items.LOWLEVEL);
            array.push(items.ITEM_CODE);
            array.push(items.ITEM_NAME);
            array.push(items.ITEM_SPECIFICATION);
            array.push(items.DRAWING_NO);
            array.push(items.UNIT_NAME);
            array.push(items.QTY_PER);
            array.push(items.DENOMINATOR);
            array.push(items.COMPONENT_LOCATION);
            _data.push(array);
          });
          _data.push(["", "制单:", "", "审核:", "", "核准:", "", "日期:", ""]);
          let merges2 = [];
          let merges = [...mergeTitle, ...merges2]; // 合并单元格
          excelArray.push({
            Sheet: item.ITEM_CODE, // 下方tab切换名称
            data: _data, // 表格数据
            merges, //  合并单元格
            autoWidth: false, // 自适应宽度
            formStyle: formStyle, // 特殊行或列样式
            sheetCols,
          });
          console.log(excelArray);
        });
        resolve(excelArray);
      });
    },
    async waitData(code) {
      let n = await this.getExcelData(code);
      return n;
    },
    async waitInfo(code) {
      let n = await this.getBomInfo(code);
      console.log("n====", n);
      return n;
    },
    initTree(parent_id) {
      // console.log("parent_id--",parent_id)
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.excelList.filter((item) => item.LAST_ITEM_CODE == parent_id);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        childrens: this.initTree(item.ITEM_CODE),
      }));
    },
    steamrollArray(arr) {
      arr.forEach((el) => {
        this.treeArray.push(el);
        el.childrens && el.childrens.length > 0 ? this.steamrollArray(el.childrens) : ""; // 子级递归
      });
      return this.treeArray;
    },
    getExcelData(itemcode) {
      return new Promise((resolve) => {
        this.treeArray = [];
        this.excelList = [];
        let params = {
          plantid: this.plantId,
          itemcode: itemcode,
        };
        getERPReportAction(params, "getbomchildlevel").then((res) => {
          this.excelList = res.data.data.list;
          let treeList = this.initTree(itemcode);
          // console.log("treeList---", treeList);
          this.treeArray = [];
          let parseList = this.steamrollArray(treeList);
          // console.log("parseList---", parseList);
          resolve(parseList);
        });
      });
    },
  },
  components: {},
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-upload-list-item-name {
  white-space: normal;
}
</style>

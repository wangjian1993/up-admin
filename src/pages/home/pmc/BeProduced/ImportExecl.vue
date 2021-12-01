<!--
 * @Author: max
 * @Date: 2021-10-18 08:33:37
 * @LastEditTime: 2021-12-01 16:53:22
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/BeProduced/ImportExecl.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入待产计划与待排计划需求" @cancel="close" @ok="handleOk" centered width="60%">
      <div>
        <a-form layout="horizontal">
          <div>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantid']" style="width: 150px" placeholder="请选择生产工厂" @change="plantChange">
                    <a-select-option v-for="item in plantArray" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                  <div style="display:flex;">
                    <a-upload name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload" :remove="removeFile" :fileList="fileList1">
                      <a-button> <a-icon type="upload" />导入待产计划 </a-button>
                    </a-upload>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                  <div style="display:flex;">
                    <a-upload name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload2" :remove="removeFile2" :fileList="fileList2">
                      <a-button> <a-icon type="upload" />导入待排产计划 </a-button>
                    </a-upload>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                  <div style="display:flex;">
                    <a-upload name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload3" :remove="removeFile3" :fileList="fileList3">
                      <a-button> <a-icon type="upload" />销售订单原材料导入 </a-button>
                    </a-upload>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
        <!-- 列表 -->
        <div class="tab" v-if="this.errorList.length != 0">
          <a-table :columns="columns" :data-source="errorList" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(errorList) => errorList.Id" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ index + 1 }}</span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { setMitemPlanAction } from "@/services/web.js";
import excel from "@/utils/xlsxTool.js";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "10%",
  },
  {
    title: "错误信息",
    dataIndex: "ErrorMsg",
    align: "center",
  },
];
export default {
  props: ["plantArray"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      errorList: [],
      pagination: false,
      tableTitle1: [],
      tableData1: [],
      tableTitle2: [],
      tableData2: [],
      tableTitle3: [],
      tableData3: [],
      plantId: "",
      week: "",
      fileList1: [],
      fileList2: [],
      fileList3: [],
    };
  },
  created() {
    console.log(this.formatDate(44530));
  },
  methods: {
    //移除文件
    removeFile() {
      this.fileList1 = [];
      this.tableData1 = []; //这里的tableData就是拿到的excel表格中的数据
      this.tableTitle1 = [];
    },
    //删除excel
    removeFile2() {
      this.fileList2 = [];
      this.tableData2 = []; //这里的tableData就是拿到的excel表格中的数据
      this.tableTitle2 = [];
    },
    removeFile3() {
      this.fileList3 = [];
      this.tableData3 = []; //这里的tableData就是拿到的excel表格中的数据
      this.tableTitle3 = [];
    },
    //关闭弹窗
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    //工厂选择
    plantChange(e) {
      this.plantId = e;
    },
    //周选择
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    //时间格式化
    formatLongDate(date) {
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();
      let myHour = date.getHours();
      let myMin = date.getMinutes();
      let mySec = date.getSeconds();
      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      if (myHour < 10) {
        myHour = "0" + myHour;
      }
      if (myMin < 10) {
        myMin = "0" + myMin;
      }
      if (mySec < 10) {
        mySec = "0" + mySec;
      }
      return myyear + "/" + mymonth + "/" + myweekday;
    },
    //时间格式化
    formatDate(numb, format = "/") {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      console.log(time);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date);
    },
    //确认提交
    handleOk() {
      this.errorList = [];
      //提交的数据格式
      if (this.plantId == "") {
        this.$message.warning("请先选择生产工厂!");
        return;
      }
      // if (this.tableData1.length === 0) {
      //   this.$message.warning("请先导入待产计划!");
      //   return;
      // }
      if (this.tableData2.length === 0) {
        this.$message.warning("请先导入待排产计划!");
        return;
      }
      // let parmas = [];
      //合并表格头部和内容数据
      let arr1 = [];
      let table1 = this.tableData1;
      for (let i = 0; i < table1.length; i++) {
        let res = table1[i];
        let obj = {};
        this.tableTitle1.forEach((item) => {
          obj[item["key"]] = res[item["key"]] || "";
        });
        arr1.push(obj);
      }
      let arr2 = [];
      let table2 = this.tableData2;
      for (let i = 0; i < table2.length; i++) {
        let res = table2[i];
        let obj = {};
        this.tableTitle2.forEach((item) => {
          obj[item["key"]] = res[item["key"]] || "";
        });
        arr2.push(obj);
      }
      let arr3 = [];
      let table3 = this.tableData3;
      for (let i = 0; i < table3.length; i++) {
        let res = table3[i];
        let obj = {};
        this.tableTitle3.forEach((item) => {
          obj[item["key"]] = res[item["key"]] || "";
        });
        arr3.push(obj);
      }
      //拼接后台数据
      let WaitProctionDatas = this.paramsList(arr1, "待产计划");
      let WaitSchecduleDatas = this.paramsList(arr2, "待排产计划");
      let SalesSchacduleDatas = this.paramsList(arr3, "销售订单原材料");
      console.log(WaitProctionDatas);
      console.log(WaitSchecduleDatas);
      let data = {
        PlantId: this.plantId,
        WaitProctionDatas: WaitProctionDatas,
        WaitSchecduleDatas: WaitSchecduleDatas,
        SalesSchacduleDatas: SalesSchacduleDatas,
      };
      if (this.errorList.length == 0) {
        this.submitExecl(data);
      } else {
        this.$message.error("计划格式错误,请修改");
      }
    },
    //上传导入数据
    submitExecl(parmas) {
      setMitemPlanAction(parmas, "import").then((res) => {
        if (res.data.success) {
          this.$message.success("导入成功!");
          this.close();
        } else {
          // this.$message.info(res.data.message.content);
          this.errorList = res.data.data.list;
        }
      });
    },
    //格式excel数据
    paramsList(arr, content) {
      let totalArray = [];
      arr.forEach((item, index) => {
        let list = {};
        for (let key in item) {
          switch (key) {
            case "工单号":
              list.MoCode = item[key];
              break;
            case "需求数量":
            case "数量":
              if (typeof item[key] !== "number" && item[key] !== "") {
                this.errorList.push({
                  ErrorMsg: `${content},第${index + 1}行,需求数量:数据'${item[key]}'错误,必须为数字`,
                });
              } else {
                list.RequirementQty = Number(item[key]);
              }
              break;
            case "开工日期":
              if (item[key] != "") {
                if (typeof item[key] === "object") {
                  list.CommencementDate = this.formatLongDate(item[key]);
                }
                if (typeof item[key] === "string") {
                  try {
                    let date = new Date(item[key]);
                    let formatDate = this.formatLongDate(date);
                    console.log(Date);
                    if (formatDate !== "NaN/NaN/NaN") {
                      list.CommencementDate = formatDate;
                    } else {
                      this.errorList.push({
                        ErrorMsg: `${content},第${index + 1}行,开工日期:数据'${item[key]}'错误,必须为2020-01-01或2020/01/01`,
                      });
                    }
                  } catch (error) {
                    this.errorList.push({
                      ErrorMsg: `${content},第${index + 1}行,开工日期:数据'${item[key]}'错误,必须为2020-01-01或2020/01/01`,
                    });
                  }
                }
              } else {
                list.CommencementDate = "";
              }
              break;
            case "需求日期":
              if (item[key] != "") {
                if (typeof item[key] === "object") {
                  list.RequirementDate = this.formatLongDate(item[key]);
                }
                if (typeof item[key] === "string") {
                  try {
                    let date = new Date(item[key]);
                    let formatDate = this.formatLongDate(date);
                    if (formatDate !== "NaN/NaN/NaN") {
                      list.CommencementDate = formatDate;
                    } else {
                      this.errorList.push({
                        ErrorMsg: `${content},第${index + 1}行,需求日期:数据'${item[key]}'错误,必须为2020-01-01或2020/01/01`,
                      });
                    }
                  } catch (error) {
                    this.errorList.push({
                      ErrorMsg: `${content},第${index + 1}行,需求日期:数据'${item[key]}'错误,必须为2020-01-01或2020/01/01`,
                    });
                  }
                }
              } else {
                list.RequirementDate = "";
              }
              break;
            case "周":
              if ((typeof item[key] !== "number" && item[key] !== "") || item[key] < 0 || item[key] > 53) {
                this.errorList.push({
                  ErrorMsg: `${content},第${index + 1}行,周:数据'${item[key]}'错误`,
                });
              } else {
                list.Week = item[key];
              }
              break;
            case "PMC":
              list.Pmc = item[key];
              break;
            case "销售订单号":
              list.SalesNo = item[key];
              break;
            case "材料品号":
              list.MitemCode = item[key];
              break;
            default:
              break;
          }
        }
        totalArray.push(list);
      });
      return totalArray;
    },
    //导入execl
    beforeUpload(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      let fileList = [...this.fileList1, file];
      this.fileList1 = fileList.slice(-1);
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file, 1);
        this.file = file;
      } else {
        this.$message.warning("文件类型错误,请重新上传");
      }
      return false;
    },
    //导入待产计划excel
    beforeUpload2(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      let fileList = [...this.fileList2, file];
      this.fileList2 = fileList.slice(-1);
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file, 2);
        this.file = file;
      } else {
        this.$message.warning("文件类型错误,请重新上传");
      }
      return false;
    },
    //导入待产计划excel
    beforeUpload3(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      let fileList = [...this.fileList3, file];
      this.fileList3 = fileList.slice(-1);
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file, 3);
        this.file = file;
      } else {
        this.$message.warning("文件类型错误,请重新上传");
      }
      return false;
    },
    // 读取文件
    readFile(file, type) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        const tableTitle = header.map((item) => {
          return { title: item, key: item };
        });
        if (type == 1) {
          console.log(results);
          this.tableData1 = results; //这里的tableData就是拿到的excel表格中的数据
          this.tableTitle1 = tableTitle;
        }
        if (type == 2) {
          console.log(results);
          this.tableData2 = results; //这里的tableData就是拿到的excel表格中的数据
          this.tableTitle2 = tableTitle;
        }
        if (type == 3) {
          console.log(results);
          this.tableData3 = results; //这里的tableData就是拿到的excel表格中的数据
          this.tableTitle3 = tableTitle;
        }
      };
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
</style>

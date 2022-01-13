<!--
 * @Author: max
 * @Date: 2021-09-09 14:55:10
 * @LastEditTime: 2022-01-13 16:04:22
 * @LastEditors: max
 * @Description: 导入execl
 * @FilePath: /up-admin/src/pages/home/pmc/manufacture/ImportExecl.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入生产日计划" @cancel="close" @ok="handleOk" centered :width="800">
      <a-spin tip="导入中..." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
                <a-col :md="8" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                      <a-select-option v-for="item in plantArray" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-decorator="['workshop']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                      <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-decorator="['line']" style="width: 200px" placeholder="请选择生产产线" @change="lineChange">
                      <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input-number placeholder="请输入计划生产人数" :min="0" allowClear style="width: 200px" v-model="people" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <div style="display:flex;">
                      <a-upload name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload" :remove="removeFile" :fileList="fileList">
                        <a-button> <a-icon type="upload" />添加execl文件 </a-button>
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
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import excel from "@/utils/xlsxTool.js";
import { getWorkshopList, getLineList, dailyPlanAction } from "@/services/web.js";
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
      errorList: [],
      pagination: false,
      tableTitle: [],
      columns,
      tableData: [],
      plantId: "",
      workshopId: "",
      week: "",
      workshopList: [],
      lineList: [],
      lineId: "",
      people: "",
      fileList: [],
      isUpload: false,
    };
  },
  created() {},
  methods: {
    //移除文件
    removeFile() {
      this.fileList = [];
      this.errorList = [];
    },
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    getWorkshopList() {
      let parmas = {
        plantid: this.plantId,
      };
      getWorkshopList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantId,
        workshopId: this.workshopId,
      };
      getLineList(parmas).then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    plantChange(e) {
      this.plantId = e;
      this.getWorkshopList();
    },
    //车间选择
    workshopChange(e) {
      this.workshopId = e;
      this.getLineList();
    },
    //产线选择
    lineChange(e) {
      this.lineId = e;
    },
    //周选择
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    //时间格式化
    formatDate(numb, format = "/") {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date);
    },
    //修改对象key
    transitionKey(list, map) {
      function toTransition(list) {
        var newObj = list.constructor === Array ? [] : {};
        for (let key in list) {
          var newKey = map[key] ? map[key] : key;

          newObj[newKey] = typeof list[key] === "object" ? toTransition(list[key], map) : list[key];
        }
        return newObj;
      }
      return toTransition(list);
    },
    formatLongDate(date) {
      let dateTime = date.setDate(date.getDate() + 1);
      date = new Date(dateTime);
      console.log("date-====", date);
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
    handleOk() {
      if (this.isUpload) {
        return;
      }
      //提交的数据格式
      if (this.plantId == "") {
        this.$message.warning("请先选择生产工厂!");
        return;
      }
      if (this.workshopId == "") {
        this.$message.warning("请先选择生产车间!");
        return;
      }
      if (this.lineId == "") {
        this.$message.warning("请先选择生成产线!");
        return;
      }
      if (this.people == "") {
        this.$message.warning("请输入人数!");
        return;
      }
      if (this.tableData.length === 0) {
        this.$message.warning("请先导入excel文件!");
        return;
      }
      let arr = [];
      let table = this.tableData;
      for (let i = 0; i < table.length; i++) {
        let res = table[i];
        let obj = {};
        this.tableTitle.forEach((item) => {
          obj[item["key"]] = res[item["key"]] || "";
        });
        arr.push(obj);
      }
      // let keyMap = {
      //   下单日期: "DateOrder",
      //   业务单号: "WorkOrderNo",
      //   人均标准产能: "PerCapiteCapacity",
      //   品号: "MitemCode",
      //   品名: "MitemName",
      //   工时: "WorkHour",
      //   序号: "序号",
      //   缺料状况: "MaterialShortage",
      //   计划数量: "PlanQty",
      //   计划日期: "PlanDate",
      //   订单交期: "DateDeliveryOrder",
      //   订单数量: "OrderQty",
      //   备注: "Remarks",
      // };
      let data = {
        PlantId: this.plantId,
        WorkShopId: this.workshopId,
        LineId: this.lineId,
        PersonQty: this.people,
        PlanList: [],
      };
      arr.forEach((item, index) => {
        let list = {};
        for (let key in item) {
          switch (key) {
            case "下单日期":
              if (typeof item[key] === "object") {
                list.DateOrder = this.formatLongDate(item[key]);
              }
              //字符串格式
              if (typeof item[key] === "string") {
                try {
                  //字符串转换为日期
                  let date = new Date(item[key]);
                  let formatDate = this.formatLongDate(date);
                  if (formatDate !== "NaN/NaN/NaN") {
                    list.DateOrder = formatDate;
                  } else {
                    this.errorList.push({
                      ErrorMsg: `第${index + 1}行,下单日期:数据'${item[key]}'错误,日期格式为:2008-08-08`,
                    });
                  }
                } catch (error) {
                  this.errorList.push({
                    ErrorMsg: `第${index + 1}行,下单日期:数据'${item[key]}'错误,日期格式为:2008-08-08`,
                  });
                }
              }
              break;
            case "业务单号":
              list.WorkOrderNo = item[key];
              break;
            case "人均标准产能":
              list.PerCapiteCapacity = item[key];
              break;
            case "品号":
              list.MitemCode = item[key];
              break;
            case "品名":
              list.MitemName = item[key];
              break;
            case "工时":
              list.WorkHour = item[key];
              break;
            case "缺料状况":
              list.MaterialShortage = item[key];
              break;
            case "计划数量":
              if (typeof item[key] !== "number" && item[key] !== "") {
                this.errorList.push({
                  ErrorMsg: `第${index + 1}行,计划数量:数据'${item[key]}'错误,必须为数字`,
                });
              } else {
                list.PlanQty = Number(item[key]);
              }
              break;
            case "计划日期":
              if (typeof item[key] === "object") {
                list.PlanDate = this.formatLongDate(item[key]);
              }
              //字符串格式
              if (typeof item[key] === "string") {
                try {
                  //字符串转换为日期
                  let date = new Date(item[key]);
                  let formatDate = this.formatLongDate(date);
                  if (formatDate !== "NaN/NaN/NaN") {
                    list.PlanDate = formatDate;
                  } else {
                    this.errorList.push({
                      ErrorMsg: `第${index + 1}行,计划日期:数据'${item[key]}'错误,日期格式为:2008-08-08`,
                    });
                  }
                } catch (error) {
                  this.errorList.push({
                    ErrorMsg: `第${index + 1}行,计划日期:数据'${item[key]}'错误,日期格式为:2008-08-08`,
                  });
                }
              }
              break;
            case "订单交期":
              if (typeof item[key] === "object") {
                list.DateDeliveryOrder = this.formatLongDate(item[key]);
              }
              //字符串格式
              if (typeof item[key] === "string") {
                try {
                  //字符串转换为日期
                  let date = new Date(item[key]);
                  let formatDate = this.formatLongDate(date);
                  if (formatDate !== "NaN/NaN/NaN") {
                    list.DateDeliveryOrder = formatDate;
                  } else {
                    this.errorList.push({
                      ErrorMsg: `第${index + 1}行,订单交期:数据'${item[key]}'错误,日期格式为:2008-08-08`,
                    });
                  }
                } catch (error) {
                  this.errorList.push({
                    ErrorMsg: `第${index + 1}行,订单交期:数据'${item[key]}'错误,日期格式为:2008-08-08`,
                  });
                }
              }
              break;
            case "订单数量":
              if (typeof item[key] !== "number" && item[key] !== "") {
                this.errorList.push({
                  ErrorMsg: `第${index + 1}行,订单数量:数据'${item[key]}'错误,必须为数字`,
                });
              } else {
                list.OrderQty = Number(item[key]);
              }
              break;
            case "备注":
              list.Remarks = item[key];
              break;
          }
        }
        data.PlanList.push(list);
      });
      if (this.errorList.length == 0) {
        this.submitExecl(data);
      } else {
        this.$message.error("物料信息格式错误,请修改");
      }
      // arr.forEach((item, index) => {
      //   console.log(item);
      //   //错误信息判断
      //   if (typeof item.OrderQty !== "number" || item.OrderQty === "") {
      //     this.errorList.push({
      //       ErrorMsg: `第${index + 1}行,"订单数量"数据(${item.OrderQty})错误,必须为数字`,
      //     });
      //   }
      //   if (typeof item.PlanQty !== "number" || item.PlanQty === "") {
      //     this.errorList.push({
      //       ErrorMsg: `第${index + 1}行,"计划数量"数据(${item.PlanQty})错误,必须为数字`,
      //     });
      //   }
      //   //数据添加
      //   data.PlanList.push({
      //     PlanDate: this.formatLongDate(item.PlanDate) || "",
      //     WorkOrderNo: item.WorkOrderNo || "",
      //     MitemCode: item.MitemCode || "",
      //     MitemName: item.MitemName || "",
      //     OrderQty: item.OrderQty || 0,
      //     PlanQty: item.PlanQty || 0,
      //     DateOrder: this.formatLongDate(item.DateOrder) || "",
      //     DateDeliveryOrder: this.formatLongDate(item.DateDeliveryOrder) || "",
      //     PerCapiteCapacity: item.PerCapiteCapacity || "",
      //     WorkHour: item.WorkHour || "",
      //     MaterialShortage: item.MaterialShortage || "",
      //     Remarks: item.Remarks || "",
      //   });
      // });
      // if (this.errorList.length == 0) {
      //   this.submitExecl(data);
      // } else {
      //   this.$message.error("生产日计划数据格式错误,请修改");
      // }
    },
    submitExecl(parmas) {
      this.isUpload = true;
      dailyPlanAction(parmas, "import").then((res) => {
        if (res.data.success && !res.data.data.IsError) {
          this.$message.success("导入成功!");
          this.close();
          this.isUpload = false;
        } else {
          this.errorList = res.data.data.list;
          this.isUpload = false;
          // this.$message.info(res.data.message.content);
        }
      });
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
        this.isUpload = false;
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
/deep/.ant-upload-list-item-name {
  white-space: normal;
}
</style>

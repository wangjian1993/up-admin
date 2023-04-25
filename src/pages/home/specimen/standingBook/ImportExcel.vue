<template>
  <div>
    <a-modal v-model="visible" title="导入台账" @cancel="close" @ok="handleOk" :maskClosable="false" centered :width="800">
      <a-spin tip="导入中..." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
                <a-col :md="12" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-model="enterpriseid" placeholder="请选择公司名称">
                      <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
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
import { setDepartmentApi } from "@/services/web.js";
import moment from "moment";
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
  props: ["enterList"],
  data() {
    return {
      size: "small",
      visible: true,
      errorList: [],
      pagination: false,
      tableTitle: [],
      columns,
      tableData: [],
      enterpriseid: "",
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
    closeModel() {
      this.this.$el;
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
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
    handleOk() {
      if (this.isUpload) {
        return;
      }
      if (this.errorList.length > 0) {
        this.$message.warning("请先检查上传的excel是否正确!");
        return;
      }
      if (this.tableData.length === 0) {
        this.$message.warning("请先导入excel文件!");
        return;
      }
      if (this.enterpriseid == "") {
        this.$message.warning("请先选择生产工厂");
        return;
      }
      if (this.errorList.length == 0) {
        let params = {
          EnterpriseId: this.enterpriseid,
          ImportData: this.tableData,
        };
        this.submitExcel(params);
      } else {
        this.$message.error("设备信息格式错误,请修改");
      }
    },
    submitExcel(params) {
      this.isUpload = true;
      setDepartmentApi(params, "importolddata").then((res) => {
        if (res.data.success) {
          this.$message.success("导入成功!");
          this.$emit("success");
          this.$emit("closeModal");
          this.isUpload = false;
        } else {
          this.isUpload = false;
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
        this.$message.warning({
          title: "文件类型错误",
          desc: "文件：" + file.name + "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。",
        });
      }
      return false;
    },
    //时间格式化
    formatLongDate(date) {
      let dateTime = date.setDate(date.getDate() + 1);
      date = new Date(dateTime);
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
    // 读取文件
    readFile(file) {
      this.tableData = [];
      const userRelations = {
        序号: "RowNumber", //行号
        采购送样日期: "DatetimePurchaseDeliver", //采购送样日期 C
        物料编码: "ItemCode", //物料编码 D
        物料名称: "ItemName", //物料名称 E
        规格型号: "ItemSpecification", //规格型号 F
        图号: "DrawingNo", //图号 G
        供应商: "Supplier", //供应商 H
        是否有承认书: "HasApprovalSheet", //是否有承认书 I
        数量: "Quantity", //数量 J
        送样采购员: "Purchaser", //送样采购员 K
        采购取回样品日期: "DatetimePurchaseRetrieve", //采购取回样品日期 L
        样品类别: "SampleCategory", //样品类别 M
        受控公司: "CtrledCompany", //受控公司 N
        采购备注: "Remark1", //采购备注 O
        签样工程师: "SignEngineer", //签样工程师 P
        承认部门: "ApprovalDepartment", //承认部门 Q
        签样时间: "DatetimeSign", //签样时间 R
        签样结果: "SignResult", //签样结果 S
        "研发/工程备注": "Remark2", //研发/工程备注 T
        受控状态: "CtrledStatus", //受控状态 U
        受控日期: "DatetimeCtrled", //受控日期 V
        受控异常描述: "CtrledAbnormalDescription", //受控异常描述 W
        异常处理情况: "CtrledAbnormalHandleStatus", //异常处理情况 X
        异常处理日期: "DatetimeCtrledAbnormalHandle", //异常处理日期 Y
        文控备注: "Remark3", //文控备注 Z
        IQC收样日期: "DatetimeQicCollect", //IQC收样日期 AA
        IQC备注: "Remark4", //IQC备注 AB
      };
      let tableHead = [];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        const tableTitle = header.map((item) => {
          tableHead.push(item);
          return { title: item, key: item };
        });
        //this.tableData = results; //这里的tableData就是拿到的excel表格中的数据
        this.tableTitle = tableTitle;
        let dateArray = ["DatetimePurchaseDeliver", "DatetimePurchaseRetrieve", "DatetimeSign", "DatetimeCtrled", "DatetimeCtrledAbnormalHandle", "DatetimeQicCollect"];
        console.log("results", results);
        results.map((item, indes) => {
          console.log();
          const obj = {};
          // 1. 取出这个对象所有的属性名： ['姓名'， ‘手机号']
          // 2. 遍历这个数组，通过 中文名去 userRelations 找对应英文名， 保存值
          // const zhKeys = Object.keys(item);
          if (indes <= 3000) {
            tableHead.forEach((zhKey) => {
              const enKey = userRelations[zhKey];
              // 如果是时间格式，就要做转换
              // console.log("enKey===", enKey);
              if (dateArray.includes(enKey) && typeof item[zhKey] === "object") {
                console.log("hahha===", item[zhKey]);
                console.log("hahha===", moment(item[zhKey]).format("YYYY-MM-DD HH:mm:ss"));
                obj[enKey] = moment(item[zhKey]).format("YYYY-MM-DD HH:mm:ss");
              } else {
                obj[enKey] = item[zhKey] || "";
              }
            });
          }
          // return obj;
          this.tableData.push(obj);
        });
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

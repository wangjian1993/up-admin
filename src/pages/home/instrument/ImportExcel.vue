<template>
  <div>
    <a-modal v-model="visible" :title="importType == 1 ? '首次导入' : '覆盖导入'" @cancel="close" @ok="handleOk" :maskClosable="false" centered :width="800">
      <a-spin tip="导入中..." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
                <a-col :md="12" :sm="24" v-if="importType == 1">
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
import { setInstrument } from "@/services/web.js";
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
  props: ["enterList", "importType"],
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
      if (this.enterpriseid == "" && this.importType == 1) {
        this.$message.warning("请先选择生产工厂");
        return;
      }
      if (this.errorList.length == 0) {
        let params = {
          InstrumentInfoList: this.tableData,
        };
        if (this.importType == 1) {
          params.EnterpriseId = this.enterpriseid;
        }
        this.submitExcel(params);
      } else {
        this.$message.error("设备信息格式错误,请修改");
      }
    },
    submitExcel(params) {
      this.isUpload = true;
      let url = this.importType == 1 ? "firstimport" : "secondimport";
      setInstrument(params, url).then((res) => {
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
        this.$Notice.warning({
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
        证书编号: "CertCode", //行号
        设备名称: "InstrumentName", //采购送样日期 C
        制造商: "Manufacturer", //物料编码 D
        型号: "InstrumentCode", //物料名称 E
        固定资产编号: "PropertyCode", //规格型号 F
        出厂编号: "FactoryNo", //图号 G
        使用部门: "UseDepartment", //供应商 H
        使用区域: "UseArea", //是否有承认书 I
        仪器负责人: "InstPerInCharge", //数量 J
        校准日期: "CalibrateDate", //送样采购员 K
        有效日期: "EffectiveDate", //采购取回样品日期 L
        计划校准月份: "PlanCaliMonth", //样品类别 M
        状态: "Status", //受控公司 N
        校准方式: "CalibrateWay", //采购备注 O
        备注: "Remark", //签样工程师 P
      };
      if (this.importType == 2) {
        userRelations.ID = "ID";
      }
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
        let dateArray = ["EffectiveDate", "CalibrateDate"];
        console.log("results----", results);
        results.map((item) => {
          console.log();
          const obj = {};
          // 1. 取出这个对象所有的属性名： ['姓名'， ‘手机号']
          // 2. 遍历这个数组，通过 中文名去 userRelations 找对应英文名， 保存值
          // const zhKeys = Object.keys(item);
          tableHead.forEach((zhKey) => {
            const enKey = userRelations[zhKey];
            // 如果是时间格式，就要做转换

            if (dateArray.includes(enKey) && typeof item[zhKey] === "object") {
              // obj[enKey] = this.formatLongDate(obj[zhKey]);
              obj[enKey] = moment(item[zhKey]).format("YYYY-MM-DD HH:mm:ss");
              obj[enKey] = this.formatLongDate(item[zhKey]);
             
            } else {
              obj[enKey] = item[zhKey] || "";
            }
          });
          console.log(" obj[enKey]==",obj);
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

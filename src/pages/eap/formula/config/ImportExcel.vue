<!--
 * @Author: max
 * @Date: 2022-05-05 14:45:16
 * @LastEditTime: 2022-05-26 16:30:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/formula/config/ImportExcel.vue
-->
<!--
 * @Author: max
 * @Date: 2021-09-09 14:55:10
 * @LastEditTime: 2022-04-11 10:17:44
 * @LastEditors: max
 * @Description: 导入execl
 * @FilePath: /up-admin/src/pages/home/pmc/manufacture/ImportExecl.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入配方配置" @cancel="close" @ok="handleOk" :maskClosable="false" centered :width="800">
      <a-spin tip="导入中..." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
                <!-- <a-col :md="8" :sm="24">
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
                </a-col> -->
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
import { setDeviceAction } from "@/services/eap.js";
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
      console.log("11111");
      console.log(this.isUpload);
      if (this.isUpload) {
        return;
      }
      console.log(this.errorList);
      if (this.errorList.length > 0) {
        this.$message.warning("请先检查上传的excel是否正确!");
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
      let data = [];
      arr.forEach((item, index) => {
        let list = {};
        for (let key in item) {
          switch (key) {
            case "设备名称":
              if (item[key] == "") {
                this.errorList.push({
                  ErrorMsg: `第${index + 1}行,设备名称不能为空'`,
                });
              } else {
                list.EquimentName = item[key];
              }
              break;
            case "设备编码":
              if (item[key] == "") {
                this.errorList.push({
                  ErrorMsg: `第${index + 1}行,设备编码不能为空'`,
                });
              } else {
                list.EquimentCode = item[key];
              }
              break;
            case "设备描述":
              list.EquimentDesc = item[key];
              break;
            case "设备类型名称":
              if (item[key] == "") {
                this.errorList.push({
                  ErrorMsg: `第${index + 1}行,设备类型名称不能为空'`,
                });
              } else {
                list.Brand = item[key];
              }
              break;
            case "设备类型编码":
              if (item[key] == "") {
                this.errorList.push({
                  ErrorMsg: `第${index + 1}行,设备类型编码不能为空'`,
                });
              } else {
                list.EquimentTypeCode = item[key];
              }
              break;
          }
        }
        data.push(list);
      });
      if (this.errorList.length == 0) {
        this.submitExecl(data);
      } else {
        this.$message.error("设备信息格式错误,请修改");
      }
    },
    submitExecl(parmas) {
      this.isUpload = true;
      setDeviceAction(parmas, "import").then((res) => {
        if (res.data.success && !res.data.data.IsError) {
          this.$message.success("导入成功!");
          this.$emit("closeModal");
          this.$emit("success");
          this.isUpload = false;
        } else {
          this.isUpload = false;
          // this.$message.info(res.data.message.content);
          this.errorList = res.data.data.list;
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
      const userRelations = {
        生产工厂: "PlantCode",
        生产车间: "WorkshopCode",
        生产产线: "username",
        产品型号: "ProCode",
        配方编码: "FormulaCode",
        配方名称: "FormulaName",
        配方描述: "FormulaDesc",
        Plc编码: "PlcCode",
        参数类型编码: "ParamsTypeCode",
        参数编码: "VarCode",
        参数地址: "VarAddress",
        参数地址为: "VarAddressBit",
        数据类型: "VarDataType",
        数据长度: "VarDataSize",
        数据精度: "VarDataAccuuacy",
        参数最大值: "VarMaxValue",
        参数最小值: "VarMinValue",
        实际参数值: "VarValue",
        参数标准值: "VarStdValue",
        必填项: "IsMust",
        PLC权限: "PlcAuth",
        上位机权限: "UpperComputerAuth",
      };
      let tableHead2 = [];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = e.target.result;
        const { header, results } = excel.read(data, "array");
        const tableTitle = header.map((item) => {
          tableHead2.push(item);
          return { title: item, key: item };
        });
        this.tableData = results; //这里的tableData就是拿到的excel表格中的数据
        this.tableTitle = tableTitle;
        results.map((item) => {
          const obj = {};
          // 1. 取出这个对象所有的属性名： ['姓名'， ‘手机号']
          // 2. 遍历这个数组，通过 中文名去 userRelations 找对应英文名， 保存值
          const zhKeys = Object.keys(item);
          zhKeys.forEach((zhKey) => {
            const enKey = userRelations[zhKey];
            // 如果是时间格式，就要做转换
            obj[enKey] = item[zhKey];
          });
          console.log(obj)
          return obj;
        });
        // this.tableTitle.find((item) => {
        //   if (tableHead.includes(item.title)) {
        //     console.log(item.title);
        //   }
        // });
        // let missing = tableHead.filter(((i) => (a) => a !== tableHead2[i] || !++i)(0));
        // if (missing.length > 0) {
        //   missing.forEach((item) => {
        //     this.errorList.push({
        //       ErrorMsg: `导入的excel缺少"${item}"字段,请重新上传`,
        //     });
        //     return;
        //   });
        // }
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

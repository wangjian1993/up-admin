<!--
 * @Author: max
 * @Date: 2021-10-18 08:33:37
 * @LastEditTime: 2021-11-09 11:13:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/buyer/ImportExecl.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入采购员物料配置" @cancel="close" @ok="handleOk" centered :width="800">
      <a-spin tip="导入中..." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
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
import { setBuyerAction } from "@/services/web.js";
import excel from "@/utils/xlsxTool.js";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "10%",
  },
  {
    title: "行数",
    dataIndex: "RowNum",
    align: "RowNum",
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
      tableTitle: [],
      tableData: [],
      plantId: "",
      week: "",
      fileList: [],
      isUpload: false,
    };
  },
  created() {},
  methods: {
    //移除文件
    removeFile() {
      this.fileList = [];
    },
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    plantChange(e) {
      this.plantId = e;
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    //时间格式化
    formatDate(numb, format = "-") {
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
    handleOk() {
      if (this.isUpload) {
        return;
      }
      this.errorList = [];
      //提交的数据格式
      if (this.tableData.length === 0) {
        this.$message.warning("请先导入excel文件!");
        return;
      }
      let parmas = [];
      //合并表格头部和内容数据
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
      //拼接后台数据
      arr.forEach((item) => {
        let list = {};
        for (let key in item) {
          switch (key) {
            case "生产工厂":
              list.PlantName = item[key];
              break;
            case "采购":
              list.PurchaseName = item[key];
              break;
            case "物料":
              list.MitemCode = item[key];
              break;
            default:
              break;
          }
        }
        parmas.push(list);
      });
      if (this.errorList.length == 0) {
        this.submitExecl(parmas);
      } else {
        this.$message.error("物料信息格式错误,请修改");
      }
    },
    //提交
    submitExecl(parmas) {
      if (this.isUpload) {
        return;
      }
      this.isUpload = true;
      setBuyerAction(parmas, "import").then((res) => {
        if (res.data.success && !res.data.data.IsError) {
          this.$message.success("导入成功!");
          this.close();
          this.isUpload = false;
        } else {
          this.$message.info(res.data.message.content);
          try {
            this.errorList = res.data.data.list || [];
          } catch (error) {
            this.isUpload = false;
          }
          this.isUpload = false;
        }
      });
    },
    //判断是否是日期
    IsDate(mystring) {
      var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
      var str = mystring;
      if (str == "") return true;
      if (!reg.test(str) && RegExp.$2 <= 12 && RegExp.$3 <= 31) {
        return false;
      }
      return true;
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
        this.isUpload = true;
        this.readFile(file);
        this.file = file;
        console.log("上传====111");
      } else {
        this.$message.warning("文件类型错误,请重新上传");
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
          return { title: item, key: item };
        });
        this.tableData = results; //这里的tableData就是拿到的excel表格中的数据
        this.tableTitle = tableTitle;
        console.log("上传====222", this.tableData);
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

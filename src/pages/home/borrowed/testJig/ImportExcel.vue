<!--
 * @Author: max
 * @Date: 2022-05-17 15:33:10
 * @LastEditTime: 2023-04-26 15:30:29
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/testJig/ImportExcel.vue
-->

<template>
  <div>
    <a-modal v-model="visible" title="导入电源测试架" @cancel="close" @ok="handleOk" :maskClosable="false" centered :width="400">
      <a-spin tip="导入中..." :spinning="isUpload">
        <div>
          <a-form layout="horizontal">
            <div>
              <a-row>
                <a-col :md="8" :sm="24">
                  <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                    <div style="display:flex;">
                      <a-upload name="file" :custom-request="uploadFile" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload" :remove="removeFile" :fileList="fileList">
                        <a-button> <a-icon type="upload" />添加execl文件 </a-button>
                      </a-upload>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { setTestJig } from "@/services/web.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
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
    uploadFile(info) {
      console.log("info", info);
    },
    handleOk() {
      this.isUpload = true;
      console.log(this.file);
      getBase64(this.file, (baseUrl) => {
        console.log(baseUrl)
        let params = {
          filename: this.file.name,
          content: baseUrl,
        };
        setTestJig(params, "import").then((res) => {
          if (res.data.success) {
            this.$message.success("导入成功!");
            this.$emit("closeModal");
            this.$emit("success");
            this.isUpload = false;
          } else {
            this.isUpload = false;
          }
        });
      });
    },
    //导入execl
    beforeUpload(file) {
      console.log(file);
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      let fileList = [...this.fileList, file];
      this.fileList = fileList.slice(-1);
      if (fileExt === "xlsx" || fileExt === "xls" || fileExt === "csv") {
        this.file = file;
      } else {
        this.$message.warning({
          title: "文件类型错误",
          desc: "文件：" + file.name + "不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。",
        });
      }
      return false;
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

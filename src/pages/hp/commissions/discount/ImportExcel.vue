<!--
 * @Author: max
 * @Date: 2021-10-18 08:33:37
 * @LastEditTime: 2022-03-29 14:42:16
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/hp/commissions/discount/ImportExcel.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入" @cancel="close" @ok="handleOk" centered :width="800">
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
          <div class="tab" v-if="isShowTable">
            <a-table :columns="columns1" :data-source="errorList" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(errorList) => errorList.Id" bordered>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ index + 1 }}</span>
                </div>
              </template>
            </a-table>
          </div>
          <div class="tab" v-if="!isShowTable">
            <a-table :columns="columns" :data-source="tableData" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(tableTitle, index) => index" bordered>
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
import { importDiscountList } from "@/services/hp.js";
import excel from "@/utils/xlsxTool.js";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "10%",
  },
  {
    title: "订单号",
    dataIndex: "MoNo",
    align: "center",
  },
  {
    title: "合同号",
    dataIndex: "ctrno",
    align: "center",
  },
  {
    title: "折扣率",
    dataIndex: "ZkRate",
    align: "center",
  },
];
const columns1 = [
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
      columns1,
      errorList: [],
      pagination: false,
      tableTitle: [],
      tableData: [],
      tableArray: [],
      fileList: [],
      isUpload: false,
      isShowTable: false,
    };
  },
  created() {},
  methods: {
    //移除文件
    removeFile() {
      this.fileList = [];
      this.isShowTable = false;
      this.errorList = [];
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
      let params = {
        ZkRate: [],
      };
      //拼接后台数据
      this.tableData.forEach((item, index) => {
        if (item.ZkRate > 1) {
          this.errorList.push({
            ErrorMsg: `第${index + 1}行,折扣率:数据'${item.ZkRate}'错误,必须在0-1范围内`,
          });
        }
        params.ZkRate.push({
          MoNo: item.MoNo,
          ctrno: item.ctrno,
          ZkRate: item.ZkRate,
        });
      });
      if (this.errorList.length == 0) {
        this.submitExecl(params);
      } else {
        this.isShowTable = true;
        this.$message.error("导入信息格式错误,请修改");
      }
    },
    //提交
    submitExecl(params) {
      this.isUpload = true;
      importDiscountList(params).then((res) => {
        if (res.data.ErrorNum == 0) {
          this.$message.success("导入成功!");
          this.close();
        } else {
          // this.$message.info(res.data.message.content);
          this.errorList = res.data.data.ErrorList;
        }
        this.isUpload = false;
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
        // this.tableData = results; //这里的tableData就是拿到的excel表格中的数据
        this.tableTitle = tableTitle;
        results.forEach((item) => {
          this.tableData.push({
            MoNo: item["订单号"],
            ctrno: item["合同号"],
            ZkRate: item["折扣率"],
          });
        });
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

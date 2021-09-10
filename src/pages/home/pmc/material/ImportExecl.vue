<!--
 * @Author: max
 * @Date: 2021-09-09 14:55:10
 * @LastEditTime: 2021-09-10 18:13:01
 * @LastEditors: max
 * @Description: 导入execl
 * @FilePath: /up-admin/src/pages/home/pmc/material/ImportExecl.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入物料需求计划" @cancel="close" @ok="handleOk" centered :width="800">
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
                  <a-week-picker placeholder="选择周" @change="weekChange" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item :wrapperCol="{ span: 18, offset: 1 }">
                  <div style="display:flex;">
                    <a-upload name="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :beforeUpload="beforeUpload">
                      <a-button> <a-icon type="upload" />添加execl文件 </a-button>
                    </a-upload>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
        <!-- 列表 -->
        <!-- <div class="tab">
          <a-table
            :columns="columns"
            :data-source="list"
            :size="size"
            :scroll="{ y: true }"
            :pagination="pagination"
            @change="handleTableChange"
            :rowKey="(list) => list.Id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="enable" slot-scope="record">
              <div>
                <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
                <a-tag color="red" v-else>禁用</a-tag>
              </div>
            </template>
          </a-table>
        </div> -->
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mitemrequirementAction } from "@/services/web.js";
import excel from "@/utils/xlsxTool.js";
export default {
  props: ["plantArray"],
  data() {
    return {
      size: "small",
      visible: true,
      isAddModal: false,
      list: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      rowSelectionType: "radio",
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      tableTitle: [],
      columns: [],
      tableData: [],
      onOrgId: 0,
      plantId: "",
      week: "",
    };
  },
  created() {},
  methods: {
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
    handleOk() {
      //提交的数据格式
      if (this.plantId == "") {
        this.$message.warning("请先选择生产工厂!");
        return;
      }
      if (this.week == "") {
        this.$message.warning("请先选择周!");
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
      // table.forEach((item) => {
      //   let obj = {
      //     ...item,
      //   };
      //   this.tableTitle.forEach((cItem) => {
      //     if (!Object.keys(item).includes(cItem.key)) {
      //       obj[cItem.key] = "";
      //     }
      //   });
      //   arr.push(obj);
      // });
      //获取年
      var date = new Date();
      var y = date.getFullYear();
      //拼接后台数据
      arr.forEach((item) => {
        let data = {
          PlantId: this.plantId,
          Week: this.week,
          MitemCode: "",
          MitemName: "",
          Spec: "",
          Remarks: "",
          RequirementList: [],
        };
        for (let key in item) {
          switch (key) {
            case "品号":
              data.MitemCode = item[key];
              break;
            case "品名":
              data.MitemName = item[key];
              break;
            case "规格":
              data.Spec = item[key];
              break;
            case "备注":
              data.Remarks = item[key];
              break;
            default:
              break;
          }
          // if (index > 4) {
          //   data.RequirementList.push({
          //     RequirementDate: y + "/" + item[key].key,
          //     RequirementQty: item[key].value || "",
          //   });
          // }
        }
        // item.forEach((items, index) => {
        //   console.log(items);
        //   switch (items.key) {
        //     case "品号":
        //       data.MitemCode = items.value;
        //       break;
        //     case "品名":
        //       data.MitemName = items.value;
        //       break;
        //     case "规格":
        //       data.Spec = items.value;
        //       break;
        //     case "备注":
        //       data.Remarks = items.value;
        //       break;
        //     default:
        //       break;
        //   }
        //   if (index > 4) {
        //     data.RequirementList.push({
        //       RequirementDate: y + "/" + items.key,
        //       RequirementQty: items.value || "",
        //     });
        //   }
        // });
        // parmas.push(data);
      });
      console.log(parmas);
      // this.submitExecl(parmas)
    },
    submitExecl(parmas) {
      mitemrequirementAction(parmas, "import").then((res) => {
        if (res.data.success) {
          this.$message.success("导入成功!");
        }
      });
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
    //导入execl
    beforeUpload(file) {
      const fileExt = file.name
        .split(".")
        .pop()
        .toLocaleLowerCase();
      this.uploadFile = file;
      if (fileExt === "xlsx" || fileExt === "xls") {
        this.readFile(file);
        this.file = file;
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
          return { title: item, key: item };
        });
        this.tableData = results; //这里的tableData就是拿到的excel表格中的数据
        this.tableTitle = tableTitle;
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
</style>

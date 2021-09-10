<!--
 * @Author: max
 * @Date: 2021-09-09 14:55:10
 * @LastEditTime: 2021-09-09 18:05:50
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
// import { getQuotePermission } from "@/services/web.js";
import XLSX from "xlsx";
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
      console.log(this.tableData);
      this.tableData.map((item) => {
        console.log(item);
      });
      // let data = {
      //   PlantId:this.plantId,
      //   Week:this.week,
      //   MitemCode: "5-5201-404210002",
      //   MitemName: "螺丝",
      //   Spec: "",
      //   Remarks: "",
      //   RequirementList: [
      //     {
      //       RequirementDate: "2021/09/10",
      //       RequirementQty: "100",
      //     },
      //     {
      //       RequirementDate: "2021/09/11",
      //       RequirementQty: "200",
      //     },
      //   ],
      // };
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
    //导入execl
    beforeUpload(file) {
      let _this = this;
      return new Promise(function(resolve) {
        // readExcel方法也使用了Promise异步转同步，此处使用then对返回值进行处理
        _this.readExcel(file).then((result) => {
          // 此时标识校验成功，为resolve返回
          if (result) resolve(result);
        });
      });
    },
    //解析execl数据
    readExcel(file) {
      let _this = this;
      _this.columns = [];
      _this.tableData = [];
      return new Promise(function(resolve, reject) {
        // 返回Promise对象
        const reader = new FileReader();
        reader.onload = (e) => {
          // 异步执行
          try {
            // 以二进制流方式读取得到整份excel表格对象
            let data = e.target.result,
              workbook = XLSX.read(data, { type: "binary" });
            const exlname = workbook.SheetNames[0]; // 取第一张表
            const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
            console.log("exl======",exl);
            let tableheader = exl;
            for (let val in tableheader) {
              _this.columns.push({
                  title: tableheader[val],
                  dataIndex: val,
                  key: val,
                  ellipsis: true,
                  scopedSlots: { customRender: val },
              });
            }
            exl.forEach((v, i) => {
              v = { ...v, key: i };
            });
            _this.tableData = exl;
            resolve();
          } catch (e) {
            reject(e.message);
          }
        };
        reader.readAsBinaryString(file);
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
</style>

<!--
 * @Author: max
 * @Date: 2021-09-09 14:55:10
 * @LastEditTime: 2021-09-14 18:47:30
 * @LastEditors: max
 * @Description: 导入execl
 * @FilePath: /up-admin/src/pages/home/pmc/manufacture/ImportExecl.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="导入生产日计划" @cancel="close" @ok="handleOk" centered :width="800">
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
                  <a-input-number placeholder="请输入人数" :min="0" allowClear style="width: 200px" v-model="people" />
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
import excel from "@/utils/xlsxTool.js";
import { getWorkshopList, getLineList, dailyPlanAction } from "@/services/web.js";
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
      plantId: "",
      workshopId: "",
      week: "",
      workshopList: [],
      lineList: [],
      lineId: "",
      people: 0,
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
      let keyMap = {
        "下单\n日期": "DateOrder",
        业务单号: "WorkOrderNo",
        人均标准产能: "PerCapiteCapacity",
        品号: "MitemCode",
        品名: "MitemName",
        工时: "WorkHour",
        序号: "序号",
        缺料状况: "MaterialShortage",
        "计划\n数量": "PlanQty",
        计划日期: "PlanDate",
        "订单\n交期": "DateDeliveryOrder",
        "订单\n数量": "OrderQty",
        备注: "Remarks",
      };
      let data = {
        PlantId: this.plantId,
        WorkShopId: this.workshopId,
        LineId: this.lineId,
        PersonQty: this.people,
        PlanList: [],
      };
      console.log(this.tableData);
      let arr = this.transitionKey(this.tableData, keyMap);
      arr.forEach((item) => {
        data.PlanList.push({
          PlanDate:  this.formatDate(item.PlanDate) || "",
          WorkOrderNo: item.WorkOrderNo || "",
          MitemCode: item.MitemCode || "",
          MitemName: item.MitemName || "",
          OrderQty: item.OrderQty || "",
          PlanQty: item.PlanQty || "",
          DateOrder: this.formatDate(item.DateOrder) || "",
          DateDeliveryOrder: this.formatDate(item.DateDeliveryOrder) || "",
          PerCapiteCapacity: item.PerCapiteCapacity || "",
          WorkHour: item.WorkHour || "",
          MaterialShortage: item.MaterialShortage || "",
          Remarks: item.Remarks || "",
        });
      });
      console.log(data);
      this.submitExecl(data);
    },
    submitExecl(parmas) {
      dailyPlanAction(parmas, "import").then((res) => {
        if (res.data.success && !res.data.data.IsError) {
          this.$message.success("导入成功!");
          this.close();
        } else {
          this.$message.info(res.data.message.content);
        }
      });
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
          let key = item.replace(/[\r\n]/g, "");
          return { key: key };
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

<!--
 * @Author: max
 * @Date: 2021-09-23 13:59:52
 * @LastEditTime: 2022-02-25 10:31:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/shipment/up/infoPersonal/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-spin tip="导出中..." :spinning="isExportLod">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="业务订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入业务订单号" v-decorator="['pinumber']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="客户代码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入客户代码" v-decorator="['customercode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="订单状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['statusshipment']" placeholder="请选择订单状态" style="width: 200px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">已出货</a-select-option>
                    <a-select-option value="0">未出货</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="处理状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['statushandle']" placeholder="请选择订单状态" style="width: 200px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">已处理</a-select-option>
                    <a-select-option value="0">未处理</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantname']" style="width: 200px" placeholder="请选择生产工厂">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option v-for="item in plantList" :key="item.PlantName" :value="item.PlantName">{{ item.PlantName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="申请时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="验货时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="提货时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker3']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{ advanced ? "收起" : "展开" }}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-form>
        <div class="operator">
          <a-button :disabled="!hasPerm('export')" icon="export" type="primary" :loading="loading" @click="excelFn('', 'all')" style="margin-left: 8px">导出</a-button>
          <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="onDelete()" style="margin-left: 8px">删除</a-button>
          <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="onDelete" style="margin-left: 8px">删除</a-button>
          <span style="margin-left: 8px">
            <template v-if="hasSelected">
              {{ `共选中 ${selectedRowKeys.length} 条` }}
            </template>
          </span>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          size="small"
          :scroll="{ y: scrollY }"
          :loading="loading"
          :pagination="pagination"
          @change="handleTableChange"
          :rowKey="(dataSource, index) => dataSource.Id + '_' + index"
          bordered
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps,
          }"
        >
          <a-table slot="expandedRowRender" slot-scope="text" :columns="innerColumns" :data-source="text.group" :rowKey="(innerColumns, index) => innerColumns.Id + '_' + index" :pagination="false"></a-table>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="StatusHandle" slot-scope="text">
            <div>
              <a-tag :color="text === '0' ? 'red' : 'green'">{{ text === "0" ? "未处理" : "已处理" }}</a-tag>
            </div>
          </template>
          <template slot="StatusShipment" slot-scope="text">
            <div>
              <a-tag :color="text === '0' ? 'red' : 'green'">{{ text === "0" ? "未出货" : "已出货" }}</a-tag>
            </div>
          </template>
          <template slot="IsExamine" slot-scope="text">
            <div>
              <a-tag :color="text === '0' ? 'red' : 'green'">{{ text === "0" ? "否" : "是" }}</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a-popconfirm title="确定删除?" @confirm="() => onDelete(record, 'Radio')" v-if="record.StatusHandle == 0 && record.StatusShipment == 0 && comparedate(record.DatetimeCreated)">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')" v-if="record.StatusHandle == 0 && record.StatusShipment == 0 && comparedate(record.DatetimeCreated)">
                <a-icon type="edit" />
                编辑
              </a>
              <a style="margin-right: 8px" @click="excelFn(record)" :disabled="!hasPerm('export')">
                <a-icon type="export" />
                导出
              </a>
            </div>
          </template>
        </a-table>
      </a-spin>
      <InfoEdit v-if="isEdit" @closeModal="closeModal" :editData="editData" @success="getListAll" />
    </a-card>
  </div>
</template>

<script>
// import { getSupplierAction } from "@/services/web.js";
// import ExportExcel from "@/utils/ExportExcelJS";
import InfoEdit from "./infoEdit.vue";

import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getPlantList, getOrderList, deleteOrder } from "@/services/shipment.js";
import { splitData } from "@/utils/util.js";
import { ShipmentExport } from "@/mixins/shipmentUp";
import { innerColumns, columns } from "../data/data.js";
import moment from "moment";
export default {
  components: { InfoEdit },
  mixins: [ShipmentExport],
  data() {
    return {
      scrollY: "",
      innerColumns,
      loading: false,
      advanced: true,
      columns,
      dataSource: [],
      isDrawer: false,
      selectedRowKeys: [],
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
      searchForm: this.$form.createForm(this),
      isExportLod: false,
      plantList: [],
      isEdit: false,
      editData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getPlantList();
    this.getListAll();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  activated(){
    this.getListAll();
  },
  methods: {
    splitData,
    getPlantList() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getPlantList(parmas).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    //比较两个日期的大小
    comparedate(date) {
      let date2  =moment().format("YYYY-MM-DD");
      let date1 = date.split("T");
      let oDate1 = new Date(date1[0]); //申请时间
      let oDate2 = new Date(date2);  //今天时间
      // console.log(oDate1.getTime())
      // console.log(oDate2.getTime())
     if (oDate1.getTime() == oDate2.getTime()) {
        return true;
      } else {
        return false;
      }
    },
    //关闭弹出框
    closeModal() {
      this.isEdit = false;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        rolesign: "PERSONAL",
        pinumber: "",
        customercode: "",
        statusshipment: "",
        statushandle: "",
        plantname: "",
        createdatestart: "",
        createdateend: "",
        goodsexaminetimestart: "",
        goodsexaminetimeend: "",
        goodspicktimestart: "",
        goodspicktimeend: "",
      };
      getOrderList(parmas).then((res) => {
        if (res.data.success) {
          this.dataSource = this.handlerDatas(res.data.data.list);
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    //编辑
    edit(record) {
      this.isEdit = true;
      this.editData = record;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      console.log(this.isSearch);
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
    },
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue1 = values["range-time-picker1"];
            var createdatestart = rangeValue1[0].format("YYYY-MM-DD");
            var createdateend = rangeValue1[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] && values["range-time-picker2"].length == 2) {
            const rangeValue1 = values["range-time-picker2"];
            var goodsexaminetimestart = rangeValue1[0].format("YYYY-MM-DD");
            var goodsexaminetimeend = rangeValue1[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker3"] && values["range-time-picker3"].length == 2) {
            const rangeValue1 = values["range-time-picker3"];
            var goodspicktimestart = rangeValue1[0].format("YYYY-MM-DD");
            var goodspicktimeend = rangeValue1[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            rolesign: "PERSONAL",
            pinumber: values.pinumber || "",
            customercode: values.customercode || "",
            statusshipment: values.statusshipment || "",
            statushandle: values.statushandle || "",
            plantname: values.plantname || "",
            createdatestart: createdatestart || "",
            createdateend: createdateend || "",
            goodsexaminetimestart: goodsexaminetimestart || "",
            goodsexaminetimeend: goodsexaminetimeend || "",
            goodspicktimestart: goodspicktimestart || "",
            goodspicktimeend: goodspicktimeend || "",
          };
          getOrderList(parmas).then((res) => {
            if (res.data.success) {
              this.dataSource = this.handlerDatas(res.data.data.list);
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = 2;
            }
          });
          // do something
        }
      });
    },
    onDelete(item, type) {
      let parmas = {
        Ids: [],
      };
      if (type == "Radio") {
        parmas.Ids.push({
          Id: item.Id,
        });
        deleteOrder(parmas).then((res) => {
          if (res.data.success) {
            this.$message.success("删除成功!");
            this.getListAll();
          }
        });
      } else {
        let self = this;
        self.$confirm({
          title: "确定要删除选中内容",
          onOk() {
            self.dataSource.map((item, index) => {
              let id = item.Id + "_" + index;
              if (self.selectedRowKeys.includes(id)) {
                parmas.Ids.push({
                  Id: item.Id,
                });
              }
            });
            deleteOrder(parmas).then((res) => {
              if (res.data.success) {
                self.$message.success("删除成功!");
                self.getListAll();
              }
            });
          },
          onCancel() {},
        });
      }
    },
    getCheckboxProps: (record) => ({
      props: {
        disabled: record.StatusHandle !== "0" || record.StatusShipment !== "0", // Column configuration not to be checked
      },
    }),
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-table-body {
  min-height: 0vh;
}
.statistic {
  display: flex;
  justify-content: center;
  cursor: pointer;
}
/deep/.ant-statistic {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
/deep/.ant-statistic-title {
  margin-bottom: 0;
  font-size: 18px;
  // font-weight: 700;
  color: #000;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>

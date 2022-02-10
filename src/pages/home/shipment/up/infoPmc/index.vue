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
                <a-form-item label="退货时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
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
          <a-button v-if="hasPerm('export')" icon="export" type="primary" :disabled="!hasSelected" :loading="loading" @click="exportExcel" style="margin-left: 8px">导出</a-button>
          <a-button v-else icon="export" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">导出</a-button>
          <a-button v-if="hasPerm('dispose')" icon="edit" type="primary" :disabled="!hasSelected" :loading="loading" @click="onDelete()" style="margin-left: 8px">确认处理</a-button>
          <a-button v-else icon="edit" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">确认处理</a-button>
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
          <template slot="action" slot-scope="text, record">
            <div>
              <a-popconfirm title="确定处理?" @confirm="() => onDelete(record, 'Radio')" v-if="record.StatusHandle == 0">
                <a style="margin-right: 8px" :disabled="!hasPerm('dispose')">
                  <a-icon type="edit" />
                  确认处理
                </a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import { getSupplierAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 100,
  },
  {
    title: "业务订单号",
    dataIndex: "PiNumber",
    scopedSlots: { customRender: "PiNumber" },
    align: "center",
    width: 150,
  },
  {
    title: "客户代码",
    dataIndex: "CustomerCode",
    scopedSlots: { customRender: "CustomerCode" },
    align: "center",
    width: 100,
  },
  {
    title: "出货国家",
    dataIndex: "ToCountry",
    scopedSlots: { customRender: "ToCountry" },
    align: "center",
    width: 80,
  },
  {
    title: "出货方式",
    dataIndex: "ShipmentWay",
    scopedSlots: { customRender: "ShipmentWay" },
    align: "center",
    width: 80,
  },
  {
    title: "是否验货",
    dataIndex: "IsExamine",
    scopedSlots: { customRender: "IsExamine" },
    align: "center",
    width: 80,
  },
  {
    title: "约定验货时间",
    dataIndex: "GoodsExamineTime",
    scopedSlots: { customRender: "GoodsExamineTime" },
    align: "center",
    width: 120,
  },
  {
    title: " 约定提货时间",
    dataIndex: "GoodsPickTime",
    scopedSlots: { customRender: "GoodsPickTime" },
    align: "center",
    width: 120,
  },
  {
    title: "申请时间",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
    width: 120,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: "100px",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
    width: 120,
  },
  {
    title: "业务员",
    dataIndex: "DisplayName",
    scopedSlots: { customRender: "DisplayName" },
    align: "center",
    width: "100px",
  },
  {
    title: "出货状态",
    dataIndex: "StatusShipment",
    scopedSlots: { customRender: "StatusShipment" },
    align: "center",
    width: 80,
  },
  {
    title: "处理状态",
    dataIndex: "StatusHandle",
    scopedSlots: { customRender: "StatusHandle" },
    align: "center",
    width: 80,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: 120,
  },
];
const innerColumns = [
  {
    title: "品号",
    dataIndex: "ItemCode",
    scopedSlots: { customRender: "ItemCode" },
    align: "left",
    width: 200,
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "left",
    width: 350,
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "left",
  },
  {
    title: "订单数量",
    dataIndex: "ShipmentQtyOrder",
    scopedSlots: { customRender: "ShipmentQtyOrder" },
    align: "center",
    width: 150,
  },
  {
    title: "本次出货数量",
    dataIndex: "ShipmentQtyNow",
    scopedSlots: { customRender: "ShipmentQtyNow" },
    align: "center",
    width: 150,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getPlantList, getOrderList, confirmDispose } from "@/services/shipment.js";
import { splitData } from "@/utils/util.js";
export default {
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
    }
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
    //分组
    handlerDatas(arr) {
      let obj = {};
      arr.forEach((item) => {
        let { Id } = item;
        if (!obj[Id]) {
          obj[Id] = {
            ...item,
            group: [],
          };
        }
        obj[Id].group.push(item);
      });
      let data = Object.values(obj); // 最终输出
      console.log(data);
      return data;
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
        confirmDispose(parmas).then((res) => {
          if (res.data.success) {
            this.$message.success("处理成功!");
            this.getListAll();
          }
        });
      } else {
        let self = this;
        self.$confirm({
          title: "确定要处理选中内容",
          onOk() {
            self.dataSource.map((item, index) => {
              let id = item.Id + "_" + index;
              if (self.selectedRowKeys.includes(id)) {
                parmas.Ids.push({
                  Id: item.Id,
                });
              }
            });
            confirmDispose(parmas).then((res) => {
              if (res.data.success) {
                self.$message.success("处理成功!");
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
        disabled: record.StatusHandle !== "0", // Column configuration not to be checked
      },
    }),
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plantid: values.plantid,
        batchid: values.batchid,
        week: this.week || "",
        pmc: values.pmc,
        status: values.status,
        mitemcode: values.mitemcode,
        mitemname: values.mitemname,
        fastcondition: this.statisticType,
      };
      getSupplierAction(parmas, "reply/getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          list.forEach((item) => {
            if (item.PurchaseOrderMatchList !== null && item.PurchaseOrderMatchList.length > 0) {
              let PurchaseUserName = [];
              let SupplierName = [];
              let PurchaseOrderNo = [];
              let LineItem = [];
              let TransitQty = [];
              let SupplierReplyDate = [];
              let SupplierReplyQty = [];
              let PurchaseReplyResult = [];
              let MatchedQty = [];
              let SalesNos = [];
              item.PurchaseOrderMatchList.map((items) => {
                PurchaseUserName.push(items.PurchaseUserName);
                SupplierName.push(items.SupplierName);
                PurchaseOrderNo.push(items.PurchaseOrderNo);
                LineItem.push(items.LineItem);
                TransitQty.push(items.TransitQty);
                SupplierReplyDate.push(items.SupplierReplyDate);
                SupplierReplyQty.push(items.SupplierReplyQty);
                PurchaseReplyResult.push(items.PurchaseReplyResult);
                MatchedQty.push(items.RequirementQty);
                SalesNos.push(items.SalesNos);
              });
              item.PurchaseUserName = PurchaseUserName;
              item.SupplierName = SupplierName;
              item.PurchaseOrderNo = PurchaseOrderNo;
              item.LineItem = LineItem;
              item.TransitQty = TransitQty;
              item.SupplierReplyDate = SupplierReplyDate;
              item.SupplierReplyQty = SupplierReplyQty;
              item.PurchaseReplyResult = PurchaseReplyResult;
              item.MatchedQty = MatchedQty;
              item.SalesNos = SalesNos;
            }
            item.Status = item.StatusName;
            item.MatchStatus = item.MatchStatusName;
            item.RequirementDate = splitData(item.RequirementDate);
          });
          const dataSource = list.map((item) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(",");
              }
            });
            return item;
          });
          const header = [];
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `物料需求明细_${timestamp}.xlsx`);
            this.$message.success("导出数据成功!");
          } catch (error) {
            // console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
        }
      });
    },
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

<!--
 * @Author: max
 * @Date: 2021-09-23 13:59:52
 * @LastEditTime: 2022-02-10 17:33:32
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/shipment/agc/infoPersonal/index.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-spin tip="导出中..." :spinning="isExportLod">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="申请时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="审核状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['statuscheck']" placeholder="请选择订单状态" style="width: 200px">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option value="1">已审核</a-select-option>
                    <a-select-option value="2">未审核</a-select-option>
                    <a-select-option value="3">不需要审核</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <div class="operator">
          <a-button v-if="hasPerm('export')" icon="export" type="primary" :disabled="!hasSelected" :loading="loading" @click="exportExcel" style="margin-left: 8px">导出</a-button>
          <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">导出</a-button>
          <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="onDelete()" style="margin-left: 8px">删除</a-button>
          <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
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
          :scroll="{ y: scrollY, x: 2400 }"
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
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="statuscheck" slot-scope="text">
            <div>
              <a-tag :color="text !== '1' ? 'red' : 'green'">{{ text === "2" ? "未处理" : text === "1" ? "已处理" : "不需要处理" }}</a-tag>
            </div>
          </template>
          <template slot="IsShipment" slot-scope="text">
            <div>
              <a-tag :color="text === 'N' ? 'red' : 'green'">{{ text === "N" ? "未出货" : "已出货" }}</a-tag>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div>
              <a-popconfirm title="确定删除?" @confirm="() => onDelete(record, 'Radio')" v-if="record.statuscheck != 1 || record.IsShipment == 'N'">
                <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                  <a-icon type="delete" />
                  删除
                </a>
              </a-popconfirm>
              <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')" v-if="record.statuscheck != 1 || record.IsShipment == 'N'">
                <a-icon type="edit" />
                编辑
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
import { getSupplierAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
import InfoEdit from "./infoEdit.vue";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "业务订单号",
    dataIndex: "PiNumber",
    scopedSlots: { customRender: "PiNumber" },
    align: "center",
    width: 180,
  },
  {
    title: "客户代码",
    dataIndex: "CustomerCode",
    scopedSlots: { customRender: "CustomerCode" },
    align: "center",
    width: 80,
  },
  {
    title: "出货国家",
    dataIndex: "ToCountry",
    scopedSlots: { customRender: "ToCountry" },
    align: "center",
    width: 80,
  },
  {
    title: "出货数量",
    dataIndex: "Quantity",
    scopedSlots: { customRender: "Quantity" },
    align: "center",
    width: 80,
  },
  {
    title: "货代",
    dataIndex: "ShipmentAgency",
    scopedSlots: { customRender: "ShipmentAgency" },
    align: "center",
    width: 80,
  },
  {
    title: "渠道",
    dataIndex: "Channel",
    scopedSlots: { customRender: "Channel" },
    align: "center",
    width: 80,
  },
  {
    title: "条款",
    dataIndex: "Clause",
    scopedSlots: { customRender: "Clause" },
    align: "center",
    width: 80,
  },
  {
    title: "币种",
    dataIndex: "Currency",
    scopedSlots: { customRender: "Currency" },
    align: "center",
    width: 80,
  },
  {
    title: "出货金额",
    dataIndex: "ShipmentAmount",
    scopedSlots: { customRender: "ShipmentAmount" },
    align: "center",
    width: 80,
  },
  {
    title: "是否报关",
    dataIndex: "IsApplyCustoms",
    scopedSlots: { customRender: "IsApplyCustoms" },
    align: "center",
    width: 80,
  },
  {
    title: "不报关原因",
    dataIndex: "NotApplyReason",
    scopedSlots: { customRender: "NotApplyReason" },
    align: "center",
    width: 120,
  },
  {
    title: "具体原因",
    dataIndex: "DetailReason",
    scopedSlots: { customRender: "DetailReason" },
    align: "center",
    width: 80,
  },
  {
    title: "申报品牌",
    dataIndex: "DeclaredBrand",
    scopedSlots: { customRender: "DeclaredBrand" },
    align: "center",
    width: 80,
  },
  {
    title: "货好时间",
    dataIndex: "GoodsFinishTime",
    scopedSlots: { customRender: "GoodsFinishTime" },
    align: "center",
    width: 120,
  },
  {
    title: " 预计提货时间",
    dataIndex: "GoodsPickTime",
    scopedSlots: { customRender: "GoodsPickTime" },
    align: "center",
    width: 120,
  },
  {
    title: "添加时间",
    dataIndex: "DatetimeCreated",
    scopedSlots: { customRender: "DatetimeCreated" },
    align: "center",
    width: 130,
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
    dataIndex: "statuscheck",
    scopedSlots: { customRender: "statuscheck" },
    align: "center",
    fixed: "right",
    width: 80,
  },
  {
    title: "审核状态",
    dataIndex: "IsShipment",
    scopedSlots: { customRender: "IsShipment" },
    align: "center",
    fixed: "right",
    width: 80,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 120,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { getOrderInfoAgc, deleteOrderAgc } from "@/services/shipment.js";
import { splitData } from "@/utils/util.js";
export default {
  components: { InfoEdit },
  data() {
    return {
      scrollY: "",
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
  methods: {
    splitData,
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
        createdatestart: "",
        createdateend: "",
        statuscheck: "",
      };
      getOrderInfoAgc(parmas,'getplantpersonal').then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
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
          getOrderInfoAgc(parmas,'getplantpersonal').then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
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
        PlantList: [],
      };
      if (type == "Radio") {
        parmas.PlantList.push({
          Id: item.Id,
        });
        deleteOrderAgc(parmas).then((res) => {
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
                parmas.PlantList.push({
                  Id: item.Id,
                });
              }
            });
            deleteOrderAgc(parmas).then((res) => {
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
        disabled: record.IsShipment === "Y" || record.StatusCheck === "1", // Column configuration not to be checked
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

<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-11-15 09:04:58
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/kanban.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['workshopid']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                  <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['lineid']" style="width: 200px" placeholder="请选择生产产线">
                  <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="PMC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input placeholder="请输入PMC" disabled allowClear style="width: 150px" v-decorator="['pmc']" />
                <a-button @click="userSearch" style="margin-left: 8px" shape="circle" icon="search" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产批号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入生产批号" v-decorator="['batchno']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['mitemname']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入BOM号" v-decorator="['mitemcode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['status']" placeholder="请选择计划状态" style="width: 200px">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="item.ParamCode" v-for="(item, index) in stateList" :key="index">
                    {{ item.ParamName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="生产日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" />
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
        <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
      </div>
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY, x: 2800 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="StatusName" slot-scope="text">
          <div>
            <a-tag :color="text === '待审' || text === '返工' ? 'red' : 'green'">{{ text }}</a-tag>
          </div>
        </template>
        <template slot="material" slot-scope="text, record">
          <a style="margin-right: 8px" @click="details(record)">
            <a-icon type="profile" />
            查看物料
          </a>
        </template>
        <template slot="production_remarks" slot-scope="text, record">
          <a style="margin-right: 8px" @click="remarks(record)">
            <a-icon type="profile" />
            填写生产备注
          </a>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a style="margin-right: 8px" :disabled="!hasPerm('edit')" @click="edit(record)">
              <a-icon type="edit" />
              打印工单
            </a>
            <a style="margin-right: 8px" @click="details(record)">
              <a-icon type="profile" />
              开工
            </a>
          </div>
        </template>
      </a-table>
      <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
      <remarks v-if="isEdit" :editData="editData" @closeModal="closeEditModal"></remarks>
      <a-details v-if="isDrawer" :detailsId="drawerItem.WorkOrderNo" @closeModal="closeEditModal"></a-details>
    </a-spin>
  </div>
</template>

<script>
import { getDailyPlanAction, getWorkshopList, getLineList, setDailyPlanAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width:50,
  },
  {
    title: "生产日计划批号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
    width:120
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "生产车间",
    dataIndex: "WorkShopName",
    scopedSlots: { customRender: "WorkShopName" },
    align: "center",
  },
  {
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "PMC",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
  },
  {
    title: "计划生产日期",
    dataIndex: "PlanDate",
    scopedSlots: { customRender: "PlanDate" },
    align: "center",
    width: "120px",
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "工单号",
    dataIndex: "WorkOrderNo",
    scopedSlots: { customRender: "WorkOrderNo" },
    align: "center",
  },
  {
    title: "业务订单号",
    dataIndex: "WorkOrderNo1",
    scopedSlots: { customRender: "WorkOrderNo1" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: "200px",
  },
  {
    title: " 订单交期",
    dataIndex: "OrderDeliveryDate",
    align: "center",
    width: "120px",
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "下单日期",
    dataIndex: "OrderDate",
    scopedSlots: { customRender: "OrderDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "订单数量",
    dataIndex: "OrderQty",
    scopedSlots: { customRender: "OrderQty" },
    align: "center",
  },
  {
    title: "计划数量",
    dataIndex: "PlanQty",
    scopedSlots: { customRender: "PlanQty" },
    align: "center",
    width: "100px",
  },
  {
    title: "人均标准产能",
    dataIndex: "PerCapiteCapacity",
    scopedSlots: { customRender: "PerCapiteCapacity" },
    align: "center",
  },
  {
    title: "工时",
    dataIndex: "WorkHour",
    scopedSlots: { customRender: "WorkHour" },
    align: "center",
  },
  {
    title: "物料库存情况",
    dataIndex: "MaterialShortage",
    scopedSlots: { customRender: "MaterialShortage" },
    align: "center",
    width: "150px",
  },
  {
    title: "开工日期",
    dataIndex: "StartDateTime",
    scopedSlots: { customRender: "StartDateTime" },
    align: "center",
    width: "100px",
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "生产进度",
    dataIndex: "ProductionSchedule",
    scopedSlots: { customRender: "ProductionSchedule" },
    align: "center",
    width: "120px",
  },
  {
    title: "备注",
    dataIndex: "Remarks",
    scopedSlots: { customRender: "Remarks" },
    align: "center",
    width: "100px",
  },
  {
    title: "物料领料情况",
    dataIndex: "material",
    scopedSlots: { customRender: "material" },
    align: "center",
    fixed: "right",
    width: 110,
  },
  {
    title: "生产备注",
    dataIndex: "production_remarks",
    scopedSlots: { customRender: "production_remarks" },
    align: "center",
    fixed: "right",
    width: 130,
  },
  {
    title: "状态",
    dataIndex: "StatusName",
    scopedSlots: { customRender: "StatusName" },
    align: "center",
    fixed: "right",
    width: 80,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import UserList from "@/components/app-user/UserList";
import { getParamData } from "@/services/admin.js";
import Remarks from "./remarks.vue";
import ADetails from "./details.vue";
export default {
  components: { UserList, Remarks, ADetails },
  data() {
    return {
      scrollY: "",
      loading: false,
      advanced: true,
      columns: columns,
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
      plantList: [],
      plantid: "",
      week: "",
      drawerItem: [],
      isSearch: 0,
      statistic: [],
      isUserList: false,
      isExportLod: false,
      statisticType: "",
      stateList: [],
      workshopList: [],
      lineList: [],
      workshopId: "",
      editData: [],
      isEdit: false,
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
      this.searchForm.setFieldsValue({
        batchid: this.batchid,
      });
    });
    this.getListAll();
    this.getPlant();
    this.getParamData();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    filterData() {
      return this.columns.filter((obj) => {
        if (obj.dataIndex !== "StatusName" && obj.dataIndex !== "MatchStatusName") {
          return obj.dataIndex;
        }
      });
    },
  },
  methods: {
    splitData,
    //pmc选择
    userSearch() {
      this.isUserList = true;
    },
    closeEditModal() {
      console.log("关闭")
      this.isEdit = false;
      this.isDrawer =false;
    },
    closeUserModal() {
      this.isUserList = false;
    },
    okUserModal(item) {
      this.isUserList = false;
      this.searchForm.setFieldsValue({
        pmc: item.Name,
      });
    },
    //查看详情
    details(item) {
      console.log("111====", item);
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.week = "";
      this.isSearch = 0;
      this.searchForm.resetFields();
    },
    //编辑
    remarks(item) {
      this.isEdit = true;
      this.editData = item;
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    getParamData() {
      let parmas = {
        groupcode: "DAILY_PRODUCTION_PLAN_STATUS",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.stateList = res.data.data;
        }
      });
    },
    plantChange(e) {
      if (e == "") return;
      this.plantId = e;
      this.searchForm.setFieldsValue({
        workshopid: "",
        lineid: "",
      });
      this.getWorkshopList();
    },
    //车间选择
    workshopChange(e) {
      if (e == "") return;
      this.workshopId = e;
      this.searchForm.setFieldsValue({
        lineid: "",
      });
      this.getLineList();
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDailyPlanAction(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
        }
      });
    },
    //获取车间
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
    //获取产线
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
      };
      getDailyPlanAction(parmas, "kanban/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          this.addListParmas();
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
    addListParmas(){
      this.dataSource.map((item)=>{
        item.material =""
        item.production_remarks = ""
      })
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
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
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var begindate = rangeValue[0].format("YYYY-MM-DD");
            var enddate = rangeValue[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            workshopid: values.workshopid,
            lineid: values.lineid,
            status: values.status,
            pmc: values.pmc,
            batchno: values.batchno,
            mitemcode: values.mitemcode,
            mitemname: values.mitemname,
            begindate: begindate,
            enddate: enddate,
          };
          getDailyPlanAction(parmas, "kanban/getall").then((res) => {
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
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.Id);
      setDailyPlanAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getParamGroupList();
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
      };
      getDailyPlanAction(parmas, "requirement/detail/getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          list.forEach((item) => {
            if (item.PurchaseOrderMatchList !== null && item.PurchaseOrderMatchList.length > 0) {
              let PurchaseUserName = [];
              let SupplierName = [];
              let PurchaseOrderNo = [];
              let LineItem = [];
              let TransitQty = [];
              let MatchedQty = [];
              item.PurchaseOrderMatchList.map((items) => {
                PurchaseUserName.push(items.PurchaseUserName);
                SupplierName.push(items.SupplierName);
                PurchaseOrderNo.push(items.PurchaseOrderNo);
                LineItem.push(items.LineItem);
                TransitQty.push(items.TransitQty);
                MatchedQty.push(items.RequirementQty);
              });
              item.PurchaseUserName = PurchaseUserName;
              item.SupplierName = SupplierName;
              item.PurchaseOrderNo = PurchaseOrderNo;
              item.LineItem = LineItem;
              item.TransitQty = TransitQty;
              item.MatchedQty = MatchedQty;
            }
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
/deep/.ant-table {
  min-height: 62vh;
}
</style>

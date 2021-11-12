<!--
 * @Author: max
 * @Date: 2021-10-18 08:39:23
 * @LastEditTime: 2021-11-11 15:23:02
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/BeProduced/ExportPlan.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="计划批号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入计划批号" v-decorator="['batchno', { rules: [{ required: true, message: '请输入计划批号' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
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
        <!-- <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button> -->
        <a-button v-if="hasPerm('export')" :disabled="!isExport" type="primary" @click="exportExcel" icon="export">导出</a-button>
        <a-button v-else type="primary" disabled @click="exportExcel" icon="export">导出</a-button>
      </div>
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY, x: 2000 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="RequirementDate" slot-scope="text">
          <span>{{ splitData(text) }}</span>
        </template>
      </a-table>
      <!-- 查看详情 -->
      <div>
        <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
          <a-descriptions title="详情" :column="1">
            <a-descriptions-item label="计划批号">{{ drawerItem.BatchNo }}</a-descriptions-item>
            <a-descriptions-item label="生产工厂">{{ drawerItem.PlantName }}</a-descriptions-item>
            <a-descriptions-item label="品号">{{ drawerItem.MitemCode }}</a-descriptions-item>
            <a-descriptions-item label="品名">{{ drawerItem.MitemName }}</a-descriptions-item>
            <a-descriptions-item label=" 产品规格">{{ drawerItem.Spec }}</a-descriptions-item>
            <a-descriptions-item label="需求日期">{{ drawerItem.RequirementDate }}</a-descriptions-item>
            <a-descriptions-item label="需求数量">{{ drawerItem.Qty }}</a-descriptions-item>
            <a-descriptions-item label="计划状态">
              <div>
                <a-tag :color="drawerItem.Status === 'APPROVAL' || drawerItem.Status === 'PUSHED_ERR' ? 'red' : 'green'">{{ drawerItem.StatusName }}</a-tag>
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="物料状态">
              <div>
                <a-tag :color="drawerItem.MatchStatus === 'ERR_MATCH' || drawerItem.MatchStatus === 'PUSHED_ERR' || drawerItem.MatchStatus === 'CANNOT_MATCH' || drawerItem.MatchStatus === 'NO_MATCH' ? 'red' : 'green'">{{ drawerItem.MatchStatusName }}</a-tag>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </a-drawer>
      </div>
      <user-list v-if="isUserList" @closeModal="closeUserModal" @okModal="okUserModal"></user-list>
    </a-spin>
  </div>
</template>

<script>
import { getMitemPlanAction } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { splitData } from "@/utils/util.js";
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "计划批号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
    width: 180,
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: 80,
  },
  {
    title: "子件BOM号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
    width: 180,
  },
  {
    title: "子件品名",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
    width: 180,
  },
   {
    title: "子件规格",
    dataIndex: "MitemSpec",
    scopedSlots: { customRender: "MitemSpec" },
    align: "center",
    width: 180,
  },
  {
    title: "需求日期",
    dataIndex: "RequirementDate",
    scopedSlots: { customRender: "RequirementDate" },
    align: "center",
    width: 100,
  },
  {
    title: "库存数量",
    dataIndex: "StockQty",
    scopedSlots: { customRender: "StockQty" },
    align: "center",
    width: 100,
  },
  {
    title: "待排产需求总数量",
    dataIndex: "WaitScheduleQty",
    scopedSlots: { customRender: "WaitScheduleQty" },
    align: "center",
    width: 160,
  },
  {
    title: "待产需求总数量",
    dataIndex: "WaitProductionQty",
    scopedSlots: { customRender: "WaitProductionQty" },
    align: "center",
    width: 160,
  },
  {
    title: "未来可用需求总量",
    dataIndex: "FutureAvailableQty",
    scopedSlots: { customRender: "FutureAvailableQty" },
    align: "center",
    width: 160,
  },
  {
    title: "已预留总数",
    dataIndex: "TotalReservedQty",
    scopedSlots: { customRender: "TotalReservedQty" },
    align: "center",
    width: 100,
  },
  {
    title: "可用总数",
    dataIndex: "AvailableQty",
    scopedSlots: { customRender: "AvailableQty" },
    align: "center",
    width: "5%",
  },
  {
    title: "需求数量",
    dataIndex: "PurchaseQty",
    scopedSlots: { customRender: "PurchaseQty" },
    align: "center",
    width: 100,
  },
  {
    title: "采购在途数量",
    dataIndex: "TransitQty",
    scopedSlots: { customRender: "TransitQty" },
    align: "center",
    width: 100,
  },
];
import getTableScroll from "@/utils/setTableHeight";
import UserList from "@/components/app-user/UserList";
import { PublicVar } from "@/mixins/publicVar.js";
export default {
  mixins: [PublicVar],
  components: { UserList },
  props: ["batchid"],
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      isDrawer: false,
      plantList: [],
      plantid: "",
      week: "",
      drawerItem: [],
      isSearch: false,
      isUserList: false,
      isExport: false,
      isExportLod :false
    };
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(20);
    });
    this.getListAll();
    this.getPlant();
    if (this.batchid) {
      this.$nextTick(() => {
        this.searchForm.setFieldsValue({
          batchid: this.batchid,
        });
      });
    }
  },
  methods: {
    splitData,
    //pmc选择
    userSearch() {
      this.isUserList = true;
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
    //关闭弹出框
    onClose() {
      this.isDrawer = false;
    },
    //查看详情
    details(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.week = "";
      this.isExport = false;
      this.isExportLod =false
      this.searchForm.resetFields();
    },
    weekChange(date, dateString) {
      let str = dateString.split("-");
      this.week = str[1].replace("周", "");
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getMitemPlanAction(parmas1, "result/getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
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
      getMitemPlanAction(parmas, "result/getexport").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
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
          this.dataSourcedata = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            batchno: values.batchno,
          };
          getMitemPlanAction(parmas, "result/getexport").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
              this.isExport =true;
            }
          });
          // do something
        }
      });
    },
    getCellWidth(value) {
      // 判断是否为null或undefined
      if (value == null) {
        return 10;
      } else if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        // 判断是否包含中文
        return value.toString().length * 2.1;
      } else {
        return value.toString().length * 1.1;
      }
    },
    exportExcel() {
      this.isExportLod = true;
      let inputData = this.searchForm.getFieldsValue();
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plantid: inputData.plantid,
        batchno: inputData.batchno,
      };
      getMitemPlanAction(parmas, "result/getexport").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item) => {
            let colWidth = [];
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(",");
              }
              colWidth.push(this.getCellWidth(item[key]));
              item.RequirementDate = splitData(item.RequirementDate);
            });
            return item;
          });
          const header = [];
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          try {
            ExportExcel(header, dataSource, `物料需求计划_${inputData.batchno}.xlsx`);
            this.$message.success("导出数据成功!");
          } catch (error) {
            console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less"></style>

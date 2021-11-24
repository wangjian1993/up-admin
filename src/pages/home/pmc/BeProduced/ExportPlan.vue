<!--
 * @Author: max
 * @Date: 2021-10-18 08:39:23
 * @LastEditTime: 2021-11-24 18:19:19
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
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY, x: 2300 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
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
      <div>
        <a-modal title="下载进度" :width="400" centered :closable="false" :visible="processVisible" :footer="null">
          <div class="baseinfo">
            <a-progress :percent="percent" class="baseProgess" />
          </div>
          <div class="baseinfoFoot">
            <span class="baseinfoing"> {{ progressUp }}</span>
          </div>
        </a-modal>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { getMitemPlanAction } from "@/services/web.js";
// import ExportExcel from "@/utils/ExportExcelJS";
import { exportjsontoexcelMore } from "@/utils/exportExcel";
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
    title: "子件品号",
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
  {
    title: "PMC",
    dataIndex: "Pmcs",
    scopedSlots: { customRender: "Pmcs" },
    align: "center",
    width: 100,
  },
  {
    title: "业务单号",
    dataIndex: "SalesOrderNos",
    scopedSlots: { customRender: "SalesOrderNos" },
    align: "center",
    width: 100,
  },
];
const excelHead = [
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
  {
    title: "PMC",
    dataIndex: "Pmcs",
    scopedSlots: { customRender: "Pmcs" },
    align: "center",
    width: 100,
  },
  {
    title: "业务单号",
    dataIndex: "SalesOrderNos",
    scopedSlots: { customRender: "SalesOrderNos" },
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
      isExportLod: false,
      processVisible: false,
      percent: 100,
      progressUp: "下载中,请稍候.......",
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
      this.isExportLod = false;
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
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
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
              this.isExport = true;
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
    getExcelList() {
      let inputData = this.searchForm.getFieldsValue();
      return new Promise((resolve, reject) => {
        let parmas = {
          pageindex: this.pagination.current,
          pagesize: 500,
          plantid: inputData.plantid,
          batchno: inputData.batchno,
        };
        getMitemPlanAction(parmas, "result/getexport").then((res) => {
          if (res.data.success) {
            let list = res.data.data.list;
            resolve(list);
          } else {
            reject();
          }
        });
      });
    },
    async waitData() {
      let n = await this.getExcelList();
      return n;
    },
    exportFn(list) {
      let inputData = this.searchForm.getFieldsValue();
      let _data = [];
      let excelArray = [];
      let mergeTitle = [];
      const hear = ["计划批号", "生产工厂", "子件品号", "子件品名", "子件规格", "需求日期", "库存数量", "待排产需求总数量", "待产需求总数量", "未来可用需求总量", "已预留总数", "可用总数", "需求数量", "采购在途数量", "PMC", "业务单号"];
      _data.push(hear);
      list.map((item) => {
        let array = [];
        excelHead.map((items) => {
          array.push(item[items.dataIndex]);
        });
        _data.push(array);
      });
      console.log(_data);
      const sheetCols = [
        { wch: 18 }, // 序号
        { wch: 15 }, // 阶次
        { wch: 18 }, // 类型
        { wch: 20 }, // 上阶BOM号
        { wch: 20 }, // 品号
        { wch: 20 }, // 料名
        { wch: 8 }, //  产品规格
        { wch: 8 }, // 单位
        { wch: 8 }, // 价格来源
        { wch: 8 }, // E10单价
        { wch: 8 }, // 单价
        { wch: 8 }, // 用量
        { wch: 8 }, // 金额
        { wch: 8 }, // 提示
        { wch: 20 }, // 备注
        { wch: 20 }, // 备注
      ];
      let contentList = [];
      let merges2 = []; // 设置表格内容单元格合并
      let aoa = [..._data, ...contentList]; // 导出的数据
      let merges = [...mergeTitle, ...merges2]; // 合并单元格
      let formStyle = {};
      excelArray.push({
        Sheet: `物料需求计划`, // 下方tab切换名称
        data: aoa, // 表格数据
        merges, //  合并单元格
        autoWidth: false, // 自适应宽度
        formStyle: formStyle, // 特殊行或列样式
        sheetCols,
      });
      try {
        exportjsontoexcelMore({
          dataList: excelArray,
          bookType: "xlsx", // 导出类型
          filename: `物料需求计划_${inputData.batchno}`, // 导出标题名
        });
        this.$message.success("导出数据成功!");
        this.percent = 100;
        this.progressUp = "下载已完成";
        this.processVisible = false;
        this.pagination.current =1;
      } catch (error) {
        this.$message.error("导出数据失败");
      }
      // const dataSource = list;
      // const header = [];
      // this.columns.map((item) => {
      //   if (item.dataIndex) {
      //     header.push({ key: item.dataIndex, title: item.title });
      //   }
      // });
      // try {
      //   console.log("header", header);
      //   console.log("dataSource", dataSource);
      //   ExportExcel(header, dataSource, `物料需求计划_${inputData.batchno}.xlsx`);
      //   this.$message.success("导出数据成功!");
      // } catch (error) {
      //   console.log(error);
      //   this.$message.error("导出数据失败");
      // }
      this.isExportLod = false;
    },
    exportExcel() {
      setInterval(() => {
        this.percent++;
        if (this.percent == 90) {
          this.percent = 90;
          this.progressUp = "下载中,请稍候.......";
        }
      }, 500);
      this.isExportLod = true;
      this.processVisible = true;
      this.percent = 0;
      let total = this.pagination.total;
      if (total <= 500) {
        this.getExcelList().then((res) => {
          console.log(res);
          this.exportFn(res);
        });
      } else {
        let ssidTimes = Math.ceil(total / 500);
        let arr = [];
        for (let i = 0; i < ssidTimes; ++i) {
          arr.push(this.waitData());
          this.pagination.current += 1;
        }
        Promise.all(arr)
          .then((res) => {
            let list = res.flat();
            this.exportFn(list);
            // loading.close();
          })
          .catch((err) => {
            //  loading.close();
            console.log("error", err);
          });
      }
    },
  },
};
</script>

<style scoped lang="less"></style>

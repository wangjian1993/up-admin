<!--
 * @Author: max
 * @Date: 2021-12-17 09:09:57
 * @LastEditTime: 2023-05-08 10:22:49
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/kanban/time/index.vue
-->
<template>
  <div >
    <a-card class="card power-conter" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <div class="content-head"><p>深圳民爆光电股份有限公司</p></div>
      <a-row>
        <a-col :span="12">
          <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="false" @change="handleTableChange" :rowKey="(dataSource, index) => dataSource.ProcessId + '_' + index" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table></a-col
        >
        <a-col :span="12">
          <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="false" @change="handleTableChange" :rowKey="(dataSource, index) => dataSource.ProcessId + '_' + index" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table></a-col
        >
      </a-row>
      <a-row>
        <a-col :span="12"> <div ref="chartColumn" style="width:100%;height:400px;"></div></a-col>
        <a-col :span="12"></a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { getProcessAgingList } from "@/services/mes.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import * as echarts from "echarts";
const columns = [
  {
    title: "时间段",
    dataIndex: "Time",
    scopedSlots: { customRender: "Time" },
    align: "center",
  },
  {
    title: "A线",
    dataIndex: "LineA",
    scopedSlots: { customRender: "LineA" },
    align: "center",
  },
  {
    title: "B线",
    dataIndex: "LineB",
    scopedSlots: { customRender: "LineB" },
    align: "center",
  },
  {
    title: "C线",
    dataIndex: "LineC",
    scopedSlots: { customRender: "LineC" },
    align: "center",
  },
  {
    title: "小计",
    dataIndex: "subtotal",
    scopedSlots: { customRender: "subtotal" },
    align: "center",
  },
  {
    title: "累计",
    dataIndex: "accumulative",
    scopedSlots: { customRender: "accumulative" },
    align: "center",
  },
];
export default {
  mixins: [PublicVar],
  data() {
    return {
      advanced: true,
      columns,
      dataSource: [],
      isDrawer: false,
      plantList: [],
      plantid: "",
      week: "",
      drawerItem: [],
      isSearch: 0,
      statistic: [],
      isUserList: false,
      chartColumn: null,
    };
  },
  created() {
    // this.search();
    // this.getPlant();
    let timeArray = this.generateTimes();
    timeArray.forEach((item) => {
      this.dataSource.push({
        Time: item,
      });
    });
    setTimeout(() => {
      this.initChart();
    }, 100);
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    splitData,
    generateTimes() {
      let timeArrays = new Array(24).fill("");
      timeArrays.forEach((item, index) => (timeArrays[index] = (index < 10 ? "0" + index : index) + ":00" + " - " + (index + 1 < 10 ? "0" + (index + 1) : index + 1) + ":00"));
      return timeArrays;
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.search();
    },
    initChart() {
      this.chartColumn = echarts.init(this.$refs.chartColumn);
      let option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
          },
        ],
      };
      this.chartColumn.setOption(option);
    },
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getProcessAgingList(params1, "getlistbytypecode").then((res) => {
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
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getProcessAgingList(params, "getall").then((res) => {
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
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var startdate = rangeValue[0].format("YYYY-MM-DD");
            var enddate = rangeValue[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            mocode: values.mocode,
            startdate: startdate,
            enddate: enddate,
          };
          getProcessAgingList(params, "getall").then((res) => {
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
    exportExcel() {
      this.isExportLod = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
      };
      getProcessAgingList(params, "getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
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
            ExportExcel(header, dataSource, `报工列表_${timestamp}.xlsx`);
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
.content-head {
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-size: 30px;
    font-weight: 700;
  }
}
.power-conter{
  background: url('../../../../../assets/img/pageBg.png');
}
</style>

<!--
 * @Author: max
 * @Date: 2022-04-01 17:32:54
 * @LastEditTime: 2022-06-17 14:12:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyReport/index.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
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
                <a-form-item label="订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入订单号" v-decorator="['orderno']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="工单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入工单号" v-decorator="['mocode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['procode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
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
          <a-button v-if="hasPerm('export')" :disabled="dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button v-else type="primary" @click="exportExcel" icon="export">导出</a-button>
        </div>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY, x: 2800 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getDailyReport } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./data";
export default {
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      isDrawer: false,
      plantList: [],
      plantid: "",
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
      isPrint: false,
      printData: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getListAll();
    this.getPlant();
  },
  methods: {
    splitData,
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
      getDailyReport(parmas1, "getplantlist").then((res) => {
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
      getDailyReport(parmas, "getworkshoplist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    //获取产线
    getLineList() {
      let parmas = {
        workshop: this.workshopId,
      };
      getDailyReport(parmas, "getlinelist").then((res) => {
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
      getDailyReport(parmas, "daily/getall").then((res) => {
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
    addListParmas() {
      this.dataSource.map((item) => {
        item.material = "";
        item.production_remarks = "";
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
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
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
            workshop: values.workshopid,
            line: values.lineid,
            orderno: values.orderno,
            mocode: values.mocode,
            procode: values.procode,
            stratdate: begindate,
            enddate: enddate,
          };
          getDailyReport(parmas, "daily/getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = 2;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    //单个删除
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
        const rangeValue = values["range-time-picker"];
        var begindate = rangeValue[0].format("YYYY-MM-DD");
        var enddate = rangeValue[1].format("YYYY-MM-DD");
      }
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plantid: values.plantid,
        workshop: values.workshopid,
        line: values.lineid,
        orderno: values.orderno,
        mocode: values.mocode,
        procode: values.procode,
        stratdate: begindate,
        enddate: enddate,
      };
      getDailyReport(parmas, "daily/getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item) => {
            Object.keys(item).forEach((key) => {
              console.log(key);
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(",");
              }
              if (key == "ProDate") {
                console.log("1111");
                item[key] = splitData(item[key]);
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
            ExportExcel(header, dataSource, `生产日报表_${timestamp}.xlsx`);
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
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>

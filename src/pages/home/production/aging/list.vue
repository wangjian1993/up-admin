<!--
 * @Author: max
 * @Date: 2021-12-17 09:09:57
 * @LastEditTime: 2022-01-12 15:10:57
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/aging/list.vue
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
              <a-form-item label="生产日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="工单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入生产批号" v-decorator="['mocode']" />
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
        <a-button :disabled="!hasPerm('export')" type="primary" @click="exportExcel" icon="export">导出</a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        size="small"
        :scroll="{ y: scrollY, x: 2400 }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(dataSource,index) => dataSource.ProcessId +'_'+index"
        bordered
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { getAgeingApi } from "@/services/web.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { splitData } from "@/utils/util.js";
import { columns } from "./list.data";
import { PublicVar } from "@/mixins/publicVar.js";
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
      isExportLod: false,
    };
  },
  created() {
    this.$nextTick(() => {
      let tHeader = document.getElementsByClassName("ant-table-thead")[1];
      console.log(tHeader)
      let tHeaderBottom = tHeader.getBoundingClientRect().bottom;
      let height = `calc(100vh - ${tHeaderBottom + 70}px)`;
      console.log("height",height)
      this.scrollY = height
    });
    this.getListAll();
    this.getPlant();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.getListAll();
      this.isSearch = 0;
      this.searchForm.resetFields();
    },
    plantChange(e) {
      if (e == "") return;
      this.plantId = e;
    },
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getAgeingApi(parmas1, "getlistbytypecode").then((res) => {
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
      getAgeingApi(parmas, "getall").then((res) => {
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
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var startdate = rangeValue[0].format("YYYY-MM-DD");
            var enddate = rangeValue[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            mocode: values.mocode,
            startdate: startdate,
            enddate: enddate,
          };
          getAgeingApi(parmas, "getall").then((res) => {
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
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
      };
      getAgeingApi(parmas, "getall").then((res) => {
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
/deep/.ant-table {
  min-height: 66vh;
  overflow: auto;
}
</style>


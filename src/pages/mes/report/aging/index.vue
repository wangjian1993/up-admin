<!--
 * @Author: max
 * @Date: 2022-04-01 17:32:54
 * @LastEditTime: 2023-04-24 16:46:48
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/report/aging/index.vue
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
                  <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="工单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入工单号" v-decorator="['mocode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="业务单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入业务单号" v-decorator="['orderno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号/品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号/品名" v-decorator="['mitem']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="老化日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a-popover v-model="poped" trigger="click" placement="leftBottom">
              <template slot="title">
                <a-checkbox :checked="chkAll" :indeterminate="indeterminate" @change="ckAllChange">全部</a-checkbox>
              </template>
              <template slot="content">
                <a-checkbox-group v-model="ckValues" :options="columnList" @change="ckChange" style="width: 120px;">
                  <span slot="label" :title="option.title" slot-scope="option" style="width:300px">{{ option.title }}</span>
                </a-checkbox-group>
                <a-divider style="margin:5px; " />
                <a-space>
                  <a-button type="primary" size="small" @click="createColumns">确认</a-button>
                  <a-button type="primary" size="small" @click="poped = false">取消</a-button>
                </a-space>
              </template>
              <a-button type="primary" style="margin:0 10px;" icon="table" shape="circle" />
            </a-popover>
          </span>
        </a-form>
        <div class="operator">
          <a-button v-if="hasPerm('export')" :disabled="dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button v-else type="primary" @click="exportExcel" icon="export">导出</a-button>
        </div>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY, x: true }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource, index) => dataSource.OrderNo + '_' + index" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <template slot="Plant" slot-scope="text, record">
            <span>{{ record.PlantName }}/{{ record.WorkShopName }}/{{ record.LineName }}</span>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getReportList } from "@/services/mes.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columnsData } from "./data.js";
export default {
  mixins: [PublicVar],
  data() {
    return {
      ckValues: [], //checkgroup设置值
      chkAll: true, //全选
      indeterminate: false, //模糊状态
      poped: false, //弹窗显示
      columns: [], //显示列
      columnList: columnsData, //全部列
      scrollY: "",
      advanced: true,
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
      processList: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(100);
      let local = JSON.parse(localStorage.getItem("AGING_COLUMN"));
      console.log(" this.columnList===", this.columnList);
      this.columnList.forEach((col) => {
        col.value = col.dataIndex; //设置value值，用于checkedgroup
      });
      if (local) {
        this.ckValues = [];
        local.forEach((col) => {
          this.ckValues.push(col.value);
        });
      } else {
        this.createChGroupValue(); //初始全部选中
      }
      this.createColumns(); //生成显示列
      // this.setDelCol(); //设置删除标记列的显示样式
      let primaryKey = this.columns.find((f) => f.primaryKey == true);
      if (primaryKey) {
        this.primaryKey = primaryKey.dataIndex;
      }
    });
    this.search();
    this.getPlant();
  },
  methods: {
    splitData,
    createChGroupValue() {
      this.ckValues = [];
      this.columnList.forEach((col) => {
        this.ckValues.push(col.value);
      });
    },
    ckChange(checkedList) {
      console.log("checkedList===", this.columnList);
      this.indeterminate = !!checkedList.length && checkedList.length < this.columnList.length;
      this.chkAll = checkedList.length === this.columnList.length;
    },
    ckAllChange(e) {
      this.chkAll = e.target.checked;
      this.indeterminate = false;
      if (this.chkAll) {
        this.createChGroupValue();
      } else {
        this.ckValues = [];
      }
    },
    createColumns() {
      if (this.ckValues.length == 0) {
        this.$message.error("请至少留下一列");
        return;
      }
      this.columns = [];
      this.ckValues.forEach((item) => {
        let col = this.columnList.find((f) => f.dataIndex == item);
        console.log("col===", col);
        if (col) {
          this.columns.push(col);
        }
      });
      this.poped = false;
      localStorage.setItem("AGING_COLUMN", JSON.stringify(this.columns));
    },
    //重置搜索
    reset() {
      this.week = "";
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.search();
    },
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getReportList(params1, "getplantlist").then((res) => {
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
    searchBtn() {
      this.pagination.current = 1;
      this.search();
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
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            mocode: values.mocode,
            orderno: values.orderno,
            stratdate: begindate,
            enddate: enddate,
            mitem: values.mitem,
          };
          getReportList(params, "ageing/getreports").then((res) => {
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
    strTime(data) {
      if (data !== null && data !== "" && data !== undefined) {
        let str = data.split("T");
        let time = str[1].split(".");
        return str[0] + " " + time[0];
      }
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
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plantid: values.plantid,
        mocode: values.mocode,
        orderno: values.orderno,
        stratdate: begindate,
        enddate: enddate,
        mitem: values.mitem,
      };
      getReportList(params, "ageing/getreports").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item, index) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }

              if (key === "FinishedDateTime") {
                item[key] = this.strTime(item.FinishedDateTime);
              }
              if (key === "StartDateTime") {
                item[key] = this.strTime(item.StartDateTime);
              }
              // console.log("item====", item[key]);
              item.ProDate = splitData(item.ProDate);
              // item.FinishedDateTime = this.strTime(item.FinishedDateTime);
              // item.StartDateTime = this.strTime(item.StartDateTime);
              item.index = index + 1;
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
            ExportExcel(header, dataSource, `老化明细报表_${timestamp}.xlsx`);
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

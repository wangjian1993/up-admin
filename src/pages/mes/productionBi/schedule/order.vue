<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2022-08-30 17:37:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/schedule/order.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <h2 style="text-align: center">生产工单总进度看板</h2>
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="工单" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入到货单号" v-decorator="['mocode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入生产订单号" v-decorator="['orderno']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号/品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号/品名" v-decorator="['procode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="display:flex;justify-content: flex-end">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </a-form>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" @change="handleTableChange" :pagination="pagination" :rowKey="(dataSource, index) => dataSource.DocNo + '_' + index" bordered>
          <!-- //前加工 -->
          <template v-for="(item, index) in rateList" :slot="item.slot" slot-scope="text">
            <div :key="index">
              <a-tooltip v-if="text.length != 0">
                <template slot="title">
                  <p>开工时间:{{ splitDate(text.StartDate) }}</p>
                  <p>完工时间:{{ splitDate(text.EndDate) }}</p>
                </template>
                <div class="rate-box">
                  <p :style="'width:' + text.CompletionRate + '%;background:' + item.color + ';margin:0;display:flex; border-radius: 5px; height: 30px;max-width:100%;'"></p>
                  <span class="rate-num">{{ text.ProedQty + "/" + text.MoQty }}</span>
                  <span class="rate-num1">{{ text.CompletionRate + "%" }}</span>
                </div>
              </a-tooltip>
            </div>
          </template>
          <!-- <template slot="AssemblyProcess" slot-scope="text">
            <div>
              <div class="rate-box" v-if="text.length != 0">
                <p :style="'width:' + text.CompletionRate + '%;background:#349969;margin:0;display:flex; border-radius: 5px; height: 30px;'"></p>
                <span class="rate-num">{{ text.ProedQty + "/" + text.MoQty + " " + text.CompletionRate + "%" }}</span>
              </div>
            </div>
          </template>
          <template slot="AgeingProcess" slot-scope="text">
            <div>
              <div class="rate-box" v-if="text.length != 0">
                <p :style="'width:' + text.CompletionRate + '%;background:#349969;margin:0;display:flex; border-radius: 5px; height: 30px;'"></p>
                <span class="rate-num">{{ text.ProedQty + "/" + text.MoQty + " " + text.CompletionRate + "%" }}</span>
              </div>
            </div>
          </template>
          <template slot="PackingProcess" slot-scope="text">
            <div>
              <div class="rate-box" v-if="text.length != 0">
                <p :style="'width:' + text.CompletionRate + '%;background:#349969;margin:0;display:flex; border-radius: 5px; height: 30px;'"></p>
                <span class="rate-num">{{ text.ProedQty + "/" + text.MoQty + " " + text.CompletionRate + "%" }}</span>
              </div>
            </div>
          </template> -->
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getOrderBi } from "@/services/mes.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./order";
export default {
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      deviceTypeList: [],
      isSearch: 0,
      isExportLod: false,
      selectedRowKeys: [],
      rateList: [
        { slot: "PreAssemblyProcess", color: "rgba(0,187,255,.4)" },
        { slot: "AssemblyProcess", color: "rgba(80,227,194,.4)" },
        { slot: "AgeingProcess", color: "rgba(255,115,115,.4)" },
        { slot: "PackingProcess", color: "rgba(155,207,107,.4)" },
      ],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });

    this.search();
  },
  methods: {
    splitDate(str) {
      let t = str.split("T");
      let m = t[1].split(".");
      return t[0] + " " + m[0];
    },
    //重置搜索
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.search();
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.search();
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log(values["range-time-picker1"]);
          if (values["range-time-picker1"] != undefined && values["range-time-picker1"].length == 2) {
            var startdate = values["range-time-picker1"][0].format("YYYY-MM-DD");
            var enddate = values["range-time-picker1"][1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            mocode: values.mocode,
            enddate: enddate,
            startdate: startdate,
            orderno: values.orderno,
            procode: values.procode,
          };
          getOrderBi(params, "get").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              this.dataSource.forEach((item) => {
                item.AgeingProcess = item.AgeingProcess == null ? [] : item.AgeingProcess;
                item.AssemblyProcess = item.AssemblyProcess == null ? [] : item.AssemblyProcess;
                item.PackingProcess = item.PackingProcess == null ? [] : item.PackingProcess;
                item.PreAssemblyProcess = item.PreAssemblyProcess == null ? [] : item.PreAssemblyProcess;
              });
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
  },
};
</script>

<style lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
.rate-box {
  height: 30px;
  line-height: 30px;
  width: 200px;
  max-width: 200px;
  overflow: hidden;
  border-radius: 5px;
  background: #e3e3e3;
  position: relative;
}
.rate-num {
  position: absolute;
  top: 0;
  left: 0;
  color: #000;
  display: inline-block;
  padding: 0 5px;
}
.rate-num1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
}
</style>

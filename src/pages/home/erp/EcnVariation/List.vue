<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2022-01-05 11:42:23
 * @LastEditors: max
 * @Description: bom工程变更单
 * @FilePath: /up-admin/src/pages/home/erp/EcnVariation/List.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-form layout="horizontal" :form="searchForm">
      <div :class="advanced ? null : 'fold'">
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="需求工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid', { rules: [{ required: true, message: '请选择需求工厂' }] }]" style="width: 200px" placeholder="请选择需求工厂">
                <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="ECN变更单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入ECN变更单号" allowClear style="width: 200px" v-decorator="['ecnchangeorder']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="主件品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入主件BOM号" allowClear style="width: 200px" v-decorator="['itemcodep']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="元件品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入元件BOM号" allowClear style="width: 200px" v-decorator="['itemcodec']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="advanced">
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <!-- <a-select style="width: 120px" default-value="A" v-decorator="['approvestatus']">
                <a-select-option value="A">
                  全部
                </a-select-option>
                <a-select-option value="N">
                  未审核
                </a-select-option>
                <a-select-option value="Y">
                  已审核
                </a-select-option>
              </a-select> -->
              <a-select default-value="全部" style="width: 120px" v-decorator="['approvestatus', { initialValue: 'A' }]">
                <a-select-option value="A">
                  全部
                </a-select-option>
                <a-select-option value="N">
                  未审核
                </a-select-option>
                <a-select-option value="Y">
                  已审核
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="单据日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="审核日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24">
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-table v-if="hasPerm('search')" ref="tableRef" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 2000 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.ECN_ID" bordered :customRow="handleClickRow" :components="components">
      <template slot="index" slot-scope="text, record, index">
        <div>
          <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div>
          <a style="margin-right: 8px" @click="detail(record)">
            <a-icon type="profile" />
            查看
          </a>
        </div>
      </template>
      <template slot="ApproveStatus" slot-scope="text">
        <a-tag :color="text === 'Y' ? 'green' : text === 'N' ? '#0000ff' : 'red'">{{ text == "Y" ? "生效" : text == "N" ? "未生效" : "失效" }}</a-tag>
      </template>
      <template slot="ITEM_PROPERTY" slot-scope="text">
        <span>{{ modelType(text) }}</span>
      </template>
      <template slot="ITEM_TYPE" slot-scope="text">
        <span>{{ feedSystem(text) }}</span>
      </template>
      <template slot="DOC_DATE" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
      <template slot="ApproveDate" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
      <template slot="EXPRITY_DATE" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <variation-info v-if="isDosage" :info="mitemcodeData" @closeModal="closeModal"></variation-info>
  </a-card>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import VariationInfo from "./VariationInfo.vue";
import { feedSystem, modelType, stateType } from "@/utils/BomParmas.js";
import { columns } from "./data";
import { PublicVarErp } from "@/mixins/publicVarErp.js";
import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  components: { VariationInfo },
  mixins: [PublicVarErp],
  data() {
    this.components = {
      header: {
        cell: (h, props, children) => resizeableTitle(h, props, children, this.columns),
      },
    };
    return {
      data: [],
      columns,
      isDosage: false,
      isExecl: false,
      isDetail: false,
      advanced: false,
      detailData: [],
      plantList: [],
      mitemcodeData: [],
      ScrollPosition: 0,
    };
  },
  activated() {
    this.$refs.tableRef.$el.querySelector(".ant-table-body").scrollTop = this.ScrollPosition;
    console.log(this.$refs.tableRef);
  },
  beforeRouteLeave(to, from, next) {
    this.ScrollPosition = this.$refs.tableRef.$el.querySelector(".ant-table-body").scrollTop;
    next();
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getPlant();
  },
  methods: {
    splitData,
    modelType,
    feedSystem,
    stateType,
    closeModal() {
      this.isDosage = false;
    },
    //物料需求详情
    detail(item) {
      this.isDosage = true;
      this.mitemcodeData = item;
    },
    getPlant() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getERPReportAction(parmas, "getenterlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].PlantId,
          });
        }
      });
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        plantid: this.plantId,
        itemcode: "",
        bomdate: "",
        approvestatus: "",
        createdatestart: "",
        createdateend: "",
        lastmodifieddatestart: "",
        lastmodifieddateend: "",
      };
      getERPReportAction(parmas, "bomreversequery").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
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
    //重置搜索
    reset() {
      this.data = [];
      this.week = "";
      this.loading = false;
      this.searchForm.resetFields();
      this.pagination.current = 1;
      this.pagination.total = 0;
      this.getPlant();
      this.searchForm.setFieldsValue({
        approvestatus: "A",
      });
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          if (values.ecnchangeorder !== "" && values.ecnchangeorder !== undefined) {
            if ((values.itemcodep !== undefined && values.itemcodep !== "") || (values.itemcodec !== undefined && values.itemcodec !== "")) {
              this.$message.warning("查询条件:ECN变更单号与元件品号不能同时查询");
              this.loading = false;
              return;
            }
          }
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue1 = values["range-time-picker1"];
            var docdatestart = rangeValue1[0].format("YYYY-MM-DD");
            var docdateend = rangeValue1[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] && values["range-time-picker2"].length == 2) {
            const rangeValue2 = values["range-time-picker2"];
            var approvedatestart = rangeValue2[0].format("YYYY-MM-DD");
            var approvedateend = rangeValue2[1].format("YYYY-MM-DD");
          }
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid || "",
            itemcodep: values.itemcodep || "",
            itemcodec: values.itemcodec || "",
            ecnchangeorder: values.ecnchangeorder || "",
            approvestatus: values.approvestatus || "A",
            docdatestart: docdatestart || "",
            docdateend: docdateend || "",
            approvedatestart: approvedatestart || "",
            approvedateend: approvedateend || "",
          };
          getERPReportAction(parmas, "getecnchangeorder").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = true;
            }else {
              this.data = [];
              this.pagination.current = 1;
              this.pagination.total = 0;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    handleClickRow(record) {
      return {
        style: {
          // 行背景色
          cursor: "pointer",
        },
        on: {
          dblclick: () => {
            this.isDosage = true;
            this.mitemcodeData = record;
          },
        },
      };
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
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  font-size: 10px;
}
// /deep/.ant-table-row-cell-break-word {
//   white-space: nowrap;
//   overflow: hidden;
// }
</style>

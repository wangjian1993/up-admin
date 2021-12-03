<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-12-03 09:26:14
 * @LastEditors: max
 * @Description: BOM多级反查
 * @FilePath: /up-admin/src/pages/home/erp/BomReverseQuery/List.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-form layout="horizontal" :form="searchForm">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="需求工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择需求工厂">
                <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="元件品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入元件品号" allowClear style="width: 200px" v-decorator="['itemcode', { rules: [{ required: true, message: '请输入元件品号' }] }]" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select style="width: 120px" v-decorator="['approvestatus']">
                <a-select-option value="A">
                  全部
                </a-select-option>
                <a-select-option value="N">
                  未生效
                </a-select-option>
                <a-select-option value="V">
                  失效
                </a-select-option>
                <a-select-option value="Y">
                  生效
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="BOM日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-date-picker v-decorator="['bomdate']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-item label="录入日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="最后修改日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24">
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 1800 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.BOM_ID" bordered :customRow="handleClickRow">
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
        <a-tag :color="text !== 'Y' ? 'red' : 'green'">{{ text == "Y" ? "生效" : "不生效" }}</a-tag>
      </template>
      <template slot="ITEM_PROPERTY" slot-scope="text">
        <span>{{ modelType(text) }}</span>
      </template>
      <template slot="ITEM_TYPE" slot-scope="text">
        <span>{{ feedSystem(text) }}</span>
      </template>
      <template slot="APPROVEDATE_ECN" slot-scope="text">
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
    <erp-dosage v-if="isDosage" :info="mitemcodeData" @closeModal="closeModal"></erp-dosage>
  </a-card>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import ErpDosage from "../components/ErpDosage.vue";
import { feedSystem, modelType, stateType } from "@/utils/BomParmas.js";
import { columns } from "./data";
import { PublicVar } from "@/mixins/publicVar.js";
export default {
  components: { ErpDosage },
  mixins: [PublicVar],
  data() {
    return {
      data: [],
      columns,
      isDosage: false,
      isExecl: false,
      isDetail: false,
      detailData: [],
      plantList: [],
      mitemcodeData: [],
    };
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
      this.searchForm.setFieldsValue({
        approvestatus: "A",
      });
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
      let values = this.searchForm.getFieldsValue();
      this.mitemcodeData.plantId = values.plantid;
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
      this.searchForm.resetFields();
      this.data = [];
      this.getPlant();
      this.searchForm.setFieldsValue({
        approvestatus: "A",
      });
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          this.pagination.total = 0;
          if (values["bomdate"]) {
            var bomdate = values["bomdate"].format("YYYY-MM-DD");
          }
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue1 = values["range-time-picker1"];
            var createdatestart = rangeValue1[0].format("YYYY-MM-DD");
            var createdateend = rangeValue1[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] && values["range-time-picker2"].length == 2) {
            const rangeValue2 = values["range-time-picker2"];
            var lastmodifieddatestart = rangeValue2[0].format("YYYY-MM-DD");
            var lastmodifieddateend = rangeValue2[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid || "",
            itemcode: values.itemcode || "",
            bomdate: bomdate || "",
            approvestatus: values.approvestatus,
            createdatestart: createdatestart || "",
            createdateend: createdateend || "",
            lastmodifieddatestart: lastmodifieddatestart || "",
            lastmodifieddateend: lastmodifieddateend || "",
          };
          getERPReportAction(parmas, "bomreversequery").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = true;
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
            let values = this.searchForm.getFieldsValue();
            this.mitemcodeData.plantId = values.plantid;
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
</style>

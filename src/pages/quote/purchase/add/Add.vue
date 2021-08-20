<!--
 * @Author: max
 * @Date: 2021-08-17 10:58:13
 * @LastEditTime: 2021-08-18 18:05:20
 * @LastEditors: max
 * @Description: 新建采购报价
 * @FilePath: /up-admin/src/pages/quote/purchase/add/Add.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="产品品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品号" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="需求公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select placeholder="请选择需求公司">
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-select placeholder="请选择生产工厂">
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <span style="float: left; margin-top: 5px;">
                  <a-button type="primary" @click="searchClick">查询</a-button>
                  <a-button style="margin-left: 8px">重置</a-button>
                </span>
              </a-col>
            </a-row>
            <a-row v-if="advanced">
              <a-col :md="6" :sm="24">
                <a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品大类" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品型号" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="产品品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品号" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="产品规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                  <a-input placeholder="请输入产品品号" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
      </div>
    </a-card>
    <!-- <a-card>
      <a-descriptions title="">
        <a-descriptions-item label="产品品号">{{ bomDetail.item_code }}</a-descriptions-item>
        <a-descriptions-item label="产品大类"><a-input placeholder="" type="text" :value="bomDetail.one_sort" @change="sortInput"/></a-descriptions-item>
        <a-descriptions-item label="产品型号"><a-input placeholder="" type="text" :value="bomDetail.two_sort" @change="typeInput"/></a-descriptions-item>
        <a-descriptions-item label="产品品名">{{ bomDetail.item_name }}</a-descriptions-item>
        <a-descriptions-item label="产品规格">{{ bomDetail.item_specification }}</a-descriptions-item>
      </a-descriptions>
    </a-card> -->
    <a-card class="card" title="填写报价单" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px', minHeight: '30px' }">
      <div id="input-box" v-if="costList.length">
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" :xxl="12" v-for="(item, index) in costList.cost_options" :key="index">
            <div class="input-item" v-if="item.field_name != 'bom_cost' && item.field_name != 'total_cost'">
              <p class="input-lable">{{ item.cost_name }}:</p>
              <p class="input-number">
                <a-input-number :disabled="item.is_readonly == 1" v-model="item.value" :min="0" @change="costNumber(item)" />
              </p>
              <p class="input-text">{{ item.tips_desc }}</p>
            </div>
          </a-col>
        </a-row>
      </div>
      <a-empty v-else :image="simpleImage" />
    </a-card>
    <a-card class="card" title="物料" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px', minHeight: '30px' }">
      <standard-table :pagination="pagination" :columns="columns" :dataSource="tableData">
        <div slot="price" slot-scope="{ record, index }">
          <a-input-number :id="record.key" v-model="record.price" :min="0" @change="priceNumber(record, index)" />
        </div>
        <div slot="action" slot-scope="{ record, index }">
          <a><a-input @change="remarkInput(record, index)" :value="record.remark"/></a>
        </div>
      </standard-table>
    </a-card>
  </div>
</template>

<script>
import { getBomSerchList, getCompanyBomCost } from "@/services/bom.js";
import StandardTable from "@/components/table/StandardTable";
const columns = [
  {
    title: "阶次",
    dataIndex: "lv",
    width: "5%",
  },
  {
    title: "类型",
    dataIndex: "property",
    width: "5%",
  },
  {
    title: "上阶料号",
    dataIndex: "last_code",
    ellipsis: true,
    width: "10%",
  },
  {
    title: "料号",
    dataIndex: "code",
    ellipsis: true,
  },
  {
    title: "料名",
    dataIndex: "name",
    ellipsis: true,
  },
  {
    title: "料规格",
    dataIndex: "specification",
    ellipsis: true,
  },
  {
    title: "单位",
    dataIndex: "unit_name",
  },
  {
    title: "E10单价",
    dataIndex: "E10",
    scopedSlots: { customRender: "e10" },
    width: "5%",
  },
  {
    title: "单价",
    dataIndex: "price",
    scopedSlots: { customRender: "price" },
  },
  {
    title: "用量",
    dataIndex: "yl",
    width: "5%",
  },
  {
    title: "金额",
    dataIndex: "row_amount",
  },
  {
    title: "提示",
    dataIndex: "row_tips",
    width: "5%",
  },
  {
    title: "备注",
    scopedSlots: { customRender: "action" },
  },
];
import { Empty } from 'ant-design-vue';
export default {
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      bomDetail: [],
      costList: [],
      tableData: [],
      columns,
      pagination: false,
      materialTotal: 0,
      ultimatelyTotal: 0,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: "",
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  },
  created() {
    // this.searchClick();
    // this.getCompanyBomCost();
  },
  methods: {
    searchClick() {
      let parmas = {
        bom_code: "1-03009602-012041009",
        act: "get_bom_detail",
      };
      getBomSerchList(parmas).then((res) => {
        console.log(res.data);
        if (res.data.success) {
          this.bomDetail = res.data.data.main_data[0];
          var sum = 0;
          this.tableData = res.data.data.child_data;
          let list = res.data.data.child_data;
          list.forEach((item) => {
            sum += item.price * item.yl;
          });
          let material = this.costList.cost_options;
          material.map((item) => {
            if (item.field_name == "bom_cost" || item.field_name == "total_cost") {
              item.value = parseFloat(sum.toFixed(4));
              this.materialTotal = parseFloat(sum.toFixed(4));
              this.ultimatelyTotal = parseFloat(sum.toFixed(4));
            }
          });
        }
      });
    },
    //获取配置信息
    getCompanyBomCost() {
      let parmas = {
        company_sign: "up",
        act: "get_latest_cost_version",
      };
      getCompanyBomCost(parmas).then((res) => {
        if (res.data.success) {
          this.costList = res.data.data;
        }
      });
    },
    //产品大类输入
    sortInput(e) {
      this.bomDetail.one_sort = e.target.value;
    },
    //产品型号输入
    typeInput(e) {
      this.bomDetail.two_sort = e.target.value;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
};
</script>

<style lang="less">
.input-item {
  display: flex;
  align-items: center;
  .input-lable {
    width: 100px;
    text-align: right;
  }
  .input-number {
    padding-left: 5px;
  }
  .input-text {
    padding-left: 5px;
  }
}
.ant-card-body {
  padding: 0;
}
.ant-card-head-title {
  padding: 0;
}
.ant-form-item {
  margin-bottom: 0;
}
/deep/.card {
  margin: 10px 0;
}
</style>

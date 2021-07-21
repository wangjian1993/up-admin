<template>
  <div class="card">
    <a-tabs default-active-key="1" @change="callback" size="small">
      <a-tab-pane key="1" tab="BOM费用-查询发布"
        ><bom-issue
          @onSearch="searchClick"
          :searchDisabled="searchDisabled"
        ></bom-issue
      ></a-tab-pane>
      <a-tab-pane key="2" tab="BOM费用-发布记录"
        ><bom-record></bom-record
      ></a-tab-pane>
    </a-tabs>
    <div class="loading" v-if="serachLod">
      <a-spin tip="加载中..." />
    </div>
    <details-list
      v-if="isSearch"
      :pagination="pagination"
      :columns="columns"
      :detailData="bomDetail"
      :costList="costList"
      @setTotalPrice="setTotalPrice"
      @countItemPrice="countItemPrice"
      @setMaterialTotal="setMaterialTotal"
    ></details-list>
    <footer-tool-bar>
      <template v-slot:extra>
        <div class="total">
          <span>物料成本:{{ materialTotal }}</span>
          <span>最终成本:{{ ultimatelyTotal }}</span>
        </div>
      </template>
      <a-button type="dashed" style="margin-right: 10px;">导出</a-button>
      <a-button type="primary" @click="bomForm">{{
        tabIndex == 1 ? "提交" : "更新"
      }}</a-button>
    </footer-tool-bar>
  </div>
</template>
<script>
import detailsList from "../components/Details.vue";
import BomIssue from "./issue/index.js";
import BomRecord from "./record/index.js";
import { inputList } from "@/mock/common/bomData.js";
import FooterToolBar from "@/components/tool/FooterToolBar";
import { getBomSerchList, getCompanyBomCost } from "@/services/bom.js";
const columns = [
  {
    title: "阶次",
    dataIndex: "lv",
  },
  {
    title: "类型",
    dataIndex: "property",
  },
  {
    title: "上阶料号",
    dataIndex: "last_code",
  },
  {
    title: "料号",
    dataIndex: "code",
  },
  {
    title: "料名",
    dataIndex: "name",
  },
  {
    title: "料规格",
    dataIndex: "specification",
  },
  {
    title: "单位",
    dataIndex: "unit_name",
  },
  {
    title: "E10单价",
    dataIndex: "E10",
    scopedSlots: { customRender: "e10" },
  },
  {
    title: "单价",
    dataIndex: "price",
    scopedSlots: { customRender: "price" },
  },
  {
    title: "用量",
    dataIndex: "yl",
  },
  {
    title: "金额",
    dataIndex: "row_amount",
  },
  {
    title: "提示",
    dataIndex: "row_tips",
  },
  {
    title: "备注",
    scopedSlots: { customRender: "action" },
  },
];
import { bomForm } from "@/services/bom.js";
export default {
  data() {
    return {
      inputList: inputList,
      columns: columns,
      selectedRows: false,
      isSearch: false,
      pagination: false,
      tabIndex: 0,
      serachLod: false,
      bomDetail: [],
      costList: [],
      searchDisabled: false,
      materialTotal: 0,
      ultimatelyTotal: 0,
      cost_version: 0,
    };
  },
  created() {
    this.getCompanyBomCost();
  },
  methods: {
    callback(key) {
      console.log(key);
      this.tabIndex = key;
    },
    searchClick(value) {
      console.log(value);
      this.serachLod = true;
      this.searchDisabled = true;
      // this.isSearch =!this.isSearch
      let parmas = {
        bom_code: "1-03009602-012041009",
        act: "get_bom_detail",
      };
      getBomSerchList(parmas).then((res) => {
        console.log(res.data);
        if (res.data.code == 1) {
          this.serachLod = false;
          this.isSearch = true;
          this.searchDisabled = false;
          this.bomDetail = res.data.data;
          var sum = 0;
          let list = res.data.data.child_data;
          list.forEach((item) => {
            sum += item.price * item.yl;
          });
          let material = this.costList.cost_options;
          console.log(material);
          material.map((item) => {
            if (
              item.field_name == "bom_cost" ||
              item.field_name == "total_cost"
            ) {
              item.value = parseFloat(sum.toFixed(4));
              this.materialTotal = parseFloat(sum.toFixed(4));
              this.ultimatelyTotal = parseFloat(sum.toFixed(4));
            }
          });
        }
      });
    },
    getCompanyBomCost() {
      let parmas = {
        company_sign: "up",
        act: "get_latest_cost_version",
      };
      getCompanyBomCost(parmas).then((res) => {
        if (res.data.code == 1) {
          this.costList = res.data.data;
        }
      });
    },
    //最终成本增加
    setTotalPrice(total) {
      this.ultimatelyTotal = total;
    },
    //物料成本增加
    setMaterialTotal(total) {
      this.materialTotal = total;
      let material = this.costList.cost_options;
      material.map((item) => {
        if (item.field_name == "bom_cost") {
          item.value = total;
        }
      });
    },
    countItemPrice(item, index) {
      let price = item.price * item.yl;
      this.bomDetail.child_data[index].row_amount = price;
      this.materialTotal = price;
      this.ultimatelyTotal = price;
    },
    //提交bom信息
    bomForm() {
      var cost = [];
      this.costList.cost_options.forEach((item) => {
        if (item.field_name == "bom_cost") {
          let obj = {
            field_name: item.field_name, //字段名
            cost_name: item.cost_name, //费用名称
            the_price: this.materialTotal, //价格
          };
          cost.push(obj);
        } else if (item.field_name == "total_cost") {
          let obj = {
            field_name: item.field_name, //字段名
            cost_name: item.cost_name, //费用名称
            the_price: this.ultimatelyTotal, //价格
          };
          cost.push(obj);
        } else {
          let obj = {
            field_name: item.field_name, //字段名
            cost_name: item.cost_name, //费用名称
            the_price: item.value || 0, //价格
          };
          cost.push(obj);
        }
      });
      let parmas = {
        act: "publish_bom_version",
        bom_main: {
          item_code: this.bomDetail.main_data[0].item_code,
          one_sort: this.bomDetail.main_data[0].item_code,
          two_sort: this.bomDetail.main_data[0].two_sort,
          item_name: this.bomDetail.main_data[0].item_name,
          item_specification: this.bomDetail.main_data[0].item_specification,
          remark: "",
          cost_version: this.costList.version_code,
          group_in: "",
          adder: "UP-14450",
        },
        bom_child: [...this.bomDetail.child_data],
        bom_cost: [...cost],
      };
      bomForm(parmas).then((res) => {
        if (res.data.code == 1) {
          console.log(res);
        }
      });
    },
  },
  components: { detailsList, FooterToolBar, BomIssue, BomRecord },
};
</script>
<style type="text/css" lang="less">
.card {
  background-color: @base-bg-color;
  padding: 0px;
}
.loading {
  display: flex;
  justify-content: center;
  padding: 50px 0;
}
.total {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: @text-color;
  span {
    &:nth-of-type(2) {
      padding-left: 30px;
    }
  }
}
</style>

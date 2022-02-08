<!--
 * @Author: max
 * @Date: 2021-09-08 09:21:40
 * @LastEditTime: 2022-02-07 09:57:30
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/Details.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="报价单详情" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions title="基本信息" :column="4" bordered size="small">
            <a-descriptions-item label="需求公司">
              {{ info.EnterpriseName }}
            </a-descriptions-item>
            <a-descriptions-item label="需求工厂">
              {{ info.PlantName }}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{ info.ItemCode }}
            </a-descriptions-item>
            <a-descriptions-item label="产品大类">
              {{ info.ItemSort }}
            </a-descriptions-item>
            <a-descriptions-item label="品名" :span="2">
              {{ info.ItemName }}
            </a-descriptions-item>
            <a-descriptions-item :span="2">
              <template v-slot:label>
                <span style="color:red">物料成本</span>
              </template>
              {{ info.MaterialCost }}
            </a-descriptions-item>
            <a-descriptions-item label=" 产品规格" :span="4">
              {{ info.ItemSpecification }}
            </a-descriptions-item>
            <a-descriptions-item :span="2">
              <template v-slot:label>
                <span style="color:red">备注</span>
              </template>
              <span style="color:red">{{ info.Remark }}</span>
            </a-descriptions-item>
            <a-descriptions-item :span="2">
              <template v-slot:label>
                <span style="color:red">最终成本</span>
              </template>
              {{ info.FinalCost }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-descriptions style="padding:5px 0" :title="item.CostSort" v-for="(item, index) in ConfigList" :key="index" :column="6" bordered size="small">
            <a-descriptions-item v-for="(items, indexs) in item.list" :key="indexs + 'cost'" :label="items.CostName">
              {{ items.Amount }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card title="物料列表" class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-form layout="inline" :form="keywordForm">
              <a-form-item label="关键字匹配">
                <a-input v-model="keyword" allowClear @change="listSearch" />
              </a-form-item>
            </a-form>
            <a-tabs default-active-key="1" @change="callback">
              <a-tab-pane key="1" tab="展开显示">
                <a-table :columns="columns" :data-source="searchList" :size="size" :scroll="{ y: 600 }" :pagination="pagination" :rowKey="(searchList) => searchList.CodeId" bordered>
                  <div slot="e10" slot-scope="text, record">
                    <p>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</p>
                  </div>
                  <template slot="Index" slot-scope="text, record, index">
                    <div>
                      <span>{{index + 1 }}</span>
                    </div>
                  </template>
                  <div slot="Amount2" slot-scope="text, record">
                    <p>{{ text }}</p>
                    <a style="margin-right: 8px" @click="historyAmount(record, 1)">
                      <a-icon type="history" />
                      历史价格
                    </a>
                  </div>
                </a-table>
              </a-tab-pane>
              <a-tab-pane key="2" tab="收缩显示">
                <a-table :columns="columns" :data-source="treeData" :size="size" :scroll="{ y: 600 }" :pagination="pagination" :rowKey="(treeData) => treeData.IndexNo + 'tab2'" bordered>
                  <div slot="e10" slot-scope="text, record">
                    <span>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</span>
                  </div>
                  <div slot="Amount2" slot-scope="text, record">
                    <p>{{ text }}</p>
                    <a style="margin-right: 8px" @click="historyAmount(record, 2)">
                      <a-icon type="history" />
                      历史价格
                    </a>
                  </div>
                </a-table>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </div>
        <HistoryAmount v-if="isHistoryAmount" :historyAmountData="historyAmountData" :info="info" @closeModal="closeModal" :amounType="amounType" />
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "品号",
    dataIndex: "ChildCode",
    width: "14%",
    align: "left",
  },
  {
    title: "阶次",
    dataIndex: "LvNo",
    width: "4%",
    align: "center",
  },
  {
    title: "序号",
    dataIndex: "Index",
    scopedSlots: { customRender: "Index" },
    align: "center",
    width: "4%",
  },
  {
    title: "上阶品号",
    dataIndex: "LastCode",
    align: "center",
  },
  {
    title: "类型",
    dataIndex: "Property",
    scopedSlots: { customRender: "Property" },
    width: "5%",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ChildName",
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "ChildSpecification",
    align: "center",
    width: "15%",
  },
  {
    title: "单位",
    dataIndex: "UnitName",
    align: "center",
    width: "4%",
  },
  {
    title: "E10单价",
    dataIndex: "PriceErp",
    scopedSlots: { customRender: "e10" },
    align: "center",
    width: "8%",
  },
  {
    title: "单价",
    dataIndex: "Price",
    scopedSlots: { customRender: "Price" },
    align: "center",
    width: "5%",
  },
  {
    title: "用量",
    dataIndex: "Yl",
    align: "center",
    width: "4%",
  },
  {
    title: "金额",
    dataIndex: "Amount",
    align: "center",
    width: "5%",
  },
  {
    title: "最新金额",
    dataIndex: "Amount2",
    scopedSlots: { customRender: "Amount2" },
    align: "center",
    width: 100,
  },
  {
    title: "提示",
    dataIndex: "Tips",
    scopedSlots: { customRender: "Tips" },
    align: "center",
    width: "5%",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getCostConfig } from "@/services/web.js";
import HistoryAmount from "./HistoryAmount.vue";
export default {
  components: { HistoryAmount },
  props: ["detailsId"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      list: [],
      info: [],
      pagination: false,
      ConfigList: [],
      loading: false,
      treeData: [],
      keywordForm: this.$form.createForm(this),
      searchList: [],
      keyword: "",
      isHistoryAmount: false,
      historyAmountData: [],
      amounType: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    historyAmount(item, type) {
      this.isHistoryAmount = true;
      this.historyAmountData = item;
      this.amounType = type;
    },
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isHistoryAmount = false;
    },
    arrayGroup(arr) {
      var map = {},
        dest = [];
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.CostSort]) {
          dest.push({
            CostSort: ai.CostSort,
            list: [ai],
          });
          map[ai.CostSort] = ai;
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j];
            if (dj.CostSort == ai.CostSort) {
              dj.list.push(ai);
              break;
            }
          }
        }
      }
      return dest;
    },
    getList() {
      this.loading = true;
      let parmas = {
        Id: this.detailsId,
      };
      getCostConfig(parmas, "getquotedetail").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.ItemInfo.ItemChildList;
          this.list.forEach((item,index) => {
            item.CodeId = item.ChildCode + "_" + item.LastCode + "_" + index;
          });
          this.searchList = this.list;
          this.info = res.data.data.ItemInfo;
          this.ConfigList = this.arrayGroup(res.data.data.ConfigList);
          // let data = [];
          // this.list.forEach((item) => {
          //   {
          //     if (item.LastCode !== this.info.ItemCode) {
          //       data.push(item);
          //     }
          //   }
          // });
          this.treeData = this.initTree(this.info.ItemCode);
          this.calField(this.treeData);
        }
        this.loading = false;
      });
    },
    calField(tree) {
      tree.forEach((node) => {
        if (node.children && node.children.length > 0) {
          // console.log(node.children)
          this.calField(node.children);
          node.Amount = node.Amount * 1 + node.children.reduce((sum, item) => ((sum += item.Amount), parseFloat(sum.toFixed(4))), 0);
          node.Amount2 = node.Amount2 * 1 + node.children.reduce((sum, item) => ((sum += item.Amount2), parseFloat(sum.toFixed(4))), 0);
          console.log("node.Amount===", node.Amount);
        } else {
          let sum = node.Amount * 1;
          node.Amount = parseFloat(sum.toFixed(4));
          let sum2 = node.Amount2 * 1;
          node.Amount2 = parseFloat(sum2.toFixed(4));
          delete node.children;
        }
      });
      console.log("tree===", tree);
      return tree;
    },
    initTree(parent_id) {
      console.log(parent_id);
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.list.filter((item) => item.LastCode == parent_id);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(item.ChildCode),
      }));
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
    callback(key) {
      console.log(key);
    },
    //列表搜索
    listSearch(e) {
      let keyword = e.target.value;
      this.searchList = this.list.filter((product) => {
        return Object.keys(product).some((key) => {
          return (
            String(product[key])
              .toLowerCase()
              .indexOf(keyword.toLowerCase()) > -1
          );
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/.ant-table {
  min-height: 77vh;
  max-height: 77vh;
  overflow: auto;
}
</style>

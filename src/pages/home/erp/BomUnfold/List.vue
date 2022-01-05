<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2022-01-05 11:41:54
 * @LastEditors: max
 * @Description: BOM多级展开
 * @FilePath: /up-admin/src/pages/home/erp/BomUnfold/List.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-form layout="horizontal" :form="searchForm">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="需求工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid', { rules: [{ required: true, message: '请选择需求工厂' }] }]" style="width: 200px" placeholder="请选择需求工厂">
                <a-select-option v-for="item in plantList" :key="item.PlantId" :value="item.PlantId">{{ item.PlantName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="主件品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="主件品号" allowClear style="width: 200px" v-decorator="['itemcode', { rules: [{ required: true, message: '请输入主键品号' }] }]" />
            </a-form-item>
          </a-col>
          <!-- <a-col :md="6" :sm="24">
            <a-form-item label="主件品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入主键品名" allowClear style="width: 200px" v-decorator="['itemname']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="产品规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入产品规格" allowClear style="width: 200px" v-decorator="['itemspecification']" />
            </a-form-item>
          </a-col> -->
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
    <a-table v-if="hasPerm('search')" ref="tableRef" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 2000 }" :loading="loading" :pagination="false" @change="handleTableChange" :rowKey="(data) => data.BOM_ID" bordered :customRow="handleClickRow" @expand="fatherExpand" :expandedRowKeys="expandedRowKeys">
      <a-table slot="expandedRowRender" :loading="expandLoading" size="small" :rowKey="(innerData, index) => innerData.ITEM_CODE + '_' + index" :columns="innerColumns" :data-source="innerData" :customRow="handleClickRow2" :pagination="false" bordered>
        <template slot="ITEM_PROPERTY" slot-scope="text">
          <span>{{ modelType(text) }}</span>
        </template>
      </a-table>
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
      <template slot="ApproveDate" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
      <template slot="LastModifiedDate" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
      <template slot="CreateDate" slot-scope="text">
        <span>{{ splitData(text) }}</span>
      </template>
    </a-table>
    <a-empty v-else description="暂无权限" />
    <erp-dosage v-if="isDosage" :info="mitemcodeData" @closeModal="closeModal"></erp-dosage>
    <model-info v-if="isModelInfo" :modelData="modelData" @closeModal="closeModal"></model-info>
  </a-card>
</template>
<script>
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import ErpDosage from "../components/ErpDosage.vue";
import ModelInfo from "../components/ModelInfo.vue";
import { columns, innerColumns } from "./data";
import { PublicVarErp } from "@/mixins/publicVarErp.js";
// import { resizeableTitle } from "@/utils/resizeableTitle.js";
export default {
  components: { ErpDosage, ModelInfo },
  mixins: [PublicVarErp],
  data() {
    return {
      data: [],
      columns,
      innerColumns,
      innerData: [],
      isDosage: false,
      isExecl: false,
      isDetail: false,
      detailData: [],
      plantList: [],
      mitemcodeData: [],
      expandLoading: false,
      expandedRowKeys: [],
      treeList: [],
      isModelInfo: false,
      modelData: [],
      itemcodesign: "",
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
      this.scrollY = getTableScroll(25);
    });
    this.getPlant();
  },
  methods: {
    splitData,
    modelType,
    closeModal() {
      this.isDosage = false;
      this.isModelInfo = false;
    },
    itemFiltrete(type, text) {
      switch (type) {
        case "itemcode":
          this.itemcodesign = text;
          break;
        case "itemname":
          this.itemnamesign = text;
          break;
        case "itemspecification":
          this.itemspecificationsign = text;
          break;
      }
      this.search();
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
          this.plantId = this.plantList[0].PlantId;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].PlantId,
          });
          // this.getListAll();
        }
      });
    },
    calField(tree) {
      tree.forEach((node) => {
        if (node.children && node.children.length > 0) {
          // console.log(node.children)
          this.calField(node.children);
          // node.Amount = node.children.reduce((sum, item) => ((sum += item.Amount), parseFloat(sum.toFixed(4))), 0);
        } else {
          // let sum = node.Amount * 1;
          // node.Amount = parseFloat(sum.toFixed(4));
          delete node.children;
        }
      });
      return tree;
    },
    initTree(parent_id) {
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.treeList.filter((item) => item.LAST_ITEM_CODE == parent_id);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(item.ITEM_CODE),
      }));
    },
    //获取列表数据
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        plantid: this.plantId,
        itemcode: "",
        itemname: "",
        itemspecification: "",
      };
      getERPReportAction(parmas, "getbomlist").then((res) => {
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
    //展开
    async fatherExpand(expanded, record) {
      this.expandedRowKeys = [];
      this.innerData = [];
      if (expanded) {
        this.expandLoading = true;
        await this.getChildList(record);
      }
      // if (expanded) {
      //   await this.getChild(record)
      //   this.expandedRowKeys.push(record.iid)
      // } else {
      //   this.expandedRowKeys.splice(this.expandedRowKeys.indexOf(record.iid), 1)
      // }
    },
    getChildList(record) {
      this.expandedRowKeys.push(record.BOM_ID);
      let values = this.searchForm.getFieldsValue();
      let parmas = {
        plantid: values.plantid,
        itemcode: record.ITEM_CODE,
      };
      getERPReportAction(parmas, "getbomchildlevel").then((res) => {
        if (res.data.success) {
          this.treeList = res.data.data.list;
          console.log(this.treeList);
          this.innerData = this.initTree(record.ITEM_CODE);
          this.calField(this.innerData);
        }
        this.expandLoading = false;
      });
    },
    //重置搜索
    reset() {
      this.data = [];
      this.week = "";
      this.searchForm.resetFields();
      this.getPlant();
      this.pagination.current = 1;
      this.pagination.total = 0;
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            itemcode: values.itemcode,
            itemname: values.itemname || "",
            itemspecification: values.itemspecification || "",
            itemcodesign: "等于",
            itemspecificationsign: "",
            itemnamesign: "",
            drawingnosign: "",
            drawingno: "",
            approvestatus: "",
          };
          getERPReportAction(parmas, "getbomlist").then((res) => {
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
    handleClickRow2(record) {
      return {
        style: {
          // 行背景色
          cursor: "pointer",
        },
        on: {
          dblclick: () => {
            console.log(record);
            this.isModelInfo = true;
            this.modelData.ITEM_CODE = record.ITEM_CODE;
            this.modelData.plantid = this.searchForm.getFieldsValue().plantid;
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
/deep/.ant-table-row-expand-icon {
  width: 22px;
  height: 22px;
  line-height: 17px;
}
/deep/.ant-table {
  font-size: 10px;
}
// /deep/.ant-table-row-cell-break-word {
//   white-space: nowrap;
//   overflow: hidden;
// }
</style>

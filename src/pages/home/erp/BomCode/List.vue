<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-10-28 17:01:25
 * @LastEditors: max
 * @Description: BOM查询
 * @FilePath: /up-admin/src/pages/home/erp/BomCode/List.vue
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
            <a-form-item label="BOM号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入BOM号" allowClear style="width: 200px" v-decorator="['itemcode']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入产品型号" allowClear style="width: 200px" v-decorator="['itemname']" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="产品规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入产品规格" allowClear style="width: 200px" v-decorator="['itemspecification']" />
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
    <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY, x: 3800 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.ITEM_BUSINESS_ID" bordered :customRow="handleClickRow">
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
    <model-info v-if="isModelInfo" :modelData="mitemcodeData" @closeModal="closeModal"></model-info>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 250,
  },
  {
    title: "工厂编号",
    dataIndex: "PLANT_CODE_P",
    scopedSlots: { customRender: "PLANT_CODE_P" },
    align: "center",
    width: 80,
  },
  {
    title: "工厂/储运",
    dataIndex: "PLANT_NAME_P",
    scopedSlots: { customRender: "PLANT_NAME_P" },
    align: "center",
    width: 80,
  },
  {
    title: "快捷码",
    dataIndex: "SHORTCUT",
    scopedSlots: { customRender: "SHORTCUT" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "产品型号",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "center",
    width: 250,
    ellipsis: true,
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "center",
    width: 300,
    ellipsis: true,
  },
  {
    title: "状态",
    dataIndex: "ApproveStatus",
    scopedSlots: { customRender: "ApproveStatus" },
    align: "center",
    width: 120,
  },
  {
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "库存单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 80,
  },
  {
    title: "采购单位",
    dataIndex: "UNIT_NAME_S",
    scopedSlots: { customRender: "UNIT_NAME_S" },
    align: "center",
    width: 80,
  },
  {
    title: "品号类型",
    dataIndex: "ITEM_PROPERTY",
    scopedSlots: { customRender: "ITEM_PROPERTY" },
    align: "center",
    width: 80,
  },
  {
    title: "默认入库仓库",
    dataIndex: "WAREHOUSE_CODE_I",
    scopedSlots: { customRender: "WAREHOUSE_CODE_I" },
    align: "center",
    width: 150,
  },
  {
    title: "默认入库仓库名称",
    dataIndex: "WAREHOUSE_NAME_I",
    scopedSlots: { customRender: "WAREHOUSE_NAME_I" },
    align: "center",
    width: 150,
  },
  {
    title: "默认出库仓库",
    dataIndex: "WAREHOUSE_CODE_O",
    scopedSlots: { customRender: "WAREHOUSE_CODE_O" },
    align: "center",
    width: 150,
  },
  {
    title: "默认出库仓库名称",
    dataIndex: "WAREHOUSE_NAME_O",
    scopedSlots: { customRender: "WAREHOUSE_NAME_O" },
    align: "center",
    width: 150,
  },
  {
    title: "批号管理",
    dataIndex: "LOT_CONTROL",
    scopedSlots: { customRender: "LOT_CONTROL" },
    align: "center",
    width: 80,
    customRender: (text) => {
      return text == "N" ? "需要" : text == "T" ? " 需要且检查库存量" : "需要不检查库存量";
    },
  },
  {
    title: "品控模式",
    dataIndex: "INSPECT_MODE",
    scopedSlots: { customRender: "INSPECT_MODE" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return text == 1 ? "免检" : text == 2 ? "执行质检流程" : "仅记录质检结果";
    },
  },
  {
    title: "工艺管理",
    dataIndex: "ITEM_ROUTING_CONTROL",
    scopedSlots: { customRender: "ITEM_ROUTING_CONTROL" },
    align: "center",
    width: 80,
    customRender: (text) => {
      return text == 0 ? "不启用" : text == 1 ? "按品号设置" : "按特征码设置";
    },
  },
  {
    title: "是否并批开单",
    dataIndex: "IS_CONSOLIDATED",
    scopedSlots: { customRender: "IS_CONSOLIDATED" },
    align: "center",
    width: 120,
    customRender: (text) => {
      return text == 'N' ? "否" : "是";
    },
  },
  {
    title: "标准工艺路线",
    dataIndex: "ROUTING_CODE",
    scopedSlots: { customRender: "ROUTING_CODE" },
    align: "center",
    width: 120,
  },
  {
    title: "标准工艺路线说明位",
    dataIndex: "ROUTING_DES",
    scopedSlots: { customRender: "ROUTING_DES" },
    align: "center",
    width: 200,
  },
  {
    title: "工作中心编号",
    dataIndex: "WORK_CENTER_CODE",
    scopedSlots: { customRender: "WORK_CENTER_CODE" },
    align: "center",
    width: 150,
  },
  {
    title: "工作中心名称",
    dataIndex: "WORK_CENTER_NAME",
    scopedSlots: { customRender: "WORK_CENTER_NAME" },
    align: "center",
    width: 150,
  },
  {
    title: "生产部门编号",
    dataIndex: "ADMIN_UNIT_CODE",
    scopedSlots: { customRender: "ADMIN_UNIT_CODE" },
    align: "center",
    width: 150,
  },
  {
    title: "生产部门名称",
    dataIndex: "ADMIN_UNIT_NAME",
    scopedSlots: { customRender: "ADMIN_UNIT_NAME" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    fixed: "right",
    width: 100,
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
import ModelInfo from "../components/ModelInfo.vue";
export default {
  components: { ModelInfo },
  data() {
    return {
      data: [],
      columns,
      loading: false,
      isModelInfo: false,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      selectedRows: [],
      isExecl: false,
      selectedRowKeys: [],
      scrollY: "",
      searchForm: this.$form.createForm(this),
      week: "",
      isSearch: false,
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
    });
    this.getPlant();
  },
  methods: {
    splitData,
    modelType,
    closeModal() {
      this.isModelInfo = false;
    },
    //物料需求详情
    detail(item) {
      this.isModelInfo = true;
      this.mitemcodeData = item;
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
      getERPReportAction(parmas, "getbominfo").then((res) => {
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
      this.getListAll();
      this.week = "";
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          // console.log("Received values of form: ", values.week);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            itemcode: values.itemcode,
            itemname: values.itemname || "",
            itemspecification: values.itemspecification || "",
          };
          getERPReportAction(parmas, "getbominfo").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
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
            console.log(record);
            this.isModelInfo = true;
            this.mitemcodeData = this.searchForm.getFieldsValue();
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

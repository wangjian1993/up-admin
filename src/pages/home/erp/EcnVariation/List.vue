<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-10-30 14:30:15
 * @LastEditors: max
 * @Description: bom工程变更单
 * @FilePath: /up-admin/src/pages/home/erp/EcnVariation/List.vue
-->
<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-form layout="horizontal" :form="searchForm">
      <div>
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="需求工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select v-decorator="['plantid',{ rules: [{ required: true, message: '请选择需求工厂' }] }]" style="width: 200px" placeholder="请选择需求工厂">
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
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select style="width: 120px" v-decorator="['approvestatus']">
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
            </span>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <a-table v-if="hasPerm('search')" :columns="columns" :data-source="data" size="small" :scroll="{ y: scrollY,x:2000 }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(data) => data.ECN_ID" bordered :customRow="handleClickRow">
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
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: 50,
  },
  {
    title: "ECN单号",
    dataIndex: "DOC_NO",
    scopedSlots: { customRender: "DOC_NO" },
    align: "center",
    width: 200,
  },
  {
    title: "单据类型",
    dataIndex: "DOC_NAME",
    scopedSlots: { customRender: "DOC_NAME" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "单据日期",
    dataIndex: "DOC_DATE",
    scopedSlots: { customRender: "DOC_DATE" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "变更原因",
    dataIndex: "DESCRIPTION_1",
    scopedSlots: { customRender: "DESCRIPTION_1" },
    align: "center",
    width: 200,
    ellipsis: true,
  },
  {
    title: "变更原因说明",
    dataIndex: "REASON_DESC",
    scopedSlots: { customRender: "REASON_DESC" },
    align: "center",
    width: 150,
  },
  {
    title: "变更部门",
    dataIndex: "ADMIN_UNIT_NAME_T",
    scopedSlots: { customRender: "ADMIN_UNIT_NAME_T" },
    align: "center",
    width: 80,
  },
  {
    title: "主办人",
    dataIndex: "EMPLOYEE_NAME_T",
    scopedSlots: { customRender: "EMPLOYEE_NAME_T" },
    align: "center",
    width: 150,
    ellipsis: true,
  },
  {
    title: "变更范围",
    dataIndex: "CONTENT",
    scopedSlots: { customRender: "CONTENT" },
    align: "center",
    width: 80,
  },
  {
    title: "专案负责人",
    dataIndex: "EMPLOYEE_NAME",
    scopedSlots: { customRender: "EMPLOYEE_NAME" },
    align: "center",
    width: 80,
  },
  {
    title: "紧急等级",
    dataIndex: "DESCRIPTION_2",
    scopedSlots: { customRender: "DESCRIPTION_2" },
    align: "center",
    width: 80,
  },
  {
    title: "审核码",
    dataIndex: "ApproveStatus",
    scopedSlots: { customRender: "ApproveStatus" },
    align: "center",
    width: 60,
  },
  {
    title: "审核日期",
    dataIndex: "ApproveDate",
    scopedSlots: { customRender: "ApproveDate" },
    align: "center",
    width: 110,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: 100,
  },
];
import getTableScroll from "@/utils/setTableHeight";
import { renderStripe } from "@/utils/stripe.js";
import { getERPReportAction } from "@/services/erp.js";
import { splitData } from "@/utils/util.js";
import VariationInfo from "./VariationInfo.vue";
import { feedSystem, modelType,stateType} from "@/utils/BomParmas.js";
export default {
  components: { VariationInfo },
  data() {
    return {
      data: [],
      columns,
      loading: false,
      isDosage: false,
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
      this.data =[];
      this.week = "";
      this.searchForm.resetFields();
      this.getPlant();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          if(values.itemcodep == undefined && values.itemcodec == undefined && values.ecnchangeorder == undefined){
            this.$message.warning("请输入查询条件:ECN变更单号,主件品号,元件品号")
            this.loading = false;
            return;
          }
          this.loading = true;
          this.pagination.total = 0;
          if (values["range-time-picker1"]) {
            const rangeValue1 = values["range-time-picker1"];
            var docdatestart = rangeValue1[0].format("YYYY-MM-DD");
            var docdateend = rangeValue1[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"]) {
            const rangeValue2 = values["range-time-picker2"];
            var approvedatestart = rangeValue2[0].format("YYYY-MM-DD");
            var approvedateend = rangeValue2[1].format("YYYY-MM-DD");
          }
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid || "",
            itemcodep: values.itemcodep || "",
            itemcodec: values.itemcodec || "",
            ecnchangeorder: values.ecnchangeorder || "",
            approvestatus: values.approvestatus,
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
/deep/div {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}
</style>

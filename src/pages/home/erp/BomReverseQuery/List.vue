<!--
 * @Author: max
 * @Date: 2021-10-14 11:30:23
 * @LastEditTime: 2021-10-27 09:39:37
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
            <a-form-item label="BOM号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input placeholder="请输入BOM号" allowClear style="width: 200px" v-decorator="['itemcode', { rules: [{ required: true, message: '请输入BOM号' }] }]" />
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
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "3%",
  },
  {
    title: "主件品号",
    dataIndex: "ITEM_CODE",
    scopedSlots: { customRender: "ITEM_CODE" },
    align: "center",
    width: 250,
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
    title: "图号",
    dataIndex: "DRAWING_NO",
    scopedSlots: { customRender: "DRAWING_NO" },
    align: "center",
    width: 150,
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
    title: "单位",
    dataIndex: "UNIT_NAME",
    scopedSlots: { customRender: "UNIT_NAME" },
    align: "center",
    width: 50,
  },
  {
    title: "组成用量",
    dataIndex: "QTY_PER",
    scopedSlots: { customRender: "QTY_PER" },
    align: "center",
  },
  {
    title: "底数",
    dataIndex: "DENOMINATOR",
    scopedSlots: { customRender: "DENOMINATOR" },
    align: "center",
  },
  {
    title: "固定损耗量",
    dataIndex: "FIXED_LOSS_RATE",
    scopedSlots: { customRender: "FIXED_LOSS_RATE" },
    align: "center",
    width: 100,
  },
  {
    title: "变动损耗",
    dataIndex: "DYNAMIC_LOSS_RATE",
    scopedSlots: { customRender: "DYNAMIC_LOSS_RATE" },
    align: "center",
    width: 80,
  },
  {
    title: "备注",
    dataIndex: "REMARK",
    scopedSlots: { customRender: "REMARK" },
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
import { splitData } from "@/utils/util.js";
import ErpDosage from "../components/ErpDosage.vue";
import { feedSystem, modelType,stateType} from "@/utils/BomParmas.js";
export default {
  components: { ErpDosage },
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
      this.searchForm.resetFields();
      this.data = [];
    },
    //关键词搜索
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.pagination.total = 0;
          console.log(values["bomdate"]);
          if (values["bomdate"]) {
            var bomdate = values["bomdate"].format("YYYY-MM-DD");
          }
          if (values["range-time-picker1"]) {
            const rangeValue1 = values["range-time-picker1"];
            var createdatestart = rangeValue1[0].format("YYYY-MM-DD");
            var createdateend = rangeValue1[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"]) {
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

<template>
  <div>
    <a-modal v-model="visible" title="选择设备" @cancel="close" @ok="handleOk" centered width="70%">
      <div>
        <a-form layout="horizontal" :form="searchForm">
          <div>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select  v-decorator="['PlantId']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['WorkshopId']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                    <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select  v-decorator="['LineId']" style="width: 200px" placeholder="请选择生产车间">
                    <a-select-option v-for="item in LineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="编码/名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入配方编码/名称" v-decorator="['procode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="编码/名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入成品编码/名称" v-decorator="['proname']" />
                </a-form-item>
              </a-col>
              <a-col :md="17" :sm="24">
                <span style="display: flex;justify-content: flex-end">
                  <a-button type="primary" @click="search">查询</a-button>
                  <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </div>
        </a-form>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :size="size"
            :pagination="pagination"
            :scroll="{ y: 550 }"
            :rowKey="(dataSource, index) => dataSource.FormulaId + '_' + index"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              type: 'radio',
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
  </div>
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
    title: "产线",
    dataIndex: "LineName",
    scopedSlots: { customRender: "LineName" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
  },
  {
    title: "配方编码",
    dataIndex: "FormulaCode",
    scopedSlots: { customRender: "FormulaCode" },
    align: "center",
  },
  {
    title: "配方名称",
    dataIndex: "FormulaName",
    scopedSlots: { customRender: "FormulaName" },
    align: "center",
  },
  {
    title: "配方版本",
    dataIndex: "Version",
    scopedSlots: { customRender: "Version" },
    align: "center",
  },
];
import { getFormulaAction } from "@/services/eap.js";
import { formulaMixin } from "@/mixins/formulaMixin.js";
export default {
  props: ["plantList"],
  mixins: [formulaMixin],
  data() {
    return {
      dataSource: [],
      columns,
      size: "small",
      visible: true,
      selectedRowKeys: [],
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
      docsList: [],
      isPreview: false,
      deviceBrand: [],
      searchForm: this.$form.createForm(this),
      deviceTypeList: [],
    };
  },
  created() {
    this.getListAll();
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getFormulaAction(params, "getlist").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data;
          const pagination = { ...this.pagination };
          pagination.total = this.dataSource.length;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let result = this.dataSource.find((item, index) => item.FormulaId + "_" + index == this.selectedRowKeys[0]);
      this.$emit("closeModal");
      this.$emit("selectFormula", result);
    },
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            lineid: values.LineId,
            procode: values.procode,
          };
          getFormulaAction(params, "product/getlist").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
          });
          // do something
        }
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
/deep/.ant-form-item {
  margin-bottom: 5px;
}
</style>

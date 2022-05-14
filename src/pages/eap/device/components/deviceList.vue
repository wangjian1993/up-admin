<template>
  <div>
    <a-modal v-model="visible" title="选择设备" @cancel="close" @ok="handleOk" centered width="70%">
      <div>
        <a-form layout="horizontal" :form="searchForm">
          <div>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['typeid']" style="width: 200px" placeholder="请选择设备类型">
                    <a-select-option v-for="item in deviceTypeList" :key="item.ID" :value="item.ID">{{ item.EQUIPMENT_TYPE_NAME }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备品牌" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['brand']" style="width: 200px" placeholder="请选择设备品牌">
                    <a-select-option v-for="item in deviceBrand" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入设备名称" v-decorator="['equimentname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入设备编码" v-decorator="['equimentcode']" />
                </a-form-item>
              </a-col>
            </a-row>
            <span style="display: flex;justify-content: flex-end">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </div>
        </a-form>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table
            :columns="columns"
            :data-source="dataSource"
            :size="size"
            :pagination="pagination"
            :rowKey="(dataSource) => dataSource.EquimentId"
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
    title: "设备名称",
    dataIndex: "EquimentName",
    scopedSlots: { customRender: "EquimentName" },
    align: "center",
  },
  {
    title: "设备编码",
    dataIndex: "EquimentCode",
    scopedSlots: { customRender: "EquimentCode" },
    align: "center",
  },
  {
    title: "设备类型",
    dataIndex: "EquimentTypeName",
    scopedSlots: { customRender: "EquimentTypeName" },
    align: "center",
  },
  {
    title: "设备品牌",
    dataIndex: "BrandName",
    scopedSlots: { customRender: "BrandName" },
    align: "center",
  },
];
import { getDeviceAction, getDeviceTypeAction } from "@/services/eap.js";
import { getParamData } from "@/services/admin.js";
export default {
  props: ["deviceInfo"],
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
    this.getDeviceType();
    this.getParamData();
  },
  methods: {
    closeModal() {
      this.isPreview = false;
    },
    getDeviceType() {
      getDeviceTypeAction("", "getlist").then((res) => {
        if (res.data.success) {
          this.deviceTypeList = res.data.data;
        }
      });
    },
    getParamData() {
      let parmas = {
        groupcode: "EAP_EQUIMENT_BRAND",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.deviceBrand = res.data.data;
        }
      });
    },
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getDeviceAction(params, "getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
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
      let result = this.dataSource.find((item) => item.EquimentId == this.selectedRowKeys[0]);
      this.$emit("selectDevice", result);
    },
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            typeid: values.typeid,
            brand: values.brand,
            equimentname: values.equimentname,
            equimentcode: values.equimentcode,
          };
          getDeviceAction(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.totalCount;
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
/deep/.ant-table {
  min-height: 0vh;
}
</style>

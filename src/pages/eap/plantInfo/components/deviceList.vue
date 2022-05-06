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
                <a-form-item label="设备名称/编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入设备名称" v-decorator="['equiment']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <span>
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
            :data-source="docsList"
            :size="size"
            :pagination="pagination"
            :rowKey="(docsList) => docsList.DocumentId"
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
            <template slot="FileSize" slot-scope="text">
              <p>{{ getFileSize(text) }}</p>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a style="margin-right: 8px" @click="preview(record)">
                  <a-icon type="profile" />
                  预览
                </a>
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
    title: "文档名称",
    dataIndex: "DocumentName",
    scopedSlots: { customRender: "DocumentName" },
    align: "center",
  },
  {
    title: "文档编号",
    dataIndex: "DocumentCode",
    scopedSlots: { customRender: "DocumentCode" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "产品大类",
    dataIndex: "ProType",
    scopedSlots: { customRender: "ProType" },
    align: "center",
  },
  {
    title: "产品系列",
    dataIndex: "ProTypeDetail",
    scopedSlots: { customRender: "ProTypeDetail" },
    align: "center",
  },
  {
    title: "品号",
    dataIndex: "ProCode",
    scopedSlots: { customRender: "ProCode" },
    align: "center",
  },
];
import { getWorkstationAction, getDeviceTypeAction } from "@/services/eap.js";
import { getParamData } from "@/services/admin.js";
export default {
  props: ["deviceInfo"],
  data() {
    return {
      data: [],
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
    //http://192.168.1.245:6688/api/eap/workstation/getequiment?pageindex=1&pagesize=10
    //http://192.168.1.245:6688/api/eap/workstation/getequiment?pageindex=1&pagesize=10
    //http://192.168.1.245:6688/api/eap/workstation/getequiment?pageindex=1&pagesize=10
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getWorkstationAction(params, "getequiment").then((res) => {
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
      let record = this.docsList.find((item) => item.DocumentId == this.selectedRowKeys[0]);
      this.$emit("success", record);
    },
    reset() {
      this.getDocsList();
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
            equiment: values.equiment,
          };
          getWorkstationAction(parmas, "getequiment").then((res) => {
            if (res.data.success) {
              this.docsList = res.data.data.list;
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

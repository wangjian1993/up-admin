<template>
  <div>
    <a-modal title="批量增加/编辑参数" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="90%">
      <div>
        <a-form layout="horizontal" :form="searchForm">
          <div>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['workshopid']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                    <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['lineid']" style="width: 200px" placeholder="请选择生产车间" @change="lineChange">
                    <a-select-option v-for="item in LineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="设备" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['equimentid']" style="width: 200px" placeholder="请选择设备" @change="deviceChange">
                    <a-select-option v-for="item in deviceList" :key="item.EquimentId" :value="item.EquimentId">{{ item.EquimentName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="PLC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plcid', { rules: [{ required: true, message: '请选择PLC' }] }]" style="width: 200px" placeholder="请选择PLC" @change="plcChange">
                    <a-select-option v-for="item in plcList" :key="item.PlcId" :value="item.PlcId">{{ item.PlcName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="参数类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['paramstype']" style="width: 200px" placeholder="请选择参数类型" @change="paramsTypeChange">
                    <a-select-option v-for="item in paramsItem.PLC_PARAMS_TYPE" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <!-- <span style="display: flex;justify-content: flex-end">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span> -->
          </div>
        </a-form>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="dataSource" :size="size" :pagination="false" :rowKey="(dataSource) => dataSource.VarId" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="VarAddress" slot-scope="text, record">
              <div>
                <a-input style="width:100px" v-model="record.VarAddress" size="small" />
              </div>
            </template>
            <template slot="VarAddressBit" slot-scope="text, record">
              <a-select v-model="record.VarAddressBit" placeholder="请选择参数地址位" size="small" style="width:100px">
                <a-select-option v-for="item in paramsItem.PLC_PARAMS_ADDRESS_BIT" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </template>
            <template slot="VarDataType" slot-scope="text, record">
              <a-select v-model="record.VarDataType" placeholder="请选择参数类型" size="small" style="width:100px">
                <a-select-option v-for="item in paramsItem.PLC_PARAMS_DATA_TYPE" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </template>
            <template slot="VarDataTypeLen" slot-scope="text, record">
              <div>
                <a-input style="width:100px" v-model="record.VarDataTypeLen" size="small" />
              </div>
            </template>
            <template slot="VarDataTypeAccuracy" slot-scope="text, record">
              <div>
                <a-input style="width:100px" v-model="record.VarDataTypeAccuracy" size="small" />
              </div>
            </template>
            <template slot="VarMaxValue" slot-scope="text, record">
              <div>
                <a-input style="width:100px" v-model="record.VarMaxValue" size="small" />
              </div>
            </template>
            <template slot="VarMinValue" slot-scope="text, record">
              <div>
                <a-input style="width:100px" v-model="record.VarMinValue" size="small" />
              </div>
            </template>
            <template slot="VarPlcAuth" slot-scope="text, record">
              <a-select v-model="record.VarPlcAuth" placeholder="请选择PLC权限" size="small" style="width:100px">
                <a-select-option v-for="item in paramsItem.PLC_AUTH_RW" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </template>
            <template slot="VarStandardValue" slot-scope="text, record">
              <div>
                <a-input style="width:100px" v-model="record.VarStandardValue" size="small" />
              </div>
            </template>
            <template slot="UpperComputerAuth" slot-scope="text, record">
              <a-select v-model="record.UpperComputerAuth" placeholder="请选择参数地址位" size="small" style="width:100px">
                <a-select-option v-for="item in paramsItem.PLC_UUPER_COMPUTER_AUTH" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
            </template>
            <template slot="VarIsMust" slot-scope="text, record">
              <a-select v-model="record.VarIsMust" placeholder="请选择参数地址位" size="small" style="width:100px">
                <a-select-option v-for="item in paramsItem.PLC_IS_MUST" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
              </a-select>
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
    title: "PLC名称",
    dataIndex: "PlcName",
    scopedSlots: { customRender: "PlcName" },
    align: "center",
  },
  {
    title: "PLC地址端口",
    dataIndex: "PlcPort",
    scopedSlots: { customRender: "PlcPort" },
    align: "center",
  },
  {
    title: "参数类型名",
    dataIndex: "ParamsTypeName",
    scopedSlots: { customRender: "ParamsTypeName" },
    align: "center",
  },
  {
    title: "参数名称",
    dataIndex: "VarName",
    scopedSlots: { customRender: "VarName" },
    align: "center",
  },
  {
    title: "参数地址",
    dataIndex: "VarAddress",
    scopedSlots: { customRender: "VarAddress" },
    align: "center",
  },
  {
    title: "参数地址位",
    dataIndex: "VarAddressBit",
    scopedSlots: { customRender: "VarAddressBit" },
    align: "center",
  },
  {
    title: "数据类型",
    dataIndex: "VarDataType",
    scopedSlots: { customRender: "VarDataType" },
    align: "center",
  },
  {
    title: "数据长度",
    dataIndex: "VarDataTypeLen",
    scopedSlots: { customRender: "VarDataTypeLen" },
    align: "center",
  },
  {
    title: "数据精度",
    dataIndex: "VarDataTypeAccuracy",
    scopedSlots: { customRender: "VarDataTypeAccuracy" },
    align: "center",
  },
  {
    title: "参数最大值",
    dataIndex: "VarMaxValue",
    scopedSlots: { customRender: "VarMaxValue" },
    align: "center",
  },
  {
    title: "参数最小值",
    dataIndex: "VarMinValue",
    scopedSlots: { customRender: "VarMinValue" },
    align: "center",
  },
  {
    title: "参数标准值",
    dataIndex: "VarStandardValue",
    scopedSlots: { customRender: "VarStandardValue" },
    align: "center",
  },
  {
    title: "PLC权限",
    dataIndex: "VarPlcAuth",
    scopedSlots: { customRender: "VarPlcAuth" },
    align: "center",
  },
  {
    title: "上位机权限",
    dataIndex: "UpperComputerAuth",
    scopedSlots: { customRender: "UpperComputerAuth" },
    align: "center",
  },
  {
    title: "是否必填值",
    dataIndex: "VarIsMust",
    scopedSlots: { customRender: "VarIsMust" },
    align: "center",
  },
];
import { getPlcAction, getPlantList, getWorkshopAction, getDeviceAction, getOperationAction, setOperationAction } from "@/services/eap.js";
export default {
  props: ["paramsItem"],
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
      isPreview: false,
      plcBrand: [],
      searchForm: this.$form.createForm(this),
      plcTypeList: [],
      workshopList: [],
      plantList: "",
      LineList: [],
      deviceList: [],
      plcList: [],
    };
  },
  created() {
    this.getPlant();
  },
  methods: {
    //生产工厂
    getPlant() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getPlantList(parmas, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    //生产工厂选择
    plantChange(e) {
      this.plantId = e;
      let parmas = {
        plantid: e,
      };
      getWorkshopAction(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
          this.searchForm.setFieldsValue({
            workshopid: "",
            lineid: "",
            equimentid: "",
            plcid: "",
          });
        }
      });
    },
    //生产车间选择
    workshopChange(e) {
      let parmas = {
        plantid: this.plantId,
        workshopid: e,
      };
      getPlantList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.LineList = res.data.data;
          this.searchForm.setFieldsValue({
            lineid: "",
            equimentid: "",
            plcid: "",
          });
        }
      });
    },
    //生产产线选择
    lineChange(e) {
      let parmas = {
        lineid: e,
      };
      getDeviceAction(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.deviceList = res.data.data;
          this.searchForm.setFieldsValue({
            equimentid: "",
            plcid: "",
          });
        }
      });
    },
    //设备选择
    deviceChange(e) {
      let values = this.searchForm.getFieldsValue();
      let params = {
        lineid: values.lineid,
        equimentid: e,
      };
      getPlcAction(params, "getlist").then((res) => {
        if (res.data.success) {
          this.plcList = res.data.data;
          this.searchForm.setFieldsValue({
            plcid: "",
          });
        }
      });
    },
    //plc选择
    plcChange(e) {
      let values = this.searchForm.getFieldsValue();
      let params = {
        plcid: e,
        paramstype: values.plcid,
      };
      getOperationAction(params, "getlist").then((res) => {
        if (res.data.success) {
          console.log("result");
            this.dataSource = res.data.data;
        }
      });
    },
    //参数类型选择
    paramsTypeChange(e) {
      let values = this.searchForm.getFieldsValue();
      let params = {
        plcid: values.plcid,
        paramstype: e,
      };
      getOperationAction(params, "getlist").then((res) => {
        if (res.data.success) {
          console.log("result");
          this.dataSource = res.data.data;
        }
      });
    },
    closeModal() {
      this.isPreview = false;
    },
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getPlcAction(params, "getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          //   const pagination = { ...this.pagination };
          //   pagination.total = res.data.data.recordsTotal;
          //   this.pagination = pagination;
          //   this.loading = false;
          //   this.isSearch = 0;
          // } else {
          //   this.loading = false;
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      let params = [];
      this.dataSource.forEach((item) => {
        params.push({
          PlcId: item.PlcId,
          ParamsTypeCode: item.ParamsTypeCode,
          VarId: item.VarId,
          VarAddress: item.VarAddress,
          VarAddressBit: item.VarAddressBit,
          VarDataType: item.VarDataType,
          VarDataTypeLen: item.VarDataTypeLen,
          VarDataTypeAccuracy: item.VarDataTypeAccuracy,
          VarMaxValue: item.VarMaxValue,
          VarMinValue: item.VarMinValue,
          VarStandardValue: item.VarStandardValue,
          VarValue: item.VarValue,
          VarIsMust: item.VarIsMust,
          VarPlcAuth: item.VarPlcAuth,
          UpperComputerAuth: item.UpperComputerAuth,
          Enable: item.Enable,
        });
      });
      setOperationAction(params, "multiple/add").then((res) => {
        if (res.data.success) {
          //   console.log("result");
          //   this.dataSource = res.data.data;
          this.$message.success("编辑成功!");
          this.$emit("closeModal");
          this.$emit("success");
        }
      });
    },
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    // search() {
    //   this.searchForm.validateFields((err, values) => {
    //     if (!err) {
    //       this.loading = true;
    //       let parmas = {
    //         pageindex: this.pagination.current,
    //         pagesize: this.pagination.pageSize,
    //         typeid: values.typeid,
    //         brand: values.brand,
    //         plccode: values.plccode,
    //         plcname: values.plcname,
    //       };
    //       getPlcAction(parmas, "getall").then((res) => {
    //         if (res.data.success) {
    //           this.dataSource = res.data.data.list;
    //           const pagination = { ...this.pagination };
    //           pagination.total = res.data.data.totalCount;
    //           this.pagination = pagination;
    //         }
    //       });
    //       // do something
    //     }
    //   });
    // },
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

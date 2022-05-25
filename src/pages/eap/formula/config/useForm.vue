<template>
  <div>
    <a-modal :title="isEdit ? '编辑配方配置' : '添加配方配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="90%">
      <div>
        <a-form layout="horizontal" :form="searchForm">
          <div>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select :disabled="isEdit" v-decorator="['PlantId', { rules: [{ required: true, message: '请选择生产工厂' }] }]" style="width: 300px" placeholder="请选择生产工厂" @change="plantChange">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select :disabled="isEdit" v-decorator="['WorkshopId', { rules: [{ required: true, message: '请选择生产工厂' }] }]" style="width: 300px" placeholder="请选择生产车间" @change="workshopChange">
                    <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select :disabled="isEdit" v-decorator="['LineId', { rules: [{ required: true, message: '请选择生产工厂' }] }]" style="width: 300px" placeholder="请选择生产车间" @change="lineChange">
                    <a-select-option v-for="item in LineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="配方编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input :disabled="isEdit" style="width: 300px" placeholder="请输入配方编码" v-decorator="['FormulaCode', { rules: [{ required: true, message: '请选择生产工厂' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="配方名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 300px" placeholder="请输入配方名称" v-decorator="['FormulaName', { rules: [{ required: true, message: '请选择生产工厂' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="配方描述" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 300px" placeholder="请输入配方名称" v-decorator="['FormulaDesc']" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="选择品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 300px" v-decorator="['paramname', { rules: [{ required: true, message: '请选择品号' }] }]" allowClear placeholder="请选择品号" disabled>
                    <a-icon slot="addonAfter" type="plus" @click="showItemCode" :disabled="isEdit" />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </a-form>
        <a-card class="card" title="配方明细列表" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-form layout="horizontal" :form="searchForm2">
            <div>
              <a-row>
                <a-col :md="6" :sm="24">
                  <a-form-item label="设备" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select :disabled="isEdit" v-decorator="['equimentid']" style="width: 200px" placeholder="请选择设备" @change="deviceChange">
                      <a-select-option v-for="item in deviceList" :key="item.EquimentId" :value="item.EquimentId">{{ item.EquimentName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="PLC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select :disabled="isEdit" v-decorator="['plcid', { rules: [{ required: true, message: '请选择PLC' }] }]" style="width: 200px" placeholder="请选择PLC" @change="plcChange">
                      <a-select-option v-for="item in plcList" :key="item.PlcId" :value="item.PlcId">{{ item.PlcName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="参数类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select :disabled="isEdit" v-decorator="['paramstype']" style="width: 200px" placeholder="请选择参数类型" @change="paramsTypeChange">
                      <a-select-option v-for="item in paramsItem.PLC_PARAMS_TYPE" :key="item.ParamValue" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
          <a-table :columns="columns" :data-source="dataSource" :size="size" :pagination="false" :rowKey="(dataSource) => dataSource.VarId" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ index + 1 }}</span>
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
            <template slot="VarValue" slot-scope="text, record">
              <div>
                <a-input style="width:100px" v-model="record.VarValue" size="small" />
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
      <itemCode v-if="isItemCode" @closeModal="closeModal" :plantList="plantList" @selectItemCode="selectItemCode" />
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
    title: "实际参数值",
    dataIndex: "VarValue",
    scopedSlots: { customRender: "VarValue" },
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
import { getPlcAction, getOperationAction, setFormulaAction, getFormulaAction } from "@/services/eap.js";
import itemCode from "../components/itemCode.vue";
import { formulaMixin } from "@/mixins/formulaMixin.js";
export default {
  props: ["paramsItem", "isEdit", "editData"],
  components: { itemCode },
  mixins: [formulaMixin],
  data() {
    return {
      dataSource: [],
      columns,
      size: "small",
      visible: true,
      isItemCode: false,
      searchForm: this.$form.createForm(this),
      searchForm2: this.$form.createForm(this),
      plcTypeList: [],
      itemCodeData: "",
    };
  },
  created() {
    this.getPlant();
    if (this.isEdit) {
      this.plantChange(this.editData.PlantId);
      this.workshopChange(this.editData.WorkshopId);
      this.lineChange(this.editData.LineId);
      setTimeout(() => {
        this.searchForm.setFieldsValue({
          PlantId: this.editData.PlantId,
          WorkshopId: this.editData.WorkshopId,
          LineId: this.editData.LineId,
          FormulaCode: this.editData.FormulaCode,
          FormulaName: this.editData.FormulaName,
          FormulaDesc: this.editData.FormulaDesc,
          paramname: this.editData.ProCode,
        });
      }, 1000);
       this.getFormulaDetail();
    }
  },
  methods: {
    showItemCode() {
      if (this.isEdit) {
        return;
      }
      this.isItemCode = true;
    },
    selectItemCode(result) {
      this.itemCodeData = result;
      this.searchForm.setFieldsValue({
        paramname: result.ProCode,
      });
    },
    getFormulaDetail() {
      let params = {
        plcid: "",
        paramstype:  "",
        formulaid: this.editData.FormulaId,
      };
      getFormulaAction(params, "getdetails").then((res) => {
        if (res.data.success) {
          console.log("result");
          this.dataSource = res.data.data;
        }
      });
    },
    plcChange(e) {
      let values = this.searchForm.getFieldsValue();
      let params = {
        plcid: e,
        paramstype: values.paramstype,
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
      this.isItemCode = false;
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
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          if (this.isEdit) {
            let parmas = {
              PlantId: values.PlantId,
              WorkshopId: values.WorkshopId,
              LineId: values.LineId,
              FormulaId: values.FormulaId,
              FormulaCode: values.FormulaCode,
              FormulaName: values.FormulaName,
              FormulaDesc: values.FormulaDesc,
              ProCode: this.itemCodeData.ProCode,
              ProName: this.itemCodeData.ProName,
              FormulaDetails: [],
            };
            this.dataSource.forEach((item) => {
              parmas.FormulaDetails.push({
                PlcId: item.PlcId,
                ParamsTypeCode: item.ParamsTypeCode,
                VarId: item.VarId,
                VarAddress: item.VarAddress,
                VarAddressBit: item.VarAddressBit,
                VarDataType: item.VarDataType,
                VarDataSize: item.VarDataTypeLen,
                VarDataAccuuacy: item.VarDataTypeAccuracy,
                VarMaxValue: item.VarMaxValue,
                VarMinValue: item.VarMinValue,
                VarValue: item.VarValue,
                IsMust: item.VarIsMust,
                PlcAuth: item.VarPlcAuth,
                UpperComputerAuth: item.UpperComputerAuth,
                VarStdValue: item.VarStandardValue,
              });
            });
            setFormulaAction(parmas, "multiple/update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          } else {
            let parmas = {
              PlantId: values.PlantId,
              WorkshopId: values.WorkshopId,
              LineId: values.LineId,
              FormulaCode: values.FormulaCode,
              FormulaName: values.FormulaName,
              FormulaDesc: values.FormulaDesc,
              ProCode: this.itemCodeData.ProCode,
              ProName: this.itemCodeData.ProName,
              FormulaDetails: [],
            };
            this.dataSource.forEach((item) => {
              parmas.FormulaDetails.push({
                PlcId: item.PlcId,
                ParamsTypeCode: item.ParamsTypeCode,
                VarId: item.VarId,
                VarAddress: item.VarAddress,
                VarAddressBit: item.VarAddressBit,
                VarDataType: item.VarDataType,
                VarDataSize: item.VarDataTypeLen,
                VarDataAccuuacy: item.VarDataTypeAccuracy,
                VarMaxValue: item.VarMaxValue,
                VarMinValue: item.VarMinValue,
                VarValue: item.VarValue,
                IsMust: item.VarIsMust,
                PlcAuth: item.VarPlcAuth,
                UpperComputerAuth: item.UpperComputerAuth,
                VarStdValue: item.VarStandardValue,
              });
            });
            setFormulaAction(parmas, "multiple/add").then((res) => {
              if (res.data.success) {
                this.$message.success("新增成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          }
        }
      });
    },
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
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

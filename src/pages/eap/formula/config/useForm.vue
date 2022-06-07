<template>
  <div>
    <a-modal :title="isEdit ? '编辑配方配置' : '添加配方配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="95%">
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
                  <a-select :disabled="isEdit" v-decorator="['LineId', { rules: [{ required: true, message: '请选择生产工厂' }] }]" style="width: 300px" placeholder="请选择生产车间" @change="(e) => lineChange(e, true)">
                    <a-select-option v-for="item in LineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="配方编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input :disabled="isEdit" style="width: 300px" placeholder="请输入配方编码" v-decorator="['FormulaCode', { rules: [{ required: true, message: '请输入配方编码' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="配方名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 300px" placeholder="请输入配方名称" v-decorator="['FormulaName', { rules: [{ required: true, message: '请输入配方名称' }] }]" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="配方描述" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 300px" placeholder="请输入配方名称" v-decorator="['FormulaDesc']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
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
                    <a-select v-decorator="['equimentid']" style="width: 200px" placeholder="请选择设备" @change="(e) => deviceChange(e, true)">
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
                      <a-select-option v-for="item in paramsItem.PLC_PARAMS_TYPE" :key="item.ParamCode" :value="item.ParamCode">{{ item.ParamName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
          <a-table :columns="columns" :data-source="dataSource" :scroll="{ y: 300 }" size="small" :pagination="false" :rowKey="(dataSource) => dataSource.VarId" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ index + 1 }}</span>
              </div>
            </template>
            <template slot="VarValue" slot-scope="text, record">
              <div>
                <a-input style="width:80px" v-model="record.VarValue" size="small" />
              </div>
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
    customRender: (text, record) => {
      return record.PlcIp + ":" + record.PlcPort;
    },
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
    dataIndex: "VarDataSize",
    scopedSlots: { customRender: "VarDataSize" },
    align: "center",
  },
  {
    title: "数据精度",
    dataIndex: "VarDataAccuuacy",
    scopedSlots: { customRender: "VarDataAccuuacy" },
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
    title: "参数单位",
    dataIndex: "VarUnit",
    scopedSlots: { customRender: "VarUnit" },
    align: "center",
    width: 100,
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
    dataIndex: "PlcAuthName",
    scopedSlots: { customRender: "PlcAuthName" },
    align: "center",
  },
  {
    title: "上位机权限",
    dataIndex: "UpperComputerAuthName",
    scopedSlots: { customRender: "UpperComputerAuthName" },
    align: "center",
  },
  {
    title: "是否必填值",
    dataIndex: "IsMust",
    scopedSlots: { customRender: "IsMust" },
    align: "center",
    customRender: (text) => {
      return text == "Y" ? "是" : "否";
    },
  },
];
import { getPlcAction, setFormulaAction, getFormulaAction } from "@/services/eap.js";
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
        lineid: this.editData.LineId,
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
        lineid: values.LineId,
        equimentid: values.equimentid,
        plcid: e,
      };
      getFormulaAction(params, "getdetails").then((res) => {
        if (res.data.success) {
          console.log("result");
          this.dataSource = res.data.data;
        }
      });
    },
    getDetailList(lineid, equimentid, plcid, paramstype) {
      let values = this.searchForm.getFieldsValue();
      let params = {
        lineid: lineid || values.LineId,
        equimentid: equimentid || values.equimentid,
        plcid: plcid || values.plcid,
        paramstype: paramstype || values.paramstype,
        formulaid: values.formulaid,
      };
      getFormulaAction(params, "getdetails").then((res) => {
        if (res.data.success) {
          console.log("result");
          this.dataSource = res.data.data;
        }
      });
    },
    //参数类型选择
    paramsTypeChange(e) {
      let values = this.searchForm.getFieldsValue();
      let values2 = this.searchForm2.getFieldsValue();
      console.log(values);
      this.getDetailList(values.LineId, values2.equimentid, values2.plcid, e);
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
          console.log("values-===", values);
          if (this.isEdit) {
            let parmas = {
              FormulaId: this.editData.FormulaId,
              PlantId: values.PlantId,
              WorkshopId: values.WorkshopId,
              LineId: values.LineId,
              FormulaCode: values.FormulaCode,
              FormulaName: values.FormulaName,
              FormulaDesc: values.FormulaDesc,
              ProCode: this.editData.ProCode,
              ProName: this.editData.ProName,
              FormulaDetails: [],
            };
            this.dataSource.forEach((item) => {
              console.log("item===", item);
              parmas.FormulaDetails.push({
                PlcId: item.PlcId,
                ParamsTypeCode: item.ParamsTypeCode,
                VarId: item.VarId,
                VarAddress: item.VarAddress,
                VarAddressBit: item.VarAddressBit,
                VarDataType: item.VarDataType,
                VarDataSize: item.VarDataTypeLen || "0",
                VarDataAccuuacy: item.VarDataAccuuacy.toString(),
                VarMaxValue: item.VarMaxValue,
                VarMinValue: item.VarMinValue,
                VarValue: item.VarValue,
                IsMust: item.IsMust,
                PlcAuth: item.PlcAuth,
                UpperComputerAuth: item.UpperComputerAuth,
                VarUnit: item.VarUnit,
                VarStdValue: item.VarStdValue,
              });
            });
            setFormulaAction(parmas, "multiple/update").then((res) => {
              if (res.data.success && !res.data.data.IsError) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              } else {
                let errorList = res.data.data.list;
                errorList.forEach((item) => {
                  this.$message.error(item.RowNum + "," + item.ErrorMsg);
                });
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
                VarDataSize: item.VarDataTypeLen || 0,
                VarDataAccuuacy: item.VarDataTypeAccuracy,
                VarMaxValue: item.VarMaxValue,
                VarMinValue: item.VarMinValue,
                VarValue: item.VarValue,
                IsMust: item.VarIsMust,
                PlcAuth: item.VarPlcAuth,
                UpperComputerAuth: item.UpperComputerAuth,
                VarUnit: item.VarUnit,
                VarStdValue: item.VarStandardValue,
              });
            });
            setFormulaAction(parmas, "multiple/add").then((res) => {
              if (res.data.success && !res.data.data.IsError) {
                this.$message.success("新增成功!");
                this.$emit("closeModal");
                this.$emit("success");
              } else {
                let errorList = res.data.data.list;
                errorList.forEach((item) => {
                  this.$message.error(item.RowNum + "," + item.ErrorMsg);
                });
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

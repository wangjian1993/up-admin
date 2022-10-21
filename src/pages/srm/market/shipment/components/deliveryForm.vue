<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-10-21 10:24:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/shipment/components/deliveryForm.vue
-->

<template>
  <div>
    <a-drawer :visible="visible" title="新建送货单" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '10px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item has-feedback label="客户" prop="suppliercode"> <a-select v-model="form.suppliercode" has-feedback placeholder="请选择客户"> </a-select></a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item  has-feedback label="送货单号"><a-input placeholder="请输入送货单号" style="width: 220px" v-model="form.orderno"/></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="收货部门"> <a-select v-model="form.department" has-feedback placeholder="请选择收货部门"> </a-select></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="ItemName" has-feedback label="内部单号"><a-input placeholder="请输入内部单号" style="width: 220px" v-model="form.ItemCode"/></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item  has-feedback label="送货日期" prop="deliverydatetime"> <a-date-picker v-model="form.deliverydatetime" show-time type="date" placeholder="选择采购取回样品日期" style="width: 100%;" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="采购说明"><a-input placeholder="请输入采购说明" style="width: 220px" v-model="form.purchaseenterprise"/></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="预计到厂" prop="plandatetime"> <a-date-picker v-model="form.plandatetime" show-time type="date" placeholder="预计到厂" style="width: 100%;" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item has-feedback label="条码版本"> <a-input v-model="form.codeversion" disabled allowClear placeholder="请输入供应商编码" /> </a-form-model-item
            ></a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item has-feedback label="送货方式" prop="deliverytype">
                <a-select v-model="form.deliverytype" has-feedback placeholder="请选择送货方式" style="width: 200px">
                  <a-select-option v-for="item in paramsItem.DELIVER_MODE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select></a-form-model-item
              ></a-col
            >
            <a-col :span="6">
              <a-form-model-item has-feedback label="运输方式" prop="deliverymethod">
                <a-select v-model="form.shippingmethod" has-feedback placeholder="请选择送货方式" style="width: 200px">
                  <a-select-option v-for="item in paramsItem.DELIVER_MODE" :key="item.ParamCode" :value="item.ParamValue">{{ item.ParamName }}</a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="6">
              <a-form-model-item  has-feedback label="送货地址"> <a-input v-model="form.deliveryaddress" allowClear placeholder="请输入送样采购员" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item  has-feedback label="联系方式" prop="deliveryphone"> <a-input v-model="form.deliveryphone" allowClear placeholder="请输入送样采购员" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item  has-feedback label="送货备注" prop="deliveryremark"> <a-input v-model="form.deliveryremark" allowClear placeholder="请输入送样采购员" /> </a-form-model-item
            ></a-col>
          </a-row>
        </a-card>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="DatetimePurchaseRetrieve" has-feedback label="整单毛重" prop="DatetimePurchaseRetrieve"> <a-input v-model="form.Purchaser" allowClear placeholder="请输入整单毛重" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="SampleCategory" has-feedback label="整单净重" prop="SampleCategory"> <a-input v-model="form.SampleCategory" allowClear placeholder="请输入整单净重" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="CtrledCompany" has-feedback label="包装方式" prop="CtrledCompany"> <a-select v-model="form.HasApprovalSheet" has-feedback placeholder="请选择包装方式"> </a-select> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="Remark1" has-feedback label="重量单位" prop="Remark1"><a-select v-model="form.HasApprovalSheet" has-feedback placeholder="请选择重量单位"> </a-select> </a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="SignEngineer" has-feedback label="总包装数" prop="SignEngineer"> <a-input v-model="form.SignEngineer" allowClear placeholder="请输入总包装数" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="ApprovalDepartment" has-feedback label="明细包装汇总" prop="ApprovalDepartment"> <a-input v-model="form.SignEngineer" allowClear placeholder="请输入明细包装汇总"/></a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="DatetimeSign" has-feedback label="报关资料" prop="DatetimeSign"> <a-input v-model="form.SignEngineer" allowClear placeholder="请输入报关资料" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form-model>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" :style="{ marginRight: '8px' }" :loading="loading" @click="handleOk('SAVE')">
          保存
        </a-button>
        <a-button type="primary" :loading="loading" @click="handleOk('SAVEANDSUBMIT')">
          提交下一节点
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { setDepartmentApi } from "@/services/web.js";
import moment from "moment";
export default {
  props: ["editData", "isEdit", "paramsItem"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        orderno: "",
        suppliercode: "",
        supplierfullname: "",
        purchaseenterprise: "",
        department: "",
        purchasedescription: "",
        deliverydatetime: "",
        receiptwarehouse: "",
        plandatetime: "",
        arrivaldatetime: "",
        codeversion: "",
        deliverytype: "",
        currentusername: "",
        deliverymethod: "",
        shippingmethod: "",
        deliveryremark: "",
        deliveryaddress: "",
        deliveryphone: "",
      },
      rules: {
        ItemCode: [
          {
            required: true,
            message: "请输入物料编码",
            trigger: "blur",
          },
        ],
        ItemName: [
          {
            required: true,
            message: "请输入物料名称",
            trigger: "blur",
          },
        ],
        ItemSpecification: [
          {
            required: true,
            message: "请输入物料型号",
            trigger: "blur",
          },
        ],
        Supplier: [
          {
            required: true,
            message: "请输入供应商",
            trigger: "blur",
          },
        ],
      },
      departmentalList: [],
      isUser: false,
      user: [],
      dynamicValidateForm: [],
      addUserIndex: -1,
      rawData: [],
      userList: [],
      userType: "",
      loading: false,
    };
  },
  created() {
    // this.getUserForm();
    if (this.isEdit) {
      this.form = JSON.parse(JSON.stringify(this.editData));
      this.form.DatetimePurchaseDeliver = this.editData.DatetimePurchaseDeliver != null ? moment(this.form.DatetimePurchaseDeliver) : "";
      this.form.DatetimePurchaseRetrieve = this.editData.DatetimePurchaseRetrieve != null ? moment(this.form.DatetimePurchaseRetrieve) : "";
      this.form.DatetimeSign = this.editData.DatetimeSign != null ? moment(this.form.DatetimeSign) : "";
      this.form.DatetimeCtrled = this.editData.DatetimeCtrled != null ? moment(this.form.DatetimeCtrled) : "";
      this.form.DatetimeCtrledAbnormalHandle = this.editData.DatetimeCtrledAbnormalHandle != null ? moment(this.form.DatetimeCtrledAbnormalHandle) : "";
      this.form.DatetimeQicCollect = this.editData.DatetimeQicCollect != null ? moment(this.form.DatetimeQicCollect) : "";
    }
  },
  methods: {
    moment,
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk(type) {
      this.loading = true;
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          console.log(this.form);
          if (this.form.ItemCode == null) {
            this.$message.warning("请输入物料编码");
            this.loading = false;
            return;
          }
          if (this.form.Supplier == null) {
            this.$message.warning("请选择供应商");
            this.loading = false;
            return;
          }
          console.log(this.form);
          let params = {
            SubmitSign: type, //提交标识：1,，SAVE-保存 2，SAVEANDSUBMIT-保存并提交到下一节点
            UserReceiveDepartment: "*", //用户所有接收部门
            RegisterId: this.form.RegisterId, //登记ID1
            DatetimePurchaseDeliver: this.form.DatetimePurchaseDeliver != "" && this.form.DatetimePurchaseDeliver != null ? this.form.DatetimePurchaseDeliver.format("YYYY-MM-DD HH:mm:ss") : "", //采购送样日期
            ItemCode: this.form.ItemCode, //物料编码
            ItemName: this.form.ItemName, //物料名称
            ItemSpecification: this.form.ItemSpecification, //规格型号
            DrawingNo: this.form.DrawingNo, //图号
            Supplier: this.form.Supplier, //供应商
            SupplierCode: this.form.SupplierCode,
            HasApprovalSheet: this.form.HasApprovalSheet, //是否有承认书
            Quantity: this.form.Quantity, //数量
            Purchaser: this.form.Purchaser, //送样采购员
            DatetimePurchaseRetrieve: this.form.DatetimePurchaseRetrieve != "" && this.form.DatetimePurchaseRetrieve != null ? this.form.DatetimePurchaseRetrieve.format("YYYY-MM-DD HH:mm:ss") : "", //采购取回样品日期
            SampleCategory: this.form.SampleCategory, //样品类别
            CtrledCompany: this.form.CtrledCompany, //受控公司
            Remark1: this.form.Remark1, //采购备注
            SignEngineer: this.form.SignEngineer, //签样工程师
            ApprovalDepartment: this.form.ApprovalDepartment, //承认部门
            DatetimeSign: this.form.DatetimeSign != "" && this.form.DatetimeSign != null ? this.form.DatetimeSign.format("YYYY-MM-DD HH:mm:ss") : "", //签样时间
            SignResult: this.form.SignResult, //签样结果
            Remark2: this.form.Remark2, //研发/工程备注
            CtrledStatus: this.form.CtrledStatus, //受控状态
            DatetimeCtrled: this.form.DatetimeCtrled != "" && this.form.DatetimeCtrled != null ? this.form.DatetimeCtrled.format("YYYY-MM-DD HH:mm:ss") : "", //受控日期
            CtrledAbnormalDescription: this.form.CtrledAbnormalDescription, //受控异常描述
            CtrledAbnormalHandleStatus: this.form.CtrledAbnormalHandleStatus, //异常处理情况
            DatetimeCtrledAbnormalHandle: this.form.DatetimeCtrledAbnormalHandle != "" && this.form.DatetimeCtrledAbnormalHandle != null ? this.form.DatetimeCtrledAbnormalHandle.format("YYYY-MM-DD HH:mm:ss") : "", //异常处理日期
            Remark3: this.form.Remark3, //文控备注
            DatetimeQicCollect: this.form.DatetimeQicCollect != "" && this.form.DatetimeQicCollect != null ? this.form.DatetimeQicCollect.format("YYYY-MM-DD HH:mm:ss") : "", //IQC收样日期
            Remark4: this.form.Remark4, //IQC备注
          };
          console.log("params===", params);
          setDepartmentApi(params, "editregister").then((res) => {
            if (res.data.success) {
              this.$message.success("编辑成功!");
              if (this.isClone) {
                this.$store.dispatch("specimen/closeRegisterId");
              }
              this.$emit("closeModal");
              this.$emit("success");
              this.visible = false;
            }
            this.loading = false;
          });
        } else {
          this.loading = false;
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
/deep/ .ant-card-head-title {
  padding: 0px 0;
}
/deep/ .ant-card-head {
  min-height: 0;
}
</style>
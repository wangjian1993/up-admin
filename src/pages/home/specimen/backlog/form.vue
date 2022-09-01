<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-08-12 09:33:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/backlog/form.vue
-->

<template>
  <div>
    <a-drawer :visible="visible" title="待办事宜编辑" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '10px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button type="primary" :loading="loading" @click="handleOk('SAVE')">
          保存
        </a-button>
        <a-button type="primary" :loading="loading" @click="handleOk('SAVEANDSUBMIT')">
          提交下一节点
        </a-button>
      </template>
      <a-descriptions size="small" :column="4">
        <a-descriptions-item label="流程编码">
          {{ editData.FlowCode }}
        </a-descriptions-item>
        <a-descriptions-item label="公司名称">
          {{ editData.EnterpriseName }}
        </a-descriptions-item>
        <a-descriptions-item label="发起部门">
          {{ editData.DepartmentName }}
        </a-descriptions-item>
        <a-descriptions-item label="条件">
          {{ editData.Condition }}
        </a-descriptions-item>
      </a-descriptions>
      <!-- <a-radio-group v-model="userType" button-style="solid" style="padding:10px 20px" @change="userRadio">
        <a-radio-button :value="item.name" v-for="(item, index) in userObj" :key="index">
          {{ item.name }}
        </a-radio-button>
      </a-radio-group> -->
      <a-card class="card" title="采购" :bordered="false" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="DatetimePurchaseDeliver" has-feedback label="采购送样日期" prop="DatetimePurchaseDeliver"> <a-date-picker :disabled="!disabled1" v-model="form.DatetimePurchaseDeliver" show-time type="date" placeholder="选择采购送样日期" style="width: 100%;" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="ItemCode" has-feedback label="物料编码" prop="ItemCode"><a-input-search placeholder="请输入物料编码" :disabled="!disabled1" style="width: 220px" v-model="form.ItemCode" @search="onSearch"/></a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="ItemName" has-feedback label="物料名称" prop="ItemName"> <a-textarea v-model="form.ItemName" disabled allowClear placeholder="请输物料名称" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="ItemSpecification" has-feedback label="物料型号" prop="ItemSpecification"> <a-textarea :rows="4" v-model="form.ItemSpecification" disabled allowClear placeholder="请输入物料型号" /> </a-form-model-item
            ></a-col>
          </a-row>
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="DrawingNo" has-feedback label="图号" prop="DrawingNo"> <a-input v-model="form.DrawingNo" :disabled="!disabled1" allowClear placeholder="请输入图号" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="Supplier" has-feedback label="供应商" prop="Supplier">
                <!-- <a-input v-model="form.Supplier"  allowClear placeholder="请输入供应商" /> -->
                <a-select show-search v-model="form.Supplier" placeholder="请输入供应商" :default-active-first-option="false" :show-arrow="false" :filter-option="false" :not-found-content="null" @search="handleSearch" @change="changeSearch">
                  <a-select-option v-for="item in supplierList" :value="item.SupplierName" :key="item.RowNumber">
                    {{ item.SupplierName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="6">
              <a-form-model-item ref="SupplierCode" has-feedback label="供应商编码" prop="SupplierCode"> <a-input v-model="form.SupplierCode" disabled allowClear placeholder="请输入供应商编码" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="HasApprovalSheet" has-feedback label="是否有承认书" prop="HasApprovalSheet">
                <a-select v-model="form.HasApprovalSheet" :disabled="!disabled1" has-feedback placeholder="请选择是否有承认书">
                  <a-select-option value="是">是</a-select-option>
                  <a-select-option value="否">否</a-select-option>
                </a-select></a-form-model-item
              >
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="Quantity" has-feedback label="数量" prop="Quantity"> <a-input v-model="form.Quantity" :disabled="!disabled1" allowClear placeholder="请输入数量" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="Purchaser" has-feedback label="送样采购员" prop="Purchaser"> <a-input v-model="form.Purchaser" :disabled="!disabled1" allowClear placeholder="请输入送样采购员" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="DatetimePurchaseRetrieve" has-feedback label="采购取回样品日期" prop="DatetimePurchaseRetrieve"> <a-date-picker :disabled="!disabled1" v-model="form.DatetimePurchaseRetrieve" show-time type="date" placeholder="选择采购取回样品日期" style="width: 100%;" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="SampleCategory" has-feedback label="样品类别" prop="SampleCategory"> <a-input v-model="form.SampleCategory" allowClear placeholder="请输入样品类别" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="CtrledCompany" has-feedback label="受控公司" prop="CtrledCompany"> <a-input v-model="form.CtrledCompany" :disabled="!disabled1" allowClear placeholder="请输入受控公司" /> </a-form-model-item
            ></a-col>
            <a-col :span="6">
              <a-form-model-item ref="Remark1" :disabled="!disabled1" has-feedback label="采购备注" prop="Remark1"> <a-input v-model="form.Remark1" allowClear placeholder="请输入采购备注" /> </a-form-model-item
            ></a-col>
          </a-row>
        </a-form-model>
      </a-card>
      <a-card class="card" title="研发/工程" :bordered="false" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="SignEngineer" has-feedback label="签样工程师" prop="SignEngineer"> <a-input v-model="form.SignEngineer" :disabled="!disabled2" allowClear placeholder="请输入签样工程师" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="ApprovalDepartment" has-feedback label="承认部门" prop="ApprovalDepartment">
                <a-select v-model="form.ApprovalDepartment" has-feedback placeholder="请选择承认部门" :disabled="!disabled2">
                  <a-select-option value="研发部">研发部</a-select-option>
                  <a-select-option value="工程部">工程部</a-select-option>
                  <a-select-option value="开发部">开发部</a-select-option>
                  <a-select-option value="电子组">电子组</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="DatetimeSign" has-feedback label="签样时间" prop="DatetimeSign"> <a-date-picker v-model="form.DatetimeSign" :disabled="!disabled2" show-time type="date" placeholder="选择签样时间" style="width: 100%;" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="SignResult" has-feedback label="签样结果" prop="SignResult">
                <a-select v-model="form.SignResult" has-feedback placeholder="请选择签样结果" :disabled="!disabled2">
                  <a-select-option value="OK">OK</a-select-option>
                  <a-select-option value="NG">NG</a-select-option>
                  <a-select-option value="其他">其他</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="Remark2" has-feedback label="研发备注" prop="Remark2"> <a-input v-model="form.Remark2" :disabled="!disabled2" allowClear placeholder="请输入研发备注" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-card>
      <a-card class="card" title="文控" :bordered="false" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="CtrledStatus" has-feedback label="受控状态" prop="CtrledStatus">
                <a-select v-model="form.CtrledStatus" has-feedback placeholder="请选择受控状态" :disabled="!disabled3">
                  <a-select-option value="已受控">已受控</a-select-option>
                  <a-select-option value="受控异常">受控异常</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="DatetimeCtrled" has-feedback label="受控日期" prop="DatetimeCtrled"> <a-date-picker v-model="form.DatetimeCtrled" :disabled="!disabled3" show-time type="date" placeholder="选择受控日期" style="width: 100%;" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="CtrledAbnormalDescription" has-feedback label="受控异常描述" prop="CtrledAbnormalDescription"> <a-input :disabled="!disabled3" v-model="form.CtrledAbnormalDescription" allowClear placeholder="请输入受控异常描述" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="CtrledAbnormalHandleStatus" has-feedback label="异常处理情况" prop="CtrledAbnormalHandleStatus"> <a-input :disabled="!disabled3" v-model="form.CtrledAbnormalHandleStatus" allowClear placeholder="请输入异常处理情况" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="DatetimeCtrledAbnormalHandle" has-feedback label="异常处理日期" prop="DatetimeCtrledAbnormalHandle"> <a-date-picker :disabled="!disabled3" v-model="form.DatetimeCtrledAbnormalHandle" show-time type="date" placeholder="选择异常处理日期" style="width: 100%;" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="Remark3" has-feedback label="文控备注" prop="Remark3"> <a-input v-model="form.Remark3" :disabled="!disabled3" allowClear placeholder="请输入文控备注" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-card>
      <a-card class="card" title="品质" :bordered="false" :bodyStyle="{ padding: '5px' }" :headStyle="{ padding: '5px' }">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="6">
              <a-form-model-item ref="DatetimeQicCollect" has-feedback label="IQC收样日期" prop="DatetimeQicCollect"> <a-date-picker :disabled="!disabled4" v-model="form.DatetimeQicCollect" show-time type="date" placeholder="选择IQC收样日期" style="width: 100%;" /> </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item ref="Remark4" has-feedback label="IQC备注" prop="Remark4"> <a-input v-model="form.Remark4" :disabled="!disabled4" allowClear placeholder="请输入IQC备注" /> </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-card>
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
import { getMaterialSampleApi, setDepartmentApi } from "@/services/web.js";
import moment from "moment";
import { mapState } from "vuex";
export default {
  props: ["editData", "isEdit", "isClone", "isEditBnt"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        ItemCode: "",
        Supplier: "",
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
      userIsInput: false,
      disabled1: false, //采购
      disabled2: false, //研发
      disabled3: false, //文控
      disabled4: false, //品质
      userObj: [
        {
          name: "研发",
          isInput: false,
        },
        {
          name: "工程",
          isInput: false,
        },
        {
          name: "文控",
          isInput: false,
        },
        {
          name: "采购",
          isInput: false,
        },
        {
          name: "品质",
          isInput: false,
        },
      ],
      supplierList: [],
    };
  },
  computed: {
    ...mapState({
      RegisterId: (start) => start.specimen.RegisterId,
      DatetimePurchaseDeliver: (start) => start.specimen.DatetimePurchaseDeliver,
      Purchaser: (start) => start.specimen.Purchaser,
      Supplier: (start) => start.specimen.Supplier,
    }),
  },
  created() {
    this.getUserForm();
    if (this.isEdit) {
      console.log("this.editData===", this.editData);
      this.form = JSON.parse(JSON.stringify(this.editData));
      console.log("this.form===", this.form);
      this.form.DatetimePurchaseDeliver = this.editData.DatetimePurchaseDeliver != null ? moment(this.form.DatetimePurchaseDeliver) : "";
      this.form.DatetimePurchaseRetrieve = this.editData.DatetimePurchaseRetrieve != null ? moment(this.form.DatetimePurchaseRetrieve) : "";
      this.form.DatetimeSign = this.editData.DatetimeSign != null ? moment(this.form.DatetimeSign) : "";
      this.form.DatetimeCtrled = this.editData.DatetimeCtrled != null ? moment(this.form.DatetimeCtrled) : "";
      this.form.DatetimeCtrledAbnormalHandle = this.editData.DatetimeCtrledAbnormalHandle != null ? moment(this.form.DatetimeCtrledAbnormalHandle) : "";
      this.form.DatetimeQicCollect = this.editData.DatetimeQicCollect != null ? moment(this.form.DatetimeQicCollect) : "";
      if (!this.isEditBnt) {
        this.form.Purchaser = this.Purchaser;
        this.form.Supplier = this.Supplier;
        this.form.DatetimePurchaseDeliver = this.DatetimePurchaseDeliver != null ? moment(this.DatetimePurchaseDeliver) : "";
      }
    }
  },
  methods: {
    moment,
    close() {
      if (this.isClone) {
        this.$store.dispatch("specimen/closeRegisterId");
      }
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    userRadio(e) {
      console.log(e);
      this.userObj;
      let result = this.userObj.find((item) => item.name == e.target.value);
      this.userIsInput = result.isInput;
    },
    handleSearch(value) {
      console.log("value===", value);
      let params = {
        pageindex: 1,
        pagesize: 50,
        keyword: value,
      };
      getMaterialSampleApi(params, "getsupplierlist").then((res) => {
        this.supplierList = res.data.data.list;
        console.log(this.supplierList);
      });
    },
    changeSearch(e) {
      this.supplierList.forEach((item) => {
        if (item.SupplierName == e) {
          this.form.SupplierCode = item.SupplierCode;
        }
      });
    },
    getUserForm() {
      let params = {
        usercode: localStorage.getItem("account"),
        flowid: this.editData.FlowId,
      };
      getMaterialSampleApi(params, "getuserdepartment").then((res) => {
        if (res.data.success) {
          if (res.data.data != "") {
            this.userList = res.data.data.UserReceiveDepartment.split(",");
            console.log(this.userList);
            let obj = {
              name: "研发/工程",
              isInput: false,
            };
            this.userObj.forEach((item) => {
              if (this.userList.includes(item.name)) {
                item.isInput = true;
                if (item.name == "采购") {
                  this.disabled1 = item.isInput;
                } else if (item.name == "文控") {
                  this.disabled3 = item.isInput;
                } else if (item.name == "品质") {
                  this.disabled4 = item.isInput;
                }
              }
              if ((item.name == "研发" && item.isInput) || (item.name == "工程" && item.isInput)) {
                console.log(item);
                obj.isInput = true;
                this.disabled2 = item.isInput;
              }
            });
            this.userObj.splice(0, 1);
            this.userObj.splice(0, 1);
            this.userObj.push(obj);
            console.log(this.userObj);
            this.userType = this.userObj[0].name;
            this.userIsInput = this.userObj[0].isInput;
          }
        }
      });
    },
    onSearch(e) {
      let params = {
        itemcode: e,
        usercode: localStorage.getItem("account"),
      };
      getMaterialSampleApi(params, "getitemmoreinfo").then((res) => {
        if (res.data.success) {
          this.form.ItemName = res.data.data[0].ItemName;
          this.form.ItemSpecification = res.data.data[0].ItemSpecification;
          this.form.DrawingNo = res.data.data[0].DrawingNo;
          this.getItemCount(e);
        }
      });
    },
    getItemCount(e) {
      let params1 = {
        itemcode: e,
      };
      getMaterialSampleApi(params1, "getitemngtimes").then((res) => {
        console.log("res.data.data.NgTimes===", res.data.data.NgTimes);
        if (res.data.success && res.data.data.NgTimes > 2) {
          this.$message.warning("该物料编码作废过2次");
        }
      });
    },
    handleCancel() {
      if (this.isClone) {
        this.$store.dispatch("specimen/closeRegisterId");
      }
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
            UserReceiveDepartment: this.userList.join(","), //用户所有接收部门
            RegisterId: this.form.RegisterId, //登记ID1
            DatetimePurchaseDeliver: this.form.DatetimePurchaseDeliver != null && this.form.DatetimePurchaseDeliver != "" ? this.form.DatetimePurchaseDeliver.format("YYYY-MM-DD HH:mm:ss") : "", //采购送样日期
            ItemCode: this.form.ItemCode, //物料编码
            ItemName: this.form.ItemName, //物料名称
            ItemSpecification: this.form.ItemSpecification, //规格型号
            DrawingNo: this.form.DrawingNo, //图号
            Supplier: this.form.Supplier, //供应商
            SupplierCode:this.form.SupplierCode,
            HasApprovalSheet: this.form.HasApprovalSheet, //是否有承认书
            Quantity: this.form.Quantity, //数量
            Purchaser: this.form.Purchaser, //送样采购员
            DatetimePurchaseRetrieve: this.form.DatetimePurchaseRetrieve != null && this.form.DatetimePurchaseRetrieve != "" ? this.form.DatetimePurchaseRetrieve.format("YYYY-MM-DD HH:mm:ss") : "", //采购取回样品日期
            SampleCategory: this.form.SampleCategory, //样品类别
            CtrledCompany: this.form.CtrledCompany, //受控公司
            Remark1: this.form.Remark1, //采购备注
            SignEngineer: this.form.SignEngineer, //签样工程师
            ApprovalDepartment: this.form.ApprovalDepartment, //承认部门
            DatetimeSign: this.form.DatetimeSign != null && this.form.DatetimeSign != "" ? this.form.DatetimeSign.format("YYYY-MM-DD HH:mm:ss") : "", //签样时间
            SignResult: this.form.SignResult, //签样结果
            Remark2: this.form.Remark2, //研发/工程备注
            CtrledStatus: this.form.CtrledStatus, //受控状态
            DatetimeCtrled: this.form.DatetimeCtrled != null && this.form.DatetimeCtrled != "" ? this.form.DatetimeCtrled.format("YYYY-MM-DD HH:mm:ss") : "", //受控日期
            CtrledAbnormalDescription: this.form.CtrledAbnormalDescription, //受控异常描述
            CtrledAbnormalHandleStatus: this.form.CtrledAbnormalHandleStatus, //异常处理情况
            DatetimeCtrledAbnormalHandle: this.form.DatetimeCtrledAbnormalHandle != null && this.form.DatetimeCtrledAbnormalHandle != "" ? this.form.DatetimeCtrledAbnormalHandle.format("YYYY-MM-DD HH:mm:ss") : "", //异常处理日期
            Remark3: this.form.Remark3, //文控备注
            DatetimeQicCollect: this.form.DatetimeQicCollect != null && this.form.DatetimeQicCollect != "" ? this.form.DatetimeQicCollect.format("YYYY-MM-DD HH:mm:ss") : "", //IQC收样日期
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

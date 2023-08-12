<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-08-12 14:02:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/location/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑' : '添加'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EnterpriseId" has-feedback label="公司名称" prop="EnterpriseId">
          <a-select v-model="form.EnterpriseId" :disabled="isEdit" has-feedback placeholder="请选择设公司名称">
            <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="ItemCode" has-feedback label="品号" prop="ItemCode"><a-input-search placeholder="请输入物料编码" style="width: 220px" v-model="form.ItemCode" @search="onSearch"/></a-form-model-item>
        <a-form-model-item has-feedback label="品名" prop="ItemName">
          <a-input v-model="form.ItemName" allowClear disabled placeholder="请输入品名" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="规格" prop="ItemSpecification">
          <a-input v-model="form.ItemSpecification" disabled allowClear placeholder="请输入规格" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="图号">
          <a-input v-model="form.DrawingNo" allowClear placeholder="请输入图号" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="供应商名称" prop="SupplierName">
          <a-select style="width: 200px;" show-search v-model="form.SupplierName" placeholder="请输入供应商" :default-active-first-option="false" :show-arrow="false" :filter-option="false" :not-found-content="null" @search="handleSearch" @change="(e) => changeSearch(e, index)">
            <a-select-option v-for="item in supplierList" :value="item.SupplierCode" :key="item.RowNumber">
              {{ item.SupplierName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="供应商编码" prop="SupplierCode">
          <a-input v-model="form.SupplierCode" disabled allowClear placeholder="请输入供应商编码" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="签样日期" prop="DatetimeSign">
          <a-date-picker :show-time="{ format: 'HH:mm' }" valueFormat="YYYY-MM-DD HH:mm:ss" v-model="form.DatetimeSign"> </a-date-picker>
        </a-form-model-item>
        <a-form-model-item has-feedback label="存放公司">
          <a-select v-model="form.StoredCompany" placeholder="请选择存放公司">
            <a-select-option v-for="item in companyList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="储存位置">
          <a-input v-model="form.StoredLocation" allowClear placeholder="请输入储存位置" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="OA是否作废">
          <a-select v-model="form.IsOaNg" allowClear placeholder="OA是否作废">
            <a-select-option value="Y">是</a-select-option>
            <a-select-option value="N">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="是否从IQC回收签样">
          <a-select v-model="form.IsIqcRecovery" allowClear placeholder="是否从IQC回收签样">
            <a-select-option value="Y">是</a-select-option>
            <a-select-option value="N">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="所回收的资料登记">
          <a-select v-model="form.RecoveryInfo" allowClear placeholder="请选择状态">
            <a-select-option value="承认书">承认书</a-select-option>
            <a-select-option value="样品">样品</a-select-option>
            <a-select-option value="承认书和样品">承认书和样品</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="Remark" label="备注">
          <a-textarea v-model="form.Remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { getMaterialSampleApi, setSpecimenLocation } from "@/services/web.js";
export default {
  props: ["editData", "isEdit", "enterList", "companyList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EnterpriseId: "",
        ItemCode: "", // 品号
        ItemName: "", // 品名
        ItemSpecification: "", // 规格
        DrawingNo: "", // 图号
        SupplierCode: "", // 供应商编码
        SupplierName: "", // 供应商名称
        DatetimeSign: "", // 签样时间
        StoredCompany: "", // 存放公司
        StoredLocation: "", // 储存位置
        IsOaNg: "", // OA是否作废
        IsIqcRecovery: "", // 是否从IQC回收签样
        RecoveryInfo: "", // 所回收的资料登记
        Remark: "", // 备注
      },
      rules: {
        EnterpriseId: [
          {
            required: true,
            message: "请选择公司名称",
            trigger: "blur",
          },
        ],
        ItemCode: [
          {
            required: true,
            message: "请输入品号",
            trigger: "blur",
          },
        ],
        ItemName: [
          {
            required: true,
            message: "请输入品名",
            trigger: "blur",
          },
        ],
        ItemSpecification: [
          {
            required: true,
            message: "请输入规格",
            trigger: "blur",
          },
        ],
        SupplierCode: [
          {
            required: true,
            message: "请输入供应商编码",
            trigger: "blur",
          },
        ],
        SupplierName: [
          {
            required: true,
            message: "请输入供应商名称",
            trigger: "blur",
          },
        ],
        DatetimeSign: [
          {
            required: true,
            message: "请输入签样时间",
            trigger: "change",
          },
        ],
      },
      supplierList: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.dynamicValidateForm = [];
      this.form = this.editData;
      this.enterChange(this.form.EnterpriseId);
      this.rawData = this.editData.PointList;
      this.editData.PointList.forEach((item) => {
        item.ReceiverList.forEach((items) => {
          items.Id = items.ReceiverId;
          items.Code = items.ReceiverCode;
          items.Name = items.ReceiverName;
        });
        // console.log( item.ReceiverList);
        this.dynamicValidateForm.push({
          department: {
            value: item.DepartmentId,
            DepartmentId: item.DepartmentId,
            DepartmentName: item.DepartmentName,
            IsDel: item.IsDel,
            PointId: item.PointId,
            key: Date.now(),
          },
          recipient: item.ReceiverList,
        });
      });
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    onSearch(e) {
      let params = {
        itemcode: e,
      };
      getMaterialSampleApi(params, "getitemmoreinfocommon").then((res) => {
        if (res.data.success) {
          this.form.ItemName = res.data.data[0].ItemName;
          this.form.ItemSpecification = res.data.data[0].ItemSpecification;
          this.form.DrawingNo = res.data.data[0].DrawingNo;
        }
      });
    },
    changeSearch(e) {
      this.supplierList.forEach((item) => {
        if (item.SupplierCode == e) {
          this.form.SupplierCode = item.SupplierCode;
          this.form.Supplier = item.SupplierName;
        }
      });
    },
    handleSearch(value) {
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
    enterChange(e) {
      let params = {
        enterpriseid: e,
      };
      getMaterialSampleApi(params, "getdeptoptions").then((res) => {
        if (res.data.success) {
          this.departmentalList = res.data.data;
        }
      });
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.form.Id = this.editData.Id;
            setSpecimenLocation(this.form, "edit").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setSpecimenLocation(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          }
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

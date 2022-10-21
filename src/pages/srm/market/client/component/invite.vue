<!--
 * @Author: max
 * @Date: 2022-09-02 11:07:01
 * @LastEditTime: 2022-09-02 16:17:49
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/purchase/supplier/component/invite.vue
-->
<template>
  <div>
    <a-modal title="邀请供应商" v-if="visible" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="receiveCompanyId" has-feedback label="邀请企业" prop="receiveCompanyId">
          <a-select show-search allowClear :show-arrow="false" :filter-option="false" :not-found-content="null" v-model="form.receiveCompanyId" placeholder="请选择邀请企业" @search="getSupplier">
            <a-select-option :value="item.Id" v-for="item in supplier" :key="item.Id">
              {{ item.Name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="receiveUser" has-feedback label="接收人" prop="receiveUser">
          <a-input v-model="form.receiveUser" allowClear placeholder="请输入接收人" />
        </a-form-model-item>
        <a-form-model-item ref="receivePhone" has-feedback label="手机号" prop="receivePhone">
          <a-input v-model="form.receivePhone" allowClear placeholder="请输入手机号" />
        </a-form-model-item>
        <a-form-model-item ref="receiveEmail" has-feedback label="邮箱" prop="receiveEmail">
          <a-input v-model="form.receiveEmail" allowClear placeholder="请输入邮箱" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setSupplierAction, getSupplierAction } from "@/services/srm.js";
export default {
  props: ["editData", "isEdit", "plantList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        receiveCompanyId: "",
        receiveUser: "",
        receivePhone: "",
        receiveEmail: "",
      },
      ids: [],
      rules: {
        receiveCompanyId: [
          {
            required: true,
            message: "请选择邀请企业",
            trigger: "blur",
          },
        ],
        receiveUser: [
          {
            required: true,
            message: "请输入接收人",
            trigger: "blur",
          },
        ],
      },
      supplier: [],
    };
  },
  created() {
    this.getSupplier();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    getSupplier(value) {
      let params = {
        pageindex: 1,
        pagesize: 100,
        keyword: value,
      };
      getSupplierAction(params, "getsupplier").then((res) => {
        if (res.data.success) {
          this.supplier = res.data.data.list;
        }
      });
    },
    handleOk() {
      console.log(this.form);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          setSupplierAction(this.form, "invitesupplier").then((res) => {
            if (res.data.success) {
              this.$message.success("邀请成功!");
              this.$emit("closeModal");
              this.$emit("success");
              this.visible = false;
            }
          });
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

<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-03-17 14:18:11
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/goods/classifyForm.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑分类' : '添加分类'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="分类名称" prop="classifyname">
          <a-input v-model="form.classifyname" has-feedback placeholder="请输入分类名称"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="排序">
          <a-input-number v-model="form.sort" has-feedback placeholder="请输入排序"></a-input-number>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setGoodsClassify } from "@/services/ors.js";
export default {
  props: ["editData", "isEdit"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        classifyname: "", //部门名称
        sort: "1", //排序
      },
      rules: {
        classifyname: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.form.classifyname = this.editData.ClassifyName;
      this.form.sort = this.editData.CompanyId;
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    closeModal() {
      this.isUser = false;
    },
    setUserList(list) {
      this.user = list;
    },
    handleClose(id) {
      this.user = this.user.filter((item) => item.Id != id);
    },
    addUser() {
      this.isUser = true;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              id: this.editData.Id, //部门ID
              classifyname: this.form.classifyname, //备注
              sort: this.form.sort,
            };
            setGoodsClassify(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            setGoodsClassify(this.form, "add").then((res) => {
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

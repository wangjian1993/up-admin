<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-03-23 09:35:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/lamp/register/form.vue
-->

<template>
  <div>
    <a-modal title="编辑灯板钢网" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="位号" prop="PlaceCode">
          <a-input v-model="form.PlaceCode" has-feedback placeholder="请输入位号"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="规格/型号/版本" prop="ItemSpecification">
          <a-input v-model="form.ItemSpecification" has-feedback placeholder="请输入规格/型号/版本"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="物料编码" prop="ItemCode">
          <a-input v-model="form.ItemCode" has-feedback placeholder="请输入物料编码"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="尺寸" prop="Size">
          <a-input v-model="form.Size" has-feedback placeholder="请输入尺寸"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="状态" prop="Status">
          <a-select style="width: 200px" allowClear placeholder="请选择状态" v-model="form.Status">
            <a-select-option value="已借出">已借出</a-select-option>
            <a-select-option value="已归还">已归还</a-select-option>
            <a-select-option value="钢网异常">钢网异常</a-select-option>
            <a-select-option value="未使用">未使用</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="备注" prop="Remark">
          <a-input v-model="form.Remark" has-feedback placeholder="请输入备注"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setLampAction } from "@/services/web.js";
export default {
  props: ["editData", "isEdit", "enterList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        PlaceCode: "", //位号
        ItemCode: "", //物料编码
        ItemSpecification: "", //规格型号
        Size: "", //尺寸
        Remark: "", //备注
        Status: "",
      },
      rules: {
        PlaceCode: [
          {
            required: true,
            message: "请输入位号",
            trigger: "blur",
          },
        ],
        ItemCode: [
          {
            required: true,
            message: "请输入物料编码",
            trigger: "blur",
          },
        ],
        ItemSpecification: [
          {
            required: true,
            message: "请输入规格型号",
            trigger: "blur",
          },
        ],
        Size: [
          {
            required: true,
            message: "请输入尺寸",
            trigger: "blur",
          },
        ],
        Remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur",
          },
        ],
        Status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      console.log("editData===", this.editData);
      this.form = { ...this.editData };
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
      if (this.userType == 1) {
        this.user = list;
      } else {
        this.notifier = list;
      }
    },
    handleClose(id, type) {
      if (type == 1) {
        this.user = this.user.filter((item) => item.Id != id);
      } else {
        this.notifier = this.notifier.filter((item) => item.Id != id);
      }
    },
    addUser(type) {
      this.userType = type;
      this.userList = type == 1 ? this.user : this.notifier;
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
              Id: this.editData.Id, //灯板钢网ID
              ...this.form,
            };
            setLampAction(editForm, "editlpsm").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
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

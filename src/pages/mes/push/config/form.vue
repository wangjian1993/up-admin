<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-05-04 16:56:19
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/push/config/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑看板配置' : '添加看板配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item has-feedback label="生产工厂" prop="plantid">
          <a-select v-model="form.plantid" :disabled="isEdit" has-feedback placeholder="请选择生产工厂">
            <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item has-feedback label="看板编码" prop="kanbancode">
          <a-input v-model="form.kanbancode" :disabled="isEdit" has-feedback placeholder="请输入看板编码"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="看板名称" prop="kanbanname">
          <a-input v-model="form.kanbanname" has-feedback placeholder="请输入看板名称"></a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="URL" prop="kanbanurl">
          <!-- <a-tex v-model="form.kanbanurl" has-feedback placeholder="请输入URL"></a-tex> -->
          <a-textarea v-model="form.kanbanurl" placeholder="请输入URL" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-textarea v-model="form.kanbandesc" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { setKanBanConfig } from "@/services/mes.js";
export default {
  props: ["editData", "isEdit", "enterList"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        plantid: "",
        kanbancode: "",
        kanbanname: "",
        kanbanurl: "",
        kanbandesc: "",
      },
      rules: {
        plantid: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        kanbancode: [
          {
            required: true,
            message: "请输入看板编码",
            trigger: "blur",
          },
        ],
        kanbanname: [
          {
            required: true,
            message: "请输入看板名称",
            trigger: "blur",
          },
        ],
        kanbanurl: [
          {
            required: true,
            message: "请输入看板URL",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.form = { id: this.editData.Id, plantid: this.editData.PlantId, kanbancode: this.editData.KanbanCode, kanbanname: this.editData.KanbanName, kanbanurl: this.editData.KanbanUrl, kanbandesc: this.editData.KanbanDesc };
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
            setKanBanConfig(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            setKanBanConfig(this.form, "add").then((res) => {
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

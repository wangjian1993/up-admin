<template>
  <div>
    <a-modal :title="isEdit ? '编辑通知' : '添加通知'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk('save')">
          保存
        </a-button>
        <a-button key="submit" type="primary" @click="handleOk('send')">
          发送
        </a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="title" has-feedback label="标题" prop="title">
          <a-input v-model="form.title" allowClear placeholder="请输入标题" :disabled="isEdit" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="发件企业">
          <div>
            <a-tag style="margin:4px 4px" v-for="item in companyList" :key="item.Id" closable @close="() => handleClose(item.Id)">
              {{ item.Name }}
            </a-tag>
          </div>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addCompany"> <a-icon type="plus" /> 添加 </a-tag>
        </a-form-model-item>
        <a-form-model-item label="优先级">
          <a-radio-group v-model="form.priority" prop="priority">
            <a-radio value="重要">
              重要
            </a-radio>
            <a-radio value="一般">
              一般
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item ref="content" label="通知内容" prop="content">
          <a-textarea v-model="form.content" placeholder="请输入通知内容" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item ref="isconfirm" label="供应商确认内容">
          <a-checkbox-group v-model="form.isconfirm">
            <a-checkbox value="1" name="type">
              需要供应商确认内容
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item ref="confirmcontent" label="供应商确认内容">
          <a-textarea v-model="form.confirmcontent" placeholder="请输入通知内容" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item ref="isreturn" label="供应商回传附件">
          <a-checkbox-group v-model="form.isreturn">
            <a-checkbox value="1" name="type">
              要求供应商回传附件
            </a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
      <CompanyList v-if="isCompany" @closeModal="closeModal" :companyList="companyList" @success="setCompanyList" />
    </a-modal>
  </div>
</template>

<script>
import { setNotification } from "@/services/srm.js";
import CompanyList from "./companyList.vue";
export default {
  props: ["editData", "isEdit"],
  components: { CompanyList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        id: "",
        title: "",
        priority: "",
        content: "",
        isconfirm: false,
        confirmcontent: "",
        isreturn: false,
        isall: false,
        companyids: [],
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      isCompany: false,
      companyList: [],
    };
  },
  created() {
    if (this.isEdit) {
      this.form = this.editData;
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    addCompany() {
      this.isCompany = true;
    },
    closeModal() {
      this.isCompany = false;
    },
    setCompanyList(list) {
      this.companyList = list;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk(type) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              PlantId: this.form.PlantId,
              LineId: this.form.LineId,
              WorkShopId: this.form.WorkShopId,
              LineName: this.form.LineName,
              LineCode: this.form.LineCode,
              LineDesc: this.form.LineDesc,
              Enable: this.form.Enable,
            };
            setNotification(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            this.companyList.forEach((item) => {
              this.form.companyids.push(item.Id);
            });
            setNotification(this.form, type).then((res) => {
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

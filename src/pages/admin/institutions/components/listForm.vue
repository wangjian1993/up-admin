<template>
  <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-row>
      <a-col :span="12">
        <a-form-model-item ref="EnterCode" label="机构编码" prop="EnterCode" :labelCol="{ span: 6 }">
          <a-select v-model="form.EnterCode" placeholder="选择机构" @change="enterTypeOption">
            <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.EnterTypeCode">
              {{ item.EnterTypeCode }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item ref="EnterEMail" label="管理员邮箱" prop="EnterEMail" :labelCol="{ span: 6 }">
          <a-input
            v-model="form.EnterEMail"
            allowClear
            @blur="
              () => {
                $refs.EnterEMail.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item ref="EnterName" label="公司中文名" prop="EnterName" :labelCol="{ span: 6 }">
          <a-input
            v-model="form.EnterName"
            @blur="
              () => {
                $refs.EnterEMail.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="公司简称(中文)" prop="region" :labelCol="{ span: 6 }">
          <a-input
            v-model="form.EnterShortName"
            allowClear
            @blur="
              () => {
                $refs.name.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="公司英文名" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterEnName" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="上级机构" :labelCol="{ span: 6 }">
          <a-input v-model="form.SuperiorEnterId" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="公司简称(英文)" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterShortEnName" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="公司域名" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterUrl" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="公司法人" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterCorporate" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="营业执照编码" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterLicense" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="公司描述" :labelCol="{ span: 6 }">
          <a-textarea v-model="form.EnterDesc" placeholder="Controlled autosize" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="机构类型" prop="region" :labelCol="{ span: 6 }">
          <a-input
            v-model="form.EnterTypeName"
            @blur="
              () => {
                $refs.EnterTypeName.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item ref="Enable" label="是否默认" :labelCol="{ span: 6 }">
          <a-radio-group :default-value="form.Enable" button-style="solid">
            <a-radio-button value="N">
              否
            </a-radio-button>
            <a-radio-button value="Y">
              是
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="联系人" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterContacts" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="联系电话" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterPhone" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="地址" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterAddr" allowClear />
        </a-form-model-item>
      </a-col>
      <a-col :span="12">
        <a-form-model-item label="传真" :labelCol="{ span: 6 }">
          <a-input v-model="form.EnterFax" allowClear />
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</template>
<script>
import { getInstitutionList } from "@/services/admin.js";
export default {
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: "",
      selectList: [],
      form: {
        OAId: "",
        EnterCode: "",
        EnterName: "",
        EnterEnName: "",
        EnterDesc: "",
        EnterTypeId: "",
        EnterTypeCode: "",
        EnterTypeName: "",
        EnterEMail: "",
        EnterFax: "",
        EnterUrl: "",
        EnterLicense: "",
        EnterCorporate: "",
        EnterContacts: "",
        EnterPhone: "",
        EnterAddr: "",
        SuperiorEnterId: "",
        Enable: "Y",
      },
      rules: {
        EnterCode: [
          {
            required: true,
            message: "请选择机构编码",
            trigger: "blur",
          },
        ],
        EnterEMail: [
          {
            required: true,
            message: "请输入管理员邮箱",
            trigger: "blur",
          },
        ],
        EnterName: [
          {
            required: true,
            message: "请输入公司中文名",
            trigger: "blur",
          },
        ],
        EnterTypeName: [
          {
            required: true,
            message: "请选择机构类型",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getInstitutionList();
  },
  methods: {
    //获取机构类型
    getInstitutionList() {
      let params = {
        pageindex: 1,
        pagesize: 100,
      };
      getInstitutionList(params).then((res) => {
        if (res.data.success) {
          this.selectList = res.data.data.list;
        }
      });
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    enterTypeOption(value) {
      console.log(value);
      this.selectList.filter((item) => {
        if (item.EnterTypeCode == value) {
          this.form.EnterTypeName = item.EnterTypeName;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

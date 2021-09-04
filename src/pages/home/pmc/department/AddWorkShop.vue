<!--
 * @Author: max
 * @Date: 2021-09-04 14:04:40
 * @LastEditTime: 2021-09-04 14:32:45
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/department/AddWorkShop.vue
-->
<template>
  <div>
    <div>
      <a-modal title="添加车间" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select v-model="form.PlantId" placeholder="请选择生产工厂">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="WorkShopName" has-feedback label="车间名称" prop="WorkShopName">
            <a-input
              v-model="form.WorkShopName"
              allowClear
              placeholder="请输入车间名称"
              @blur="
                () => {
                  $refs.WorkShopName.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="WorkShopCode" has-feedback label="车间编码" prop="WorkShopCode">
            <a-input
              v-model="form.WorkShopCode"
              allowClear
              placeholder="请输入车间编码"
              @blur="
                () => {
                  $refs.WorkShopCode.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="WorkShopDesc" label="车间描述">
            <a-textarea v-model="form.WorkShopDesc" placeholder="请输入车间描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { addWorkshop } from "@/services/web.js";
export default {
  props: ["plantList"],
  data() {
    return {
      visible: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        PlantId: "",
        WorkShopCode: "",
        WorkShopName: "",
        WorkShopDesc: "",
        Enable: "Y",
      },
      rules: {
        PlantId: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        WorkShopCode: [
          {
            required: true,
            message: "请输入车间编码",
            trigger: "blur",
          },
        ],
        WorkShopName: [
          {
            required: true,
            message: "请输入车间名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //初始化表单
    defaultForm() {
      this.form = {
        PlantId: "",
        WorkShopCode: "",
        WorkShopName: "",
        WorkShopDesc: "",
        Enable: "Y",
      };
    },
    //确定按钮
    handleOk() {
      addWorkshop(this.form).then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功!");
          this.defaultForm();
          this.$emit("confirm");
        }
      });
    },
    //取消按钮
    handleCancel() {
      this.$emit("close");
    },
    //启动选择
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
  },
  components: {},
};
</script>

<style></style>

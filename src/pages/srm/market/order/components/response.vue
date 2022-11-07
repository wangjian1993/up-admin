<!--
 * @Author: max
 * @Date: 2021-11-29 15:04:20
 * @LastEditTime: 2022-11-02 10:20:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/market/order/components/response.vue
-->
<template>
  <div>
    <a-modal v-model="visible" :title="isEdit ? '编辑答交' : '添加答交'" @cancel="close" @ok="handleOk" centered :width="600">
      <div>
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item has-feedback label="采购订单" prop="orderno">
            <a-input v-model="form.orderno"  disabled="" allowClear placeholder="请输入采购订单" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="序号" prop="sort">
            <a-input v-model.trim="form.sort" allowClear placeholder="请输入工序编码" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="答交日期" prop="changedatetime">
            <a-date-picker   v-model="form.changedatetime" allowClear placeholder="请输入答交日期"/>
          </a-form-model-item>
          <a-form-model-item has-feedback label="答交数量" prop="changeqty">
            <a-input-number v-model="form.changeqty" style="width:200px" allowClear placeholder="请输入答交数量" :min="0" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="答交单价" prop="changeprice">
            <a-input-number v-model="form.changeprice" style="width:200px" allowClear placeholder="请输入答交单价" :min="0" />
          </a-form-model-item>
          <a-form-model-item has-feedback label="答交金额" prop="changeamount">
            <a-input-number v-model="form.changeamount" style="width:200px" allowClear placeholder="请输入答交金额" :min="0" />
          </a-form-model-item>
          <a-form-model-item label="备注">
            <a-textarea v-model="form.remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { setClientOrder } from "@/services/srm.js";
export default {
  props: ["orderData", "editData", "isEdit"],
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        orderno: "",
        sort: "",
        changedatetime: "",
        changeqty: "",
        changeprice: "",
        changeamount: "",
        remark: "",
      },
      rules: {
        orderno: [
          {
            required: true,
            message: "请输入采购订单",
            trigger: "change",
          },
        ],
        sort: [
          {
            required: true,
            message: "请输入序号",
            trigger: "change",
          },
        ],
        changedatetime: [
          {
            required: true,
            message: "请输入答交日期",
            trigger: "change",
          },
        ],
        changeqty: [
          {
            required: true,
            message: "请输入答交数量",
            trigger: "blur",
          },
        ],
        changeprice: [
          {
            required: true,
            message: "请输入答交价格",
            trigger: "blur",
          },
        ],
        changeamount: [
          {
            required: true,
            message: "请输入答交金额",
            trigger: "blur",
          },
        ],
      },
      visible: true,
      plantId: "",
      workshopId: "",
      week: "",
      workshopList: [],
      lineList: [],
      lineId: "",
      isUserList: false,
      processList: [],
      processType: [],
    };
  },
  created() {
    this.form.orderno = this.orderData.OrderNo;
    console.log("editData===",this.editData)
    if (this.isEdit) {
      this.form.orderno = this.editData.OrderNo;
      this.form.sort = this.editData.Sort;
      this.form.changedatetime = this.editData.ChangeDatetime;
      this.form.changeqty = this.editData.ChangeQty;
      this.form.changeprice = this.editData.ChangePrice;
      this.form.changeamount = this.editData.ChangeAmount;
      this.form.remark = this.editData.Remark;
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    isAgeingChange(value) {
      this.form.IsAgeing = value.target.value;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          //编辑
          if (this.isEdit) {
            this.form.id = this.editData.Id
            setClientOrder(this.form, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
              }
            });
          } else {
            //添加
            console.log("this.form", this.form);
            setClientOrder(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.$emit("closeModal");
                this.$emit("success");
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
/deep/.ant-table {
  min-height: 0vh;
}
/deep/.ant-upload-list-item-name {
  white-space: normal;
}
</style>

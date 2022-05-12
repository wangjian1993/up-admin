<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2022-05-12 15:53:02
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/flow/form.vue
-->

<template>
  <div>
    <a-modal :title="isEdit ? '编辑流程' : '添加流程'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="EnterpriseId" has-feedback label="公司名称" prop="EnterpriseId">
          <a-select v-model="form.EnterpriseId" :disabled="isEdit" has-feedback placeholder="请选择设公司名称" @change="enterChange">
            <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="DepartmentId" has-feedback label="发起部门" prop="DepartmentId">
          <a-select v-model="form.DepartmentId" :disabled="isEdit" has-feedback placeholder="请选择发起部门">
            <a-select-option v-for="item in departmentalList" :key="item.Id" :value="item.Id">{{ item.DepartmentName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="Condition" has-feedback label="条件" prop="Condition">
          <a-input v-model="form.Condition" allowClear placeholder="请输入排序" />
        </a-form-model-item>
        <a-row>
          <a-col :span="24" v-for="(formItem, index) in dynamicValidateForm" :key="index">
            <a-form-model-item label="接收部门">
              <a-select :disabled="isEdit" v-model="formItem.department.value" has-feedback placeholder="请选择发起部门" style="width:91%" @change="(e) => departmentChange(e, index)">
                <a-select-option v-for="item in departmentalList" :key="item.Id" :value="item.Id">{{ item.DepartmentName }}</a-select-option>
              </a-select>
              <a-icon v-if="!isEdit" style="margin-left:10px" class="dynamic-delete-button" type="minus-circle-o" :disabled="dynamicValidateForm.length === 1" @click="removeDomain(formItem)" />
            </a-form-model-item>
            <a-form-model-item label="接收人">
              <div>
                <a-tag style="margin:4px 4px" v-for="item in formItem.recipient" :key="item.Id" closable @close="() => handleClose(item.Id,index)">
                  {{ item.Name }}
                </a-tag>
              </div>
              <a-tag style="background: #fff; borderStyle: dashed;" @click="addUser(index)"> <a-icon type="plus" /> 添加 </a-tag>
            </a-form-model-item></a-col
          >
        </a-row>
        <a-form-model-item v-if="!isEdit">
          <div style="text-align: center;">
            <a-button :disabled="isEdit" type="dashed" style="width: 60%;margin: 0 auto;" @click="addDomain"> <a-icon type="plus" />添加接收人 </a-button>
          </div>
        </a-form-model-item>
        <a-form-model-item ref="SortNumber" has-feedback label="排序" prop="SortNumber">
          <a-input-number style="width: 200px" :min="0" v-model="form.SortNumber" allowClear placeholder="请输入排序" />
        </a-form-model-item>
        <a-form-model-item ref="Remark" label="备注">
          <a-textarea v-model="form.Remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-model-item>
        <a-form-model-item ref="Enable" label="是否启用">
          <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
            <a-radio-button value="N">否</a-radio-button>
            <a-radio-button value="Y">是</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <userList v-if="isUser" @closeModal="closeModal" :user="user" @success="setUserList" />
    </a-modal>
  </div>
</template>

<script>
import { getMaterialSampleApi, setDepartmentApi } from "@/services/web.js";
import userList from "../components/userList.vue";
export default {
  props: ["editData", "isEdit", "enterList"],
  components: { userList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EnterpriseId: "", //公司ID
        DepartmentId: "", //部门名称
        Condition: "",
        PointList: [],
        SortNumber: "", //排序
        Remark: "", //备注
        Enable: "Y",
      },
      rules: {
        EnterpriseId: [
          {
            required: true,
            message: "请选择公司名称",
            trigger: "blur",
          },
        ],
        DepartmentId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur",
          },
        ],
        Condition: [
          {
            required: true,
            message: "请输入条件",
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
    closeModal() {
      this.isUser = false;
    },
    //选择用户
    setUserList(list) {
      // this.user = list;
      this.dynamicValidateForm[this.addUserIndex].recipient = list;
      console.log(" this.dynamicValidateForm", this.dynamicValidateForm);
    },
    //tag删除用户
    handleClose(id,index) {
      let list = this.dynamicValidateForm[index].recipient;
      this.dynamicValidateForm[index].recipient = list.filter((item) => item.Id != id);
    },
    //添加用户按钮
    addUser(index) {
      this.isUser = true;
      this.addUserIndex = index;
      this.user = this.dynamicValidateForm[this.addUserIndex].recipient;
    },
    departmentChange(e, index) {
      console.log(e);
      console.log(index);
      let params = {
        departmentid: e,
      };
      getMaterialSampleApi(params, "getdeptsingle").then((res) => {
        if (res.data.success) {
          let list = res.data.data.ReceiverList;
          list.forEach((item) => {
            this.dynamicValidateForm[index].recipient.push({
              Id: item.ReceiverId,
              Code: item.ReceiverCode,
              Name: item.ReceiverName,
            });
          });
        }
      });
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    removeDomain(item) {
      console.log(item);
      let index = this.dynamicValidateForm.indexOf(item);
      this.rawData.forEach((i) => {
        if (item.department.PointId == i.PointId) {
          i.IsDel = "Y";
        }
      });
      console.log(this.rawData);
      if (index !== -1) {
        this.dynamicValidateForm.splice(index, 1);
      }
    },
    addDomain() {
      if(this.form.EnterpriseId == ''){
        this.$message.warning("请先选择公司")
        return
      }
      this.dynamicValidateForm.push({
        department: {
          value: "",
          key: Date.now(),
        },
        recipient: [],
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
            let editForm = {
              FlowId: this.form.FlowId, //部门ID
              Condition: this.form.Condition,
              PointList: [],
              SortNumber: this.form.SortNumber, //排序
              Remark: this.form.Remark, //备注
              Enable: this.form.Enable,
            };
            this.dynamicValidateForm.forEach((item) => {
              item.recipient.forEach((items) => {
                items.ReceiverId = items.Id;
                items.ReceiverCode = items.Code;
                items.ReceiverName = items.Name;
                delete items.Id;
                delete items.Code;
                delete items.Name;
                delete items.SurperName;
              });
              editForm.PointList.push({
                DepartmentId: item.department.value, //部门ID：采购
                PointId: item.department.PointId || "",
                DepartmentName: item.department.DepartmentName || "",
                IsDel: "N", //删除标识
                ReceiverList: item.recipient,
              });
            });
            this.rawData.forEach((item) => {
              if (item.IsDel == "Y") {
                editForm.PointList.push(item);
              }
            });
            console.log("editForm", editForm);
            setDepartmentApi(editForm, "editflow").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.$emit("closeModal");
                this.$emit("success");
                this.visible = false;
              }
            });
          } else {
            //添加
            this.dynamicValidateForm.forEach((item) => {
              item.recipient.forEach((items) => {
                items.ReceiverId = items.Id;
                items.ReceiverCode = items.Code;
                items.ReceiverName = items.Name;
                delete items.Id;
                delete items.Code;
                delete items.Name;
                delete items.SurperName;
              });
              this.form.PointList.push({
                DepartmentId: item.department.value, //部门ID：采购
                IsDel: "N", //删除标识
                ReceiverList: item.recipient,
              });
            });
            console.log(this.form);
            setDepartmentApi(this.form, "addflow").then((res) => {
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

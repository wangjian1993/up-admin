<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-07-20 09:26:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/specimen/backlog/recipient.vue
-->

<template>
  <div>
    <a-modal title="修改接收人" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="Condition" has-feedback label="顺序">
          <a-input v-model="form.SortNumber" disabled allowClear placeholder="请输入排序" />
        </a-form-model-item>
        <a-form-model-item ref="DepartmentId" has-feedback label="部门名称" prop="DepartmentId">
          <a-select v-model="form.DepartmentId" has-feedback placeholder="请选择部门名称" @change="epartmentChange">
            <a-select-option v-for="item in departmentalList" :key="item.Id" :value="item.Id">{{ item.DepartmentName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="接收人">
          <div>
            <a-tag style="margin:4px 4px" v-for="item in user" :key="item.Id" closable @close="() => handleClose(item.Id)">
              {{ item.Name }}
            </a-tag>
          </div>
          <a-tag style="background: #fff; borderStyle: dashed;" @click="addUser"> <a-icon type="plus" /> 添加 </a-tag>
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
  props: ["pointid"],
  components: { userList },
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        EnterpriseId: "", //公司ID
        DepartmentName: "", //部门名称
        SortNumber: "", //排序
      },
      rules: {
        DepartmentName: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur",
          },
        ],
      },
      departmentalList: [],
      isUser: false,
      user: [],
    };
  },
  created() {
    this.getPointList();
    if (this.isEdit) {
      this.form = JSON.parse(JSON.stringify(this.editData));
      this.form.MaterialPrefix = this.editData.MaterialPrefix.split(",");
      this.enterChange(this.form.EnterpriseId);
      this.editData.PermissionUserList.forEach((item) => {
        this.user.push({
          Name: item.UserName,
          Id: item.UserId,
          Code: item.UserCode,
        });
      });
    }
  },
  methods: {
    getPointList() {
      let params = {
        pointid: this.pointid,
      };
      getMaterialSampleApi(params, "getonepointinfo").then((res) => {
        if (res.data.success) {
          this.enterChange(res.data.data.EnterpriseId);
          this.form.DepartmentId = res.data.data.DepartmentId;
          this.form.SortNumber = res.data.data.SortNumber;
          res.data.data.ReceiverList.forEach((item) => {
            this.user.push({
              Name: item.ReceiverName,
              Id: item.ReceiverId,
              Code: item.ReceiverCode,
            });
          });
        } else {
          console.log("res.data.===", res.data);
          this.$emit("closeModal");
          this.visible = true;
        }
      });
    },
    epartmentChange(e) {
      let params = {
        departmentid: e,
      };
      this.user = [];
      getMaterialSampleApi(params, "getdeptsingle").then((res) => {
        if (res.data.success) {
          let list = res.data.data.ReceiverList;
          list.forEach((item) => {
            this.user.push({
              Id: item.ReceiverId,
              Code: item.ReceiverCode,
              Name: item.ReceiverName,
            });
          });
        }
      });
    },
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
          if (this.user.length == 0) {
            this.$message.warning("请先添加接收人!");
          }
          let editForm = {
            PointId:this.pointid, //部门ID
            DepartmentId: this.form.DepartmentId,
            ReceiverList:[], //排序
          };
          this.user.forEach((item) => {
            editForm.ReceiverList.push({
              ReceiverId: item.Id, //接收人ID
              ReceiverCode: item.Code, //接收人工号
              ReceiverName: item.Name, //接收人名称
            });
          });
          setDepartmentApi(editForm, "editonepointinfo").then((res) => {
            if (res.data.success) {
              this.$message.success("修改成功!");
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

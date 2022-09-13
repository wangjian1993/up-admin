<template>
  <div>
    <a-modal title="添加快码" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel" width="60%">
      <a-button class="editable-add-btn" @click="handleAdd">
        Add
      </a-button>
      <a-table bordered :data-source="dataSource" :pagination="false" :columns="columns">
        <template slot="ParamName" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.ParamName" size="small" />
          </div>
        </template>
        <template slot="ParamCode" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.ParamCode" size="small" />
          </div>
        </template>
        <template slot="ParamValue" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.ParamValue" size="small" />
          </div>
        </template>
        <template slot="SortNo" slot-scope="text, record">
          <div>
            <a-input-number :min="0" style="width:80px" v-model="record.SortNo" size="small" />
          </div>
        </template>
        <template slot="ParamDesc" slot-scope="text, record">
          <div>
            <a-input style="width:150px" v-model="record.ParamDesc" size="small" />
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-popconfirm v-if="dataSource.length > 1" title="Sure to delete?" @confirm="() => onDelete(record.SortNo)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { paramAction } from "@/services/admin.js";
const columns = [
  {
    title: "快码组",
    dataIndex: "ParamGroup",
    scopedSlots: { customRender: "ParamGroup" },
    align: "center",
  },
  {
    title: "快码名称",
    dataIndex: "ParamName",
    scopedSlots: { customRender: "ParamName" },
    align: "center",
  },
  {
    title: "快码编码",
    dataIndex: "ParamCode",
    scopedSlots: { customRender: "ParamCode" },
    align: "center",
  },
  {
    title: "值",
    dataIndex: "ParamValue",
    scopedSlots: { customRender: "ParamValue" },
    align: "center",
  },
  {
    title: "排序",
    dataIndex: "SortNo",
    scopedSlots: { customRender: "SortNo" },
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "ParamDesc",
    scopedSlots: { customRender: "ParamDesc" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  props: ["groupItem"],
  data() {
    return {
      size: "small",
      visible: true,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      dataSource: [
        {
          ParamCode: "",
          ParamName: "",
          ParamDesc: "",
          ParamValue: "",
          SortNo: 1,
          Enable: "Y",
          ParamGroup: "",
        },
      ],
      columns,
      count: 2,
    };
  },
  created() {
    this.dataSource[0].ParamGroup = this.groupItem.ParamGroupName;
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleAdd() {
      const { count, dataSource } = this;
      this.count = count + 1;
      const newData = {
        ParamCode: "",
        ParamName: "",
        ParamDesc: "",
        ParamValue: "",
        SortNo: count,
        Enable: "Y",
        ParamGroup: this.groupItem.ParamGroupName,
      };
      this.dataSource = [...dataSource, newData];
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter((item) => item.SortNo !== key);
    },
    closeModal() {
      this.isCompany = false;
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    handleOk() {
      let flag = false;
      this.dataSource.forEach((item) => {
        if (item.ParamCode == "") {
          flag = true;
        }
        if (item.ParamName == "") {
          flag = true;
        }
        if (item.ParamValue == "") {
          flag = true;
        }
      });
      if (flag) {
        return this.$message.warning("数据输入有误!");
      }
      this.dataSource.forEach((item) => {
        let params = {
          ParamCode: item.ParamCode,
          ParamName: item.ParamName,
          ParamDesc: item.ParamDesc,
          ParamValue: item.ParamValue,
          SortNo: item.SortNo,
          Enable: "Y",
          ParamGroupId: this.groupItem.ParamGroupId,
        };
        paramAction(params, "add").then((res) => {
          if (res.data.success) {
            this.$message.success("添加成功!");
            this.$emit("closeModal");
            this.$emit("success");
          }
        });
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

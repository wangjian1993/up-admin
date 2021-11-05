<!--
 * @Author: max
 * @Date: 2021-10-07 15:16:07
 * @LastEditTime: 2021-11-05 17:49:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/BatchApprove.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="匹配异常处理" @cancel="close" @ok="handleOk" centered width="90%">
      <div>
        <div class="tab">
          <a-table
            :columns="columns"
            :data-source="list"
            size="small"
            :scroll="{ y: 600 }"
            :pagination="false"
            @change="handleTableChange"
            :rowKey="(list) => list.Id"
            :loading="loading"
            bordered
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <div slot="UpdateQty" slot-scope="text, record">
              <a-input-number v-model="record.UpdateQty" :min="0" :disabled="!record.isInput" />
            </div>
            <div slot="IsDel" slot-scope="text, record">
              <a-checkbox v-model="record.IsDel" :disabled="!record.isInput"></a-checkbox>
            </div>
          </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    width: "5%",
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
  },
  {
    title: "计划批号",
    dataIndex: "BatchNo",
    scopedSlots: { customRender: "BatchNo" },
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "物料名称",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: "需求日期",
    dataIndex: "RequirementDate",
    scopedSlots: { customRender: "RequirementDate" },
    align: "center",
    customRender: (text) => {
      return splitData(text);
    },
  },
  {
    title: "需求数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: 80,
  },
  {
    title: "状态",
    dataIndex: "MatchStatusName",
    scopedSlots: { customRender: "MatchStatusName" },
    align: "center",
  },
  {
    title: "错误信息",
    dataIndex: "Msg",
    scopedSlots: { customRender: "Msg" },
    align: "center",
  },
  {
    title: "调整需求数量",
    dataIndex: "UpdateQty",
    scopedSlots: { customRender: "UpdateQty" },
    align: "center",
  },
  {
    title: "是否删除",
    dataIndex: "IsDel",
    scopedSlots: { customRender: "IsDel" },
    align: "center",
  },
];
import { getMitemrequirement, mitemrequirementAction } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
export default {
  props: ["batchid","BatchNo"],
  data() {
    return {
      columns,
      size: "small",
      visible: true,
      list: [],
      searchForm: this.$form.createForm(this),
      mitemList: [],
      mitemData: [],
      batchData: [],
      batchnoData: [],
      selectedRowKeys: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      isBatchNo: false,
      materialData: [],
      materialDates: [],
      PlantName: "",
      loading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    splitData,
    handleChange(e, record, index) {
      console.log(e);
      this.list[index].MatchQty = e;
    },
    close() {
      this.$emit("closeModal");
    },
    reset() {
      this.MitemCode = "";
      this.getList();
      this.searchForm.resetFields();
    },
    getList() {
      this.loading = true;
      console.log(this.batchid);
      let parmas = {
        batchid: this.batchid,
      };
      getMitemrequirement(parmas, "masterplan/geterrmatchs").then((res) => {
        if (res.data.success) {
          this.list = res.data.data;
          const pagination = { ...this.pagination };
          pagination.total = this.list.length;
          this.pagination = pagination;
          this.loading = false;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      if (selectedRowKeys.length > 0) {
        this.list.map((items) => {
          items.isInput = this.setIsInput(items.Id);
        });
      } else {
        this.list.map((items) => {
          items.isInput = false;
        });
      }
    },
    setIsInput(id) {
      return this.selectedRowKeys.includes(id);
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
    },
    search() {},
    batchno() {
      this.isBatchNo = true;
    },
    handleOk() {
      let parmas = [];
      this.list.map((items) => {
        if (items.isInput) {
          parmas.push({
            Id: items.Id,
            UpdateQty: items.UpdateQty,
            IsDel: items.IsDel ? "Y" : "N",
          });
        }
      });
      mitemrequirementAction(parmas, "masterplan/errupdate").then((res) => {
        if (res.data.success) {
          this.$message.success(`提示批次号【${this.BatchNo}】异常匹配信息处理成功!`);
          this.$emit("succeed");
          this.$emit("closeModal");
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
/deep/.ant-table {
  min-height: 0vh;
}
</style>

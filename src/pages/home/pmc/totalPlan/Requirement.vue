<!--
 * @Author: max
 * @Date: 2021-09-16 15:47:55
 * @LastEditTime: 2021-09-16 16:39:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/totalPlan/Requirement.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="物料需求明细" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="4">
            <a-descriptions-item label="需求工厂">
              {{ detailData.PlantName }}
            </a-descriptions-item>
            <a-descriptions-item label="计划批号">
              {{ detailData.BatchNo }}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{ detailData.MitemCode }}
            </a-descriptions-item>
            <a-descriptions-item label="品名">
              {{ detailData.MitemName }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ x: true }" :pagination="pagination" :rowKey="(list) => list.IndexNo + 'tab1'" bordered>
              <div slot="e10" slot-scope="text, record">
                <p>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</p>
              </div>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: ["detailData"],
  data() {
    return {
      size: "small",
      visible: true,
      columns: [],
      pagination: false,
      loading: false,
      list: [],
    };
  },
  created() {
    this.setTableData();
  },
  methods: {
    setTableData() {
      this.loading = true;
      let data = this.detailData.RequirementDetails;
      let obj = {};
      data.forEach((item, index) => {
        let dateArray = item.RequirementDate.split("T");
        let date = dateArray[0].replace(/-/g, "/");
        this.columns.push({
          title: date,
          dataIndex: "table" + index,
          align: "center",
        });
        obj["table" + index] = item.RequirementQty;
      });
      this.list.push(obj);
      this.loading = false;
    },
    close() {
      this.$emit("closeModal");
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
  },
  components: {},
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
/deep/.ant-card-head {
  padding: 0;
}
/deep/.ant-table {
  min-height: 0vh;
}
</style>

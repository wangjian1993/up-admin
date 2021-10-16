<!--
 * @Author: max
 * @Date: 2021-09-15 15:39:45
 * @LastEditTime: 2021-10-15 11:48:10
 * @LastEditors: max
 * @Description: 用量统计
 * @FilePath: /up-admin/src/pages/home/quote/purchase/add/Dosage.vue
-->

<template>
  <div>
    <a-modal v-model="visible" title="用量统计" @cancel="close" width="60%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div></div>
        <div>
          <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <div class="table-search">
              <a-form layout="inline">
                <a-form-item label="用量统计">
                  <a-input v-model="dosage" disabled style="width:80px" />
                </a-form-item>
                <a-form-item label="基数">
                  <a-input-number v-model="radix" style="width:80px" :min="0" @change="radixChange" />
                </a-form-item>
                <a-form-item label="费用">
                  <a-input v-model="cost" disabled style="width:80px" />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="dosageCount">
                    重新计算
                  </a-button>
                  <a-button style="margin-left: 8px" @click="empty">
                    清空面板
                  </a-button>
                </a-form-item>
              </a-form>
            </div>
            <a-table :columns="columns" :data-source="searchDosage" :size="size" :pagination="pagination" :rowKey="(searchDosage) => searchDosage.Id" :scroll="{ y: 600 }" bordered @change="handleTableChange">
              <template slot="StatusCheck" slot-scope="record">
                <div>
                  <a-tag color="green" v-if="record == 'Y'">已审核</a-tag>
                  <a-tag color="red" v-else>未审核</a-tag>
                </div>
              </template>
              <template slot="index" slot-scope="text, record, index">
                <div>
                  <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
                </div>
              </template>
              <template slot="action" slot-scope="text, record, index">
                <div>
                  <a style="margin-right: 8px" @click="remove(index, record)">
                    <a-icon type="profile" />
                    移除
                  </a>
                </div>
              </template>
            </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "BOM号",
    dataIndex: "ChildCode",
    align: "center",
  },
  {
    title: "产品型号",
    dataIndex: "ChildName",
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "ChildSpecification",
    align: "center",
  },
  {
    title: "用量",
    dataIndex: "Yl",
    scopedSlots: { customRender: "Yl" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
export default {
  props: ["searchDosage"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
      loading: false,
      dosage: 0,
      cost: 0,
      radix: 1,
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
    };
  },
  created() {
    this.$nextTick(() => {
      this.dosageCount();
    });
  },
  methods: {
    dosageCount() {
      let sum = 0;
      this.radix = localStorage.getItem("radix") || 1;
      this.searchDosage.forEach((item) => {
        //遍历Yl这个字段，并累加
        sum += item.Yl;
      });
      this.dosage = parseFloat(sum.toFixed(4));
      let c = this.radix * this.dosage;
      this.cost = parseFloat(c.toFixed(4));
    },
    radixChange(e) {
      let c = e * this.dosage;
      this.cost = parseFloat(c.toFixed(4));
      localStorage.setItem("radix", e);
    },
    empty() {
      this.$emit("empty");
      this.dosage = 0;
      this.cost = 0;
      this.radix = 0;
    },
    remove(index, list) {
      this.searchDosage.map((item,i) => {
        if (item.ChildCode == list.ChildCode) {
          this.searchDosage.splice(i, 1);
          this.dosage = this.dosage - item.Yl;
          let c = this.radix * this.dosage;
          this.cost = parseFloat(c.toFixed(4));
          this.$emit("remove", item.ChildCode);
        }
      });
    },
    close() {
      this.$emit("closeModal");
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
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
/deep/.ant-table {
  min-height: 0vh;
}
.table-search {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
</style>

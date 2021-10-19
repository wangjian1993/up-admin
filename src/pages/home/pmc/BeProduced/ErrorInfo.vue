<!--
 * @Author: max
 * @Date: 2021-10-19 09:16:43
 * @LastEditTime: 2021-10-19 10:13:40
 * @LastEditors: max
 * @Description: 异常信息
 * @FilePath: /up-admin/src/pages/home/pmc/BeProduced/ErrorInfo.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="异常信息" @cancel="close" :footer="null" centered width="70%">
      <div>
        <div class="search-box">
          <a-row>
            <a-col :xl="8" :lg="12">
              <span>导入批次:{{ errorData.BatchNo }}</span>
            </a-col>
            <a-col :xl="8" :lg="12">
              <span>导入数据:{{ errorData.MsgModel.Title }}</span>
            </a-col>
            <a-col :xl="8" :lg="12">
              <span>导入时间:{{ errorData.ImportDate }}</span>
            </a-col>
          </a-row>
        </div>
        <!-- 列表 -->
        <div class="tab">
          <a-table :columns="columns" :data-source="errorData.MsgModel.ErrMsg" :size="size" :scroll="{ y: 600 }" :pagination="false" bordered> </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 50,
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "行号",
    dataIndex: "Row",
    scopedSlots: { customRender: "Row" },
    align: "center",
  },
  {
    title: "错误提示",
    dataIndex: "RowMsg",
    scopedSlots: { customRender: "RowMsg" },
    align: "center",
  },
];
export default {
  props: ["errorData"],
  data() {
    return {
      size: "small",
      visible: true,
      columns,
    };
  },
  created() {},
  methods: {
    close() {
      this.$emit("closeModal");
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
/deep/.search-box{
    margin-bottom: 10px;
}
</style>

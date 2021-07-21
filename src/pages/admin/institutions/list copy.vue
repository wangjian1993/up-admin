<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div>
      <a-row type="flex" justify="start">
        <a-col :span="2"
          ><a-button @click="goAdd()" type="primary" icon="form"
            >添加</a-button
          ></a-col
        >
      </a-row>
    </div>
    <div class="tab">
      <a-table :columns="columns" :data-source="data" size="small" bordered>
        <template
          v-for="col in ['name', 'age', 'address']"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="(e) => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template slot="operation">
          <div>
            <a style="margin-right: 8px">
              <a-icon type="plus" />
              新增
            </a>
            <a style="margin-right: 8px">
              <a-icon type="edit" />
              编辑
            </a>
          </div>
        </template>
      </a-table>
    </div>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "公司中文名",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "name" },
    align: "center",
  },
  {
    title: "机构编号",
    dataIndex: "EnterTypeCode",
    scopedSlots: { customRender: "age" },
    align: "center",
  },
  {
    title: "机构类型",
    dataIndex: "EnterTypeName",
    scopedSlots: { customRender: "type" },
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "time" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "address" },
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];
import { getEnterList } from "@/services/admin.js";
export default {
  data() {
    return {
      data: [],
      columns,
      editingKey: "",
    };
  },
  created() {
    this.getEnterList();
  },
  methods: {
    goAdd() {
      this.$router.push("institutions-add");
    },
    getEnterList() {
      let parmas = {
        pageindex: 1,
        pagesize: 10,
      };
      getEnterList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
        }
      });
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => key === item.key)[0];
      const targetCache = newCacheData.filter((item) => key === item.key)[0];
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.key)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => key === item.key)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    },
  },
};
</script>

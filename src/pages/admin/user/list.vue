<template>
  <div>
    <div v-if="!isAdd">
      <a-row>
        <a-col style="padding: 0 5px" :span="5">
          <a-card
            class="card"
            :bordered="false"
            :bodyStyle="{ padding: '5px' }"
          >
            <a-tree :load-data="onLoadData" :tree-data="treeData" />
          </a-card>
        </a-col>
        <a-col :span="19">
          <a-card
            class="card"
            :bordered="false"
            :bodyStyle="{ padding: '5px' }"
          >
            <div>
              <a-row type="flex" justify="start">
                <a-col :span="2"
                  ><a-button @click="goAdd()" type="primary" icon="form"
                    >添加</a-button
                  ></a-col
                >
              </a-row>
            </div>
            <div>
              <a-table
                :columns="columns"
                :data-source="data"
                size="small"
                bordered
              >
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
                      @change="
                        (e) => handleChange(e.target.value, record.key, col)
                      "
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
        </a-col>
      </a-row>
    </div>

    <user-add v-if="isAdd"></user-add>
  </div>
</template>

<script>
import userAdd from "./add.vue";
const columns = [
  {
    title: "类型编码",
    dataIndex: "name",
    width: "25%",
    scopedSlots: { customRender: "name" },
    align: "center",
  },
  {
    title: "类型名称",
    dataIndex: "age",
    width: "15%",
    scopedSlots: { customRender: "age" },
    align: "center",
  },
  {
    title: "是否启用",
    dataIndex: "address",
    width: "40%",
    scopedSlots: { customRender: "address" },
    align: "center",
  },
  {
    title: "默认",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
export default {
  data() {
    return {
      isAdd: false,
      data,
      columns,
      editingKey: "",
      treeData: [
        { title: "Expand to load", key: "0" },
        { title: "Expand to load", key: "1" },
        { title: "Tree Node", key: "2", isLeaf: true },
      ],
    };
  },
  methods: {
    //添加用户
    goAdd(){

    },
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        setTimeout(() => {
          treeNode.dataRef.children = [
            { title: "Child Node", key: `${treeNode.eventKey}-0` },
            { title: "Child Node", key: `${treeNode.eventKey}-1` },
          ];
          this.treeData = [...this.treeData];
          resolve();
        }, 1000);
      });
    },
  },
  components: { userAdd },
};
</script>

<style lang="less">
.left-list {
  padding: 10px 20px;
  text-align: center;
  p {
    font-size: 12px;
    color: @title-color;
    span {
      padding-left: 10px;
      &:hover {
        color: @primary-color;
        // background: @theme-color;
        cursor: pointer;
      }
    }
  }
}
.list-tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  p {
    height: 30px;
    line-height: 30px;
    color: @title-color;
    font-size: 12px;
    &:hover {
      color: @primary-color;
      cursor: pointer;
    }
  }
}
</style>

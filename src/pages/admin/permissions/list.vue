<template>
  <div>
    <a-row>
      <a-col style="padding: 0 5px" :span="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-tree show-line :default-expanded-keys="['0-0-0']">
            <a-icon slot="switcherIcon" type="down" />
            <a-tree-node key="0-0" title="parent 1">
              <a-tree-node key="0-0-0" title="parent 1-0">
                <a-tree-node key="0-0-0-0" title="leaf" />
                <a-tree-node key="0-0-0-1" title="leaf" />
                <a-tree-node key="0-0-0-2" title="leaf" />
              </a-tree-node>
              <a-tree-node key="0-0-1" title="parent 1-1">
                <a-tree-node key="0-0-1-0" title="leaf" />
              </a-tree-node>
              <a-tree-node key="0-0-2" title="parent 1-2">
                <a-tree-node key="0-0-2-0" title="leaf" />
                <a-tree-node key="0-0-2-1" title="leaf" />
              </a-tree-node>
            </a-tree-node>
          </a-tree>
        </a-card>
      </a-col>
      <a-col style="padding: 0 5px" :span="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            @expand="onExpand"
            @select="onSelect"
          /> </a-card
      ></a-col>
      <a-col :span="14">
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
</template>

<script>
const treeData = [
  {
    title: "0-0",
    key: "0-0",
    children: [
      {
        title: "0-0-0",
        key: "0-0-0",
        children: [
          { title: "0-0-0-0", key: "0-0-0-0" },
          { title: "0-0-0-1", key: "0-0-0-1" },
          { title: "0-0-0-2", key: "0-0-0-2" },
        ],
      },
      {
        title: "0-0-1",
        key: "0-0-1",
        children: [
          { title: "0-0-1-0", key: "0-0-1-0" },
          { title: "0-0-1-1", key: "0-0-1-1" },
          { title: "0-0-1-2", key: "0-0-1-2" },
        ],
      },
      {
        title: "0-0-2",
        key: "0-0-2",
      },
    ],
  },
  {
    title: "0-1",
    key: "0-1",
    children: [
      { title: "0-1-0-0", key: "0-1-0-0" },
      { title: "0-1-0-1", key: "0-1-0-1" },
      { title: "0-1-0-2", key: "0-1-0-2" },
    ],
  },
  {
    title: "0-2",
    key: "0-2",
  },
];
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
      data,
      columns,
      editingKey: "",
      expandedKeys: ["0-0-0", "0-0-1"],
      autoExpandParent: true,
      checkedKeys: ["0-0-0"],
      selectedKeys: [],
      treeData,
    };
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", val);
    },
  },
  methods: {
    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    },
  },
  components: {},
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

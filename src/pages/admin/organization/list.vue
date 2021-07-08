<template>
  <div>
    <a-row>
      <a-col style="padding: 0 5px" :span="4">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-input-search
            placeholder="input search text"
            style="width: 160px"
            @search="onSearch"
          />
          <div class="left-list">
            <p>
              <a-icon type="android" />
              <span>组织1</span>
            </p>
            <p>
              <a-icon type="android" />
              <span>组织2</span>
            </p>
            <p>
              <a-icon type="android" />
              <span>组织3</span>
            </p>
          </div>
        </a-card>
      </a-col>
      <a-col :span="15">
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
      <a-col style="padding: 0 5px" :span="5">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-tabs default-active-key="1" @change="callback" size="small">
            <a-tab-pane key="1" tab="用户关系">
              <div>
                <a-space size="small">
                  <a-button type="primary" size="small">新建</a-button>
                  <a-button size="small">新建</a-button>
                  <a-button type="dashed" size="small">新建</a-button>
                </a-space>
              </div>
              <div class="list-tab">
                <p>组内用户</p>
                <p>组负责人</p>
                <p>上下级</p>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="组关系" force-render>
              Content of Tab Pane 2
            </a-tab-pane>
          </a-tabs></a-card
        ></a-col
      >
    </a-row>
  </div>
</template>

<script>
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
    };
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

<!--
 * @Author: max
 * @Date: 2021-09-01 10:49:31
 * @LastEditTime: 2021-10-12 14:58:46
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyPlan/kanban.vue
-->
<template>
  <div>
    <a-form layout="horizontal">
      <div  :class="advanced ? null : 'fold'">
        <a-row>
          <a-col :md="6" :sm="24">
            <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择生产工厂">
                <a-select-option value="1">1</a-select-option>
                <a-select-option value="2">2</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="计划日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input-number style="width: 100%" placeholder="请输入计划日期" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="PMC" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择">
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
             <a-form-item label="拉" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input-number style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="advanced">
          <a-col :md="6" :sm="24">
             <a-form-item label="生成车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input-number style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
             <a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input-number style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
             <a-form-item label="BOM号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-input-number style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
             <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
              <a-select placeholder="请选择">
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <span style="float: right; margin-top: 3px;">
        <a-button type="primary">查询</a-button>
        <a-button style="margin-left: 8px">重置</a-button>
        <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
      </span>
    </a-form>
    <div class="operator">
      <a-button @click="addNew" type="primary" icon="export">导出</a-button>
      <!-- <a-button>复制发布</a-button>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item key="delete">删除</a-menu-item>
          <a-menu-item key="audit">审批</a-menu-item>
        </a-menu>
        <a-button>
          更多操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown> -->
    </div>
    <standard-table :columns="columns" :dataSource="dataSource" :selectedRows.sync="selectedRows" @clear="onClear" @change="onChange">
      <div slot="description" slot-scope="{ text }">{{ text }}</div>
      <div slot="action" slot-scope="{ record }">
        <a style="margin-right: 8px">
          <a-icon type="plus" />
          新增
        </a>
        <a style="margin-right: 8px">
          <a-icon type="edit" />
          编辑
        </a>
        <a @click="deleteRecord(record.key)">
          <a-icon type="delete" />
          删除1
        </a>
        <a @click="deleteRecord(record.key)" v-auth="`delete`">
          <a-icon type="delete" />
          删除2
        </a>
      </div>
      <template slot="statusTitle">
        <a-icon @click.native="onStatusTitleClick" type="info-circle" />
      </template>
    </standard-table>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
const columns = [
  {
    title: "规则编号",
    dataIndex: "no",
  },
  {
    title: "描述",
    dataIndex: "description",
    scopedSlots: { customRender: "description" },
  },
  {
    title: "服务调用次数",
    dataIndex: "callNo",
    sorter: true,
    needTotal: true,
    customRender: (text) => text + " 次",
  },
  {
    dataIndex: "status",
    needTotal: true,
    slots: { title: "statusTitle" },
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    sorter: true,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

const dataSource = [];

for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    no: "NO " + i,
    description: "这是一段描述",
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: "2018-07-26",
  });
}
export default {
      components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRows: [],
      headers: {
        authorization: "authorization-text",
      },
    };
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
  }
};
</script>

<style></style>

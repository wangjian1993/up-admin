<!--
 * @Author: max
 * @Date: 2021-08-17 10:59:02
 * @LastEditTime: 2021-09-06 11:25:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/quote/purchase/list/List.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-tabs type="card" @change="callback">
        <a-tab-pane key="1" tab="列表查询"> </a-tab-pane>
        <a-tab-pane key="2" tab="销售要求报价"> </a-tab-pane>
        <a-tab-pane key="3" tab="物料价格变动"> </a-tab-pane>
        <a-tab-pane key="4" tab="有Bom无成本价"> </a-tab-pane>
      </a-tabs>
      <div>
        <div :class="advanced ? 'search' : null">
          <a-form layout="horizontal">
            <div :class="advanced ? null : 'fold'">
              <a-row>
                <a-col :md="8" :sm="24">
                  <a-form-item label="需求公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-select v-model="form.EnterpriseId"  placeholder="请选择需求公司">
                      <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 14, offset: 1 }">
                    <a-select v-model="form.EnterpriseId" placeholder="请选择生产工厂">
                      <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select placeholder="请选择">
                      <a-select-option value="1">关闭</a-select-option>
                      <a-select-option value="2">运行中</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input placeholder="请输入产品大类" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="产品系列" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input placeholder="请输入产品系列" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input placeholder="请输入产品品名" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input placeholder="请输入产品品号" />
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
        </div>
      </div>
      <div>
        <a-space class="operator">
          <a-button @click="addNew" type="primary" icon="check">审批</a-button>
          <a-button>复制发布</a-button>
          <a-dropdown>
            <a-menu @click="handleMenuClick" slot="overlay">
              <a-menu-item key="delete">删除</a-menu-item>
              <!-- <a-menu-item key="audit">审批</a-menu-item> -->
            </a-menu>
            <a-button> 更多操作 <a-icon type="down" /> </a-button>
          </a-dropdown>
        </a-space>
        <standard-table :columns="columns" :dataSource="dataSource" :selectedRows.sync="selectedRows" @clear="onClear" @change="onChange" @selectedRowChange="onSelectChange">
          <div slot="description" slot-scope="{ text }">
            {{ text }}
          </div>
          <div slot="action" slot-scope="record">
            <a style="margin-right: 8px"> <a-icon type="plus" />新增 </a>
            <a style="margin-right: 8px"> <a-icon type="edit" />编辑 </a>
            <a @click="deleteRecord(record.key)"> <a-icon type="delete" />删除1 </a>
            <a @click="deleteRecord(record.key)" v-auth="`delete`"> <a-icon type="delete" />删除2 </a>
          </div>
          <template slot="statusTitle">
            <a-icon @click.native="onStatusTitleClick" type="info-circle" />
          </template>
        </standard-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import { getDemandEnter } from "@/services/web.js";
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
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRows: [],
      plantList: [],
      enterList: [],
      form:[]
    };
  },
  authorize: {
    deleteRecord: "delete",
  },
  components: { StandardTable },
  created() {
    this.getDemandEnter();
  },
  methods: {
    //获取需求公司
    getDemandEnter() {
      let parmas = {
        entertypecode: "COMPANY",
      };
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getDemandEnter(parmas).then((res) => {
        if (res.data.success) {
          this.enterList = res.data.data;
        }
      });
      getDemandEnter(parmas1).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    callback(key) {
      console.log(key);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onSelectChange(){
      
    }
  },
};
</script>

<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>

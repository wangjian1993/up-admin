<!--
 * @Author: max
 * @Date: 2021-07-07 10:19:01
 * @LastEditTime: 2021-07-08 17:09:04
 * @LastEditors: max
 * @Description: 版本管理
 * @FilePath: /mb-admin/src/pages/bom/versionsManage/VersionsManage.vue
-->

<template>
  <div class="content">
    <a-tabs :default-active-key="tabType" @change="callback" size="small"
      ><a-tab-pane
        v-for="(item, key) in list"
        :key="key"
        :tab="key"
      ></a-tab-pane
    ></a-tabs>
    <div class="table-content">
      <advance-table
        :columns="columns"
        :data-source="dataSource"
        :loading="isLoading"
        rowKey="id"
        :format-conditions="true"
        @reset="onReset"
        @refresh="onRefresh"
        :pagination="{
          showTotal: (total, range) =>
            `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        }"
      >
        <template slot="status" slot-scope="{ record }">
          <a-tag color="green" v-if="record.check_status == 1">已审核</a-tag>
          <a-tag color="red" v-else>待审核</a-tag>
        </template>
        <template slot="action" slot-scope="{ record }">
          <div>
            <a
              style="margin-right: 8px"
              v-if="record.check_status == 0"
              @click="audit(record.id)"
            >
              <a-icon type="check-circle" />
              审核
            </a>
            <a style="margin-right: 8px" @click="showDrawer(record)">
              <a-icon type="snippets" />
              详情
            </a>
          </div>
        </template>
      </advance-table>
      <!-- <a-table
        :columns="columns"
        :data-source="dataSource"
        size="small"
        :loading="isLoading"
      >
        <template slot="status" slot-scope="text, record">
          <a-tag color="green" v-if="record.check_status == 1">已审核</a-tag>
          <a-tag color="red" v-else>待审核</a-tag>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a
              style="margin-right: 8px"
              v-if="record.check_status == 0"
              @click="audit(record.id)"
            >
              <a-icon type="check-circle" />
              审核
            </a>
            <a style="margin-right: 8px" @click="showDrawer(record)">
              <a-icon type="snippets" />
              详情
            </a>
          </div>
        </template>
      </a-table> -->
    </div>
    <a-drawer
      width="800"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
      :destroyOnClose="true"
    >
      <a-descriptions>
        <a-descriptions-item label="公司标识">{{
          detailItem.company_sign
        }}</a-descriptions-item>
        <a-descriptions-item label="版本号">{{
          detailItem.version_code
        }}</a-descriptions-item>
        <a-descriptions-item label="添加人">{{
          detailItem.adder
        }}</a-descriptions-item>
        <a-descriptions-item label="审核状态">
          <a-tag color="green" v-if="detailItem.check_status == 1"
            >已审核</a-tag
          >
          <a-tag color="red" v-else>待审核</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="添加时间">{{
          detailItem.add_time
        }}</a-descriptions-item>
      </a-descriptions>
      <a-table :columns="columns1" :data-source="detailList">
        <span slot="is_required" slot-scope="text, record">{{
          record.is_required == 0 ? "否" : "是"
        }}</span>
        <span slot="is_use" slot-scope="text, record">{{
          record.is_use == 0 ? "否" : "是"
        }}</span>
        <span slot="is_readonly" slot-scope="text, record">{{
          record.is_readonly == 0 ? "否" : "是"
        }}</span>
      </a-table>
    </a-drawer>
  </div>
</template>

<script>
import {
  getVersionsManage,
  setVersionsAudit,
  getVersionsDetail,
} from "@/services/bom.js";
import AdvanceTable from "@/components/table/advance/AdvanceTable";
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "公司标识",
    dataIndex: "company_sign",
    align: "center",
  },
  {
    title: "版本号",
    dataIndex: "version_code",
    align: "center",
  },
  {
    title: "审核状态",
    dataIndex: "check_status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "添加人",
    dataIndex: "adder",
    align: "center",
  },
  {
    title: "添加时间",
    dataIndex: "add_time",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
const columns1 = [
  {
    title: "费用名称",
    dataIndex: "cost_name",
    key: "cost_name",
    align: "center",
  },
  {
    title: "字段名",
    dataIndex: "field_name",
    key: "field_name",
    align: "center",
  },
  {
    title: "是否必填项",
    dataIndex: "is_required",
    align: "center",
    scopedSlots: { customRender: "is_required" },
  },
  {
    title: "是否使用",
    dataIndex: "is_use",
    align: "center",
    scopedSlots: { customRender: "is_use" },
  },
  {
    title: "是否只读",
    dataIndex: "is_readonly",
    align: "center",
    scopedSlots: { customRender: "is_readonly" },
  },
  {
    title: "提示描述",
    dataIndex: "tips_desc",
    align: "center",
  },
  {
    title: "基数",
    dataIndex: "base_number",
    align: "center",
  },
  {
    title: "顺序",
    dataIndex: "order",
    align: "center",
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park, New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 2 Lake Park, London No. 2 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park, Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const detailLabel = ["版本号", "公司标识", "审核状态", "添加人", "添加时间"];
export default {
  data() {
    return {
      list: [],
      columns,
      dataSource: [],
      isLoading: true,
      tab: [],
      visible: false,
      detailList: [],
      detailLabel,
      tabType: "ONE",
      data,
      columns1,
      detailItem: [],
    };
  },
  created() {
    this.getVersionsManage();
  },
  methods: {
    /**
     * @description: tab切换
     * @param {*} key tab切换参数
     * @return {*}
     */
    callback(key) {
      this.isLoading = true;
      this.tabType = key;
      this.dataSource = this.list[key];
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    },
    /**
     * @description: 获取版本列表
     * @param {*}
     * @return {*}
     */
    getVersionsManage() {
      let param = {
        act: "get_version_list",
      };
      getVersionsManage(param).then((res) => {
        if (res.data.success) {
          var keyArr = Object.keys(res.data.data);
          if (this.tabType == "ONE") {
            this.tabType = keyArr[0];
          }
          this.tab = res.data;
          this.list = res.data.data;
          this.isLoading = false;
          this.dataSource = this.list[this.tabType];
        }
      });
    },
    /**
     * @description: 查看详情
     * @param {*} id 版本id
     * @return {*}
     */
    showDrawer(item) {
      this.visible = true;
      let param = {
        act: "get_version_detail",
        id: item.id,
      };
      this.detailItem = item;
      getVersionsDetail(param).then((res) => {
        if (res.data.success) {
          this.detailList = res.data.data;
        }
      });
    },
    onClose() {
      this.visible = false;
    },
    /**
     * @description: 修改审核状态
     * @param {*} id 版本id
     * @return {*}
     */
    audit(id) {
      let param = {
        act: "check_version",
        id: id,
      };
      setVersionsAudit(param).then((res) => {
        if (res.data.success) {
          this.$message.success("操作成功");
          this.getVersionsManage();
        }
      });
    },
    /**
     * @description: 显示参数格式化
     * @param {*} item
     * @param {*} key
     * @return {*}
     */
    stringFilter(item, key) {
      if (
        key == "is_required" ||
        key == "is_use" ||
        key == "is_readonly" ||
        key == "is_auto_compute" ||
        key == "is_use"
      ) {
        return item == 1 ? "是" : "否";
      } else if (key == "check_status") {
        return item == 1 ? "已审核" : "未审核";
      } else {
        return item;
      }
    },
    onRefresh(conditions) {
      console.log("刷新=====", conditions);
      this.getVersionsManage();
    },
    onReset(conditions) {
      console.log("peizhi=====", conditions);
    },
  },
  components: { AdvanceTable },
};
</script>

<style lang="less" scoped>
.content {
  background-color: @base-bg-color;
  padding: 0px;
}
.table-content {
  min-height: 200px;
}
</style>

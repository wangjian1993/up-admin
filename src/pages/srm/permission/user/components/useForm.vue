<!--
 * @Author: max
 * @Date: 2022-09-28 11:33:37
 * @LastEditTime: 2022-09-29 14:17:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/srm/permission/user/components/useForm.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="公司权限设置" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :bodyStyle="{ padding: '5px 10px' }">
      <div class="operator" style="margin:5px 0">
        <a-button style="margin-left: 8px" type="primary" @click="isAdd = true" icon="usergroup-add">添加</a-button>
        <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" @click="allDel" style="margin-left: 8px">删除</a-button>
        <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
        <span style="margin-left: 8px">
          <template v-if="hasSelected">
            {{ `共选中 ${selectedRowKeys.length} 条` }}
          </template>
        </span>
      </div>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        size="small"
        :pagination="false"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        :rowKey="(dataSource) => dataSource.Id"
        bordered
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ index + 1 }}</span>
          </div>
        </template>
        <template slot="Enable" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
            <a-tag color="red" v-else>禁用</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" @confirm="() => useDelete(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
      <CompanyList v-if="isAdd" @closeModal="closeModal" @success="setUserInfo" />
    </a-drawer>
  </div>
</template>

<script>
import { getPermission, setPermission } from "@/services/srm.js";
import CompanyList from "./companyList.vue";
export default {
  props: ["userData", "isEdit"],
  components: { CompanyList },
  data() {
    return {
      size: "small",
      visible: true,
      isAdd: false,
      userInfo: [],
      dataSource: [],
      selectedRowKeys: [],
      columns: [
        {
          title: "序号",
          scopedSlots: { customRender: "index" },
          align: "center",
        },
        {
          title: "企业编码",
          dataIndex: "Code",
          scopedSlots: { customRender: "Code" },
          align: "center",
        },
        {
          title: "企业名称",
          dataIndex: "Name",
          scopedSlots: { customRender: "Name" },
          align: "center",
        },
        {
          title: "是否生效",
          dataIndex: "Enable",
          scopedSlots: { customRender: "Enable" },
          align: "center",
        },
        {
          title: "操作",
          scopedSlots: { customRender: "action" },
          align: "center",
        },
      ],
      infoColumns: [
        {
          title: "用户",
          dataIndex: "Name",
        },
        {
          title: "工号",
          dataIndex: "UserId",
        },
        {
          title: "部门",
          dataIndex: "Department",
        },
        {
          title: "邮箱",
          dataIndex: "Email",
        },
        {
          title: "在岗状态",
          dataIndex: "Status",
        },
      ],
    };
  },
  created() {
    this.getUserInfo();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  methods: {
    getUserInfo() {
      getPermission({ id: this.userData.Id }, "enterprise/single").then((res) => {
        if (res.data.success) {
          this.userInfo = res.data.data.userInfo;
          this.dataSource = res.data.data.list;
        }
      });
    },
    setUserInfo(list) {
      let params = {
        userid: this.userData.Id,
        companyids: [],
      };
      list.forEach((item) => {
        params.companyids.push(item.Id);
      });
      setPermission(params, "enterprise/add").then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功!");
          this.isAdd = false;
          this.getUserInfo();
        }
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    closeModal() {
      this.isAdd = false;
    },
    close() {
      this.$emit("closeModal");
    },
    handleCancel() {
      this.$emit("closeModal");
    },
    //多选删除
    allDel() {
      let self = this;
      self.selectedRowKeys.push(null);
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setPermission(self.selectedRowKeys, "enterprise/delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getUserInfo();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    useDelete(item) {
      let params = [item.Id, null];
      setPermission(params, "enterprise/delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getUserInfo();
        }
      });
    },
  },
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
/deep/.ant-form-item {
  margin-bottom: 5px;
}
</style>

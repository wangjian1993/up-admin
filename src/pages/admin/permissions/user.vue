<!--
 * @Author: max
 * @Date: 2022-04-22 10:11:26
 * @LastEditTime: 2022-04-22 15:53:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/permissions/user.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="业务公司" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['enterid']" style="width: 250px" placeholder="请选择业务公司">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6" :sm="24">
                <a-form-item label="顶级部门" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['orgid']" style="width: 200px" placeholder="请选择顶级部门">
                    <a-select-option v-for="item in department" :key="item.OrgId" :value="item.OrgId">{{ item.OrgName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <a-col :md="6" :sm="24">
                <a-form-item label="工号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入订单号" v-decorator="['usercode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="姓名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入工单号" v-decorator="['username']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="应用" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['appid']" style="width: 200px" placeholder="请选择应用" @change="appChange">
                    <a-select-option v-for="item in appList" :key="item.AppId" :value="item.AppId">{{ item.AppName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="菜单" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['menuid']" style="width: 200px" placeholder="请选择顶级部门">
                    <a-select-option v-for="item in menuList" :key="item.MenuId" :value="item.MenuId">{{ item.MenuName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <span style="float: right;">
              <a-button type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </div>
        </a-form>
        <div class="operator">
          <a-button v-if="hasPerm('export')" :disabled="dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button v-else type="primary" @click="exportExcel" icon="export">导出</a-button>
        </div>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource) => dataSource.Id" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getUserPermission } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import ExportExcel from "@/utils/ExportExcelJS";
import { columns } from "./data";
export default {
  mixins: [PublicVar],
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      isDrawer: false,
      plantList: [],
      plantid: "",
      drawerItem: [],
      isSearch: 0,
      statistic: [],
      isUserList: false,
      isExportLod: false,
      statisticType: "",
      stateList: [],
      workshopList: [],
      lineList: [],
      workshopId: "",
      editData: [],
      isEdit: false,
      isPrint: false,
      department: [],
      appList: [],
      menuList: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
    this.getPlant();
    this.getAppList();
    this.getListAll();
  },
  methods: {
    splitData,
    //重置搜索
    reset() {
      this.getPlant();
      this.getAppList();
      this.getListAll();
      this.pagination.current = 1;
      this.isSearch = 0;
      this.searchForm.resetFields();
    },
    company(e) {
      let params = {
        enterid: e,
      };
      getUserPermission(params, "org/gettop").then((res) => {
        if (res.data.success) {
          this.department = res.data.data;
        }
      });
    },
    getPlant() {
      getUserPermission("", "enterprise/getall").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getAppList() {
      getUserPermission("", "app/getall").then((res) => {
        if (res.data.success) {
          this.appList = res.data.data;
        }
      });
    },
    appChange(e) {
      let params = {
        app: e,
        menutype: "menu",
        menusur: "",
      };
      getUserPermission(params, "menu/getall").then((res) => {
        if (res.data.success) {
          this.menuList = res.data.data;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getUserPermission(params, "getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          console.log(this.dataSource);
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
    },
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          //   let name = encodeURI(values.username);
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterid: values.enterid,
            usercode: values.usercode,
            username: values.username,
            appid: values.appid,
            menuid: values.menuid,
          };
          getUserPermission(params, "getall").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = 2;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        enterid: values.enterid,
        usercode: values.usercode,
        username: values.username,
        appid: values.appid,
        menuid: values.menuid,
      };
      getUserPermission(params, "getall").then((res) => {
        if (res.data.success) {
          let list = res.data.data.list;
          const dataSource = list.map((item) => {
            Object.keys(item).forEach((key) => {
              // 后端传null node写入会有问题
              if (item[key] === null) {
                item[key] = "";
              }
              if (Array.isArray(item[key])) {
                item[key] = item[key].join(",");
              }
            });
            return item;
          });
          const header = [];
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push({ key: item.dataIndex, title: item.title });
            }
          });
          var timestamp = Date.parse(new Date());
          try {
            ExportExcel(header, dataSource, `用户权限列表_${timestamp}.xlsx`);
            this.$message.success("导出数据成功!");
          } catch (error) {
            // console.log(error);
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>

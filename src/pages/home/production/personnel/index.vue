<!--
 * @Author: max
 * @Date: 2021-11-29 13:54:43
 * @LastEditTime: 2021-11-29 17:35:47
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/personnel/index.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['workshop']" style="width: 200px" placeholder="请选择生产车间" @change="workShopChange">
                  <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select v-decorator="['line']" style="width: 200px" placeholder="请选择生产产线">
                  <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="工号/姓名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入员工工号/姓名" v-decorator="['user']" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search" :disabled="!hasPerm('search')">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
        </span>
      </a-form>
    </div>
    <div class="operator">
      <a-button icon="plus" type="primary" :disabled="!hasPerm('add')" :loading="loading" @click="add" style="margin-left: 8px">新建</a-button>
      <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
      <span style="margin-left: 8px">
        <template v-if="hasSelected">
          {{ `共选中 ${selectedRowKeys.length} 条` }}
        </template>
      </span>
    </div>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: true }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        bordered
      >
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="Enable" slot-scope="text">
          <div>
            <a-tag :color="text == 'Y'?'green':'red'">{{text=='Y'?'启用':'禁用'}}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
              <a-icon type="edit" />
              编辑
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <addForm v-if="visible" :plantList="plantList" @closeModal="closeModal" @success="getListAll"/>
    </div>
  </a-card>
</template>
<script>
import { getProductionPersonnel, setProductionPersonnel, getWorkshopList, getLineList } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import { columns } from "./data.js";
import addForm from "./addForm";
import { PublicVar } from "@/mixins/publicVar.js";
export default {
  components: { addForm },
  mixins: [PublicVar],
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      visible: false,
      plantList: [],
      codeTags: [],
      plantid: "",
      isAddUser: false,
      isAddCategory: false,
      searcValue: "",
      form: {
        UserName: "",
        PlantId: "",
        UserId: "",
        MitemCategoryCodes: [],
        MitemCodes: "",
      },
      rules: {
        PlantId: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        WorkShopId: [
          {
            required: true,
            message: "请选择车间",
            trigger: "blur",
          },
        ],
      },
      categorytags: [],
      modelTypes: "",
      categorysList: [],
      workshopList: [],
      workshopId: "",
      lineList: [],
    };
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getListAll();
    this.getEnterList();
    // this.getCategorysList();
  },
  methods: {
    closeModal() {
      this.visible = false;
    },
    plantChange(e) {
      this.plantid = e;
      this.getWorkshopList();
      this.searchForm.setFieldsValue({
        workshop: "",
        line: "",
      });
    },
    workShopChange(e) {
      this.workshopId = e;
      this.getLineList();
      this.searchForm.setFieldsValue({
        line: "",
      });
    },
    //获取生产工厂
    getEnterList() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getProductionPersonnel(parmas, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getWorkshopList() {
      let parmas = {
        plantid: this.plantid,
      };
      getWorkshopList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    getLineList() {
      let parmas = {
        plantid: this.plantid,
        workshopid: this.workshopId,
      };
      getLineList(parmas, "getlist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    getCategorysList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: 100,
      };
      getProductionPersonnel(parmas, "getcategorys").then((res) => {
        if (res.data.success) {
          this.categorysList = res.data.data.list;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            user: values.user,
          };
          getProductionPersonnel(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    //获取机构类型列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getProductionPersonnel(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      this.isEdit = false;
      this.visible = true;
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          let parmas = [];
          self.selectedRowKeys.forEach((item) => {
            parmas.push({
              PlantId: self.data[item].PlantId,
              UserId: self.data[item].UserId,
            });
          });
          setProductionPersonnel(parmas, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push({
        PlantId: item.PlantId,
        UserId: item.UserId,
      });
      setProductionPersonnel(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    //删除tag
    handleClose(index, type) {
      if (type == 2) {
        this.codeTags.splice(index, 1);
        return;
      }
      this.categorytags.splice(index, 1);
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getListAll();
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  min-height: 77vh;
  max-height: 77vh;
  overflow: auto;
}
</style>

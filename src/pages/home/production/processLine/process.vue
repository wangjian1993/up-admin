<!--
 * @Author: max
 * @Date: 2021-11-30 14:31:04
 * @LastEditTime: 2022-01-10 17:11:43
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/processLine/process.vue
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
                <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                  <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="编码/名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入工序编码/名称" v-decorator="['process']" />
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
    <!-- 添加编辑弹窗框 -->
    <div>
      <a-modal :title="isEdit ? '编辑工序' : '添加工序'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select style="width: 200px" placeholder="请选择生产工厂" v-model="form.PlantId">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="ProcessName" has-feedback label="工序名称" prop="ProcessName">
            <a-input
              v-model="form.ProcessName"
              allowClear
              placeholder="请输入工序名称"
              @blur="
                () => {
                  $refs.ProcessName.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="ProcessCode" has-feedback label="工序编码" prop="ProcessCode">
            <a-input
              v-model.trim="form.ProcessCode"
              allowClear
              placeholder="请输入工序编码"
              :disabled="isEdit"
              @blur="
                () => {
                  $refs.ProcessCode.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="Step" has-feedback label="工序步骤" prop="Step">
            <a-input-number
              v-model="form.Step"
              style="width:200px"
              allowClear
              placeholder="请输入工序步骤"
              :min="1"
              @blur="
                () => {
                  $refs.Step.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="ProcessDesc" label="工序描述">
            <a-textarea v-model="form.ProcessDesc" placeholder="请输入工序描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否启用">
            <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-form-model>
      </a-modal>
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
        :rowKey="(data) => data.Id"
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
        <template slot="EnableName" slot-scope="text">
          <div>
            <a-tag :color="text == '启用' ? 'green' : 'red'" v-if="text == '启用'">{{text}}</a-tag>
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
            <!-- <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看
            </a> -->
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </div>
    <!-- 查看详情 -->
    <div>
      <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
        <a-descriptions title="应用类型详情" :column="1">
          <a-descriptions-item label="应用编码">{{ drawerItem.AppTypeCode }}</a-descriptions-item>
          <a-descriptions-item label="用户名称">{{ drawerItem.AppTypeName }}</a-descriptions-item>
          <a-descriptions-item label="是否启用">
            <div>
              <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="描述">{{ drawerItem.AppTypeDesc }}</a-descriptions-item>
          <a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
          <a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
  </a-card>
</template>
<script>
import { getProcessLine, setProcessLine } from "@/services/web.js";
import { columns } from "./data";
import { PublicVar } from "@/mixins/publicVar.js";
export default {
  mixins: [PublicVar],
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加机构类型",
      isDrawer: false,
      visible: false,
      drawerItem: [],
      plantList: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      searcValue: "",
      form: {
        PlantId: "",
        ProcessCode: "",
        ProcessName: "",
        ProcessDesc: "",
        Step: 1,
        Enable: "Y",
      },
      rules: {
        PlantId: [
          {
            required: true,
            message: "请选择生产工厂",
            trigger: "blur",
          },
        ],
        ProcessCode: [
          {
            required: true,
            message: "请输入工序编码",
            trigger: "blur",
          },
        ],
        ProcessName: [
          {
            required: true,
            message: "请输入工序名称",
            trigger: "blur",
          },
        ],
        Step: [
          {
            required: true,
            message: "请输入工序步骤",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getListAll();
    this.getPlant();
  },
  methods: {
    getPlant() {
      let parmas1 = {
        entertypecode: "PLANT",
      };
      getProcessLine(parmas1, "getlistbytypecode").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    //状态切换
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    //查看详情
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //关闭弹窗
    onClose() {
      this.isDrawer = false;
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
            process: values.process,
          };
          getProcessLine(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
            }
          });
          // do something
        }
      });
    },
    //获取机构类型列表
    getListAll() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getProcessLine(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.visible = true;
    },
    //初始化表单
    defaultForm() {
      this.form = {
        PlantId: "",
        ProcessCode: "",
        ProcessName: "",
        ProcessDesc: "",
        Step: 1,
        Enable: "Y",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    //编辑
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.form = item;
    },
    //弹框确认按钮
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //编辑
          if (this.isEdit) {
            let editForm = {
              Id: this.form.Id,
              Step: this.form.Step,
              ProcessName: this.form.ProcessName,
              ProcessDesc: this.form.ProcessDesc,
              Enable: this.form.Enable,
            };
            setProcessLine(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getListAll();
              }
            });
          } else {
            //添加
            setProcessLine(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getListAll();
                this.defaultForm();
                this.visible = false;
              }
            });
          }
        }
      });
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          setProcessLine(self.selectedRowKeys, "delete").then((res) => {
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
      parmas.push(item.Id);
      setProcessLine(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getListAll();
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/ .ant-table {
  min-height: 65vh;
  max-height: 65vh;
  overflow: auto;
}
</style>

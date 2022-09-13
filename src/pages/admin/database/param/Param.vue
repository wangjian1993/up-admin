<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2022-09-08 11:53:02
 * @LastEditors: max
 * @Description: 快码列表
 * @FilePath: /up-admin/src/pages/admin/database/param/Param.vue
-->
<template>
  <div>
    <!-- 搜索 -->
    <a-row>
      <a-col style="padding: 0 5px" :span="6">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }" title="快码组:">
          <a-row>
            <a-col :xs="12" :sm="16"><a-input-search placeholder="搜索快码组" :disabled="!hasPerm('searchGroup')" v-model="groupSearch" enter-button @search="onSearch"/></a-col>
            <a-col :xs="12" :sm="8"><a-button :disabled="!hasPerm('addGroup')" type="primary" style="margin-left: 20px;" @click="addGroup">添加组</a-button></a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="24">
              <div style="padding: 10px 0;max-height:78vh;min-height:78vh;overflow:auto">
                <a-tree @select="groupClick" v-if="groupData.length" :tree-data="groupData" :replaceFields="replaceFields" default-expand-all :default-selected-keys="groupValue"></a-tree>
                <a-empty v-if="groupData.length == 0" />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col style="padding: 0 5px" :span="18">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <div class="search-box">
            <a-row type="flex" justify="space-between">
              <a-col :span="8">
                <div>
                  <a-button :disabled="!hasPerm('add')" @click="add" type="primary" icon="plus">添加</a-button>
                  <a-button :disabled="!hasPerm('add')" style="margin-left: 8px" @click="batchAdd" type="primary" icon="plus">批量添加</a-button>
                  <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
                  <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
                  <span style="margin-left: 8px">
                    <template v-if="hasSelected">
                      {{ `共选中 ${selectedRowKeys.length} 条` }}
                    </template>
                  </span>
                </div>
              </a-col>
              <a-col :sm="24" :md="24" :xl="14">
                <a-row>
                  <a-col>
                    <a-form layout="horizontal" :form="searchForm" class="form-box">
                      <div>
                        <a-form-item>
                          <a-input placeholder="请输入快码编码/名称" allowClear style="width: 300px" v-decorator="['searcValue']" />
                        </a-form-item>
                      </div>
                      <div style="margin-top: 3px;margin-left:10px">
                        <a-button :disabled="!hasPerm('search')" type="primary" icon="search" style="margin:0 10px" @click="search">搜索</a-button>
                        <a-button :disabled="!hasPerm('search')" @click="reset" icon="reload">重置</a-button>
                      </div>
                    </a-form>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
          <!-- 添加快码组 -->
          <div>
            <a-modal title="添加快码组" v-if="groupVisible" :visible="groupVisible" @ok="handleOk1" :destroyOnClose="true" @cancel="handleCancel">
              <a-form-model ref="ruleForm1" :model="form1" :rules="rules1" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item ref="ParamGroupName" has-feedback label="快码组名称" prop="ParamGroupName">
                  <a-input
                    v-model="form1.ParamGroupName"
                    allowClear
                    placeholder="请输入快码组名称"
                    @blur="
                      () => {
                        $refs.ParamGroupName.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ParamGroupCode" has-feedback label="快码组编码" prop="ParamGroupCode">
                  <a-input
                    v-model="form1.ParamGroupCode"
                    allowClear
                    placeholder="请输入快码组编码"
                    :disabled="isEdit"
                    @blur="
                      () => {
                        $refs.ParamGroupCode.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ParamGroupDesc" label="快码组描述">
                  <a-textarea v-model="form1.ParamGroupDesc" placeholder="请输入快码组描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
                </a-form-model-item>
                <a-form-model-item ref="Enable" label="是否启用">
                  <a-radio-group :value="form1.Enable" button-style="solid" @change="enableChange1">
                    <a-radio-button value="N">否</a-radio-button>
                    <a-radio-button value="Y">是</a-radio-button>
                  </a-radio-group>
                </a-form-model-item>
              </a-form-model>
            </a-modal>
          </div>
          <!-- 添加,编辑弹窗 -->
          <div>
            <a-modal :title="isEdit ? '编辑快码' : '添加快码'" v-if="visible" :visible="visible" @ok="handleOk" :destroyOnClose="true" @cancel="handleCancel">
              <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item ref="ParamGroupName" has-feedback label="快码组选择" prop="ParamGroupName">
                  <a-select v-model="form.ParamGroupId" :disabled="isEdit" placeholder="请选择快码组" prop="ParamGroupId">
                    <a-select-option v-for="item in groupData" :key="item.ParamGroupId" :value="item.ParamGroupId">{{ item.ParamGroupName }}</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item ref="ParamName" has-feedback label="快码名称" prop="ParamName">
                  <a-input
                    v-model="form.ParamName"
                    allowClear
                    placeholder="请输入快码名称"
                    @blur="
                      () => {
                        $refs.ParamName.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ParamCode" has-feedback label="快码编码" prop="ParamCode">
                  <a-input
                    v-model="form.ParamCode"
                    allowClear
                    placeholder="请输入快码编码"
                    :disabled="isEdit"
                    @blur="
                      () => {
                        $refs.ParamCode.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ParamCode" has-feedback label="快码排序" prop="ParamCode">
                  <a-input-number
                    v-model="form.SortNo"
                    :min="1"
                    allowClear
                    @blur="
                      () => {
                        $refs.ParamCode.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ParamValue" has-feedback label="快码值" prop="ParamValue">
                  <a-input
                    v-model="form.ParamValue"
                    allowClear
                    placeholder="请输入快码值"
                    @blur="
                      () => {
                        $refs.ParamValue.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ParamDesc" label="快码描述">
                  <a-textarea v-model="form.ParamDesc" placeholder="请输入快码描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
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
              :rowKey="(tableDatas) => data.EnterTypeId"
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
              <template slot="enable" slot-scope="record">
                <div>
                  <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
                  <a-tag color="red" v-else>禁用</a-tag>
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
                  <a style="margin-right: 8px" @click="detail(record)">
                    <a-icon type="profile" />
                    查看
                  </a>
                </div>
              </template>
            </a-table>
            <a-empty v-else description="暂无权限" />
          </div>
          <!-- 查看详情 -->
          <div>
            <a-drawer width="400" placement="right" :closable="true" :visible="isDrawer" @close="onClose">
              <a-descriptions title="快码详情" :column="1">
                <a-descriptions-item label="快码编码">{{ drawerItem.ParamCode }}</a-descriptions-item>
                <a-descriptions-item label="快码名称">{{ drawerItem.ParamName }}</a-descriptions-item>
                <a-descriptions-item label="快码组名称">{{ drawerItem.ParamGroupName }}</a-descriptions-item>
                <a-descriptions-item label="快码值">{{ drawerItem.ParamValue }}</a-descriptions-item>
                <a-descriptions-item label="快码排序">{{ drawerItem.SortNo }}</a-descriptions-item>
                <a-descriptions-item label="是否启用">
                  <div>
                    <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
                    <a-tag color="red" v-else>禁用</a-tag>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="描述">{{ drawerItem.ParamDesc }}</a-descriptions-item>
                <a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
                <a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
              </a-descriptions>
            </a-drawer>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <BatchAdd v-if="isBatchAdd" :groupItem="groupItem" @closeModal="handleCancel" @success="getParamGroupList"/>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "快码名称",
    dataIndex: "ParamName",
    scopedSlots: { customRender: "ParamName" },
    align: "center",
    width: "20%",
  },
  {
    title: "快码编码",
    dataIndex: "ParamCode",
    scopedSlots: { customRender: "ParamCode" },
    align: "center",
    width: "20%",
  },
  {
    title: "值",
    dataIndex: "ParamValue",
    scopedSlots: { customRender: "ParamValue" },
    align: "center",
    width: "10%",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "enable" },
    align: "center",
    width: "10%",
  },
  {
    title: "排序",
    dataIndex: "SortNo",
    scopedSlots: { customRender: "SortNo" },
    align: "center",
    width: "5%",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: "30%",
  },
];
import { getParamGroupList, getParamList, paramAction, paramGroupAction } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import BatchAdd from "./batchAdd.vue";
export default {
  components: { BatchAdd },
  data() {
    return {
      groupData: [],
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      loading: true,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      groupValue: [],
      groupId: "",
      groupSearch: "",
      groupVisible: false,
      replaceFields: {
        title: "ParamGroupName",
        key: "ParamGroupId",
        value: "ParamGroupId",
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      searcValue: "",
      searchForm: this.$form.createForm(this),
      form: {
        ParamCode: "",
        ParamName: "",
        ParamDesc: "",
        ParamValue: "",
        SortNo: 1,
        Enable: "Y",
        ParamGroupId: "",
      },
      form1: {
        ParamGroupCode: "",
        ParamGroupName: "",
        ParamGroupDesc: "",
        Enable: "Y",
      },
      rules1: {
        ParamGroupCode: [
          {
            required: true,
            message: "请输入快码组编码",
            trigger: "blur",
          },
        ],
        ParamGroupName: [
          {
            required: true,
            message: "请输入快码组名称",
            trigger: "blur",
          },
        ],
      },
      rules: {
        ParamGroupId: [
          {
            required: true,
            message: "请选择快码组",
            trigger: "blur",
          },
        ],
        ParamName: [
          {
            required: true,
            message: "请输入快码名称",
            trigger: "blur",
          },
        ],
        ParamCode: [
          {
            required: true,
            message: "请输入快码编码",
            trigger: "blur",
          },
        ],
        ParamValue: [
          {
            required: true,
            message: "请输入快码值",
            trigger: "blur",
          },
        ],
      },
      isBatchAdd:false,
      groupItem:[]
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
    this.getParamGroupList();
  },
  methods: {
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    enableChange1(value) {
      this.form1.Enable = value.target.value;
    },
    //查看详情
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    onClose() {
      this.isDrawer = false;
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getParamGroupList();
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
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            keyword: values.searcValue,
            groupid: this.groupId,
          };
          getParamList(params).then((res) => {
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
    getParamGroupList() {
      let params = {
        pageindex: 1,
        pagesize: 100,
      };
      getParamGroupList(params).then((res) => {
        if (res.data.success) {
          this.groupData = res.data.data;
          this.groupValue.push(this.groupData[0].ParamGroupId);
          this.groupId = this.groupData[0].ParamGroupId;
          this.getParamList();
        }
      });
    },
    getParamList() {
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        groupid: this.groupId,
      };
      getParamList(params).then((res) => {
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
    addGroup() {
      this.groupVisible = true;
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.visible = true;
      this.form.ParamGroupId = this.groupId;
    },
    batchAdd(){
      this.isBatchAdd = true;
      this.groupItem = this.groupData.find((item) =>item.ParamGroupId == this.groupId)
    },
    defaultForm() {
      this.form = {
        ParamCode: "",
        ParamName: "",
        ParamDesc: "",
        ParamValue: "",
        SortNo: 1,
        Enable: "Y",
        ParamGroupId: "",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
      this.groupVisible = false;
      this.isBatchAdd = false;
    },
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.form = item;
    },
    handleOk1() {
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          paramGroupAction(this.form1, "add").then((res) => {
            if (res.data.success) {
              this.$message.success("添加成功!");
              this.getParamGroupList();
              this.groupVisible = false;
            }
          });
        }
      });
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              ParamId: this.form.ParamId,
              ParamName: this.form.ParamName,
              ParamDesc: this.form.ParamDesc,
              ParamValue: this.form.ParamValue,
              SortNo: this.form.SortNo,
              Enable: this.form.Enable,
            };
            paramAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getParamList();
              }
            });
          } else {
            paramAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getParamList();
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
          const params = [];
          self.selectedRowKeys.forEach((item) => {
            params.push(self.data[item].ParamId);
          });
          paramAction(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getParamList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let params = [];
      params.push(item.ParamId);
      paramAction(params, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getParamList();
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getParamList();
    },
    groupClick(e) {
      console.log(e);
      this.groupId = e[0];
      this.getParamList();
    },
    onSearch() {
      console.log(this.groupSearch);
      let params = {
        keyword: this.groupSearch,
      };
      getParamGroupList(params).then((res) => {
        if (res.data.success) {
          this.groupData = res.data.data;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-table {
  min-height: 77vh;
  max-height: 77vh;
  overflow: auto;
}
</style>

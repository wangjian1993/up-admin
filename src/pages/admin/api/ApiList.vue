<!--
 * @Author: max
 * @Date: 2021-08-06 15:34:43
 * @LastEditTime: 2021-10-11 17:34:17
 * @LastEditors: max
 * @Description: api管理
 * @FilePath: /up-admin/src/pages/admin/api/ApiList.vue
-->
<template>
  <div>
    <!-- 搜索 -->
    <a-row>
      <a-col style="padding: 0 5px" :lg="6" :sm="24">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-row>
            <a-col :lg="12" :sm="24"><span class="card-title">应用类型:</span></a-col>
            <a-col :lg="12" :sm="24">
              <a-select v-model="defaultAppTypeId" style="width: 130px" @change="appTypeSelect">
                <a-select-option :value="item.AppTypeId" v-for="(item, index) in appTypeData" :key="index">{{ item.AppTypeName }}</a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="24">
              <div style="padding: 10px 0;max-height:78vh;min-height:78vh;overflow:auto">
                <a-tree @select="appClick" v-if="appTreeData.length" :tree-data="appTreeData" :replaceFields="{ title: 'Name', key: 'Id', value: 'Id', children: 'children' }" default-expand-all :default-selected-keys="appValue"></a-tree>
                <a-empty v-if="appTreeData.length == 0" />
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col style="padding: 0 5px" :lg="18" :sm="24">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <div class="search-box">
            <a-row type="flex" justify="space-between">
              <a-col :lg="5" :sm="24">
                <div>
                  <a-button :disabled="!hasPerm('add')" @click="add" type="primary" icon="form">添加</a-button>
                  <a-button v-if="hasPerm('delete')" icon="delete" type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
                  <a-button v-else icon="delete" type="primary" disabled :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
                  <span style="margin-left: 8px">
                    <template v-if="hasSelected">
                      {{ `共选中 ${selectedRowKeys.length} 条` }}
                    </template>
                  </span>
                </div>
              </a-col>
              <a-col :lg="19" :sm="24">
                <a-row>
                  <a-col>
                    <a-form layout="horizontal" :form="searchForm" class="form-box">
                      <div>
                        <a-form-item>
                          <a-input placeholder="请输入API路径" allowClear style="width: 170px" v-decorator="['apiurl']" />
                        </a-form-item>
                      </div>
                      <div style="margin-left:10px">
                        <a-form-item>
                          <a-input placeholder="API编码/名称" allowClear style="width: 170px" v-decorator="['apicode']" />
                        </a-form-item>
                      </div>
                      <div style="margin-left:10px">
                        <a-form-item>
                          <a-form-item>
                            <a-select v-decorator="['apimethod']" placeholder="请选择API请求方式" style="width: 140px">
                              <a-select-option value="GET">
                                GET
                              </a-select-option>
                              <a-select-option value="POST">
                                POST
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-form-item>
                      </div>
                      <div style="margin-top: 3px;margin-left:0px">
                        <a-button :disabled="!hasPerm('search')" type="primary" icon="search" style="margin:0 5px" @click="search">搜索</a-button>
                        <a-button :disabled="!hasPerm('search')" @click="reset" icon="reload">重置</a-button>
                      </div>
                    </a-form>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </div>
          <!-- 添加,编辑弹窗 -->
          <div>
            <a-modal :title="isEdit ? '编辑API' : '添加API'" v-if="visible" :visible="visible" @ok="handleOk" :destroyOnClose="true" @cancel="handleCancel">
              <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item ref="ModuleId" has-feedback label="关联菜单项" prop="ModuleId">
                  <a-input v-model="form.ModuleName" disabled allowClear placeholder="请输入API路径" />
                </a-form-model-item>
                <a-form-model-item ref="ButtionId" has-feedback label="功能点" prop="ButtionId">
                  <a-select v-model="form.ButtionId" placeholder="选择菜单功能点">
                    <a-select-option
                      :value="item.Id"
                      v-for="(item, index) in addApiDataChildren"
                      :key="index"
                      @blur="
                        () => {
                          $refs.ButtionId.onFieldBlur();
                        }
                      "
                    >
                      {{ item.Name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item ref="ApiCode" has-feedback label="API编码" prop="ApiCode">
                  <a-input
                    v-model="form.ApiCode"
                    allowClear
                    :disabled="isEdit"
                    placeholder="请输入API编码"
                    @blur="
                      () => {
                        $refs.ApiCode.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ApiName" has-feedback label="API名称" prop="ApiName">
                  <a-input
                    v-model="form.ApiName"
                    allowClear
                    placeholder="请输入API名称"
                    @blur="
                      () => {
                        $refs.ApiName.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ApiMehtod" has-feedback label="API方法" prop="ApiMehtod">
                  <a-select v-model="form.ApiMehtod" style="width: 150px" placeholder="选择API请求方式">
                    <a-select-option value="GET">
                      GET
                    </a-select-option>
                    <a-select-option value="POST">
                      POST
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item ref="ApiUrl" has-feedback label="API路径" prop="ApiUrl">
                  <a-input
                    v-model="form.ApiUrl"
                    allowClear
                    placeholder="请输入API路径"
                    @blur="
                      () => {
                        $refs.ApiUrl.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
                <a-form-model-item ref="ApiDesc" label="API描述">
                  <a-textarea v-model="form.ApiDesc" placeholder="请输入API描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
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
                  <a style="margin-right: 8px" v-if="moduleid != '' || buttonid != ''" @click="edit(record)" :disabled="!hasPerm('edit')">
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
              <a-descriptions title="API详情" :column="1">
                <a-descriptions-item label="API名称">{{ drawerItem.ButtionName }}</a-descriptions-item>
                <a-descriptions-item label="API编码">{{ drawerItem.ApiCode }}</a-descriptions-item>
                <a-descriptions-item label="API路径">{{ drawerItem.ApiUrl }}</a-descriptions-item>
                <a-descriptions-item label="API方式">{{ drawerItem.ApiMehtod }}</a-descriptions-item>
                <a-descriptions-item label="关联菜单名称">{{ drawerItem.ModuleName }}</a-descriptions-item>
                <a-descriptions-item label="是否启用">
                  <div>
                    <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
                    <a-tag color="red" v-else>禁用</a-tag>
                  </div>
                </a-descriptions-item>
                <a-descriptions-item label="描述">{{ drawerItem.ApiDesc }}</a-descriptions-item>
                <a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
                <a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
              </a-descriptions>
            </a-drawer>
          </div>
        </a-card>
      </a-col>
    </a-row>
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
    title: "API名称",
    dataIndex: "ApiName",
    scopedSlots: { customRender: "ApiName" },
    align: "center",
    width: "15%",
  },
  {
    title: "API编码",
    dataIndex: "ApiCode",
    scopedSlots: { customRender: "ApiCode" },
    align: "center",
    width: "10%",
  },
  {
    title: "API路径",
    dataIndex: "ApiUrl",
    scopedSlots: { customRender: "ApiUrl" },
    align: "center",
    width: "15%",
  },
  {
    title: "关联菜单名称",
    dataIndex: "ModuleName",
    scopedSlots: { customRender: "ModuleName" },
    align: "center",
    width: "10%",
  },
  {
    title: "API请求方式",
    dataIndex: "ApiMehtod",
    scopedSlots: { customRender: "ApiMehtod" },
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
import { getApiList, getApiAction, getAppTypeList, getModuleList } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
export default {
  data() {
    return {
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
        ApiCode: "",
        ApiName: "",
        ApiDesc: "",
        ApiMehtod: "",
        ApiUrl: "",
        ModuleId: "",
        ButtionId: "",
        Enable: "Y",
      },
      rules: {
        ApiCode: [
          {
            required: true,
            message: "请输入API编码",
            trigger: "blur",
          },
        ],
        ApiName: [
          {
            required: true,
            message: "请输入API名称",
            trigger: "blur",
          },
        ],
        ApiMehtod: [
          {
            required: true,
            message: "请选择API请求方式",
            trigger: "blur",
          },
        ],
        ApiUrl: [
          {
            required: true,
            message: "请输入API路径",
            trigger: "blur",
          },
        ],
        ButtionId: [
          {
            required: true,
            message: "请选择功能点",
            trigger: "blur",
          },
        ],
      },
      appTypeData: [],
      defaultAppTypeId: "",
      appTypeId: "",
      appTreeData: [],
      appValue: [],
      moduleid: "",
      buttonid: "",
      addApiData: [],
      addApiDataChildren: [],
      isSearch:false,
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
    this.getApiList();
    this.getAppTypeList();
  },
  methods: {
    //应用类型选择
    appTypeSelect(e) {
      this.appTypeId = e;
      this.appTreeData = [];
      this.appValue = [];
      this.getAppMdules();
    },
    //获取应用类型
    getAppTypeList() {
      let parmas = {
        pageindex: 1,
        pagesize: 50,
      };
      getAppTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.appTypeData = res.data.data.list;
          this.defaultAppTypeId = res.data.data.list[0].AppTypeId;
          this.appTypeId = res.data.data.list[0].AppTypeId;
          console.log("this.appTypeIdt", this.appTypeId);
          this.getAppMdules();
        }
      });
    },
    getAppMdules() {
      let parmas = {
        apptypeid: this.appTypeId,
      };
      getModuleList(parmas).then((res) => {
        if (res.data.success) {
          if (res.data.data.length > 0) {
            this.appTreeData = res.data.data;
            this.appValue.push(this.appTreeData[0].Id);
            this.moduleid = this.appTreeData[0].Id;
            if (this.moduleid != "") {
              this.getApiList();
            }
          }
        }
      });
    },
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
      this.pagination.current =1;
      this.getApiList();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values.apiurl == undefined && values.apicode == undefined && values.apimethod == undefined) {
            this.$message.warning("请输入要查询内容!");
            this.loading = false;
            return;
          }
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            moduleid: this.moduleid,
            buttonid: this.buttonid,
            apiurl: values.apiurl,
            apicode: values.apicode,
            apimethod: values.apimethod,
          };
          getApiList(parmas).then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch=true;
            }
          });
        }
      });
    },
    getApiList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        moduleid: this.moduleid,
        buttonid: this.buttonid,
      };
      getApiList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch=false;
        } else {
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      if (this.moduleid == "") {
        this.$message.warning("请先选择左侧菜单!");
        return;
      }
      this.defaultForm();
      this.isEdit = false;
      this.visible = true;
      this.form.ModuleName = this.addApiData.Name;
    },
    defaultForm() {
      this.form = {
        ApiCode: "",
        ApiName: "",
        ApiDesc: "",
        ApiMehtod: "",
        ApiUrl: "",
        ModuleId: "",
        ButtionId: "",
        Enable: "Y",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
      this.groupVisible = false;
    },
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.form = item;
      let children = this.recursive(item.ModuleId, this.appTreeData);
      this.addApiDataChildren = children.children;
    },
    recursive(id, obj) {
      const queue = [...obj];
      while (queue.length) {
        const o = queue.shift();
        if (o.Id == id) return o;
        queue.push(...(o.children || []));
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let editForm = {
              ApiId: this.form.ApiId,
              ApiName: this.form.ApiName,
              ApiDesc: this.form.ApiDesc,
              ApiMehtod:this.form.ApiMehtod,
              ApiUrl: this.form.ApiUrl,
              ModuleId: this.form.ModuleId,
              ButtionId: this.form.ButtionId,
            };
            getApiAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getApiList();
              }
            });
          } else {
            this.form.ModuleId = this.addApiData.Id;
            getApiAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getApiList();
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
            params.push(self.data[item].ApiId);
          });
          getApiAction(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getApiList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.ApiId);
      getApiAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getApiList();
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if( this.isSearch){
        this.search();
        return;
      }
      this.getApiList();
    },
    appClick(e, key) {
      this.addApiData = [];
      this.addApiDataChildren = [];
      let data = key.selectedNodes[0].data.props;
      if (data.ModuleType == "button") {
        this.buttonid = data.Id;
        this.moduleid = "";
        console.log("button", this.buttonid);
      } else if (data.ModuleType == "menu") {
        this.buttonid = "";
        this.moduleid = data.Id;
        console.log("menu", this.moduleid);
        this.addApiData = data;
        this.addApiDataChildren = data.dataRef.children;
      } else {
        this.buttonid = "";
        this.moduleid = "";
      }
      this.getApiList();
    },
  },
};
</script>
<style lang="less" scoped>
.card-title {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .ant-table{
  min-height:77vh;
  max-height:77vh;
  overflow: auto;
}
</style>

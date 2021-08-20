<template>
  <div>
    <a-modal
      v-model="visible"
      :title="classItem.OrgDimensionName + '-等级管理'"
      :footer="null"
      @cancel="close"
      centered
      :width="800"
    >
      <div>
        <div class="search-box">
          <a-row>
            <a-col :span="9">
              <div>
                <a-button @click="add" type="primary" icon="form"
                  >添加</a-button
                >
                <a-button
                  type="primary"
                  :disabled="!hasSelected"
                  @click="allDel"
                  icon="delete"
                  style="margin-left: 8px"
                  >删除</a-button
                >
                <span style="margin-left: 8px">
                  <template v-if="hasSelected">
                    {{ `共选中 ${selectedRowKeys.length} 条` }}
                  </template>
                </span>
              </div>
            </a-col>
            <a-col :span="15">
              <a-form layout="horizontal" :form="searchForm">
                <div>
                  <a-col :md="15" :sm="24">
                    <a-form-item
                      label="等级编码/名称"
                      :labelCol="{ span: 9 }"
                      :wrapperCol="{ span: 14, offset: 1 }"
                    >
                      <a-input
                        placeholder="请输入"
                        allowClear
                        v-decorator="[
                          'searcValue',
                          {
                            rules: [
                              { required: true, message: '等级编码/名称' },
                            ],
                          },
                        ]"
                      />
                    </a-form-item>
                  </a-col>
                </div>
                <span style="float: right; margin-top: 3px;">
                  <a-button type="primary" @click="search">查询</a-button>
                  <a-button style="margin-left: 8px" @click="reset"
                    >重置</a-button
                  >
                </span>
              </a-form>
            </a-col>
          </a-row>
        </div>
        <div>
          <a-modal
            title="编辑"
            :visible="isAddModal"
            @ok="handleOk"
            @cancel="handleCancel"
            centered
          >
            <a-form-model
              ref="ruleForm"
              :model="form"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-form-model-item
                ref="OrgLevelCode"
                has-feedback
                label="等级编码"
                prop="OrgLevelCode"
              >
                <a-input
                  v-model="form.OrgLevelCode"
                  allowClear
                  @blur="
                    () => {
                      $refs.OrgLevelCode.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
              <a-form-model-item
                ref="OrgLevelName"
                has-feedback
                label="名称"
                prop="OrgLevelName"
              >
                <a-input
                  v-model="form.OrgLevelName"
                  allowClear
                  @blur="
                    () => {
                      $refs.OrgLevelName.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
              <a-form-model-item
                ref="OrgLevelSortNo"
                has-feedback
                label="排序"
                prop="OrgLevelSortNo"
              >
                <a-input-number
                  id="OrgLevelSortNo"
                  v-model="form.OrgLevelSortNo"
                  :min="1"
                  placeholder="请输入排序"
                  @blur="
                    () => {
                      $refs.OrgLevelSortNo.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
              <a-form-model-item ref="Enable" label="是否启动">
                <a-radio-group
                  :value="form.Enable"
                  button-style="solid"
                  @change="enableChange"
                >
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
            :columns="columns"
            :data-source="list"
            size="small"
            :scroll="{y:true}"
            :pagination="pagination"
            @change="handleTableChange"
            :rowKey="(tableDatas) => list.EnterTypeId"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{
                  (pagination.current - 1) * pagination.pageSize + (index + 1)
                }}</span>
              </div>
            </template>
            <template slot="enable" slot-scope="record">
              <div>
                <a-tag color="green" v-if="record == 'Y'">启用</a-tag>
                <a-tag color="red" v-else>禁用</a-tag>
              </div>
            </template>
            <template slot="IsPartAuth" slot-scope="record">
              <div>
                <a-tag color="green" v-if="record == 'Y'">是</a-tag>
                <a-tag color="red" v-else>否</a-tag>
              </div>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a-popconfirm
                  title="确定删除?"
                  @confirm="() => onDelete(record)"
                >
                  <a style="margin-right: 8px">
                    <a-icon type="delete" />
                    删除
                  </a>
                </a-popconfirm>
                <a style="margin-right: 8px" @click="edit(record)">
                  <a-icon type="edit" />
                  编辑
                </a>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
  },
  {
    title: "组织等级编号",
    dataIndex: "OrgLevelCode",
    scopedSlots: { customRender: "OrgLevelCode" },
    align: "center",
  },
  {
    title: "组织等级名称",
    dataIndex: "OrgLevelName",
    scopedSlots: { customRender: "OrgLevelName" },
    align: "center",
  },
  {
    title: "组织维度",
    dataIndex: "OrgDimensionName",
    scopedSlots: { customRender: "OrgDimensionName" },
    align: "center",
  },
  {
    title: "级别",
    dataIndex: "OrgLevelSortNo",
    scopedSlots: { customRender: "OrgLevelSortNo" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getOrgLevelList, orgLevelAction } from "@/services/admin.js";
export default {
  props: ["classItem"],
  data() {
    return {
      visible: true,
      isAddModal: false,
      columns,
      list: [],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) =>
          `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      form: {
        OrgLevelCode: "",
        OrgLevelName: "",
        Enable: "Y",
        OrgLevelSortNo: 1,
        OrgDimensionId: "",
        EnterId: "",
      },
      rules: {
        OrgLevelCode: [
          {
            required: true,
            message: "请输入等级编码",
            trigger: "blur",
          },
        ],
        OrgLevelName: [
          {
            required: true,
            message: "请输入等级名称",
            trigger: "blur",
          },
        ],
        OrgLevelSortNo: [
          {
            required: true,
            message: "请输入等级排序",
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
    this.getList();
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    getList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        dimsensionId: this.classItem.OrgDimensionId,
      };
      getOrgLevelList(parmas).then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
        }
      });
    },
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    authChange(value) {
      this.form.IsPartAuth = value.target.value;
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
    reset() {
      this.getList();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            dimsensionId: this.classItem.OrgDimensionId,
            keyword: values.searcValue,
          };
          getOrgLevelList(parmas).then((res) => {
            if (res.data.success) {
              this.list = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
            }
          });
          // do something
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加组织";
      this.isAddModal = true;
    },
    defaultForm() {
      this.form = {
        OrgDimensionCode: "",
        OrgDimensionName: "",
        Enable: "Y",
        IsPartAuth: "Y",
        SortNo: 0,
      };
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
    edit(item) {
      this.isAddModal = true;
      this.isEdit = true;
      this.title = "编辑组织列表";
      this.form = item;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let parmas = {
              OrgLevelCode: this.form.OrgLevelCode,
              OrgLevelName: this.form.OrgLevelName,
              Enable: this.form.Enable,
              OrgLevelSortNo: this.form.OrgLevelSortNo,
              OrgLevelId: this.form.OrgLevelId,
              EnterId: "",
            };
            orgLevelAction(parmas, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.isAddModal = false;
                this.getList();
              }
            });
          } else {
            let parmas = {
              OrgLevelCode: this.form.OrgLevelCode,
              OrgLevelName: this.form.OrgLevelName,
              Enable: this.form.Enable,
              OrgLevelSortNo: this.form.OrgLevelSortNo,
              OrgDimensionId: this.classItem.OrgDimensionId,
              EnterId: "",
            };
            orgLevelAction(parmas, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getList();
                this.defaultForm();
                this.isAddModal = false;
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
            params.push(self.list[item].OrgLevelId);
          });
          orgLevelAction(params, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getList();
            } else {
              self.$message.warning(res.data.message.content);
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.OrgLevelId);
      orgLevelAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getList();
        }
      });
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.getList();
    },
  },
  components: {},
};
</script>

<style lang="less" scoped></style>

<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-09-24 17:26:34
 * @LastEditors: max
 * @Description: 报价参数配置
 * @FilePath: /up-admin/src/pages/home/quote/config/parmas/Parmas.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <div class="search-box">
      <a-row type="flex" justify="space-between">
        <a-col :span="8">
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
        <a-col :sm="24" :md="24" :xl="14">
          <a-row>
            <a-col>
              <a-form layout="horizontal" :form="searchForm" class="form-box">
                <div>
                  <a-form-item>
                    <a-select v-decorator="['enterpriseid']" style="width: 250px" placeholder="请选择需求公司">
                      <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div style="margin-left:10px">
                  <a-form-item>
                    <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                      <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <!-- <div>
                  <a-form-item>
                    <a-input
                      placeholder="请输入产线编码/名称"
                      allowClear
                      style="width: 200px"
                      v-decorator="[
                        'searcValue',
                        {
                          rules: [{ required: true, message: '请输入应用类型编码/名称!' }],
                        },
                      ]"
                    />
                  </a-form-item>
                </div> -->
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
    <!-- 添加编辑弹窗框 -->
    <div>
      <a-modal :title="isEdit ? '编辑参数配置' : '添加参数配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="EnterpriseId" has-feedback label="需求公司" prop="EnterpriseId">
            <a-select v-model="form.EnterpriseId" :disabled="isEdit" placeholder="请选择需求公司">
              <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select v-model="form.PlantId" :disabled="isEdit" placeholder="请选择生产工厂">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="CostName" has-feedback label="加工费名称" prop="CostName">
            <a-input
              v-model="form.CostName"
              allowClear
              placeholder="请输入加工费名称"
              :disabled="isEdit"
              @blur="
                () => {
                  $refs.CostName.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="CostSort" has-feedback label="分类" prop="CostSort">
            <a-input
              v-model="form.CostSort"
              allowClear
              placeholder="请输入加工费分类"
            />
          </a-form-model-item>
          <a-form-model-item ref="SortNum" has-feedback label="排序" prop="SortNum">
            <a-input-number
              v-model="form.SortNum"
              :min="1"
              allowClear
              @blur="
                () => {
                  $refs.SortNum.onFieldBlur();
                }
              "
            />
          </a-form-model-item>
          <a-form-model-item ref="Description" label="说明">
            <a-textarea v-model="form.Description" placeholder="说明" :auto-size="{ minRows: 3, maxRows: 5 }" />
          </a-form-model-item>
          <a-form-model-item ref="Enable" label="是否只读">
            <a-radio-group :value="form.IsReadonly" button-style="solid" @change="readonlyChange">
              <a-radio-button value="N">否</a-radio-button>
              <a-radio-button value="Y">是</a-radio-button>
            </a-radio-group>
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
        <template slot="IsReadonly" slot-scope="record">
          <div>
            <a-tag color="green" v-if="record == 'Y'">是</a-tag>
            <a-tag color="red" v-else>否</a-tag>
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
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "需求公司",
    dataIndex: "EnterpriseName",
    scopedSlots: { customRender: "EnterpriseName" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    width: "10%",
    align: "center",
  },
  {
    title: "加工费用名称",
    dataIndex: "CostName",
    scopedSlots: { customRender: "CostName" },
    align: "center",
  },
  {
    title: "加工费用分类",
    dataIndex: "CostSort",
    scopedSlots: { customRender: "CostSort" },
    align: "center",
  },
  {
    title: "是否只读",
    dataIndex: "IsReadonly",
    scopedSlots: { customRender: "IsReadonly" },
    align: "center",
    width: "5%",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "enable" },
    align: "center",
    width: "5%",
  },
  {
    title: "排序",
    dataIndex: "SortNum",
    scopedSlots: { customRender: "SortNum" },
    align: "center",
    width: "5%",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getCostList, costAction, getDemandEnter } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
export default {
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      loading: true,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      enterList: [],
      plantList: [],
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
        CostName: "",
        Enable: "Y",
        IsReadonly: "N",
        Description: "",
        SortNum: 99,
        EnterpriseId: "",
        PlantId: "",
      },
      rules: {
        EnterpriseId: [
          {
            required: true,
            message: "请选择需求公司",
            trigger: "blur",
          },
        ],
        PlantId: [
          {
            required: true,
            message: "请选择生成工厂",
            trigger: "blur",
          },
        ],
        CostName: [
          {
            required: true,
            message: "请输入加工费名称",
            trigger: "blur",
          },
        ],
        CostSort:[
          {
            required: true,
            message: "请输入加工费分类",
            trigger: "blur",
          },
        ],
      },
      enterpriseid: "",
      plantid: "",
      isSearch:false
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
          this.enterpriseid = this.enterList[0].EnterId;
          this.searchForm.setFieldsValue({
            enterpriseid: this.enterList[0].EnterId,
          });
          getDemandEnter(parmas1).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantid = this.plantList[0].EnterId;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].EnterId,
          });
          this.getCostList();
        }
      });
        }
      });
    },
    //状态切换
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    //是否只读切换
    readonlyChange(value) {
      this.form.IsReadonly = value.target.value;
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
      this.getDemandEnter();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            enterpriseid: values.enterpriseid,
            plantid: values.plantid,
          };
          getCostList(parmas).then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch =true;
            }
          });
          // do something
        }
      });
    },
    //获取机构类型列表
    getCostList() {
      this.loading =true
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        enterpriseid: this.enterpriseid,
        plantid: this.plantid,
      };
      getCostList(parmas).then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch =false
        } else {
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加机构类型";
      this.visible = true;
    },
    //初始化表单
    defaultForm() {
      this.form = {
        CostName: "",
        Enable: "Y",
        IsReadonly: "N",
        Description: "",
        SortNum: 99,
        EnterpriseId: "",
        PlantId: "",
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
      this.title = "编辑机构类型";
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
              IsReadonly: this.form.IsReadonly,
              Description: this.form.Description,
              SortNum: this.form.SortNum,
              Enable: this.form.Enable,
            };
            costAction(editForm, "updatecostbase").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getCostList();
              }
            });
          } else {
            //添加
            costAction(this.form, "addcostbase").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getCostList();
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
          let parmas =[]
          self.selectedRowKeys.forEach((item) => {
            let obj = {
              Id: item,
            };
            parmas.push(obj);
          });
          costAction(parmas, "deletecostbase").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getCostList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = {
        "Id":item.Id
      };
      costAction(parmas, "deletecostbase").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getCostList();
        }
      });
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if(this.isSearch){
        this.search();
        return
      }
      this.getCostList();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
</style>

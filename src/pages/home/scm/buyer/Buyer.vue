<!--
 * @Author: max
 * @Date: 2021-10-08 10:57:09
 * @LastEditTime: 2021-10-25 18:17:06
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/buyer/Buyer.vue
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
                    <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂">
                      <a-select-option value="">全部</a-select-option>
                      <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </div>
                <div style="margin-left:10px">
                  <a-form-item>
                    <a-input placeholder="请输入采购员账号/名称" allowClear style="width: 200px" v-decorator="['user']" />
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
    <!-- 添加编辑弹窗框 -->
    <div>
      <a-modal :title="isEdit ? '编辑采购物料配置' : '添加采购物料配置'" v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item ref="PlantId" has-feedback label="生产工厂" prop="PlantId">
            <a-select v-model="form.PlantId" :disabled="isEdit" placeholder="请选择生产工厂">
              <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item ref="UserId" has-feedback label="采购员" prop="UserId">
            <a-input v-model="form.UserName" style="width: 150px" disabled placeholder="请选择采购员" />
            <a-button type="primary" :disabled="isEdit" style="margin-left:10px" icon="plus" @click="addUser">
              添加
            </a-button>
          </a-form-model-item>
          <a-form-model-item ref="AppTypeCode" has-feedback label="物料大类" prop="AppTypeCode">
            <!-- <a-select mode="tags" placeholder="选择物料大类"  style="width: 200px">
              <a-select-option v-for="item in categorysList" :key="item.MitemCategoryId">
                {{ item.MitemCategoryCode }}
              </a-select-option>
            </a-select> -->
            <a-select v-model="form.MitemCategoryCodes" mode="tags" style="width: 100%" placeholder="选择物料大类" :token-separators="[',']">
              <a-select-option v-for="item in categorysList" :key="item.MitemCategoryCode">
                {{ item.MitemCategoryCode }}
              </a-select-option>
            </a-select>
            <!-- <a-select v-model="form.MitemCategoryCodes" mode="tags" style="width: 100%" :token-separators="[',']">
              <a-select-option></a-select-option>
            </a-select> -->
            <!-- <template v-for="(tag, index) in categorytags">
              <a-tag :key="tag.MitemCategoryCode" :closable="true" @close="() => handleClose(index, 1)">
                {{ tag.MitemCategoryCode }}
              </a-tag>
            </template>
            <a-tag style="background: #fff; borderStyle: dashed;" @click="addCategory(1)"> <a-icon type="plus" />添加</a-tag> -->
          </a-form-model-item>
          <a-form-model-item ref="AppTypeCode" has-feedback label="物料编码" prop="AppTypeCode">
            <template v-for="(tag, index) in codeTags">
              <a-tag :key="tag.MitemCode" :closable="true" @close="() => handleClose(index, 2)">
                {{ tag.MitemCode }}
              </a-tag>
            </template>
            <a-tag style="background: #fff; borderStyle: dashed;" @click="addCategory(2)"> <a-icon type="plus" />添加</a-tag>
          </a-form-model-item>
          <a-form-model-item ref="LineDesc" label="备注">
            <a-textarea v-model="form.LineDesc" placeholder="请输入产线描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
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
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </div>
    <buyer-user v-if="isAddUser" @okModal="setUser" @closeModal="onClose"></buyer-user>
    <buyer-category v-if="isAddCategory" @okModal="okModal" @closeModal="onClose" :modelTypes="modelTypes"></buyer-category>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "50px",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: "80px",
  },
  {
    title: "采购员",
    dataIndex: "UserName",
    scopedSlots: { customRender: "UserName" },
    align: "center",
    width: "5%",
  },
  {
    title: "负责物料大类",
    dataIndex: "MitemCategoryCodes",
    scopedSlots: { customRender: "MitemCategoryCodes" },
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "MitemCodes",
    scopedSlots: { customRender: "MitemCodes" },
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "DateTimeCreated" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remarks",
    scopedSlots: { customRender: "Remarks" },
    align: "center",
  },
  {
    title: "创建人",
    dataIndex: "UserCreated",
    scopedSlots: { customRender: "UserCreated" },
    align: "center",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    align: "center",
  },
];
import { getBuyerAction, setBuyerAction } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import BuyerUser from "./BuyerUser.vue";
import BuyerCategory from "./BuyerCategory.vue";
export default {
  components: { BuyerUser, BuyerCategory },
  data() {
    return {
      data: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加机构类型",
      loading: true,
      isDrawer: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      plantList: [],
      codeTags: [],
      plantid: "",
      isAddUser: false,
      isAddCategory: false,
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
      isSearch: false,
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
    this.getDemandEnter();
    // this.getCategorysList();
  },
  methods: {
    //获取生产工厂
    getDemandEnter() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getBuyerAction(parmas, "getenterlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getCategorysList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: 100,
      };
      getBuyerAction(parmas, "getcategorys").then((res) => {
        if (res.data.success) {
          this.categorysList = res.data.data.list;
        }
      });
    },
    //添加车间
    addUser() {
      this.isAddUser = true;
    },
    setUser(item) {
      this.form.UserName = item.Name;
      this.form.UserId = item.Id;
      this.isAddUser = false;
    },
    //车间添加成确认那妞
    addCategory(type) {
      this.isAddCategory = true;
      this.modelTypes = type;
    },
    //关闭弹窗
    onClose() {
      this.isAddUser = false;
      this.isAddCategory = false;
    },
    //大类选择
    okModal(array, type) {
      this.isAddCategory = false;
      if (type == 2) {
        this.codeTags = this.codeTags.concat(array);
        let map = new Map();
        for (let i of this.codeTags) {
          if (!map.has(i.MitemCode)) {
            map.set(i.MitemCode, i);
          }
        }
        this.codeTags = [...map.values()];
      } else if (type == 1) {
        this.categorytags = this.categorytags.concat(array);
        let map = new Map();
        for (let i of this.categorytags) {
          if (!map.has(i.MitemCategoryId)) {
            map.set(i.MitemCategoryId, i);
          }
        }
        this.categorytags = [...map.values()];
      }
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
      this.loading = true;
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            user: values.user,
          };
          getBuyerAction(parmas,'getall').then((res) => {
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
      getBuyerAction(parmas, "getall").then((res) => {
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
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加机构类型";
      this.visible = true;
    },
    //初始化表单
    defaultForm() {
      this.form = {
        UserName: "",
        PlantId: "",
        UserId: "",
        MitemCategoryCodes: [],
        MitemCodes: "",
      };
      this.categorytags = [];
      this.codeTags = [];
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
      this.form.MitemCategoryCodes = item.MitemCategoryCodes.split(",");
      console.log(this.form.MitemCategoryCodes);
      let MitemCodes = item.MitemCodes.split(",");
      // MitemCategoryCodes.forEach((item) => {
      //   this.categorytags.push({
      //     MitemCategoryId: "",
      //     MitemCategoryCode: item,
      //     MitemCategoryName: "",
      //   });
      // });
      MitemCodes.forEach((item) => {
        this.codeTags.push({
          MitemCode: item,
          MitemName: "",
          CategoryCode1: "",
          CategoryCode2: "",
        });
      });
    },
    //弹框确认按钮
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //编辑
          if (this.isEdit) {
            let categoryArray = [];
            this.categorytags.forEach((item) => {
              categoryArray.push(item.MitemCategoryCode);
            });
            let codeArray = [];
            this.codeTags.forEach((item) => {
              codeArray.push(item.MitemCode);
            });
            let editForm = {
              PlantId: this.form.PlantId,
              UserId: this.form.UserId,
              MitemCategoryCodes: this.form.MitemCategoryCodes.join(","),
              MitemCodes: codeArray.join(","),
            };
            setBuyerAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getListAll();
              }
            });
          } else {
            //添加
            let categoryArray = [];
            this.categorytags.forEach((item) => {
              categoryArray.push(item.MitemCategoryCode);
            });
            let codeArray = [];
            this.codeTags.forEach((item) => {
              codeArray.push(item.MitemCode);
            });
            console.log(this.form);
            let parmas = {
              PlantId: this.form.PlantId,
              UserId: this.form.UserId,
              MitemCategoryCodes: this.form.MitemCategoryCodes.join(","),
              MitemCodes: codeArray.join(","),
            };
            setBuyerAction(parmas, "add").then((res) => {
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
          let parmas = [];
          self.selectedRowKeys.forEach((item) => {
            parmas.push({
              PlantId: self.data[item].PlantId,
              UserId: self.data[item].UserId,
            });
          });
          setBuyerAction(parmas, "delete").then((res) => {
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
      setBuyerAction(parmas, "delete").then((res) => {
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

<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <!-- 查询 -->
    <div class="search-box">
      <a-row type="flex" justify="space-between">
        <a-col :md="24" :lg="6">
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
        <a-col :md="24" :lg="18">
          <a-form layout="horizontal" :form="searchForm" class="form-box">
            <a-row type="flex" justify="end">
              <a-col
                ><a-form-item style="margin-right:10px"> <a-input placeholder="机构编码/名称" allowClear style="width: 200px" v-decorator="['searcValue']" /> </a-form-item
              ></a-col>
              <a-col>
                <a-form-item>
                  <!-- <a-input placeholder="请输入" v-decorator="['entertype']" /> -->
                  <a-select placeholder="选择机构" style="width: 300px" v-decorator="['entertype']">
                    <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.EnterTypeCode">
                      {{ item.EnterTypeName }}
                    </a-select-option>
                  </a-select>
                </a-form-item></a-col
              >
              <a-col
                ><div style="margin-top: 3px;margin-left:10px">
                  <a-button :disabled="!hasPerm('search')" type="primary" icon="search" style="margin:0 10px" @click="search">搜索</a-button>
                  <a-button :disabled="!hasPerm('search')" @click="reset" icon="reload">重置</a-button>
                </div></a-col
              >
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </div>
    <!-- 添加 -->
    <div>
      <a-modal :title="isEdit ? '编辑机构' : '添加机构'" :visible="visible" v-if="visible" destoryOnClose @ok="handleOk" @cancel="handleCancel" :width="840">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-row>
            <a-col :span="12">
              <a-form-model-item ref="EnterLogo" label="机构logo">
                <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange" :custom-request="uploadImg" accept="image/png, image/jpeg">
                  <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="head" />
                  <div v-else>
                    <a-icon :type="loading ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">Upload</div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="EnterCode" has-feedback label="机构编码" prop="EnterCode" :labelCol="{ span: 6 }">
                <a-input
                  v-model="form.EnterCode"
                  allowClear
                  placeholder="请输入机构编码"
                  @blur="
                    () => {
                      $refs.EnterCode.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="EnterEMail" has-feedback label="管理员邮箱" prop="EnterEMail" :labelCol="{ span: 6 }">
                <a-input
                  v-model="form.EnterEMail"
                  allowClear
                  placeholder="请输入管理员邮箱"
                  @blur="
                    () => {
                      $refs.EnterEMail.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="EnterName" has-feedback label="机构中文名" prop="EnterName" :labelCol="{ span: 6 }">
                <a-input
                  v-model="form.EnterName"
                  allowClear
                  placeholder="请输入机构中文名"
                  @blur="
                    () => {
                      $refs.EnterEMail.onFieldBlur();
                    }
                  "
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="机构简称(中文)" :labelCol="{ span: 6 }">
                <a-input v-model="form.EnterShortName" allowClear placeholder="请输入机构简称(中文)" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="机构英文名" :labelCol="{ span: 6 }"><a-input v-model="form.EnterEnName" placeholder="请输入机构英文名"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="上级机构" :labelCol="{ span: 6 }">
                <a-select v-model="form.SuperiorEnterId" placeholder="请选择上级机构" @change="enterOption">
                  <a-select-option v-for="(item, index) in supSelectList" :key="index" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="机构简称(英文)" :labelCol="{ span: 6 }">
                <a-input v-model="form.EnterShortEnName" allowClear placeholder="请输入机构简称(英文)" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="机构域名" :labelCol="{ span: 6 }"><a-input v-model="form.EnterUrl" placeholder="请输入机构域名"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="机构法人" :labelCol="{ span: 6 }"><a-input v-model="form.EnterCorporate" placeholder="请输入机构法人"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="营业执照编码" :labelCol="{ span: 6 }">
                <a-input v-model="form.EnterLicense" allowClear placeholder="请输入营业执照编码" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="机构描述" :labelCol="{ span: 6 }">
                <a-textarea v-model="form.EnterDesc" placeholder="请输入机构描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="机构类型" has-feedback prop="EnterTypeName" :labelCol="{ span: 6 }">
                <a-select v-model="form.EnterTypeName" placeholder="选择机构" @change="enterTypeOption">
                  <a-select-option v-for="(item, index) in selectList" :key="index" :value="item.EnterTypeName">{{ item.EnterTypeName }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="Enable" label="是否启用" :labelCol="{ span: 6 }">
                <a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
                  <a-radio-button value="N">否</a-radio-button>
                  <a-radio-button value="Y">是</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系人" :labelCol="{ span: 6 }"><a-input v-model="form.EnterContacts" placeholder="请输入联系人"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="联系电话" :labelCol="{ span: 6 }"><a-input v-model="form.EnterPhone" placeholder="请输入联系电话"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="传真" :labelCol="{ span: 6 }"><a-input v-model="form.EnterFax" placeholder="请输入联系传真"/></a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="SortNo" :labelCol="{ span: 6 }" has-feedback label="序号">
                <a-input-number v-model="form.SortNo" :min="1" placeholder="序号" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-model-item label="地址" :labelCol="{ span: 3 }">
                <a-textarea v-model="form.EnterAddr" placeholder="请输入联系地址" :auto-size="{ minRows: 3, maxRows: 5 }" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </div>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="dataSource"
        size="small"
        :scroll="{ y: scrollY }"
        :pagination="pagination"
        @change="handleTableChange"
        :rowKey="(dataSource) => dataSource.EnterId"
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
        <template slot="Enable" slot-scope="record">
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
      <a-drawer width="700" placement="right" :visible="isDrawer" @close="onClose">
        <a-descriptions title="机构列表详情" :column="2">
           <a-descriptions-item label="机构logo"><a-avatar shape="square" :size="80" :src="`./${drawerItem.EnterLogo}`"/></a-descriptions-item>
          <a-descriptions-item label="机构中文名">{{ drawerItem.EnterName }}</a-descriptions-item>
          <a-descriptions-item label="管理员邮箱">{{ drawerItem.EnterEMail }}</a-descriptions-item>
          <a-descriptions-item label="机构英文名">{{ drawerItem.EnterEnName }}</a-descriptions-item>
          <a-descriptions-item label="机构中文名(简称)">{{ drawerItem.EnterShortName }}</a-descriptions-item>
          <a-descriptions-item label="机构英文名(简称)">{{ drawerItem.EnterShortEnName }}</a-descriptions-item>
          <a-descriptions-item label="营业执照编码">{{ drawerItem.EnterLicense }}</a-descriptions-item>
          <a-descriptions-item label="上级机构">{{ drawerItem.SuperiorEnterName }}</a-descriptions-item>
          <a-descriptions-item label="机构域名">{{ drawerItem.EnterUrl }}</a-descriptions-item>
          <a-descriptions-item label="机构法人">{{ drawerItem.EnterCorporate }}</a-descriptions-item>
          <a-descriptions-item label="机构描述">{{ drawerItem.EnterDesc }}</a-descriptions-item>
          <a-descriptions-item label="联系人">{{ drawerItem.EnterContacts }}</a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ drawerItem.EnterPhone }}</a-descriptions-item>
          <a-descriptions-item label="地址">{{ drawerItem.EnterAddr }}</a-descriptions-item>
          <a-descriptions-item label="传真">{{ drawerItem.EnterFax }}</a-descriptions-item>
          <a-descriptions-item label="机构编码">{{ drawerItem.EnterTypeCode }}</a-descriptions-item>
          <a-descriptions-item label="机构类型">{{ drawerItem.EnterTypeName }}</a-descriptions-item>
          <a-descriptions-item label="是否启用">
            <div>
              <a-tag color="green" v-if="drawerItem.Enable == 'Y'">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="描述">{{ drawerItem.EnterTypeDesc }}</a-descriptions-item>
          <a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
          <a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </div>
  </a-card>
</template>
<script>
//表头
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "机构中文名",
    dataIndex: "EnterName",
    scopedSlots: { customRender: "name" },
    align: "center",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "机构编号",
    dataIndex: "EnterCode",
    scopedSlots: { customRender: "EnterCode" },
    align: "center",
  },
  {
    title: "机构类型",
    dataIndex: "EnterTypeName",
    scopedSlots: { customRender: "type" },
    align: "center",
    width: "5%",
  },
  {
    title: "状态",
    dataIndex: "Enable",
    scopedSlots: { customRender: "Enable" },
    align: "center",
    width: "5%",
  },
  {
    title: "上级机构名称",
    dataIndex: "SuperiorEnterName",
    scopedSlots: { customRender: "SuperiorEnterName" },
    align: "center",
    width: "15%",
    ellipsis: true,
  },
  {
    title: "排序号",
    dataIndex: "SortNo",
    scopedSlots: { customRender: "SortNo" },
    align: "center",
    width: "5%",
  },
  {
    title: "创建时间",
    dataIndex: "DateTimeCreated",
    scopedSlots: { customRender: "address" },
    align: "center",
    width: "10%",
    ellipsis: true,
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
import { getEnterList, getInstitutionList, enterAction, uploadFile } from "@/services/admin.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      dataSource: [],
      columns,
      isEdit: false,
      editForm: [],
      title: "添加机构",
      loading: false,
      selectedRowKeys: [], // Check here to configure the default column
      visible: false,
      drawerItem: [],
      isDrawer: false,
      searchForm: this.$form.createForm(this),
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: "",
      selectList: [],
      supSelectList: [],
      isSuperior: false,
      form: {
        OAId: "",
        EnterCode: "",
        EnterName: "",
        EnterEnName: "",
        EnterDesc: "",
        EnterTypeId: "",
        EnterTypeCode: "",
        EnterTypeName: "",
        EnterEMail: "",
        EnterFax: "",
        EnterUrl: "",
        EnterLicense: "",
        EnterCorporate: "",
        EnterContacts: "",
        EnterPhone: "",
        EnterAddr: "",
        EnterId: "",
        SuperiorEnterName: "",
        Enable: "Y",
        SortNo: 1,
        EnterLogo: "",
      },
      rules: {
        EnterCode: [
          {
            required: true,
            message: "请选择机构编码",
            trigger: "blur",
          },
        ],
        EnterEMail: [
          {
            required: true,
            message: "请输入管理员邮箱",
            trigger: "blur",
          },
        ],
        SuperiorEnterId: [
          {
            required: true,
            message: "请选择上级机构",
            trigger: "blur",
          },
        ],
        EnterTypeName: [
          {
            required: true,
            message: "请选择机构类型",
            trigger: "blur",
          },
        ],
        EnterName: [
          {
            required: true,
            message: "请输入机构中文名",
            trigger: "blur",
          },
        ],
      },
      scrollY: "",
      isSearch: false,
      imageUrl: "",
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
    this.$nextTick(() => {
      this.scrollY = getTableScroll();
    });
    this.getEnterList();
    this.getInstitutionList();
  },
  methods: {
    uploadImg(info) {
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl;
        console.log(info.file);
        let typeArray = info.file.type.split("/");
        let fileType = typeArray[1].toUpperCase();
        let parmas = {
          FileName: info.file.name,
          FileContent: imageUrl,
          FileSuffix: "." + fileType,
        };
        uploadFile(parmas).then((res) => {
          if (res.data.success) {
            this.$message.success("上传成功!");
            this.fileData = res.data.data;
          } else {
            this.$message.error(`上传失败`);
          }
        });
        this.loading = false;
      });
    },
    handleChange(info) {
      if (info.file.status === "error") {
        this.loading = true;
        this.$message.error(`上传失败`);
        return;
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("请选择jpg或者png格式图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片太大了.请上传小于2M图片");
      }
      return isJpgOrPng && isLt2M;
    },
    //设置是否默认
    enableChange(value) {
      this.form.Enable = value.target.value;
    },
    //查看详情
    detail(item) {
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //关闭模态窗
    onClose() {
      this.isDrawer = false;
    },
    //获取机构类型
    getInstitutionList() {
      let parmas = {
        pageindex: 1,
        pagesize: 100,
      };
      getInstitutionList(parmas).then((res) => {
        if (res.data.success) {
          this.selectList = res.data.data.list;
        }
      });
    },
    //设置上级机构
    enterOption(value) {
      if (this.form.EnterId == value) {
        return;
      }
      this.dataSource.filter((item) => {
        if (item.EnterId == value) {
          this.form.SuperiorEnterId = item.EnterId;
          this.form.SuperiorEnterName = item.EnterName;
          // this.form.SuperiorEnterName =item.SuperiorEnterName
        }
      });
    },
    //设置机构类型
    enterTypeOption(value) {
      this.selectList.filter((item) => {
        if (item.EnterTypeName == value) {
          this.form.EnterTypeName = item.EnterTypeName;
          this.form.EnterTypeId = item.EnterTypeId;
          this.form.EnterTypeCode = item.EnterTypeCode;
        }
      });
    },
    //重置搜索
    reset() {
      this.pagination.current = 1;
      this.getEnterList();
      this.searchForm.resetFields();
    },
    //搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.dataSource = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            entertype: values.entertype,
            keyword: values.enter,
          };
          getEnterList(parmas).then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取机构类型列表
    getEnterList() {
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getEnterList(parmas).then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.isSearch = false;
        }
      });
    },
    //打开对话框
    add() {
      this.defaultForm();
      this.isEdit = false;
      this.title = "添加机构";
      this.visible = true;
    },
    //初始化表单数据
    defaultForm() {
      this.form = {
        OAId: "",
        EnterCode: "",
        EnterName: "",
        EnterEnName: "",
        EnterDesc: "",
        EnterTypeId: "",
        EnterTypeCode: "",
        EnterTypeName: "",
        EnterEMail: "",
        EnterFax: "",
        EnterUrl: "",
        EnterLicense: "",
        EnterCorporate: "",
        EnterContacts: "",
        EnterPhone: "",
        EnterAddr: "",
        SuperiorEnterId: "",
        SuperiorEnterName: "",
        Enable: "Y",
        SortNo: 1,
        EnterLogo: "",
      };
    },
    //关闭对话框
    handleCancel() {
      this.visible = false;
    },
    //编辑
    edit(item) {
      this.supSelectList = [
        {
          EnterName: "顶级",
          EnterId: 0,
        },
      ];
      let list = this.dataSource;
      list.forEach((i) => {
        this.supSelectList.push(i);
      });
      this.isSuperior = false;
      this.getInstitutionList();
      this.visible = true;
      this.isEdit = true;
      this.title = "编辑机构";
      this.form = item;
      this.supSelectList.filter((items, index) => {
        if (items.EnterId == item.EnterId) {
          this.supSelectList.splice(index, 1);
        }
      });
      if (item.SuperiorEnterId == 0) {
        this.form.SuperiorEnterId = "顶级";
      }
    },
    //确定按钮
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //编辑数据
          if (this.isEdit) {
            let editForm = {
              EnterId: this.form.EnterId,
              EnterName: this.form.EnterName,
              EnterEnName: this.form.EnterEnName,
              EnterShortName: this.form.EnterShortName,
              EnterShortEnName: this.form.EnterShortEnName,
              EnterDesc: this.form.EnterDesc,
              EnterTypeId: this.form.EnterTypeId,
              EnterTypeCode: this.form.EnterTypeCode,
              EnterTypeName: this.form.EnterTypeName,
              EnterEMail: this.form.EnterEMail,
              EnterFax: this.form.EnterFax,
              EnterUrl: this.form.EnterUrl,
              EnterLicense: this.form.EnterLicense,
              EnterCorporate: this.form.EnterCorporate,
              EnterContacts: this.form.EnterContacts,
              EnterPhone: this.form.EnterPhone,
              EnterAddr: this.form.EnterAddr,
              SuperiorEnterId: this.form.SuperiorEnterId,
              SuperiorEnterName: this.form.SuperiorEnterName,
              Enable: this.form.Enable,
              SortNo: this.form.SortNo,
              EnterLogo: this.fileData.ResourceId || this.form.EnterLogo,
            };
            enterAction(editForm, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.visible = false;
                this.getEnterList();
              }
            });
          } else {
            //添加数据
            this.form.EnterLogo = this.fileData.ResourceId || "";
            enterAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.getEnterList();
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
          enterAction(self.selectedRowKeys, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getEnterList();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push(item.EnterId);
      enterAction(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getEnterList();
        }
      });
    },
    //分页切换
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getEnterList();
    },
  },
};
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.tab {
  min-height: 50vh;
}
.head {
  width: 104px;
  height: 104px;
}
.ant-upload.ant-upload-select-picture-card {
  width: 104px;
  height: 104px;
}
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
</style>

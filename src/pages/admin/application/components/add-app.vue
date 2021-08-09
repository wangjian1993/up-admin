<template>
  <div>
    <app-icon
      v-if="isIcon"
      @closeModal="closeModal"
      @iconClick="iconClick"
    ></app-icon>
    <a-modal
      :title="isEdit ? '编辑应用' : '添加应用'"
      v-if="visible"
      :visible="visible"
      :width="800"
      centered
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="基本信息">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row>
              <a-col :span="12">
                <a-form-model-item ref="AppLogo" label="图标">
                  <a-input
                    style="width: 150px"
                    disabled
                    v-model="form.AppLogo"
                  />
                  <a-button type="primary" @click="iconSelect()">选择</a-button>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  ref="AppName"
                  has-feedback
                  label="应用名称"
                  prop="AppName"
                >
                  <a-input
                    v-model="form.AppName"
                    placeholder="请输入应用名称"
                    allowClear
                    @blur="
                      () => {
                        $refs.AppName.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  ref="AppCode"
                  has-feedback
                  label="应用编码"
                  prop="AppCode"
                >
                  <a-input
                    v-model="form.AppCode"
                    placeholder="请输入应用编码"
                    :disabled="isEdit"
                    @blur="
                      () => {
                        $refs.AppCode.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item
                  ref="AppTypeId"
                  has-feedback
                  label="应用类型"
                  prop="AppTypeId"
                >
                  <a-select
                    v-model="form.AppTypeId"
                    placeholder="请选择用户类型"
                  >
                    <a-select-option
                      v-for="item in appTypeList"
                      :key="item.AppTypeId"
                      :value="item.AppTypeId"
                      >{{ item.AppTypeName }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item ref="Gender" label="共享">
                  <a-radio-group v-model="form.IsShare">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="2">否</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item ref="Gender" label="是否启用">
                  <a-radio-group v-model="form.resource">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="2">否</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item ref="AppSortNo" has-feedback label="序号">
                  <a-input-number
                    id="AppSortNo"
                    v-model="form.AppSortNo"
                    :min="1"
                    placeholder="请输入应用序号"
                    @blur="
                      () => {
                        $refs.AppSortNo.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="12">
                <a-form-model-item ref="AppDesc" label="描述">
                  <a-textarea
                    v-model="form.AppDesc"
                    placeholder="请输入应用描述"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="应用首页">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row>
              <a-col :span="24">
                <a-form-model-item ref="IsAuth" label="是否授权">
                  <a-radio-group v-model="form.IsAuth">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="2">否</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item ref="LayoutTypeCode" label="布局">
                  <a-radio-group v-model="form.LayoutTypeCode">
                    <a-radio value="1">单页面</a-radio>
                    <a-radio value="2">多页面</a-radio>
                    <a-radio value="2">外部链接</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item ref="Gender" label="配置类型">
                  <a-radio-group v-model="form.ConfigTypeCode">
                    <a-radio value="1">Iframe</a-radio>
                    <a-radio value="2">VUE组件</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item ref="MouduleUrl" label="组件路径">
                  <a-input v-model="form.MouduleUrl" placeholder="组件路径" />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item ref="MouduleParam" label="组件参数">
                  <a-input v-model="form.MouduleParam" placeholder="组件参数" />
                </a-form-model-item>
              </a-col>
              <a-col :span="24">
                <a-form-model-item ref="Gender" label="访问方式">
                  <a-radio-group v-model="form.AccessTypeCode">
                    <a-radio value="1">URL访问</a-radio>
                    <a-radio value="2">新窗口</a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>
<script>
import { getAppTypeList, appInfoAction, uploadFile } from "@/services/admin.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
import AppIcon from "@/components/app-icon/AppIcon.vue";
export default {
  props: ["enterValue", "editItem", "modalType", "isEdit", "editForm"],
  components: { AppIcon },
  data() {
    return {
      ModalText: "Content of the modal",
      visible: true,
      confirmLoading: false,
      loading: false,
      isListClass: false,
      classItem: [],
      fileData: [],
      form: {
        AppCode: "",
        AppName: "",
        AppDesc: "",
        AppLogo: "",
        AppTypeId: "",
        AccessTypeCode: "",
        AppSortNo: 1,
        ConfigTypeCode: "",
        IsAuth: 1,
        IsShare: 1,
        LayoutTypeCode: "",
        MouduleParam: "",
        MouduleUrl: "",
      },
      rules: {
        AppName: [
          {
            required: true,
            message: "请输入应用名称",
            trigger: "blur",
          },
        ],
        AppCode: [
          {
            required: true,
            message: "请输入应用编码",
            trigger: "blur",
          },
        ],
        AppTypeId: [
          {
            required: true,
            message: "请选择应用类型",
            trigger: "blur",
          },
        ],
        AppSortNo: [
          {
            required: true,
            message: "请输入应用序号",
            trigger: "blur",
          },
        ],
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      appTypeList: [],
      rolesList: [],
      rolesDefault: null,
      orgList: [],
      imageUrl: "",
      roleList: [],
      isIcon: false,
    };
  },
  created() {
    this.getAppTypeList();
    if (this.isEdit) {
      this.form = this.editForm;
      this.imageUrl = this.editForm.AppLogoUrl;
    }
    // this.getUserRoles();
    // this.getOrganizationList();
    // console.log(this.modalType);
    // if (this.modalType == 'edit') {
    // 	this.form = this.editItem;
    // 	console.log(this.form);
    // }
  },
  methods: {
    iconClick(item) {
      this.form.AppLogo = item;
      this.isIcon = false;
    },
    defaultForm() {
      this.form = {
        AppCode: "",
        AppName: "",
        AppDesc: "",
        AppLogo: "",
        AppTypeId: "",
        AccessTypeCode: "",
        AppSortNo: 1,
        ConfigTypeCode: "",
        IsAuth: "",
        IsShare: "",
        LayoutTypeCode: "",
        MouduleParam: "",
        MouduleUrl: "",
      };
    },
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
    closeModal() {
      this.isListClass = false;
    },
    enableChange(e) {
      this.form.Gender = e.target.value;
    },
    handleChange(info) {
      if (info.file.status === "error") {
        this.loading = true;
        this.$message.error(`上传失败`);
        return;
      }
    },
    beforeUpload(file) {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        this.$message.error("请选择jpg或者png格式图片");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("图片太大了.请上传小于2M图片");
      }
      return isJpgOrPng && isLt2M;
    },
    //获取用户类型
    getAppTypeList() {
      let parmas = {
        pageindex: 1,
        pagesize: 50,
      };
      getAppTypeList(parmas).then((res) => {
        if (res.data.success) {
          this.appTypeList = res.data.data.list;
        }
      });
    },
    orgSelect(item) {
      console.log(item);
      this.isListClass = true;
      this.classItem = item;
    },
    orgSubSelect(value) {
      this.isListClass = false;
      this.classItem = [];
      this.orgList.filter((item) => {
        console.log(item);
        if (item.OrgDimensionId == value.OrgDimensionId) {
          item.levelArray = value;
        }
      });
    },
    rolesChange(e) {
      this.roleList = this.rolesList[e.target.value];
    },
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let params = {
              AppId: this.form.AppId,
              AppName: this.form.AppName,
              AppCode: this.form.AppCode,
              AppDesc: this.form.AppDesc,
              AppLogo: this.form.AppLogo,
              AppTypeId: this.form.AppTypeId,
              AccessTypeCode: this.form.AccessTypeCode,
              AppSortNo: this.form.AppSortNo,
              ConfigTypeCode: this.form.ConfigTypeCode,
              IsAuth: this.form.IsAuth,
              IsShare: this.form.IsShare,
              LayoutTypeCode: this.form.LayoutTypeCode,
              MouduleParam: this.form.MouduleParam,
              MouduleUrl: this.form.MouduleUrl,
            };
            appInfoAction(params, "update").then((res) => {
              if (res.data.success) {
                this.$message.success("编辑成功!");
                this.defaultForm();
                this.$emit("succeed");
                this.$emit("cloneModal");
              }
            });
          } else {
            this.form.AppLogo = this.fileData.ResourceId || "";
            appInfoAction(this.form, "add").then((res) => {
              if (res.data.success) {
                this.$message.success("添加成功!");
                this.defaultForm();
                this.$emit("succeed");
                this.$emit("cloneModal");
              }
            });
          }
        }
      });
    },
    handleCancel() {
      this.$emit("cloneModal");
      this.defaultForm();
    },
    iconSelect() {
      this.isIcon = true;
    },
  },
};
</script>
<style type="text/css" lang="less" scoped>
.ant-modal-body {
  padding: 5px 15px;
}
/deep/.ant-modal-body {
  height: 450px;
  min-height: 450px;
}
.head {
  width: 128px;
  height: 128px;
}
.ant-upload.ant-upload-select-picture-card {
  width: 128px;
  height: 128px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

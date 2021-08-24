<template>
  <div>
    <a-row>
      <a-col style="padding: 0 5px" :sm="12" :xs="24">
        <a-card class="card" title="个人信息" :bordered="false" :bodyStyle="{ margin: '0 0px', padding: '5px', maxHeight: '45vh', minHeight: '45vh', overflow: 'auto' }">
          <a-row>
            <a-col :span="8">
              <a-upload name="avatar" list-type="picture-card" class="avatar-uploader" :show-upload-list="false" :before-upload="beforeUpload" action="https://www.mocky.io/v2/5cc8019d300000980a055e76" @change="handleChange" :custom-request="uploadImg" accept="image/png, image/jpeg">
                <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="head" />
                <div v-else>
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-col>
            <a-col :span="16">
              <a-descriptions :column="1">
                <a-descriptions-item label="账号">
                  {{ userInfo.UserLoginId }}
                </a-descriptions-item>
                <a-descriptions-item label="角色权限">
                  {{ RoleName }}
                </a-descriptions-item>
                <a-descriptions-item label="所属机构">
                  {{ enterName }}
                </a-descriptions-item>
                <a-descriptions-item label="行政组织">
                  {{ orgName }}
                </a-descriptions-item>
                <a-descriptions-item label="姓名">
                  <a-input v-model="user.UserName" style="width:200px" />
                </a-descriptions-item>
                <a-descriptions-item label="手机">
                  <a-input v-model="user.MobilePhone" style="width:200px" />
                </a-descriptions-item>
                <a-descriptions-item label="邮箱">
                  <a-input v-model="user.Email" style="width:200px" />
                </a-descriptions-item>
                <a-descriptions-item label="企业微信">
                  <a-input v-model="user.EnterWechatAccount" style="width:200px" />
                </a-descriptions-item>
              </a-descriptions>
            </a-col>
            <div slots="actions">
              <a-button @click="saveInfo" type="primary" style="float:right;margin-right:50px;margin-top:10px;">
                保存设置
              </a-button>
            </div>
          </a-row>
        </a-card>
        <a-card class="card" title="修改密码" :bordered="false" :bodyStyle="{ margin: '5px', padding: '5px', maxHeight: '30vh', minHeight: '30vh', overflow: 'auto' }">
          <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="旧密码" has-feedback>
              <a-input-password
                v-decorator="[
                  'OldPwd',
                  {
                    rules: [{ required: true, message: '请输入旧密码' }],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item label="新密码" has-feedback>
              <a-input-password
                v-decorator="[
                  'NewPwd',
                  {
                    rules: [
                      { required: true, message: '请输入新密码' },
                      { max: 18, message: '密码最多18位' },
                      { min: 6, message: '密码最少6位' },
                      {
                        validator: validateToNextPassword,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
            <a-form-item label="确认新密码" has-feedback>
              <a-input-password
                type="password"
                v-decorator="[
                  'ComfirmNewPwd',
                  {
                    rules: [
                      { required: true, message: '请再次输入新密码!' },
                      {
                        validator: compareToFirstPassword,
                      },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-form>
          <div slots="actions">
            <a-button type="primary" @click="changePwd" style="float:right;margin-right:50px;margin-top:10px;">
              保存修改
            </a-button>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="12" :xs="24" style="padding: 0 0px">
        <a-card class="card" title="可访问的菜单权限" :bordered="false" :bodyStyle="{ margin: '5px', padding: '5px', maxHeight: '80vh', minHeight: '80vh', overflow: 'auto' }">
          <a-tree :tree-data="menu" default-expand-all auto-expand-parent :replaceFields="{ title: 'name', key: 'path', value: 'path', children: 'children' }"></a-tree>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getUserInfo, loginUpdate, changePwd, logout } from "@/services/user.js";
import { uploadFile } from "@/services/admin.js";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      userInfo: [],
      RoleName: "",
      enterName: "",
      orgName: "",
      menu: [],
      imageUrl: "",
      loading: false,
      fileData: [],
      user: [],
      form: this.$form.createForm(this),
    };
  },
  created() {
    this.getUserInfo();
    this.menu = JSON.parse(localStorage.getItem("menu"));
  },
  methods: {
    getUserInfo() {
      getUserInfo().then((res) => {
        if (res.data.success) {
          this.userInfo = res.data.data;
          this.RoleName = this.userInfo.UserInRoleList[0].RoleName;
          console.log("1111111", this.userInfo.UserInRoleList.length);
          if (this.userInfo.UserInOrgList.length > 0) {
            console.log("1111111");
            this.enterName = this.userInfo.UserInOrgList[0].EnterName || "";
            this.orgName = this.userInfo.UserInOrgList[0].OrgName || "";
          }
          this.imageUrl = this.userInfo.PhotoUrl;
          this.user = {
            UserName: this.userInfo.UserName,
            Email: this.userInfo.Email,
            MobilePhone: this.userInfo.MobilePhone,
            EnterWechatAccount: this.userInfo.EnterWechatAccount,
            Photo: this.userInfo.Photo,
          };
          console.log(this.user);
        }
      });
    },
    uploadImg(info) {
      getBase64(info.file, (imageUrl) => {
        this.imageUrl = imageUrl;
        console.log(info.file);
        // let typeArray = info.file.type.split("/");
        // let fileType = typeArray[1].toUpperCase();
        let parmas = {
          FileName: info.file.name,
          FileContent: imageUrl,
          FileSuffix: ".jpg",
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
    saveInfo() {
      this.user.Photo = this.fileData.ResourceId || this.user.Photo;
      console.log(this.user);
      let parmas = {
        UserName: this.user.UserName,
        Email: this.user.Email,
        EnterWechatAccount: this.user.EnterWechatAccount,
        MobilePhone: this.user.MobilePhone,
        Photo: this.user.Photo,
      };
      loginUpdate(parmas).then((res) => {
        if (res.data.success) {
          this.$message.success("修改成功!");
          this.getUserInfo();
        }
      });
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("NewPwd")) {
        callback("两次输入的密码不一致!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      //定义你需要的正则
      let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (!reg.test(value)) {
        //验证通过调用回调函数
        callback();
      } else {
        callback("密码不能是中文字符,只能是数字,大小写字母,符号");
      }
    },
    changePwd() {
      let self = this;
      self.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          changePwd(values).then((res) => {
            if (res.data.success) {
              self.$message.success("修改成功!");
              self.$success({
                title: "重新登录",
                // JSX support
                content: (
                  <div>
                    <p>密码修改成功请重新登录</p>
                  </div>
                ),
                onOk() {
                  logout();
                  self.$router.push("/login");
                },
              });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less">
.head {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  border: none;
}
.avatar-uploader {
  display: flex;
  justify-content: center;
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

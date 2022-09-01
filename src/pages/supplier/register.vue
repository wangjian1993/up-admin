<template>
  <common-layout>
    <div class="login">
      <div class="top">
        <div class="header">
          <!-- <img alt="logo" class="logo" src="../../assets/img/upshine-logo.png" /> -->
          <span class="title">{{ systemName }}</span>
        </div>
      </div>
      <a-form @submit="onSubmit" :form="form">
        <a-radio-group style="width:100%" default-value="0" button-style="solid" @change="tabChange">
          <a-radio-button value="0" style="width:50%;text-align: center;">
            手机号注册
          </a-radio-button>
          <a-radio-button value="1" style="width:50%;text-align: center;">
            邮箱注册
          </a-radio-button>
        </a-radio-group>
        <a-form-item style="margin-top:10px;" label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input
            autocomplete="autocomplete"
            allowClear
            size="large"
            placeholder="请输入账号"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入账户名', whitespace: true }],
              },
            ]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item v-if="formType == '0'" style="margin-top:10px;" label="手机号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input
            autocomplete="autocomplete"
            allowClear
            size="large"
            placeholder="请输入手机号"
            v-decorator="[
              'username',
              {
                rules: [
                  { required: true, message: '请输入手机号码', whitespace: true },
                  { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式错误' },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item v-if="formType == '1'" style="margin-top:10px;" label="邮箱" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input
            autocomplete="autocomplete"
            allowClear
            size="large"
            placeholder="请输入邮箱"
            v-decorator="[
              'username',
              {
                rules: [
                  { required: true, message: '请输入邮箱', whitespace: true },
                  { type: 'email', message: '请输入有效的邮箱' },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item label="密码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input-password
            size="large"
            placeholder="请输入密码"
            allowClear
            autocomplete="autocomplete"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入登陆密码',
                  },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
          <a-input-password
            size="large"
            placeholder="请输入密码"
            allowClear
            autocomplete="autocomplete"
            v-decorator="[
              'confirmpassword',
              {
                rules: [
                  {
                    required: true,
                    message: '请再次输入登陆密码!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              },
            ]"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        <!-- <div>
          <a-checkbox style="float: right" :checked="isAccount" @click="cheackAccount">记住账号/密码</a-checkbox>
          <a-checkbox style="float: right" :checked="isAutoLogin" @click="cheackAuto">自动登录</a-checkbox>
        </div> -->
        <a-form-item><a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">注册</a-button></a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { supplierLogin } from "@/services/user";
// import { setAuthorization } from "@/utils/request";
// import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";
// import { encrypto, decrypto } from "@/utils/encrypt";
export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      routerItem: [],
      isAccount: true,
      isAutoLogin: true,
      formType: "0",
    };
  },
  computed: {
    systemName() {
      return "民爆供应商注册";
    },
  },
  created() {},
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles", "setMenu", "setUserHead"]),
    //密码验证
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入的密码不一致");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirmpassword"], { force: true });
      }
      callback();
    },
    tabChange(e) {
      this.form.setFieldsValue({ username: "" });
      this.formType = e.target.value;
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.logging = true;
          // const name = this.form.getFieldValue("name");
          // const password = this.form.getFieldValue("password");
          // login(name, password).then(this.afterLogin);
          let params = {
            type: this.formType, // 登录类型，0为手机号，1为邮箱
            islogin: false, // 是否登录、注册
            ...values,
          };
          supplierLogin(params).then((result) => {
            console.log(result);
            this.logging = true;
          });
        }
      });
    },
    timeFix() {
      const time = new Date();
      const hour = time.getHours();
      return hour < 9 ? this.timeList[0] : hour <= 11 ? this.timeList[1] : hour <= 13 ? this.timeList[2] : hour <= 20 ? this.timeList[3] : this.timeList[4];
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    margin-bottom: 5vw;
    .header {
      height: 44px;
      line-height: 44px;
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: #004595;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
  }
  .login {
    margin-top: 5vw;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
.ant-input-affix-wrapper {
  border: none;
  // width: 317px;
}
.ant-input {
  border-radius: 5px;
}
.ant-form-item {
  margin-bottom: 24px;
}
</style>

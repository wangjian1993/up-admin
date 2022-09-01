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
        <a-form-item>
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
        <a-form-item>
          <a-input-password
            size="large"
            placeholder="请输入密码"
            allowClear
            autocomplete="autocomplete"
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: '请输入密码', whitespace: true }],
              },
            ]"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-select default-value="1" v-model="loginType">
            <a-select-option value="1">
              民爆职员
            </a-select-option>
            <a-select-option value="2">
              供应商
            </a-select-option>
          </a-select>
        </a-form-item>
        <div>
          <a-checkbox style="float: right" :checked="isAccount" @click="cheackAccount">记住账号/密码</a-checkbox>
          <a-checkbox style="float: right" :checked="isAutoLogin" @click="cheackAuto">自动登录</a-checkbox>
          <!-- <a style="float: right">忘记密码</a> -->
        </div>
        <a-form-item><a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button></a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { login, supplierLogin } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";
import { encrypto, decrypto } from "@/utils/encrypt";
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
      loginType: "1",
      timeList: [
        {
          CN: "早上好",
          HK: "早晨啊",
          US: "Good morning",
        },
        {
          CN: "上午好",
          HK: "上午好",
          US: "Good morning",
        },
        {
          CN: "中午好",
          HK: "中午好",
          US: "Good afternoon",
        },
        {
          CN: "下午好",
          HK: "下午好",
          US: "Good afternoon",
        },
        {
          CN: "晚上好",
          HK: "晚上好",
          US: "Good evening",
        },
      ],
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  created() {
    //设置账号
    this.$nextTick(() => {
      let name = localStorage.getItem("account");
      let isAutoLogin = localStorage.getItem("isAutoLogin");
      const pws = decrypto(localStorage.getItem("password"));
      this.form.setFieldsValue({ name: name, password: pws });
      if (isAutoLogin) {
        this.logging = true;
        const name = this.form.getFieldValue("name");
        const password = this.form.getFieldValue("password");
        if (this.loginType == 1) {
          login(name, password).then(this.afterLogin);
        }
      }
    });
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles", "setMenu", "setUserHead"]),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          //普通用户登录
          if (this.loginType == 1) {
            login(name, password).then(this.afterLogin);
          }
          //供应商登录
          if (this.loginType == 2) {
            console.log("供应商登录====")
            var isPhone = /^[1][3,4,5,7,8][0-9]{9}$/; //手机
            let regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            let formType = 1;
            console.log("供应商登录====",isPhone)
            console.log("供应商登录====",regEmail)
            console.log("供应商登录====",isPhone.test(name))
            console.log("供应商登录====",regEmail.test(name))
            if (isPhone.test(name)) {
              formType = 1;
            } else if (regEmail.test(name)) {
              formType = 2;
            }
            let params = {
              type:formType, // 登录类型，0为手机号，1为邮箱
              islogin: true, // 是否登录、注册
              username: name,
              password: password,
            };
            console.log("params===",params)
            supplierLogin(params).then(this.afterLogin);
          }
        }
      });
    },
    timeFix() {
      const time = new Date();
      const hour = time.getHours();
      return hour < 9 ? this.timeList[0] : hour <= 11 ? this.timeList[1] : hour <= 13 ? this.timeList[2] : hour <= 20 ? this.timeList[3] : this.timeList[4];
    },
    routerList(datas) {
      //遍历树  获取id数组
      for (var i in datas) {
        this.routerItem.push({});
        if (datas[i].children) {
          this.setName(datas[i].children);
        }
      }
    },
    afterLogin(res) {
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.success) {
        const { userName, userModules, PhotoUrl } = loginRes.data;
        this.setUser(userName);
        this.setUserHead("./" + PhotoUrl);
        var inFifteenMinutes = new Date(new Date().getTime() + 4 * 60 * 60 * 1000);
        setAuthorization({ token: res.headers.token, expireAt: inFifteenMinutes });
        this.$message.success(this.timeFix().CN + "，欢迎回来!", 3);
        const routesConfig = userModules || [];
        //记住账号
        if (this.isAccount) {
          console.log("保存账号密码====");
          localStorage.setItem("account", this.form.getFieldValue("name"));
          localStorage.setItem("password", encrypto(this.form.getFieldValue("password")));
        } else {
          localStorage.removeItem("account");
          localStorage.removeItem("password");
        }
        if (this.isAutoLogin) {
          localStorage.setItem("isAutoLogin", true);
        } else {
          localStorage.removeItem("isAutoLogin");
        }
        // if (routesConfig.length == 0) {
        let workplace = {
          router: "dashboard", //匹配 router.map.js 中注册名 registerName = dashboard 的路由
          children: ["workplace"], //dashboard 路由的子路由配置，依次匹配 registerName 为 workplace 和 analysis 的路由
        };
        let personal = { router: "personal", children: ["user"] };
        let newRoutesConfig = [];
        routesConfig.push(workplace);
        routesConfig.push(personal);
        routesConfig.forEach((item) => {
          if (item.path != "") {
            newRoutesConfig.push(item);
          }
        });
        localStorage.setItem("menu", JSON.stringify(newRoutesConfig));
        let root = [
          {
            router: "root", //匹配 router.map.js 中注册名 registerName = root 的路由
            children: newRoutesConfig,
          },
        ];
        console.log("root====", root);
        loadRoutes(root);
        // this.$router.push("dashboard");
        this.$router.push("dashboard").catch((err) => console.log(err));
      }
    },
    cheackAccount() {
      this.isAccount = !this.isAccount;
    },
    cheackAuto() {
      this.isAutoLogin = !this.isAutoLogin;
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
  width: 317px;
}
.ant-input {
  border-radius: 5px;
}
.ant-form-item {
  margin-bottom: 24px;
}
</style>

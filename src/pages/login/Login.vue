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
        <div>
          <a-checkbox style="float: right" :checked="isAccount" @click="cheackAccount">记住账号</a-checkbox>
          <!-- <a style="float: right">忘记密码</a> -->
        </div>
        <a-form-item><a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button></a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { login } from "@/services/user";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";

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
      this.form.setFieldsValue({ name: name });
    });
  },
  methods: {
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles",'setMenu']),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true;
          const name = this.form.getFieldValue("name");
          const password = this.form.getFieldValue("password");
          login(name, password).then(this.afterLogin);
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
        const { userName, userModules } = loginRes.data;
        console.log("userModules----",userModules)
        this.setUser(userName);
        // this.setMenu(userModules);
        localStorage.setItem("menu",JSON.stringify(userModules));
        var inFifteenMinutes = new Date(new Date().getTime() + 4 * 60 * 60 * 1000);
        setAuthorization({ token: res.headers.token, expireAt: inFifteenMinutes });
        this.$message.success(this.timeFix().CN + "，欢迎回来!", 3);
        const routesConfig = userModules || [];
        //记住账号
        if (this.isAccount) {
          localStorage.setItem("account", this.form.getFieldValue("name"));
        } else {
          localStorage.removeItem("account");
        }
        // if (routesConfig.length == 0) {
        let workplace = {
          router: "dashboard", //匹配 router.map.js 中注册名 registerName = dashboard 的路由
          children: ["workplace"] //dashboard 路由的子路由配置，依次匹配 registerName 为 workplace 和 analysis 的路由
        };
        let personal = { router: "personal", children: ["user"] };
        routesConfig.push(workplace);
        routesConfig.push(personal);
        // }
        let root = [
          {
            router: "root", //匹配 router.map.js 中注册名 registerName = root 的路由
            children: routesConfig,
          },
        ];
        console.log(root);
        loadRoutes(root);
        this.$router.push("dashboard");
      }
    },
    cheackAccount() {
      this.isAccount = !this.isAccount;
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

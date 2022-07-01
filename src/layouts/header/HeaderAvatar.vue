<!--
 * @Author: max
 * @Date: 2021-08-17 08:26:18
 * @LastEditTime: 2022-07-01 16:08:17
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/layouts/header/HeaderAvatar.vue
-->
<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="head" />
      <span class="name">{{ user }}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="goUser">
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { logout } from "@/services/user";

export default {
  name: "HeaderAvatar",
  computed: {
    ...mapGetters("account", ["user", "head"]),
  },
  methods: {
    onClick() {},
    goUser() {
      this.$router.push({ path: "/personal" });
    },
    logout() {
      let selt = this;
      selt.$confirm({
        title: "退出登录",
        content: "确定要退出登录吗?",
        onOk() {
          logout();
          localStorage.removeItem("isAutoLogin");
          selt.$router.push("/");
        },
        onCancel() {},
      });
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
</style>

<!--
 * @Author: max
 * @Date: 2021-08-17 08:26:18
 * @LastEditTime: 2022-09-02 15:35:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/layouts/header/HeaderCompany.vue
-->
<template>
  <div>
    <div class="header-avatar" style="cursor: pointer">
      <span class="name" @click="isClick = false">当前公司:</span>
    </div>
    <div class="header-avatar" style="cursor: pointer" v-if="!isClick">
      <span class="name" @click="isClick = true">{{ companyName }}</span>
    </div>
    <a-select v-model="companyId" style="width: 200px;margin:0 5px" v-if="isClick" @change="companyChange">
      <a-select-option :value="item.CompanyId" v-for="item in companyList" :key="item.CompanyId">
        {{ item.CompanyName }}
      </a-select-option>
    </a-select>
    <a-icon v-if="isClick" type="close-circle" class="search-icon" @click="isClick = false" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { logout } from "@/services/user";

export default {
  name: "HeaderAvatar",
  data() {
    return {
      isClick: false,
      companyName: "",
      companyId: "",
    };
  },
  computed: {
    ...mapGetters("account", ["companyList"]),
  },
  created() {
    this.companyName = localStorage.getItem("COMPANY_NAME") || "请选择公司";
    this.companyId = localStorage.getItem("COMPANY_ID");
  },
  methods: {
    companyChange(e) {
      let company = this.companyList.find((item) => item.CompanyId == e);
      let key = sessionStorage.getItem(process.env.VUE_APP_TBAS_KEY);
      console.log("key===", key);
      localStorage.setItem("COMPANY_ID", company.CompanyId);
      localStorage.setItem("COMPANY_NAME", company.CompanyName);
      this.companyName = company.CompanyName;
      this.companyId = company.CompanyId;
      sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY);
      location.reload();
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

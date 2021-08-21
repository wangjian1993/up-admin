<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-08-21 17:27:25
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/components/menu/SideMenu.vue
-->
<template>
  <a-layout-sider
    :theme="sideTheme"
    width="200px"
    :class="[
      'side-menu eip-admin-collapse',
      'beauty-scroll',
      isMobile ? null : 'shadow',
    ]"
    collapsedWidth="48px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
  >
    <div :class="['logo', theme]" v-if="!collapsed">
      <router-link to="/dashboard">
        <img src="../../assets/img/upshine-logo.png" alt="" />
        <h1>{{ systemName }}</h1>
      </router-link>
    </div>
    <div :class="['logo', theme]" v-else>
      <router-link to="/dashboard">
        <img src="../../assets/img/upshine-logo.png" alt="" />
      </router-link>
    </div>
    <i-menu
      :theme="theme"
      :collapsed="collapsed"
      :options="menuData"
      @select="onSelect"
      class="menu eip-admin-sidebar"
    />
  </a-layout-sider>
</template>

<script>
import IMenu from "./menu";
import { mapState } from "vuex";
export default {
  name: "SideMenu",
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false,
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false,
    },
    menuData: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: "dark",
    },
  },
  computed: {
    sideTheme() {
      return this.theme == "light" ? this.theme : "dark";
    },
    ...mapState("setting", ["isMobile", "systemName"]),
  },
  methods: {
    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },
  },
};
</script>

<style lang="less">
@import "index";
.ant-menu-submenu-title{
  padding-left: 35px;
}
.ant-menu-item{
   padding-left: 55px;
}
</style>

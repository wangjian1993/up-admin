<!--
 * @Author: max
 * @Date: 2022-04-01 08:52:31
 * @LastEditTime: 2022-11-02 14:18:31
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/layouts/header/AdminHeader.vue
-->
<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth]">
      <router-link v-if="isMobile || layout === 'head'" to="/" :class="['logo', isMobile ? null : 'pc', headerTheme]">
        <img width="32" src="@/assets/img/logo.png" />
        <h1 v-if="!isMobile">{{ systemName }}</h1>
      </router-link>
      <a-icon v-if="layout !== 'head' && !isMobile" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse" />
      <div class="admin-header-menu" v-if="layout == 'side'">
        <a-breadcrumb>
          <a-breadcrumb-item :key="index" v-for="(item, index) in breadcrumb">
            <span>{{ item }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div v-if="layout !== 'side' && !isMobile" class="admin-header-menu" :style="`width: ${menuWidth};`">
        <i-menu class="head-menu" :theme="headerTheme" mode="horizontal" :options="menuData" @select="onSelect" />
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <HeaderCompany/>
        <div class="header-item" @click="clickFullscreen"><a-icon :type="fullScreenIcon" /></div>
        <header-help class="header-item" />
        <header-avatar class="header-item" />
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderHelp from "./HeaderHelp.vue";
import HeaderAvatar from "./HeaderAvatar";
import HeaderCompany from './HeaderCompany.vue'
import IMenu from "@/components/menu/menu";
import screenfull from "screenfull";
import { mapState, mapMutations } from "vuex";

export default {
  name: "AdminHeader",
  components: { IMenu, HeaderAvatar, HeaderHelp,HeaderCompany},
  props: ["collapsed", "menuData", "breadcrumb"],
  data() {
    return {
      langList: [
        { key: "CN", name: "简体中文", alias: "简体" },
        { key: "HK", name: "繁體中文", alias: "繁體" },
        { key: "US", name: "English", alias: "English" },
      ],
      company: "请选择公司",
      isFullscreen: false,
      fullScreenIcon: "fullscreen",
    };
  },
  computed: {
    ...mapState("setting", ["theme", "isMobile", "layout", "systemName", "lang", "pageWidth"]),
    headerTheme() {
      if (this.layout == "side" && this.theme.mode == "dark" && !this.isMobile) {
        return "light";
      }
      return this.theme.mode;
    },
    langAlias() {
      let lang = this.langList.find((item) => item.key == this.lang);
      return lang.alias;
    },
    menuWidth() {
      const { layout } = this;
      const headWidth = layout === "head" ? "100% - 200px" : "100%";
      const extraWidth = "600px";
      return `calc(${headWidth} - ${extraWidth})`;
    },
  },
  methods: {
    clickFullscreen() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "您的浏览器不支持全屏",
          type: "warning",
        });
        return false;
      }
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
      this.fullScreenIcon = this.isFullscreen ? "fullscreen-exit" : "fullscreen";
    },
    toggleCollapse() {
      this.$emit("toggleCollapse");
    },
    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },
    ...mapMutations("setting", ["setLang"]),
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>

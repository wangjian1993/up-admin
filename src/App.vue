<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2022-08-20 14:35:52
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/App.vue
-->
<template>
  <a-config-provider :locale="locale" :get-popup-container="popContainer">
    <router-view />
  </a-config-provider>
</template>

<script>
import { enquireScreen } from "./utils/util";
import { mapState, mapMutations } from "vuex";
import themeUtil from "@/utils/themeUtil";
import { getI18nKey } from "@/utils/routerUtil";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  name: "App",
  data() {
    return {
      locale: zhCN,
    };
  },
  created() {
    console.log("locale===", this.locale);
    this.setHtmlTitle();
    this.setLanguage(this.lang);
    enquireScreen((isMobile) => this.setDevice(isMobile));
  },
  mounted() {
    this.setWeekModeTheme(this.weekMode);
    window.Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkcgIvwL0jnpsDqRpWg5FI5kt2G7A0tYIcUygBh1sPs7plofUOqPB1a4HBIXJB621mau2oiAIj+ysU7gKUXfjn/D5BocmduNB+ZMiDGPxFrAp3PoD0nYNkkWh8r7gBZ1v/JZSXGE3bQDrCQCNSy6mgby+iFAMV8/PuZ1z77U+Xz3fkpbm6MYQXYp3cQooLGLUti7k1TFWrnawT0iEEDJ2iRcU9wLqn2g9UiWesEZtKwI/UmEI2T7nv5NbgV+CHguu6QU4WWzFpIgW+3LUnKCT/vCDY+ymzgycw9A9+HFSzARiPzgOaAuQYrFDpzhXV+ZeX31AxWlnzjDWqpfluygSNPtGul5gyNt2CEoJD1Yom0VN9fvRonYsMsimkFFx2AwyVpPcs+JfVBtpPbTcZscnzUdmiIvxv8Gcin6sNSibM6in/uUKFt3bVgW/XeMYa7MLGF53kvBSwi78poUDigA2n12SmghLR0AHxyEDIgZGOTbNI33GWu7ZsPBeUdGu55R8w=";
    window.Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("/localization/zh-CHS.xml", true);

    var options = new window.Stimulsoft.Designer.StiDesignerOptions();
    // options.appearance.fullScreenMode = false;
    options.appearance.scrollbarsMode = true;
    options.toolbar.showDesignButton = true;
    options.appearance.fullScreenMode = true;
    options.toolbar.printDestination = window.Stimulsoft.Viewer.StiPrintDestination.Direct;
    options.appearance.htmlRenderMode = window.Stimulsoft.Report.Export.StiHtmlExportMode.Table;
    new window.Stimulsoft.Designer.StiDesigner(options, "StiDesigner", false);
    console.log("Create the report designer with specified options");
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val);
    },
    lang(val) {
      this.setLanguage(val);
      this.setHtmlTitle();
    },
    $route() {
      this.setHtmlTitle();
    },
    "theme.mode": function(val) {
      let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`);
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage);
    },
    "theme.color": function(val) {
      let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`);
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage);
    },
    layout: function() {
      window.dispatchEvent(new Event("resize"));
    },
  },
  computed: {
    ...mapState("setting", ["layout", "theme", "weekMode", "lang"]),
  },
  methods: {
    ...mapMutations("setting", ["setDevice"]),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add("week-mode");
      } else {
        document.body.classList.remove("week-mode");
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang;
      switch (lang) {
        case "CN":
          this.locale = require("ant-design-vue/es/locale-provider/zh_CN").default;
          break;
        case "HK":
          this.locale = require("ant-design-vue/es/locale-provider/zh_TW").default;
          break;
        case "US":
        default:
          this.locale = require("ant-design-vue/es/locale-provider/en_US").default;
          break;
      }
    },
    setHtmlTitle() {
      const route = this.$route;
      const key = route.path === "/" ? "home.name" : getI18nKey(route.matched[route.matched.length - 1].path);
      document.title = process.env.VUE_APP_NAME + " | " + this.$t(key);
    },
    popContainer() {
      return document.getElementById("popContainer");
    },
  },
};
</script>

<style lang="less">
.ant-table-column-title {
  font-size: 700;
  color: #000;
}
.ant-input[disabled],
.ant-select-disabled,
.ant-input-number-disabled {
  color: rgba(0, 0, 0, 0.5);
}
.operator {
  margin-bottom: 10px;
}
</style>

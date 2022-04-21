<!--
 * @Author: max
 * @Date: 2022-04-21 13:41:03
 * @LastEditTime: 2022-04-21 17:19:36
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/efficiency.vue
-->
<template>
  <div>
    <iframe style="width: 100%;height:100vh" :src="datavUrl"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      datavUrl: "",
      BASE_URL_MOCK: "",
    };
  },
  created() {
    let paramsArray = this.$route.path.split("&");
    console.log(paramsArray);
    if (process.env.NODE_ENV == "production") {
      //正式服
      this.BASE_URL_MOCK = "http://" + window.location.host;
    } else {
      //测试
      this.BASE_URL_MOCK = "http://192.168.1.245:8080";
    }
    let time = Date.now()
    this.datavUrl = this.BASE_URL_MOCK + `/datav/efficiency.html?t=${time}`;
    console.log(this.datavUrl);
  },
  components: {},
};
</script>

<style></style>

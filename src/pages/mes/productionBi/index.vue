<!--
 * @Author: max
 * @Date: 2021-12-10 09:39:43
 * @LastEditTime: 2022-02-07 10:18:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/index.vue
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
      this.BASE_URL_MOCK = window.location.host
    } else {
      //测试
      this.BASE_URL_MOCK = "http://192.168.1.245:8080";
    }
    this.datavUrl ="http://" + this.BASE_URL_MOCK + `/datav/#/?${paramsArray[1]}&${paramsArray[2]}&${paramsArray[3]}&${paramsArray[4]}`;
    console.log(this.datavUrl);
  },
  components: {},
};
</script>

<style></style>

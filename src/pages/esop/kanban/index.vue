<!--
 * @Author: max
 * @Date: 2021-12-10 09:39:43
 * @LastEditTime: 2022-12-26 10:17:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/kanban/index.vue
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
      this.datavUrl = this.BASE_URL_MOCK + `/datav/esop.html?&${paramsArray[1]}&${paramsArray[2]}`;
      console.log(this.datavUrl);
    },
    components: {},
  };
  </script>
  
  <style></style>
  
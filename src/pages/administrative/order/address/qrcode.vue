<!--
 * @Author: max
 * @Date: 2022-05-11 11:49:26
 * @LastEditTime: 2023-04-08 14:44:50
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/administrative/order/address/qrcode.vue
-->

<template>
  <div>
    <a-modal title="点餐二维码" v-if="visible" :visible="visible" :footer="null" destoryOnClose @cancel="handleCancel">
      <vue-qr :text="hostUrl + '/order/#/?addressId=' + qrData.Id" :margin="0" colorDark="#000" colorLight="#fff" :callback="qrBack" :size="300"></vue-qr>
      <a-button type="primary" @click="downQr">下载二维码</a-button>
    </a-modal>
  </div>
</template>

<script>
import vueQr from "vue-qr";
export default {
  props: ["qrData"],
  components: { vueQr },
  data() {
    return {
      user: [],
      visible: true,
      qrUrl: "",
      hostUrl: "",
    };
  },
  created() {
    if (process.env.NODE_ENV == "production") {
      //正式服
      this.hostUrl = "https://www.up-ims.com:7005";
    } else {
      //测试
      this.hostUrl = "http://192.168.1.245:8080";
    }
  },
  methods: {
    handleCancel() {
      this.$emit("closeModal");
    },
    qrBack(url) {
      this.qrUrl = url;
    },
    downQr() {
      let a = document.createElement("a");
      a.style.display = "none";
      a.download = this.qrData.Place;
      a.href = this.qrUrl;
      document.body.appendChild(a);
      a.click();
    },
  },
};
</script>

<style lang="less" scoped>
.rowActive {
  background: #000;
}
.form-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
/deep/.ant-form-item {
  margin-bottom: 5px;
}
</style>

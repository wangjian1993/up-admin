<!--
 * @Author: max
 * @Date: 2022-03-31 13:52:56
 * @LastEditTime: 2022-03-31 14:42:59
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/deviceBind/preview.vue
-->
<template>
  <div>
    <a-modal title="附件预览" :visible="visible" v-if="visible" @cancel="handleCancel" destoryOnClose :footer="null" width="50%">
      <div class="preview-box">
          <div v-if="previewRecord.FileType == 'image'">
              <img :src="'http://192.168.1.245:8080' + previewRecord.FilePath" alt="">
          </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: ["previewRecord"],
  data() {
    return {
      visible: true,
    };
  },
  created() {},
  methods: {
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.preview-box{
    height:300px;
}
</style>

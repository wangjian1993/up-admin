<!--
 * @Author: max
 * @Date: 2022-03-31 13:52:56
 * @LastEditTime: 2022-04-01 14:41:01
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/esop/components/preview.vue
-->
<template>
  <div>
    <a-modal title="附件预览" :visible="visible" v-if="visible" @cancel="handleCancel" destoryOnClose :footer="null" width="50%">
      <div class="preview-box">
        <div v-if="previewRecord.FileType == 'image'">
          <img :src="'http://192.168.1.245:8080' + previewRecord.FilePath" alt="" />
        </div>
        <div v-if="previewRecord.FileType == 'video'">
          <!-- <video :src="'http://192.168.1.245:8080' + previewRecord.FilePath"></video> -->
          <video ref="videoPlayer" controls :src="'http://192.168.1.245:8080' + previewRecord.FilePath" :poster="posterUrl" controlslist="nodownload" :class="[porel, fullwidth, mal, fla, mat, 'movie-show-video']" style="width: 100%; height: 100%; object-fit: fill"></video>
        </div>
        <div v-if="previewRecord.FileType == 'pdf'">
          <pdf ref="morePDF" :src="'http://192.168.1.245:8080' + previewRecord.FilePath"></pdf>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import pdf from "vue-pdf";
export default {
  props: ["previewRecord"],
  components: {
    pdf,
  },
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
</style>

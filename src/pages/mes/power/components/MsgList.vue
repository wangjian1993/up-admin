<!--
 * @Author: max
 * @Date: 2021-12-15 15:47:15
 * @LastEditTime: 2021-12-15 16:08:42
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/components/MsgList.vue
-->
<template>
  <div>
    <a-list size="small" bordered :data-source="listData" style="height:180px;overflow: auto;">
      <a-list-item slot="renderItem" slot-scope="item" :split="false">
        <span :style="!item.IsSuccess ? 'color:red' : 'color:#0223e0'">[{{ item.time }}] {{ item.content }}</span>
      </a-list-item>
    </a-list>
    <a-button style="margin:5px 0;" type="primary" icon="delete" @click="closeListData">
      清空消息
    </a-button>
  </div>
</template>

<script>
export default {
  props: ["listData",'IsSuccess'],
  data() {
    return {};
  },
  methods: {
    closeListData() {
        this.$emit('closeList')
    },
  },
  components: {},
};
</script>

<style></style>

<!--
 * @Author: max
 * @Date: 2021-09-02 18:16:28
 * @LastEditTime: 2021-12-23 17:08:43
 * @LastEditors: max
 * @Description: 导入生产日计划
 * @FilePath: /up-admin/src/pages/home/production/process/components/print.vue
-->
<template>
  <a-modal v-model="visible" title="打印生产投料单" v-if="visible" @cancel="close" :footer="null" centered width="50%">
    <a-button style="float:right" type="primary" class="no-print" @click="updatedStatu" v-print="'#printTest'">打印</a-button>
    <div id="printTest">
      <div class="content" v-for="(item, index) in printData" :key="item.id" :style="(index + 1) % 4 == 0 ? 'page-break-after:always' : ''">
        <div class="content-top">
          <div class="head-img"><img src="@/assets/img/mb.png" alt="" /></div>
          <div class="head-title">
            <p>物料标识卡</p>
          </div>
          <div class="head-qr"><vue-qr :text="item.QrCode" :size="300"></vue-qr></div>
        </div>
        <div class="info">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="订单">
              {{ item.MoCode }}
            </a-descriptions-item>
            <a-descriptions-item label="工单号">
              {{ item.MoCode }}
            </a-descriptions-item>
            <a-descriptions-item label="日期/时间">
              {{ item.DateTime }}
            </a-descriptions-item>
            <a-descriptions-item label="数量">
              {{ item.Qty }}
            </a-descriptions-item>
            <a-descriptions-item label="品号">
              {{ item.MitemCode }}
            </a-descriptions-item>
            <a-descriptions-item label="品名">
              {{ item.MitemName }}
            </a-descriptions-item>
            <a-descriptions-item label="生产车间">
              {{ item.WorkShopName }}
            </a-descriptions-item>
            <a-descriptions-item label="拉">
              {{ item.LineName }}
            </a-descriptions-item>
             <a-descriptions-item label="备注">
              {{ item.Remarks }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { setPrintInfo } from "@/services/web.js";
import vueQr from "vue-qr";
export default {
  props: ["printData"],
  components: { vueQr },
  data() {
    return {
      data: [],
      isSearch: false,
      isUserList: false,
      visible: true,
    };
  },
  created() {
    console.log(this.printData);
  },
  methods: {
    close() {
      this.$emit("closeModal");
      this.data = [];
    },
    updatedStatu() {
      console.log("打印=====");
      let parmas = [];
      this.printData.map((item) => {
        parmas.push({
          Id: item.Id,
          Remarks:item.Remarks,
          Status: "PRINTED",
        });
      });
      setPrintInfo(parmas, "mitemupdate").then((res) => {
        if (res.data.success) {
          this.$message.success("打印成功!");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.content {
  margin: 8px auto;
  border: 1px #000 solid;
}
.head-img {
  text-align: center;
  width: 200px;
  height: 50px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-qr {
  text-align: center;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  margin-top: 5px;
  img {
    width: 100%;
    height: 100%;
  }
}
.head-title {
  text-align: center;
  p {
    padding: 0;
    margin: 0;
    font-size: 18px;
    color: #000;
    font-weight: 700;
  }
}
.info {
  margin: 0 auto;
  // border: 1px #000 solid;
  padding: 5px 10px;
  border-bottom: none;
}
/deep/.ant-descriptions-item {
  padding-bottom: 2px;
}
/deep/.ant-descriptions-item-label {
  font-size: 10px;
}
/deep/.ant-descriptions-item-content {
  font-size: 10px;
}
/deep/.ant-table-small {
  border: 1px #000 solid;
  // border-top: none;
  // border-bottom: none;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th {
  // border: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
  font-size: 10px;
}
/deep/.ant-table-body {
  margin: 0;
}
/deep/.ant-table-column-title {
  font-size: 10px;
}
/deep/.ant-table-thead > tr > th {
  border-bottom: 1px #000 solid;
}
/deep/.ant-table-bordered .ant-table-thead > tr > th,
.ant-table-bordered .ant-table-tbody > tr > td {
  border-right: 1px #000 solid;
}
/deep/.ant-table-tbody > tr > td {
  border-bottom: 1px #000 solid;
}
/deep/.ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
.print-footer,
.content-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  p {
    flex: 3;
    text-align: center;
    padding: 2px 0;
    margin: 0;
  }
}
</style>

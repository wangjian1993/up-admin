<!--
 * @Author: max
 * @Date: 2021-12-22 16:01:33
 * @LastEditTime: 2022-10-27 17:26:38
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/power/process/components/setQty.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="投料" @cancel="close" :footer="null" centered width="30%">
      <a-descriptions :column="1">
        <a-descriptions-item label="生产工厂/车间/产线"> {{ bomData.PlantName }}/{{ bomData.WorkshopName }}/{{ bomData.LineName }} </a-descriptions-item>
        <a-descriptions-item label="所需料号">
          {{ bomData.MitemCode }}
        </a-descriptions-item>
        <a-descriptions-item label="所需料名">
          {{ bomData.MitemName }}
        </a-descriptions-item>
        <a-descriptions-item label="需要投料数量">
          {{ bomData.StandardQty }}
        </a-descriptions-item>
        <a-descriptions-item label="已投料数量">
          {{ bomData.ReleasedQty }}
        </a-descriptions-item>
        <a-descriptions-item label="剩余可投料数量">
          {{ inputValue }}
        </a-descriptions-item>
        <a-descriptions-item label="投料数量">
          <a-input-number id="inputNumber" v-model="ReleaseQty" :min="0" :max="inputValue" />
        </a-descriptions-item>
        <a-descriptions-item label="投料扫码">
          <a-input style="width:400px;" allowClear v-model.trim="PurchaseNo" placeholder="" @change="inputChange" @blur="inputBlur()" @pressEnter="handleOk" auto-size />
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
import { getReleases, getProcessReport } from "@/services/mes.js";
export default {
  props: ["orderInfo", "bomInfo"],
  data() {
    return {
      bomData: [],
      visible: true,
      ReleaseQty: 0,
      PurchaseNo: "",
      inputValue:0
    };
  },
  created() {
    this.getBom();
  },
  methods: {
    closeModal() {
      this.isPrint = true;
    },
    close() {
      this.$emit("closeModal");
    },
    getBom() {
      let params = {
        mocode: this.orderInfo.MoCode,
        lineid: this.orderInfo.LineId,
        mitemcode: this.bomInfo.MitemCode,
      };
      getReleases(params, "getbom").then((res) => {
        console.log(res);
        if (res.data.success) {
          console.log(res);
          this.bomData = res.data.data;
          this.inputValue = this.bomData.StandardQty - this.bomData.ReleasedQty
        }
      });
    },
    inputChange(e) {
      const { value } = e.target;
      if (!value && e.type !== "change") {
        // do something
        this.emptyData();
      }
    },
    emptyData() {
      this.PurchaseNo = "";
    },
    handleOk(e) {
    //   e.currentTarget.select();
      if (e.keyCode == 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
      }
      if (this.ReleaseQty == 0) {
        this.$message.error("请先输入投料数量");
        return;
      }
      if (!this.PurchaseNo) {
        this.$message.error("请先输入工单号，或者扫描工单二维码");
        return;
      }
      let params = {
        PlantId: this.bomData.PlantId,
        LineId: this.bomData.LineId,
        MoCode: this.bomData.MoCode,
        MitemCode: this.bomData.MitemCode,
        ReleasedQty: this.bomData.ReleasedQty,
        ReleaseQty: this.ReleaseQty,
        PurchaseNo: this.PurchaseNo,
      };
      getProcessReport(params, "release/sumbit").then((res) => {
        if (res.data.success) {
          console.log(res);
          this.$emit("closeModal");
          this.$emit('success');
          this.$message.success("投料成功")
        }
      });
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
/deep/.ant-table {
  min-height: 0vh;
}
</style>

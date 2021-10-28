<!--
 * @Author: max
 * @Date: 2021-10-07 15:16:07
 * @LastEditTime: 2021-10-28 18:26:55
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/scm/masterPlan/BatchApprove.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="手动匹配" @cancel="close" @ok="handleOk" centered width="70%">
      <div class="search-box">
        <a-row>
          <a-col :lg="24">
            <a-form layout="inline" :form="searchForm" class="form-box">
              <a-row>
                <a-col :xl="6" :lg="8" :md="6" :sm="24"
                  ><div style="margin-left:20px">
                    <a-form-item label="生产工厂:">
                      <a-select style="width: 200px" v-decorator="['plantid']" placeholder="请选择生产工厂">
                        <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div></a-col
                >
                <a-col :xl="6" :lg="8" :md="6" :sm="6"
                  ><div style="margin-left:20px">
                    <a-form-item label="计划批次:">
                      <a-input placeholder="物料需求计划批次号" allowClear style="width:200px" v-decorator="['BatchNo']" />
                    </a-form-item></div
                ></a-col>

                <a-col :xl="6" :lg="8" :md="6" :sm="6"
                  ><div style="margin-left:20px">
                    <a-form-item label="物料编码:">
                      <a-input placeholder="请选择物料编码" allowClear style="width:200px" v-decorator="['MitemCode']" />
                    </a-form-item></div
                ></a-col>

                <a-col :xl="6" :lg="8" :md="6" :sm="6">
                  <div style="margin-left:20px">
                    <a-form-item label="物料名称:">
                      <span>{{ mitemList.MitemName }}</span>
                    </a-form-item>
                  </div></a-col 
                >
                <a-col :xl="6" :lg="8" :md="6" :sm="6">
                  <div style="margin-left:20px">
                    <a-form-item label="需求日期:">
                      <span>{{ mitemList.RequirementDate }}</span>
                    </a-form-item>
                  </div></a-col
                >
                <a-col :xl="6" :lg="8" :md="6" :sm="6">
                  <div style="margin-left:20px">
                    <a-form-item label="需求数量:"> 
                      <span>{{ mitemList.RequirementQty }}</span>
                    </a-form-item>
                  </div></a-col
                >
                <a-col :xl="6" :lg="8" :md="6" :sm="6"
                  ><span style="margin-left:20px;margin-top:-5px">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                  </span></a-col
                >
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </div>
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="batchData" :size="size" :pagination="pagination" bordered>
            <div slot="QTQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.QTQty" v-model="record.QTQty" />
            </div>
            <div slot="QualifiedQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.QualifiedQty" v-model="record.QualifiedQty" />
            </div>
            <div slot="ReturnQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.ReturnQty" v-model="record.ReturnQty" />
            </div>
            <div slot="ScrapQty" slot-scope="text, record">
              <a-input-number allowClear :min="0" :value="record.ScrapQty" v-model="record.ScrapQty" />
            </div>
          </a-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    align: "center",
    width: "5%",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantName",
    scopedSlots: { customRender: "PlantName" },
    align: "center",
    width: "100px",
  },
  {
    title: "供应商",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
    width: "10%",
  },
  {
    title: "BOM号",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "产品型号",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: " 产品规格",
    dataIndex: "MitemSpec",
    align: "center",
    width: "20%",
  },
  {
    title: "行项目",
    dataIndex: "SequenceNumber",
    scopedSlots: { customRender: "SequenceNumber" },
    align: "center",
    width: "80px",
  },
  {
    title: "到货数量",
    dataIndex: "Qty",
    scopedSlots: { customRender: "Qty" },
    align: "center",
    width: "80px",
  },
  {
    title: "检验数量",
    dataIndex: "QTQty",
    scopedSlots: { customRender: "QTQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "合格数量",
    dataIndex: "QualifiedQty",
    scopedSlots: { customRender: "QualifiedQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "退货数量",
    dataIndex: "ReturnQty",
    scopedSlots: { customRender: "ReturnQty" },
    align: "center",
    width: "80px",
  },
  {
    title: "报废数量",
    dataIndex: "ScrapQty",
    scopedSlots: { customRender: "ScrapQty" },
    align: "center",
    width: "80px",
  },
];
import { setQualityAction } from "@/services/web.js";
export default {
  props: ["plantList", "matchingData", "isEdit"],
  data() {
    return {
      columns,
      size: "small",
      visible: true,
      pagination: false,
      searchForm: this.$form.createForm(this),
      mitemList: [],
      mitemData: [],
    };
  },
  created() {
    console.log(this.matchingData);
    if (this.matchingData.BatchNo) {
      this.searchForm.setFieldsValue({
        plantid: this.matchingData.PlantId,
        BatchNo: this.matchingData.BatchNo,
        MitemCode: this.matchingData.MitemCode,
      });
      // this.form.BatchNo = this.matchingData.BatchNo;
      // this.form.BatchId = this.matchingData.Id;
      // this.form.MitemCode = this.matchingData.MitemCode;
      this.mitemList.MitemCode = this.matchingData.MitemCode;
      this.mitemList.MitemName = this.matchingData.MitemName;
      this.mitemData.RequirementQty = this.matchingData.RequirementQty;
      // // this.form.MatchQty = this.matchingData.RequirementQty;
      // this.form.RequirementDate = splitData(this.matchingData.RequirementDate);
      // this.batchnoData.BatchId = this.matchingData.Id;
      // this.batchnoData.BatchNo = this.matchingData.BatchNo;
      // this.batchnoData.PlantName = this.matchingData.PlantName;
      // this.batchnoData.PlantId = this.matchingData.PlantId;
      // console.log(this.mitemData);
      // this.getMitemsByBatch();
    }
  },
  methods: {
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      let parmas = [];
      this.batchData.forEach((item) => {
        console.log(item);
        parmas.push({
          PlantCode: item.PlantCode,
          OrderNo: item.OrderNo,
          MitemCode: item.MitemCode,
          SequenceNumber: item.SequenceNumber,
          QTQty: item.QTQty || 0,
          QualifiedQty: item.QualifiedQty || 0,
          ReturnQty: item.ReturnQty || 0,
          ScrapQty: item.ScrapQty || 0,
        });
      });
      setQualityAction(parmas, "approvedmultiple").then((res) => {
        if (res.data.success) {
          this.$message.success("审核成功!");
          this.$emit("succeed");
          this.$emit("closeModal");
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

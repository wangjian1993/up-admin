<!--
 * @Author: max
 * @Date: 2022-02-09 17:33:25
 * @LastEditTime: 2022-02-11 14:45:51
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/shipment/agc/infoPersonal/infoEdit.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="编辑出货单信息" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered  :bodyStyle="{ padding: '5px 10px' }">
      <div style="display:flex;justify-content: flex-end;margin:3px 0;">
        <a-button type="primary" @click="save">提交</a-button>
      </div>
      <a-table :columns="columns" :data-source="data" size="small" :loading="loading" :pagination="false" :rowKey="(data, index) => data.ITEM_CODE" bordered>
        <template slot="PiNumber" slot-scope="text, record">
          <a-input size="small" v-model="record.PiNumber" placeholder="订单号" />
        </template>
        <template slot="CustomerCode" slot-scope="text, record">
          <a-input size="small" v-model="record.CustomerCode" placeholder="客户代码" />
        </template>
        <template slot="ToCountry" slot-scope="text, record">
          <a-input size="small" v-model="record.ToCountry" placeholder="出货国家" />
        </template>
        <template slot="Quantity" slot-scope="text, record">
          <a-input-number size="small" v-model="record.Quantity" :min="0" />
        </template>
        <template slot="ShipmentAgency" slot-scope="text, record">
          <a-input size="small" v-model="record.ShipmentAgency" placeholder="货代" />
        </template>
        <template slot="Channel" slot-scope="text, record">
          <a-select style="width: 80px" placeholder="选择渠道" size="small" v-model="record.Channel">
            <a-select-option v-for="item in expressList" :key="item.ParamId" :value="item.ParamName">
              {{ item.ParamName }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="Clause" slot-scope="text, record">
          <a-select style="width: 80px" placeholder="选择条款" size="small" v-model="record.Clause">
            <a-select-option v-for="item in clauseList" :key="item.ParamName">
              {{ item.ParamName }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="Currency" slot-scope="text, record">
          <a-select style="width: 80px" placeholder="选择条款" size="small" v-model="record.Currency">
            <a-select-option v-for="item in currencyList" :key="item.ParamName">
              {{ item.ParamName }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="ShipmentAmount" slot-scope="text, record">
          <a-input-number :min="0" size="small" v-model="record.ShipmentAmount" />
        </template>
        <template slot="IsApplyCustoms" slot-scope="text, record">
          <a-select style="width: 80px" placeholder="选择是否报关" size="small" v-model="record.IsApplyCustoms">
            <a-select-option value="1">
              报关
            </a-select-option>
            <a-select-option value="0">
              不报关
            </a-select-option>
          </a-select>
        </template>
        <template slot="NotApplyReason" slot-scope="text, record">
          <a-select style="width: 100px" placeholder="选择理由" size="small" v-model="record.NotApplyReason">
            <a-select-option v-for="item in reasonList" :key="item.ParamName">
              {{ item.ParamName }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="DetailReason" slot-scope="text, record">
          <a-input v-model="record.DetailReason" size="small" />
        </template>
        <template slot="DeclaredBrand" slot-scope="text, record">
          <a-select style="width: 100px" placeholder="选择品牌" size="small" v-model="record.DeclaredBrand">
            <a-select-option v-for="item in brandList" :key="item.ParamName">
              {{ item.ParamName }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="GoodsFinishTime" slot-scope="text, record">
          <a-date-picker size="small" :disabled-date="disabledDate" v-model="record.GoodsFinishTime" @change="GoodsExamineTimeChange" />
        </template>
        <template slot="GoodsPickTime" slot-scope="text, record">
          <a-date-picker size="small" :disabled-date="disabledDate" v-model="record.GoodsPickTime" @change="GoodsPickTimeChange" />
        </template>
        <template slot="Remark" slot-scope="text, record">
          <a-input size="small" v-model="record.Remark" />
        </template>
      </a-table>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: "业务订单号",
    dataIndex: "PiNumber",
    scopedSlots: { customRender: "PiNumber" },
    align: "center",
  },
  {
    title: "客户代码",
    dataIndex: "CustomerCode",
    scopedSlots: { customRender: "CustomerCode" },
    align: "center",
  },
  {
    title: "出货国家",
    dataIndex: "ToCountry",
    scopedSlots: { customRender: "ToCountry" },
    align: "center",
  },
  {
    title: "出货数量",
    dataIndex: "Quantity",
    scopedSlots: { customRender: "Quantity" },
    align: "center",
  },
  {
    title: "货代",
    dataIndex: "ShipmentAgency",
    scopedSlots: { customRender: "ShipmentAgency" },
    align: "center",
  },
  {
    title: "渠道",
    dataIndex: "Channel",
    scopedSlots: { customRender: "Channel" },
    align: "center",
  },
  {
    title: "条款",
    dataIndex: "Clause",
    scopedSlots: { customRender: "Clause" },
    align: "center",
  },
  {
    title: "币种",
    dataIndex: "Currency",
    scopedSlots: { customRender: "Currency" },
    align: "center",
  },
  {
    title: "出货金额",
    dataIndex: "ShipmentAmount",
    scopedSlots: { customRender: "ShipmentAmount" },
    align: "center",
  },
  {
    title: "是否报关",
    dataIndex: "IsApplyCustoms",
    scopedSlots: { customRender: "IsApplyCustoms" },
    align: "center",
  },
  {
    title: "不报关理由",
    dataIndex: "NotApplyReason",
    scopedSlots: { customRender: "NotApplyReason" },
    align: "center",
  },
  {
    title: "具体原因",
    dataIndex: "DetailReason",
    scopedSlots: { customRender: "DetailReason" },
    align: "center",
  },
  {
    title: "申报品牌",
    dataIndex: "DeclaredBrand",
    scopedSlots: { customRender: "DeclaredBrand" },
    align: "center",
  },
  {
    title: "货好时间",
    dataIndex: "GoodsFinishTime",
    scopedSlots: { customRender: "GoodsFinishTime" },
    align: "center",
  },
  {
    title: "预计提货时间",
    dataIndex: "GoodsPickTime",
    scopedSlots: { customRender: "GoodsPickTime" },
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
  },
];
import { setShipmentAgc } from "@/services/shipment.js";
import { getParamData } from "@/services/admin.js";
import moment from "moment";
export default {
  props: ["editData"],
  data() {
    return {
      data: [],
      columns,
      loading: false,
      expressList: [],
      currencyList: [], //币种
      clauseList: [], //渠道
      reasonList: [], //不报关理由
      brandList: [], //品牌
      visible: true,
    };
  },
  created() {
    this.getparamsData();
    this.data.push(this.editData);
  },
  methods: {
    moment,
    reset() {
      this.data = [];
    },
    //数量转换为数字
    close() {
      this.$emit("closeModal");
    },
    disabledDate(current) {
      return current && current < moment().endOf("day");
    },
    disabledDate1(current) {
      return current && current < moment().endOf("day");
    },
    getparamsData() {
      getParamData({
        groupcode: "CHANNEL",
      }).then((res) => {
        if (res.data.success) {
          this.expressList = res.data.data;
        }
      });
      //币种
      getParamData({
        groupcode: "currency",
      }).then((res) => {
        if (res.data.success) {
          this.currencyList = res.data.data;
        }
      });
      //条款
      getParamData({
        groupcode: "clause",
      }).then((res) => {
        if (res.data.success) {
          this.clauseList = res.data.data;
        }
      });
      //理由
      getParamData({
        groupcode: "NOTHING_TO_DECLARE",
      }).then((res) => {
        if (res.data.success) {
          this.reasonList = res.data.data;
        }
      });
      //品牌
      getParamData({
        groupcode: "BRAND",
      }).then((res) => {
        if (res.data.success) {
          this.brandList = res.data.data;
        }
      });
    },
    GoodsExamineTimeChange(value, dateString) {
      this.data[0].GoodsExamineTime = dateString;
    },
    GoodsPickTimeChange(value, dateString) {
      this.data[0].GoodsPickTime = dateString;
    },
    save() {
      console.log(this.data[0]);
      console.log(this.data[0]);
      let params = {
        Action: "EDIT",
        PlantList: [],
      };
      if (this.data[0].PiNumber == "") {
        this.$message.warning("填写订单号!");

        return;
      }
      if (this.data[0].Currency == "") {
        this.$message.warning("选择币种!");

        return;
      }
      if (this.data[0].IsApplyCustoms == "") {
        this.$message.warning("选择是否报关!");

        return;
      }
      if (this.data[0].Quantity == "") {
        this.$message.warning("填写出货数量!");

        return;
      }
      if (this.data[0].ShipmentAmount == "") {
        this.$message.warning("填写出货金额!");

        return;
      }
      if (this.data[0].IsApplyCustoms == 0 && this.data[0].Currency != "人民币") {
        if (this.data[0].NotApplyReason == "") {
          this.$message.warning("选择不报关理由!");

          return;
        }
        if (this.data[0].NotApplyReason == "大于200美金(或等同价值)请写具体原因") {
          if (this.data[0].ShipmentAmount < 200) {
            this.$message.warning("金额必须大于200!");
            return;
          }
        }
        if (this.data[0].ShipmentAmount >= 200 && this.data[0].NotApplyReason == "大于200美金(或等同价值)请写具体原因" && this.data[0].DetailReason == "") {
          this.$message.warning("填写具体原因!");
          return;
        }
        if (this.data[0].NotApplyReason == "小于200美金(或等同价值样品不报关)") {
          if (this.data[0].ShipmentAmount >= 200) {
            this.$message.warning("金额必须小于200!");
            return;
          }
        }
      }
      params.PlantList.push({
        Id: this.data[0].Id,
        PiNumber: this.data[0].PiNumber,
        ToCountry: this.data[0].ToCountry,
        Quantity: this.data[0].Quantity,
        ShipmentAgency: this.data[0].ShipmentAgency,
        Channel: this.data[0].Channel,
        Clause: this.data[0].Clause,
        IsApplyCustoms: this.data[0].IsApplyCustoms,
        NotApplyReason: this.data[0].NotApplyReason,
        DetailReason: this.data[0].DetailReason,
        DeclaredBrand: this.data[0].DeclaredBrand,
        GoodsFinishTime: this.data[0].GoodsFinishTime,
        GoodsPickTime: this.data[0].GoodsPickTime,
        Remark: this.data[0].Remark,
        CustomerCode: this.data[0].CustomerCode,
        Currency: this.data[0].Currency,
        ShipmentAmount: this.data[0].ShipmentAmount,
        StatusCheck: this.data[0].StatusCheck,
      });
      console.log(params);
      setShipmentAgc(params).then((res) => {
        if (res.data.success) {
          this.reset();
          this.$message.success("提交成功!");
          this.$emit("success");
          this.$emit("closeModal");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 60vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
</style>

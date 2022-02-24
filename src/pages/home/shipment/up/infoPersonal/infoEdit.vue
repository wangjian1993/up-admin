<!--
 * @Author: max
 * @Date: 2022-02-09 17:33:25
 * @LastEditTime: 2022-02-24 10:23:46
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/shipment/up/infoPersonal/infoEdit.vue
-->
<template>
  <div>
    <a-drawer :visible="visible" title="编辑出货单信息" placement="right" @close="close" :get-container="false" :wrap-style="{ position: 'absolute' }" width="100%" :footer="null" centered :headerStyle="{ padding: '5px 20px' }" :bodyStyle="{ padding: '5px 10px' }">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="业务订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" placeholder="请输入业务订单号" disabled v-decorator="['pinumber']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-button icon="save" style="margin-left: 8px" type="primary" @click="save" :disabled="selectedRowKeys.length == 0">提交</a-button>
              </a-col>
            </a-row>
          </div>
        </a-form>
        <a-descriptions layout="vertical" bordered size="small" :column="9">
          <a-descriptions-item label="业务订单号">
            {{ editData.PiNumber }}
          </a-descriptions-item>
          <a-descriptions-item label="客户代码">
            {{ editData.CustomerCode }}
          </a-descriptions-item>
          <a-descriptions-item label="出货国家">
            {{ editData.ToCountry }}
          </a-descriptions-item>
          <a-descriptions-item label="出货方式">
            <a-select style="width: 130px" placeholder="选择出货方式" v-model="saveParmas.ShipmentWay">
              <a-select-option v-for="item in expressList" :key="item.ParamName">
                {{ item.ParamName }}
              </a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item label="是否验货">
            <a-select style="width: 130px" v-model="saveParmas.IsExamine" placeholder="选择是否验货">
              <a-select-option value="1">
                是
              </a-select-option>
              <a-select-option value="0">
                否
              </a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item label="约定验货时间">
            <a-date-picker style="width: 130px" :disabled-date="disabledDate" v-model="saveParmas.GoodsExamineTime" @change="GoodsExamineTimeChange" />
          </a-descriptions-item>
          <a-descriptions-item label="约定提货时间">
            <a-date-picker style="width: 130px" :disabled-date="disabledDate1" v-model="saveParmas.GoodsPickTime" @change="GoodsPickTimeChange" />
          </a-descriptions-item>
          <a-descriptions-item label="生产工厂">
            <a-select v-model="saveParmas.PlantName" style="width: 150px" placeholder="请选择生产工厂">
              <a-select-option v-for="item in plantList" :key="item.PlantName" :value="item.PlantName">{{ item.PlantName }}</a-select-option>
            </a-select>
          </a-descriptions-item>
          <a-descriptions-item label="备注">
            <a-input placeholder="请输入备注" v-model="saveParmas.Remark" />
          </a-descriptions-item>
        </a-descriptions>
        <a-table
          :columns="columns"
          :data-source="data"
          size="small"
          :loading="loading"
          :pagination="false"
          :rowKey="(data, index) => data.ItemCode"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            getCheckboxProps: getCheckboxProps,
          }"
          bordered
        >
          <template slot="ShipmentQtyNow" slot-scope="text, record">
            <a-input-number :min="0" :value="text" @change="(e) => handleChange(e, record.ItemCode, 'ShipmentQtyNow')" />
          </template>
        </a-table>
      </a-card>
    </a-drawer>
  </div>
</template>

<script>
const columns = [
  {
    title: "品号",
    dataIndex: "ItemCode",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ItemName",
    scopedSlots: { customRender: "ItemName" },
    align: "center",
  },
  {
    title: "规格",
    dataIndex: "ItemSpecification",
    scopedSlots: { customRender: "ItemSpecification" },
    align: "center",
  },
  {
    title: "订单数量",
    dataIndex: "ShipmentQtyOrder",
    scopedSlots: { customRender: "ShipmentQtyOrder" },
    align: "center",
  },
  {
    title: "本次出货数量",
    dataIndex: "ShipmentQtyNow",
    scopedSlots: { customRender: "ShipmentQtyNow" },
    align: "center",
  },
];
import { renderStripe } from "@/utils/stripe.js";
import { getOrderInfo, getPlantList, editShipment } from "@/services/shipment.js";
import { getParamData } from "@/services/admin.js";
import moment from "moment";
export default {
  props: ["editData"],
  data() {
    return {
      data: [],
      columns,
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      orderInfo: [],
      expressList: [], //快递类型
      plantList: [],
      saveParmas: {
        Id: "",
        ShipmentWay: "",
        IsExamine: "",
        GoodsExamineTime: "",
        GoodsPickTime: "",
        PlantName: "",
        Remark: "",
        PlantChild: [],
      },
      visible: true,
    };
  },
  updated() {
    renderStripe();
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  created() {
    this.getParmasData();
    this.getPlantList();
    console.log(this.editData);
    this.$nextTick(() => {
      this.searchForm.setFieldsValue({
        pinumber: this.editData.PiNumber,
      });
      this.saveParmas.Id = this.editData.Id;
      this.saveParmas.ShipmentWay = this.editData.ShipmentWay;
      this.saveParmas.IsExamine = this.editData.IsExamine;
      this.saveParmas.GoodsExamineTime = this.editData.GoodsExamineTime;
      this.saveParmas.GoodsPickTime = this.editData.GoodsPickTime;
      this.saveParmas.PlantName = this.editData.PlantName;
      this.saveParmas.Remark = this.editData.Remark;
      this.data = this.editData.group;
      this.data.map((item) => {
        this.selectedRowKeys.push(item.ItemCode);
      });
    });
  },
  methods: {
    moment,
    //数量转换为数字
    numberQty(num) {
      return Number(num);
    },
    close() {
      this.$emit("closeModal");
    },
    disabledDate(current) {
      return current < moment().add(7, "days");
    },
    disabledDate1(current) {
      return current < moment().add(10, "days");
    },
    //禁用多选
    getCheckboxProps: () => ({
      props: {
        disabled:true, // Column configuration not
      },
    }),
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter((item) => key === item.ItemCode)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    getPlantList() {
      let parmas = {
        entertypecode: "PLANT",
      };
      getPlantList(parmas).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getParmasData() {
      let parmas = {
        groupcode: "SHIPPING_METHOD",
      };
      getParamData(parmas).then((res) => {
        if (res.data.success) {
          this.expressList = res.data.data;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.searchForm.resetFields();
      this.data = [];
      this.orderInfo = [];
      this.saveParmas = {
        PiNumber: "",
        CustomerCode: "",
        ToCountry: "",
        ShipmentWay: "",
        IsExamine: "",
        GoodsExamineTime: "",
        GoodsPickTime: "",
        PlantName: "",
        Remark: "",
        PlantChild: [],
      };
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          this.pagination.total = 0;
          let parmas = {
            pinumber: values.pinumber,
          };
          getOrderInfo(parmas).then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              this.orderInfo = this.data[0];
              this.data.map((item) => {
                item.ShippingQty = item.BUSINESS_QTY;
              });
              this.loading = false;
            }
          });
          // do something
        }
      });
    },
    GoodsExamineTimeChange(value, dateString) {
      this.saveParmas.GoodsExamineTime = dateString;
    },
    GoodsPickTimeChange(value, dateString) {
      this.saveParmas.GoodsPickTime = dateString;
    },
    save() {
      if (this.saveParmas.ShipmentWay == "") {
        this.$message.warning("请选择出货方式!");
        return;
      }
      if (this.saveParmas.ShipmentWay == "") {
        this.$message.warning("请选择出货方式!");
        return;
      }
      if (this.saveParmas.ShipmentWay == "") {
        this.$message.warning("请选择出货方式!");
        return;
      }
      if (this.saveParmas.IsExamine == "") {
        this.$message.warning("请选择是否验货!");
        return;
      }
      if (this.saveParmas.PlantName == "") {
        this.$message.warning("请选择生产工厂!");
        return;
      }
      console.log(this.saveParmas.GoodsExamineTime);
      if (this.saveParmas.IsExamine == 1 && this.saveParmas.GoodsExamineTime == "") {
        this.$message.warning("请选择验货时间!");
        return;
      }
      if (this.saveParmas.IsExamine == 1 && this.saveParmas.GoodsExamineTime >= this.saveParmas.GoodsPickTime) {
        this.$message.warning("验货时间不能大于提货时间!");
        return;
      }
      if (this.saveParmas.GoodsPickTime == "") {
        this.$message.warning("请选择提货时间!");
        return;
      }
      this.saveParmas.PiNumber = this.orderInfo.PiNumber;
      this.saveParmas.CustomerCode = this.orderInfo.CustomerCode;
      this.saveParmas.ToCountry = this.orderInfo.ToCountry;
      //验货时间
      //提货时间
      this.data.map((item) => {
        if (this.selectedRowKeys.includes(item.ItemCode)) {
          this.saveParmas.PlantChild.push({
            Id: item.Cid,
            ShipmentQtyNow: item.ShipmentQtyNow,
          });
        }
      });
      editShipment(this.saveParmas).then((res) => {
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

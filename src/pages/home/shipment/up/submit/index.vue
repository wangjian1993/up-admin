<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div>
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="业务订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" placeholder="请输入业务订单号" v-decorator="['pinumber']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-button type="primary" icon="search" @click="search" :disabled="!hasPerm('search')">查询</a-button>
              <a-button icon="reload" style="margin-left: 8px" @click="reset" :disabled="!hasPerm('search')">重置</a-button>
              <a-button icon="save" v-if="hasPerm('save')" style="margin-left: 8px" type="primary" @click="save" :disabled="selectedRowKeys.length == 0">提交</a-button>
              <a-button icon="save" v-else style="margin-left: 8px" type="primary" @click="save" disabled>提交</a-button>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <a-descriptions layout="vertical" bordered size="small" :column="9">
        <a-descriptions-item label="业务订单号">
          {{ orderInfo.DOC_NO }}
        </a-descriptions-item>
        <a-descriptions-item label="客户代码">
          {{ orderInfo.CUSTOMER_CODE }}
        </a-descriptions-item>
        <a-descriptions-item label="出货国家">
          {{ orderInfo.TO_COUNTRY }}
        </a-descriptions-item>
        <a-descriptions-item label="出货方式">
          <a-select style="width: 130px" placeholder="选择出货方式" v-model="saveparams.ShipmentWay">
            <a-select-option v-for="item in expressList" :key="item.ParamName">
              {{ item.ParamName }}
            </a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="是否验货">
          <a-select style="width: 130px" v-model="saveparams.IsExamine" placeholder="选择是否验货">
            <a-select-option value="1">
              是
            </a-select-option>
            <a-select-option value="0">
              否
            </a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="约定验货时间">
          <a-date-picker style="width: 130px" :disabled-date="disabledDate" v-model="saveparams.GoodsExamineTime" />
        </a-descriptions-item>
        <a-descriptions-item label="约定提货时间">
          <a-date-picker style="width: 130px" :disabled-date="disabledDate1" v-model="saveparams.GoodsPickTime" />
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂">
          <a-select v-model="saveparams.PlantName" style="width: 150px" placeholder="请选择生产工厂">
            <a-select-option v-for="item in plantList" :key="item.PlantName" :value="item.PlantName">{{ item.PlantName }}</a-select-option>
          </a-select>
        </a-descriptions-item>
        <a-descriptions-item label="备注">
          <a-input placeholder="请输入备注" v-model="saveparams.Remark" />
        </a-descriptions-item>
      </a-descriptions>
      <a-table
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :loading="loading"
        :pagination="pagination"
        :rowKey="(data, index) => data.ITEM_CODE"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
        bordered
      >
        <template slot="ShippingQty" slot-scope="text, record">
          <a-input-number :min="0" :value="text" @change="(e) => handleChange(e, record.ITEM_CODE, 'ShippingQty')" />
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    title: "品号",
    dataIndex: "ITEM_CODE",
    align: "center",
  },
  {
    title: "品名",
    dataIndex: "ITEM_NAME",
    scopedSlots: { customRender: "ITEM_NAME" },
    align: "center",
  },
  {
    title: "规格",
    dataIndex: "ITEM_SPECIFICATION",
    scopedSlots: { customRender: "ITEM_SPECIFICATION" },
    align: "center",
  },
  {
    title: "订单数量",
    dataIndex: "BUSINESS_QTY",
    scopedSlots: { customRender: "BUSINESS_QTY" },
    align: "center",
  },
  {
    title: "本次出货数量",
    dataIndex: "ShippingQty",
    scopedSlots: { customRender: "ShippingQty" },
    align: "center",
  },
];
import { renderStripe } from "@/utils/stripe.js";
import { getOrderInfo, getPlantList, setShipment } from "@/services/shipment.js";
import { getParamData } from "@/services/admin.js";
import moment from "moment";
export default {
  data() {
    return {
      data: [],
      columns,
      loading: false,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20, //每页中显示10条数据
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        pageSizeOptions: ["10", "20", "50", "100"], //每页中显示的数据
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
      },
      selectedRows: [],
      selectedRowKeys: [],
      searchForm: this.$form.createForm(this),
      orderInfo: [],
      expressList: [], //快递类型
      plantList: [],
      saveparams: {
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
      },
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
    this.getparamsData();
    this.getPlantList();
  },
  methods: {
    moment,
    disabledDate(current) {
      return current < moment().add(7, "days");
    },
    disabledDate1(current) {
      return current < moment().add(10, "days");
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      console.log(newData);
      const target = newData.filter((item) => key === item.ITEM_CODE)[0];
      console.log(target);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    getPlantList() {
      let params = {
        entertypecode: "PLANT",
      };
      getPlantList(params).then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
        }
      });
    },
    getparamsData() {
      let params = {
        groupcode: "SHIPPING_METHOD",
      };
      getParamData(params).then((res) => {
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
      this.selectedRowKeys = []
      this.data = [];
      this.orderInfo = [];
      this.saveparams = {
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
          let params = {
            pinumber: values.pinumber,
          };
          getOrderInfo(params).then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              this.orderInfo = this.data[0];
              this.data.map((item) => {
                item.ShippingQty = item.BUSINESS_QTY;
              });
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    save() {
      if (this.saveparams.ShipmentWay == "") {
        this.$message.warning("请选择出货方式!");
        return;
      }
      if (this.saveparams.ShipmentWay == "") {
        this.$message.warning("请选择出货方式!");
        return;
      }
      if (this.saveparams.ShipmentWay == "") {
        this.$message.warning("请选择出货方式!");
        return;
      }
      if (this.saveparams.IsExamine == "") {
        this.$message.warning("请选择是否验货!");
        return;
      }
      if (this.saveparams.PlantName == "") {
        this.$message.warning("请选择生产工厂!");
        return;
      }
      console.log(this.saveparams.GoodsExamineTime);
      if (this.saveparams.IsExamine == 1 && this.saveparams.GoodsExamineTime == "") {
        this.$message.warning("请选择验货时间!");
        return;
      }
      if (this.saveparams.IsExamine == 1 && this.saveparams.GoodsExamineTime >= this.saveparams.GoodsPickTime) {
        this.$message.warning("验货时间不能大于提货时间!");
        return;
      }
      if (this.saveparams.GoodsPickTime == "") {
        this.$message.warning("请选择提货时间!");
        return;
      }
      this.saveparams.PiNumber = this.orderInfo.DOC_NO;
      this.saveparams.CustomerCode = this.orderInfo.CUSTOMER_CODE;
      this.saveparams.ToCountry = this.orderInfo.TO_COUNTRY;
      //验货时间
      if (this.saveparams.GoodsExamineTime != "") {
        this.saveparams.GoodsExamineTime = this.saveparams.GoodsExamineTime.format("YYYY-MM-DD");
      }
      //提货时间
      this.saveparams.GoodsPickTime = this.saveparams.GoodsPickTime.format("YYYY-MM-DD");
      this.data.map((item) => {
        if (this.selectedRowKeys.includes(item.ITEM_CODE)) {
          this.saveparams.PlantChild.push({
            ItemCode: item.ITEM_CODE,
            ItemName: item.ITEM_NAME,
            ItemSpecification: item.ITEM_SPECIFICATION,
            ShipmentQtyOrder: item.BUSINESS_QTY,
            ShipmentQtyNow: item.ShippingQty,
          });
        }
      });
      setShipment(this.saveparams).then((res) => {
        if (res.data.success) {
          this.reset();
          this.$message.success("提交成功!");
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

<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <div style="display:flex;justify-content: flex-end;margin:3px 0;">
        <a-button type="primary" @click="save">提交</a-button>
        <a-button style="margin-left: 8px" @click="reset">重置</a-button>
      </div>
      <a-table :columns="columns" :data-source="data" size="small" :scroll="{ x: 1500 }" :loading="loading" :pagination="false" :rowKey="(data, index) => data.ITEM_CODE" bordered>
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
          <a-input size="small" v-model="record.Quantity"/>
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
            <a-select-option value="报关">
              报关
            </a-select-option>
            <a-select-option value="不报关">
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
          <a-date-picker size="small" :disabled-date="disabledDate" v-model="record.GoodsFinishTime" />
        </template>
        <template slot="GoodsPickTime" slot-scope="text, record">
          <a-date-picker size="small" :disabled-date="disabledDate" v-model="record.GoodsPickTime" />
        </template>
        <template slot="Remark" slot-scope="text, record">
          <a-input size="small" v-model="record.Remark" />
        </template>
        <template slot="action" slot-scope="text, record, index">
          <a-popconfirm title="确定移除?" @confirm="() => onDelete(index)">
            <a style="margin-right: 8px" :disabled="index == 0">
              <a-icon type="delete" />
            </a>
          </a-popconfirm>
        </template>
      </a-table>
      <div class="add-table">
        <a-button type="dashed" style="width:20%" @click="addDomain"> <a-icon type="plus" />添加 </a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
const columns = [
  {
    title: "操作",
    dataIndex: "",
    scopedSlots: { customRender: "action" },
    align: "center",
    width: 60,
  },
  {
    title: "业务订单号",
    dataIndex: "PiNumber",
    scopedSlots: { customRender: "PiNumber" },
    align: "center",
    width: 120,
  },
  {
    title: "客户代码",
    dataIndex: "CustomerCode",
    scopedSlots: { customRender: "CustomerCode" },
    align: "center",
    width: 120,
  },
  {
    title: "出货国家",
    dataIndex: "ToCountry",
    scopedSlots: { customRender: "ToCountry" },
    align: "center",
    width: 100,
  },
  {
    title: "出货数量",
    dataIndex: "Quantity",
    scopedSlots: { customRender: "Quantity" },
    align: "center",
    width: 100,
  },
  {
    title: "货代",
    dataIndex: "ShipmentAgency",
    scopedSlots: { customRender: "ShipmentAgency" },
    align: "center",
    width: 100,
  },
  {
    title: "渠道",
    dataIndex: "Channel",
    scopedSlots: { customRender: "Channel" },
    align: "center",
    width: 100,
  },
  {
    title: "条款",
    dataIndex: "Clause",
    scopedSlots: { customRender: "Clause" },
    align: "center",
     width: 120,
  },
  {
    title: "币种",
    dataIndex: "Currency",
    scopedSlots: { customRender: "Currency" },
    align: "center",
    width: 120,
  },
  {
    title: "出货金额",
    dataIndex: "ShipmentAmount",
    scopedSlots: { customRender: "ShipmentAmount" },
    align: "center",
    width: 120,
  },
  {
    title: "是否报关",
    dataIndex: "IsApplyCustoms",
    scopedSlots: { customRender: "IsApplyCustoms" },
    align: "center",
    width: 120,
  },
  {
    title: "不报关理由",
    dataIndex: "NotApplyReason",
    scopedSlots: { customRender: "NotApplyReason" },
    align: "center",
    width: 120,
  },
  {
    title: "具体原因",
    dataIndex: "DetailReason",
    scopedSlots: { customRender: "DetailReason" },
    align: "center",
    width: 120,
  },
  {
    title: "申报品牌",
    dataIndex: "DeclaredBrand",
    scopedSlots: { customRender: "DeclaredBrand" },
    align: "center",
    width: 120,
  },
  {
    title: "货好时间",
    dataIndex: "GoodsFinishTime",
    scopedSlots: { customRender: "GoodsFinishTime" },
    align: "center",
    width: 140,
  },
  {
    title: "预计提货时间",
    dataIndex: "GoodsPickTime",
    scopedSlots: { customRender: "GoodsPickTime" },
    align: "center",
    width: 140,
  },
  {
    title: "备注",
    dataIndex: "Remark",
    scopedSlots: { customRender: "Remark" },
    align: "center",
     width: 100,
  },
];
import { renderStripe } from "@/utils/stripe.js";
import { setShipmentAgc } from "@/services/shipment.js";
import { getParamData } from "@/services/admin.js";
import moment from "moment";
export default {
  data() {
    return {
      data: [],
      initialization: {
        PiNumber: "",
        ToCountry: "",
        Quantity: "",
        ShipmentAgency: "",
        Channel: "",
        Clause: "",
        IsApplyCustoms: "",
        NotApplyReason: "",
        DetailReason: "",
        DeclaredBrand: "",
        GoodsFinishTime: "",
        GoodsPickTime: "",
        Remark: "",
        CustomerCode: "",
        Currency: "",
        ShipmentAmount: "",
      },
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
      currencyList: [], //币种
      clauseList: [], //渠道
      reasonList: [], //不报关理由
      brandList: [], //品牌
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.getparamsData();
    let array = { ...this.initialization };
    this.data.push(array);
  },
  methods: {
    moment,
    disabledDate(current) {
      return current && current < moment().endOf("day");
    },
    disabledDate1(current) {
      return current && current < moment().endOf("day");
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
    getparamsData() {
      //渠道
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
    reset() {
      this.data = [];
      let array = { ...this.initialization };
      this.data.push(array);
      console.log(this.data);
    },
    //添加行
    addDomain() {
      let array = { ...this.initialization };
      this.data.push(array);
    },
    //删除
    onDelete(i) {
      this.data.splice(i, 1);
    },
    save() {
      let params = {
        Action: "ADD",
        PlantList: [],
      };
      let status = true;
      this.data.map((item, index) => {
        if (item.PiNumber == "") {
          this.$message.warning("请第" + (index + 1) + "行,填写订单号!");
          status = false;
          return;
        }
        if (item.Currency == "") {
          this.$message.warning("请第" + (index + 1) + "行,选择币种!");
          status = false;
          return;
        }
        if (item.IsApplyCustoms == "") {
          this.$message.warning("请第" + (index + 1) + "行,选择是否报关!");
          status = false;
          return;
        }
        if (item.Quantity == "") {
          this.$message.warning("请第" + (index + 1) + "行,填写出货数量!");
          status = false;
          return;
        }
        if (item.ShipmentAmount == "") {
          this.$message.warning("请第" + (index + 1) + "行,填写出货金额!");
          status = false;
          return;
        }
        if (item.IsApplyCustoms == 1 && item.Currency != "人民币") {
          if (item.NotApplyReason == "") {
            this.$message.warning("第" + (index + 1) + "行.选择不报关理由!");
            status = false;
            return;
          }
          if (item.NotApplyReason == "大于200美金(或等同价值)请写具体原因") {
            if (item.ShipmentAmount < 200) {
              this.$message.warning("第" + (index + 1) + "行,金额必须大于200!");
              status = false;
              return;
            }
          }
          if (item.ShipmentAmount >= 200 && item.NotApplyReason == "大于200美金(或等同价值)请写具体原因" && item.DetailReason == "") {
            this.$message.warning("第" + (index + 1) + "行.填写具体原因!");
            status = false;
            return;
          }
          if (item.NotApplyReason == "小于200美金(或等同价值样品不报关)") {
            if (item.ShipmentAmount >= 200) {
              this.$message.warning("第" + (index + 1) + "行,金额必须小于200!");
              status = false;
              return;
            }
          }
        }
        if (item.GoodsFinishTime != "") item.GoodsFinishTime = item.GoodsFinishTime.format("YYYY-MM-DD");
        if (item.GoodsPickTime != "") item.GoodsPickTime = item.GoodsPickTime.format("YYYY-MM-DD");
        params.PlantList.push(item);
      });
      console.log(params);
      if (status) {
        setShipmentAgc(params).then((res) => {
          if (res.data.success) {
            this.reset();
            this.$message.success("提交成功!");
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 5px;
}
.add-table {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

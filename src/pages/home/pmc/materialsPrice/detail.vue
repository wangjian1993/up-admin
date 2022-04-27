<!--
 * @Author: max
 * @Date: 2022-04-27 11:29:03
 * @LastEditTime: 2022-04-27 17:42:03
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/detail.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="详情" @cancel="close" :footer="null" @ok="handleOk" centered width="90%">
      <a-descriptions :column="4" size="small">
        <a-descriptions-item label="流水编号">
          {{ detailData.SerialNumber }}
        </a-descriptions-item>
        <a-descriptions-item label="供应商编码">
          {{ detailData.SupplierCode }}
        </a-descriptions-item>
        <a-descriptions-item label="供应商检查">
          {{ detailData.SupplierName }}
        </a-descriptions-item>
        <a-descriptions-item label="审核状态">
          {{ detailData.ApproveStatus }}
        </a-descriptions-item>
        <a-descriptions-item label="0-面积">
          {{ detailData.Square }}
        </a-descriptions-item>
        <a-descriptions-item label="基准价格(大于)">
          {{ detailData.JzPrice1 }}
        </a-descriptions-item>
        <a-descriptions-item label="基准价格(小于)">
          {{ detailData.JzPrice2 }}
        </a-descriptions-item>
        <a-descriptions-item label="品号">
          {{ detailData.ItemCode }}
        </a-descriptions-item>
        <a-descriptions-item label="铜厚">
          {{ detailData.ThStr }}
        </a-descriptions-item>
        <a-descriptions-item label="耐压">
          {{ detailData.NyStr }}
        </a-descriptions-item>
        <a-descriptions-item label="板厚">
          {{ detailData.BhStr }}
        </a-descriptions-item>
        <a-descriptions-item label="生产工艺">
          {{ detailData.ScgyStr }}
        </a-descriptions-item>
        <a-descriptions-item label="提交人">
          {{ detailData.UserCreated }}
        </a-descriptions-item>
        <a-descriptions-item label="提交时间">
          {{ detailData.DatetimeCreated }}
        </a-descriptions-item>
        <a-descriptions-item label="审核人">
          {{ detailData.UserApprove }}
        </a-descriptions-item>
        <a-descriptions-item label="审核时间">
          {{ detailData.DatetimeApprove }}
        </a-descriptions-item>
      </a-descriptions>
      <div style="display:flex;justify-content: flex-end">
        <a-button type="primary" @click="actionBnt('approve')">审核</a-button>
        <a-button style="margin-left: 8px" @click="actionBnt('export')">导出</a-button>
      </div>
      <div>
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-table :columns="columns" :data-source="dataSource" :size="size" :pagination="false" bordered>
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="TaxIncluded" slot-scope="text">
              <div>
                <a-tag :color="text === 'True' ? 'green' : 'red'">{{ text === "True" ? "是" : "否" }}</a-tag>
              </div>
            </template>
            <template slot="ComponentPrice" slot-scope="text">
              <div>
                <a-tag :color="text === 'True' ? 'green' : 'red'">{{ text === "True" ? "是" : "否" }}</a-tag>
              </div>
            </template>
            <template slot="EffectiveDate" slot-scope="text, record">
              <div>
                <p>{{ timeSplit(record.EffectiveDate) }}</p>
                <p v-if="record.EffectiveDateAfter != ''">{{ record.EffectiveDateAfter }}(修改后)</p>
              </div>
            </template>
            <template slot="Price" slot-scope="text, record">
              <div>
                <p>{{ record.Price }}</p>
                <p v-if="record.PriceAfter != ''">{{ record.PriceAfter }}(修改后)</p>
              </div>
            </template>
            <template slot="PriceD" slot-scope="text, record">
              <div>
                <p>{{ record.PriceD }}</p>
                <p v-if="record.PriceDAfter != ''">{{ record.PriceDAfter }}(修改后)</p>
              </div>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getMaterialsPrice } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
import { columns } from "./data";
export default {
  props: ["detailData"],
  data() {
    return {
      dataSource: [],
      columns,
      size: "small",
      visible: true,
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
      isPrint: false,
      selectedRowKeys: [],
      printData: [],
    };
  },
  created() {
    this.getListAll();
  },
  methods: {
    splitData,
    timeSplit(time) {
      let str = time.split(" ");
      return str[0];
    },
    close() {
      this.$emit("closeModal");
    },
    handleOk() {
      this.$emit("closeModal");
    },
    getListAll() {
      let params = {
        Id: this.detailData.Id,
      };
      getMaterialsPrice(params, "getrecorddetail").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.Details;
        }
      });
    },
    actionBnt(type) {
      this.$emit("closeModal");
      this.$emit("actionBnt",type);
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

<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-07-21 09:09:05
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/bom/components/Details.vue
-->
<template>
  <div>
    <div>
      <a-card
        class="card"
        title="搜索结果"
        :bordered="false"
        :bodyStyle="{ padding: '0px 24px' }"
        :headStyle="{ padding: '0px 24px', minHeight: '30px' }"
      >
        <a-descriptions title="">
          <a-descriptions-item label="产品品号">{{
            detailData.main_data[0].item_code
          }}</a-descriptions-item>
          <a-descriptions-item label="产品大类"
            ><a-input
              placeholder=""
              type="text"
              :value="detailData.main_data[0].one_sort"
              @change="sortInput"
          /></a-descriptions-item>
          <a-descriptions-item label="产品型号"
            ><a-input
              placeholder=""
              type="text"
              :value="detailData.main_data[0].two_sort"
              @change="typeInput"
          /></a-descriptions-item>
          <a-descriptions-item label="产品品名">{{
            detailData.main_data[0].item_name
          }}</a-descriptions-item>
          <a-descriptions-item label="产品规格">{{
            detailData.main_data[0].item_specification
          }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-card
        class="card"
        title="物料成本"
        :bordered="false"
        :bodyStyle="{ padding: '0px 24px' }"
        :headStyle="{ padding: '5px 24px', minHeight: '30px' }"
      >
        <div id="input-box">
          <a-row>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="12"
              :xxl="12"
              v-for="(item, index) in costList.cost_options"
              :key="index"
            >
              <div
                class="input-item"
                v-if="
                  item.field_name != 'bom_cost' &&
                    item.field_name != 'total_cost'
                "
              >
                <p class="input-lable">{{ item.cost_name }}:</p>
                <p class="input-number">
                  <a-input-number
                    :disabled="item.is_readonly == 1"
                    v-model="item.value"
                    :min="0"
                    @change="costNumber(item)"
                  />
                </p>
                <p class="input-text">{{ item.tips_desc }}</p>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-card>
      <a-card
        class="card"
        title="物料"
        :bordered="false"
        :bodyStyle="{ padding: '0px 24px' }"
        :headStyle="{ padding: '5px 24px', minHeight: '30px' }"
      >
        <!-- <a-form layout="horizontal">
          <div>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item
                  label="关键字匹配"
                  :labelCol="{ span: 5 }"
                  :wrapperCol="{ span: 16, offset: 1 }"
                >
                  <a-input placeholder="请输入料名、料规格、提示" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24"
                ><a-button type="primary" style="margin-top: 3px;"
                  >查询</a-button
                ></a-col
              >
            </a-row>
          </div>
        </a-form> -->
        <standard-table
          :pagination="pagination"
          :columns="columns"
          :dataSource="detailData.child_data"
        >
          <div slot="price" slot-scope="{ record, index }">
            <a-input-number
              :id="record.key"
              v-model="record.price"
              :min="0"
              @change="priceNumber(record, index)"
            />
          </div>
          <div slot="action" slot-scope="{ record, index }">
            <a><a-input 
              @change="remarkInput(record, index)"
              :value="record.remark"
             /></a>
          </div>
        </standard-table>
      </a-card>
    </div>
  </div>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
export default {
  props: ["columns", "dataSource", "costList", "pagination", "detailData"],
  data() {
    return {};
  },
  methods: {
    //修改物料成本
    costNumber() {
      let total = 0;
      this.costList.cost_options.map((item) => {
        if (item.field_name != "total_cost" && item.value) {
          total += item.value;
        }
      });
      this.$emit("setTotalPrice", total);
    },
    //修改单价
    priceNumber(item, index) {
      this.detailData.child_data[index].row_amount = item.price * item.yl;
      var sum = 0,finallyTotal =0;
      let list = this.detailData.child_data;
      list.forEach((item) => {
        sum += item.price * item.yl;
      });
      let total = parseFloat(sum.toFixed(4));
      this.$emit("setMaterialTotal", total);
      this.costList.cost_options.map((item) => {
        if (item.field_name != "total_cost" && item.value) {
          finallyTotal += item.value;
        }
      })
      this.$emit("setTotalPrice", finallyTotal);
    },
    //产品大类输入
    sortInput(e){
      this.detailData.main_data[0].one_sort =e.target.value
    },
    //产品型号输入
    typeInput(e){
      this.detailData.main_data[0].two_sort =e.target.value
    },
    //备注输入框
    remarkInput(item,index){
      console.log(item);
      console.log(index)
    }
  },
  components: { StandardTable },
};
</script>

<style lang="less">
.input-item {
  display: flex;
  align-items: center;
  .input-lable {
    width: 100px;
    text-align: right;
  }
  .input-number {
    padding-left: 5px;
  }
  .input-text {
    padding-left: 5px;
  }
}
.ant-card-body {
  padding: 0;
}
.ant-card-head-title {
  padding: 0;
}
.ant-form-item {
  margin-bottom: 0;
}
</style>

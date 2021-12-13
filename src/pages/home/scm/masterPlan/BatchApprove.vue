<!--
 * @Author: max
 * @Date: 2021-10-07 15:16:07
 * @LastEditTime: 2021-12-13 18:25:44
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
                <a-col :xl="8" :lg="12"
                  ><div style="margin-left:10px">
                    <a-form-item label="生产工厂:">
                      <span>{{ PlantName }}</span>
                    </a-form-item>
                  </div></a-col
                >
                <a-col :xl="8" :lg="12"
                  ><div style="margin-left:10px">
                    <a-form-item label="计划批次:">
                      <a-input placeholder="物料需求计划批次号" disabled allowClear style="width:150px" v-decorator="['BatchNo']" />
                      <a-button @click="batchno" :disabled="isEdit" style="margin-left: 8px" shape="circle" icon="search" />
                    </a-form-item></div
                ></a-col>

                <a-col :xl="8" :lg="12"
                  ><div style="margin-left:10px">
                    <a-form-item label="物料编码:">
                      <!-- <a-input placeholder="请选择物料编码" :disabled="isEdit" allowClear style="width:200px" v-decorator="['MitemCode']" /> -->
                      <a-select v-decorator="['MitemCode']" placeholder="请选择物料编码" style="width:200px" :disabled="isEdit" @change="mitemChange">
                        <a-select-option v-for="item in materialData" :key="item.MitemCode" :value="item.MitemCode">{{ item.MitemCode }}</a-select-option>
                      </a-select>
                    </a-form-item>
                  </div></a-col
                >

                <a-col :xl="8" :lg="12">
                  <div style="margin-left:10px">
                    <a-form-item label="物料名称:">
                      <span>{{ mitemList.MitemName }}</span>
                    </a-form-item>
                  </div></a-col
                >
                <a-col :xl="8" :lg="12">
                  <div style="margin-left:10px">
                    <a-form-item label="需求日期:">
                      <a-select v-if="!isEdit" v-decorator="['RequirementDate']" placeholder="请选择需求日期" :disabled="isEdit" @change="dateChange" style="width:200px">
                        <a-select-option v-for="(item, index) in materialDates" :key="index" :value="item.RequirementDate">{{ splitData(item.RequirementDate) }}</a-select-option>
                      </a-select>
                      <span v-else>{{ mitemData.RequirementDate }}</span>
                    </a-form-item>
                  </div></a-col
                >
                <a-col :xl="8" :lg="12">
                  <div style="margin-left:10px">
                    <a-form-item label="需求数量:">
                      <span>{{ mitemData.RequirementQty }}</span>
                    </a-form-item>
                    <a-form-item label="已匹配数量:" style="margin-left:20px">
                      <span>{{ alreadyQty }}</span>
                    </a-form-item>
                    <a-form-item label="未匹配数量:" style="margin-left:20px">
                      <span>{{ notQty }}</span>
                    </a-form-item>
                  </div></a-col
                >
                <!-- <a-col :xl="6" :lg="8" :md="6" :sm="6"
                  ><span style="margin-left:20px;margin-top:-5px" v-if="!isEdit">
                    <a-button type="primary" @click="search">查询</a-button>
                    <a-button style="margin-left: 8px" @click="reset">重置</a-button>
                  </span></a-col
                > -->
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </div>
      <div>
        <div class="tab">
          <a-table
            :columns="columns"
            :data-source="list"
            size="small"
            :scroll="{ y: 600 }"
            :pagination="pagination"
            @change="handleTableChange"
            :rowKey="(list) => list.Id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <div slot="MatchQty" slot-scope="text, record">
              <!-- <a-input-number allowClear :min="0" size="small" @change="(e) => handleChange(e.target.value, record)" :value="record.MatchQty" /> -->
              <a-input-number v-model="record.MatchQty" :disabled="!record.isInput" @change="countQty" :min="0" :max="mitemData.RequirementQty" />
            </div>
          </a-table>
        </div>
      </div>
      <batch-no v-if="isBatchNo" :plantList="plantList" @closeModal="closeModal" @batchNoItem="batchNoItem"></batch-no>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "序号",
    scopedSlots: { customRender: "index" },
    width: "5%",
    align: "center",
  },
  {
    title: "物料编码",
    dataIndex: "MitemCode",
    scopedSlots: { customRender: "MitemCode" },
    align: "center",
  },
  {
    title: "物料名称",
    dataIndex: "MitemName",
    scopedSlots: { customRender: "MitemName" },
    align: "center",
  },
  {
    title: "供应商名称",
    dataIndex: "SupplierName",
    scopedSlots: { customRender: "SupplierName" },
    align: "center",
  },
  {
    title: "生产工厂",
    dataIndex: "PlantErpName",
    scopedSlots: { customRender: "PlantErpName" },
    align: "center",
  },
  {
    title: "采购订单号",
    dataIndex: "PurchaseOrderNo",
    scopedSlots: { customRender: "PurchaseOrderNo" },
    align: "center",
  },
  {
    title: "行项目号",
    dataIndex: "LineItemNo",
    scopedSlots: { customRender: "LineItemNo" },
    align: "center",
  },
  {
    title: "采购名称",
    dataIndex: "EmployeeName",
    scopedSlots: { customRender: "EmployeeName" },
    align: "center",
  },
  {
    title: "在途数量",
    dataIndex: "QtyTransit",
    scopedSlots: { customRender: "QtyTransit" },
    align: "center",
  },
  {
    title: "剩余可匹配数量",
    dataIndex: "RemainQty",
    scopedSlots: { customRender: "RemainQty" },
    align: "center",
  },
  {
    title: "匹配数量",
    dataIndex: "MatchQty",
    scopedSlots: { customRender: "MatchQty" },
    align: "center",
  },
];
import { getScmAction, setScmAction } from "@/services/web.js";
import { splitData } from "@/utils/util.js";
import BatchNo from "./BatchNo.vue";
export default {
  components: { BatchNo },
  props: ["plantList", "matchingData", "isEdit"],
  data() {
    return {
      columns,
      size: "small",
      visible: true,
      list: [],
      searchForm: this.$form.createForm(this),
      mitemList: [],
      mitemData: [],
      batchData: [],
      batchnoData: [],
      selectedRowKeys: [],
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
      isBatchNo: false,
      materialData: [],
      materialDates: [],
      PlantName: "",
      alreadyQty: 0,
      notQty: 0,
    };
  },
  created() {
    if (this.matchingData.BatchNo) {
      this.$nextTick(() => {
        this.searchForm.setFieldsValue({
          BatchNo: this.matchingData.BatchNo,
          MitemCode: this.matchingData.MitemCode,
        });
      });
      console.log(this.matchingData);
      this.PlantName = this.matchingData.PlantName;
      this.mitemList.MitemCode = this.matchingData.MitemCode;
      this.mitemList.MitemName = this.matchingData.MitemName;
      this.mitemData.RequirementQty = this.matchingData.RequirementQty;
      this.mitemData.RequirementDate = splitData(this.matchingData.RequirementDate);
      this.batchnoData.BatchId = this.matchingData.BatchId;
      this.batchnoData.DetailId = this.matchingData.Id;
      this.batchnoData.BatchNo = this.matchingData.BatchNo;
      this.batchnoData.PlantName = this.matchingData.PlantName;
      this.batchnoData.PlantId = this.matchingData.PlantId;
      this.notQty = this.matchingData.RequirementQty;
      console.log(this.batchnoData);
    }
    if (this.isEdit) {
      console.log("1111")
      this.getList();
    } else {
      console.log("2222")
      this.getMitemsByBatch();
    }
  },
  methods: {
    splitData,
    handleChange(e, record, index) {
      this.list[index].MatchQty = e;
    },
    close() {
      this.$emit("closeModal");
    },
    countQty() {
      this.alreadyQty = 0;
      this.list.map((item) => {
        if (item.isInput) {
          this.alreadyQty += item.MatchQty;
          this.notQty = this.mitemData.RequirementQty - this.alreadyQty;
        }
      });
    },
    reset() {
      this.MitemCode = "";
      this.getList();
      this.searchForm.resetFields();
    },
    //计划批次号
    batchNoItem(item) {
      this.batchnoData = item;
      this.isBatchNo = false;
      this.form.BatchNo = item.BatchNo;
      this.form.BatchId = item.BatchId;
      this.getMitemsByBatch();
    },
    //获取物料信息
    getMitemsByBatch() {
      let parmas = {
        batchid: this.batchnoData.BatchId,
      };
      getScmAction(parmas, "manualmatch/getmitemsbybatch").then((res) => {
        if (res.data.success) {
          this.materialData = res.data.data;
        }
      });
    },
    //选择物料信息
    mitemChange(e) {
      this.mitemList = this.materialData.find((item) => (item.MitemCode = e));
      this.getRequirementDates();
      this.getList();
    },
    getRequirementDates() {
      let parmas = {
        batchid: this.batchnoData.BatchId,
        mitemcode: this.mitemList.MitemCode,
      };
      getScmAction(parmas, "manualmatch/getrequirementdates").then((res) => {
        if (res.data.success) {
          this.materialDates = res.data.data;
          console.log(res.data.data);
        }
      });
    },
    //需求时间选择
    dateChange(e) {
      this.mitemData = this.materialDates.find((item) => item.RequirementDate == e);
    },
    getList() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
        mitemcode: this.mitemList.MitemCode,
      };
      getScmAction(parmas, "manualmatch/getpurchaseorders").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.list;
          this.list.map((item,index) => {
            item.Id = item.PurchaseOrderNo + "_" +  item.MitemCode + "_" + item.lineItemNum + "_" + index;
          });
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
      console.log(this.selectedRowKeys);
      if (selectedRowKeys.length > 0) {
        this.list.map((items) => {
          items.isInput = this.setIsInput(items.Id);
        });
      } else {
        this.list.map((items) => {
          items.isInput = false;
        });
      }
    },
    setIsInput(id) {
      return this.selectedRowKeys.includes(id);
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getList();
    },
    search() {},
    batchno() {
      this.isBatchNo = true;
    },
    handleOk() {
      let parmas = {
        PlantId: this.batchnoData.PlantId,
        BatchId: this.batchnoData.BatchId,
        MitemCode: this.mitemList.MitemCode,
        DetailId:this.batchnoData.DetailId,
        RequirementDate: this.mitemData.RequirementDate,
        MatchList: [],
      };
      this.list.map((items) => {
        if (this.selectedRowKeys.indexOf(items.Id) > -1) {
          parmas.MatchList.push({
            PurchaseOrderNo: items.PurchaseOrderNo,
            SupplierCode: items.SupplierCode,
            LineItem: items.LineItem,
            LineItemNum: items.lineItemNum,
            MatchQty: items.MatchQty || 0,
          });
        }
      });
      setScmAction(parmas, "manualmatch/addv2").then((res) => {
        if (res.data.success) {
          this.$message.success("手动匹配成功!");
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

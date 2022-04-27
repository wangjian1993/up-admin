<!--
 * @Author: max
 * @Date: 2022-04-27 08:47:14
 * @LastEditTime: 2022-04-27 17:45:41
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/pmc/materialsPrice/record.vue
-->
<template>
  <div>
    <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
      <a-form layout="horizontal" :form="searchForm">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="6" :sm="24">
              <a-form-item label="供应商编码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入供应商编码" v-decorator="['suppliercode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="供应商简称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入供应商简称" v-decorator="['SupplierName']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="0-面积" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input-number
                  :min="0"
                  style="width: 200px"
                  allowClear
                  placeholder="请输入面积"
                  v-decorator="[
                    'square',
                    {
                      initialValue: 50,
                      rules: [{ required: true, message: '请输入面积!' }],
                    },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="基准价格(大于)" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input-number :min="0" style="width: 200px" allowClear placeholder="请输入基准价格1" v-decorator="['jzprice1']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="基准价格(小于)" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input-number :min="0" style="width: 200px" allowClear placeholder="请输入基准价格2" v-decorator="['jzprice2']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="铜厚" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入铜厚" v-decorator="['thstr']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="耐压" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入耐压" v-decorator="['nystr']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="板厚" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入板厚" v-decorator="['bhstr']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="生产工艺" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入生产工艺" v-decorator="['scgystr']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['ItemCode']" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="提交时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker1', { initialValue: [momentTime(startTime, 'YYYY-MM-DD'), momentTime(endTime, 'YYYY-MM-DD')] }]" format="YYYY-MM-DD" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="审核时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-range-picker style="width: 300px" v-decorator="['range-time-picker2']" format="YYYY-MM-DD" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="审核状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                <a-select style="width: 200px" v-decorator="['ApproveStatus', { initialValue: 'N' }]">
                  <a-select-option key="" value="">全部</a-select-option>
                  <a-select-option key="" value="Y">已审核</a-select-option>
                  <a-select-option key="" value="N">未审核</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <span style="display:flex;justify-content: flex-end">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          </span>
        </div>
      </a-form>
      <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource, index) => dataSource.Id" bordered>
        <template slot="index" slot-scope="text, record, index">
          <div>
            <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
          </div>
        </template>
        <template slot="ApproveStatus" slot-scope="text">
          <div>
            <a-tag :color="text == 'N' ? 'red' : 'green'">{{ text == "Y" ? "已审核" : "未审核" }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm v-if="record.ApproveStatus === 'N'" title="确定删除?" @confirm="() => actionBnt(record, 'deletesubmitrecord')">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a-popconfirm v-if="record.ApproveStatus === 'N'" title="确定审核?" @confirm="() => actionBnt(record, 'approvesubmitrecord')">
              <a style="margin-right: 8px" :disabled="!hasPerm('approve')">
                <a-icon type="delete" />
                审核
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="detail(record)">
              <a-icon type="profile" />
              查看
            </a>
            <a style="margin-right: 8px" @click="exportFn(record)">
              <a-icon type="profile" />
              导出
            </a>
          </div>
        </template>
      </a-table>
    </a-card>
    <detail v-if="isDetail" @closeModal="closeModal" @actionBnt="detailApprove" :detailData="detailData" />
  </div>
</template>

<script>
import { getMaterialsPrice } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columns } from "./record";
import { columns as columnsHead } from "./data";
import moment from "moment";
import detail from "./detail.vue";
import { exportjsontoexcelMore } from "@/utils/ExportExcel";
export default {
  mixins: [PublicVar],
  components: { detail },
  data() {
    return {
      scrollY: "",
      advanced: true,
      columns,
      dataSource: [],
      isSearch: 0,
      isDetail: false,
      printData: [],
      detailData: [],
      startTime: moment(new Date())
        .subtract(30, "days")
        .format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment(new Date())
        .subtract(0, "days")
        .format("YYYY-MM-DD HH:mm:ss"),
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(70);
    });
  },
  methods: {
    splitData,
    moment,
    momentTime(time, format) {
      return moment(time, format);
    },
    detail(item) {
      this.isDetail = true;
      this.detailData = item;
    },
    closeModal() {
      this.isDetail = false;
    },
    detailApprove(type) {
      if (type == "Approve") {
        this.actionBnt(this.detailData, "approvesubmitrecord");
      } else {
        this.exportFn(this.detailData);
      }
    },
    //重置搜索
    timeSplit(time) {
      let str = time.split(" ");
      return str[0];
    },
    reset() {
      this.isSearch = 0;
      this.searchForm.resetFields();
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //分页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch == 2) {
        this.search();
        return;
      }
      this.getListAll();
    },
    actionBnt(item, type) {
      console.log(item);
      let params = {
        Id: item.Id,
      };
      getMaterialsPrice(params, type).then((res) => {
        if (res.data.success) {
          if (type == "approvesubmitrecord") {
            this.$message.success("审批成功!");
          } else {
            this.$message.success("删除成功!");
          }
          this.search();
        }
      });
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          if (values.suppliercode == undefined && values.SupplierName == undefined) {
            this.$message.warning("请输入供应商编码或供应商简称!");
            return;
          }
          if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
            const rangeValue = values["range-time-picker1"];
            var DateCreatedStart = rangeValue[0].format("YYYY-MM-DD");
            var DateCreatedEnd = rangeValue[1].format("YYYY-MM-DD");
          }
          if (values["range-time-picker2"] && values["range-time-picker2"].length == 2) {
            const rangeValue = values["range-time-picker2"];
            var DateApproveStart = rangeValue[0].format("YYYY-MM-DD");
            var DateApproveEnd = rangeValue[1].format("YYYY-MM-DD");
          }
          this.loading = true;
          let parmas = {
            PageIndex: this.pagination.current,
            PageSize: this.pagination.pageSize,
            SupplierCode: values.suppliercode.toString(),
            Square: values.square,
            JzPrice1: values.jzprice1,
            JzPrice2: values.jzprice2,
            SupplierName: values.SupplierName || "",
            ItemCode: values.ItemCode || "",
            ApproveStatus: values.ApproveStatus || "",
            ThStr: values.thstr != undefined ? values.thstr.toString() : "",
            NyStr: values.nystr != undefined ? values.nystr.toString() : "",
            BhStr: values.bhstr != undefined ? values.bhstr.toString() : "",
            ScgyStr: values.scgystr != undefined ? values.scgystr.toString() : "",
            DateCreatedStart: DateCreatedStart || "", // 创建时间Start
            DateCreatedEnd: DateCreatedEnd || "", // 创建时间End
            DateApproveStart: DateApproveStart || "", //审核时间Start
            DateApproveEnd: DateApproveEnd || "", //审核时间End
          };
          getMaterialsPrice(parmas, "getsubmitrecord").then((res) => {
            if (res.data.success) {
              this.dataSource = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.isSearch = 2;
            }
            this.loading = false;
          });
          // do something
        }
      });
    },
    exportFn(item) {
      let params = {
        Id: item.Id,
      };
      getMaterialsPrice(params, "getrecorddetail").then((res) => {
        if (res.data.success) {
          let _data = [];
          let excelArray = [];
          let mergeTitle = [];
          let list = res.data.data.Details;
          let record = res.data.data.Record[0];
          _data.push(["流水编号:", record.SerialNumber, "供应商编号:", record.SupplierCode, "供应商编号:", record.SupplierName, "面积:", record.Square, "", "", "", "", "", "", ""]);
          _data.push(["0-面积:", record.Square, "基准价格(大于):", record.JzPrice1, "基准价格(小于):", record.JzPrice2, "品号:", record.ItemCode, "", "", "", "", "", "", ""]);
          _data.push(["铜厚:", record.ThStr, "	耐压:", record.NyStr, "板厚:", record.BhStr, "生产工艺:", record.ScgyStr, "", "", "", "", "", "", ""]);
          _data.push(["提交人:", record.UserCreated, "提交时间:", record.DatetimeCreated, "审核人:", record.UserApprove || "", "审核时间:", record.DatetimeApprove || "", "", "", "", "", "", "", ""]);
          const hear = ["供应商名称", "品号", "品名", "规格", "采购单价", "含税", "分量计价", "开始数量", "结束数量", "大批量单价", "生效日期", "失效日期", "描述", "状态", "供应商编号"];
          _data.push(hear);
          console.log("columnsHead===", columnsHead);
          list.map((item) => {
            let PriceD = item.PriceD + " / " + item.PriceDAfter + "(修改后)";
            let EffectiveDate = item.EffectiveDate + " / " + item.EffectiveDateAfter + "(修改后)";
            let array = [item.SupplierName, item.ItemCode, item.ItemName, item.ItemSpecification, item.Price, item.TaxIncluded, item.ComponentPrice, item.BeginQty, item.EndQty, PriceD, EffectiveDate, item.IneffectiveDate, item.Description, item.ApproveStatus, item.SupplierCode];
            _data.push(array);
          });
          console.log(_data);
          const sheetCols = [
            { wch: 18 }, // 序号
            { wch: 15 }, // 阶次
            { wch: 18 }, // 类型
            { wch: 20 }, // 上阶BOM号
            { wch: 20 }, // 品号
            { wch: 20 }, // 品号
            { wch: 8 }, // 料名
            { wch: 8 }, //  产品规格
            { wch: 8 }, // 单位
            { wch: 8 }, // 价格来源
            { wch: 8 }, // E10单价
            { wch: 8 }, // 单价
            { wch: 8 }, // 用量
            { wch: 8 }, // 金额
            { wch: 8 }, // 提示
            { wch: 20 }, // 备注
            { wch: 20 }, // 备注
          ];
          let contentList = [];
          let merges2 = []; // 设置表格内容单元格合并
          let aoa = [..._data, ...contentList]; // 导出的数据
          let merges = [...mergeTitle, ...merges2]; // 合并单元格
          let formStyle = {};
          excelArray.push({
            Sheet: `供应商价格`, // 下方tab切换名称
            data: aoa, // 表格数据
            merges, //  合并单元格
            autoWidth: false, // 自适应宽度
            formStyle: formStyle, // 特殊行或列样式
            sheetCols,
          });
          try {
            exportjsontoexcelMore({
              dataList: excelArray,
              bookType: "xlsx", // 导出类型
              filename: `供应商价格_` + item.SerialNumber, // 导出标题名
            });
            this.$message.success("导出数据成功!");
          } catch (error) {
            this.$message.error("导出数据失败");
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
/deep/.ant-table {
  min-height: 62vh;
}
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.Rowactive > td {
  // background-color: #ed0e0e !important;
  color: #f60e0e !important;
}
</style>

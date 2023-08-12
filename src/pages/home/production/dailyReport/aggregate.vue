<!--
 * @Author: max
 * @Date: 2022-04-01 17:32:54
 * @LastEditTime: 2023-06-28 09:45:04
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/dailyReport/aggregate.vue
-->
<template>
  <div>
    <a-spin tip="导出中..." :spinning="isExportLod">
      <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
        <a-form layout="horizontal" :form="searchForm">
          <div :class="advanced ? null : 'fold'">
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产工厂" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['plantid']" style="width: 200px" placeholder="请选择生产工厂" @change="plantChange">
                    <a-select-option v-for="item in plantList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="6" :sm="24">
                <a-form-item label="生产车间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['workshopid']" style="width: 200px" placeholder="请选择生产车间" @change="workshopChange">
                    <a-select-option v-for="item in workshopList" :key="item.WorkShopId" :value="item.WorkShopId">{{ item.WorkShopName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产产线" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['lineid']" style="width: 200px" placeholder="请选择生产产线">
                    <a-select-option v-for="item in lineList" :key="item.LineId" :value="item.LineId">{{ item.LineName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
              <a-col :md="6" :sm="24">
                <a-form-item label="订单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入订单号" v-decorator="['orderno']" />
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="工单号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入工单号" v-decorator="['mocode']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['procode']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="6" :sm="24">
                <a-form-item label="品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 200px" allowClear placeholder="请输入品名" v-decorator="['proname']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="工序" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-select v-decorator="['process']" style="width: 200px" placeholder="请选择工序">
                    <a-select-option v-for="item in processList" :key="item.ProcessCode" :value="item.ProcessCode">{{ item.ProcessName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="生产日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-range-picker style="width: 300px" v-decorator="['range-time-picker']" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <span style="float: right; margin-top: 3px;">
            <a-button type="primary" @click="searchBtn">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a-popover v-model="poped" trigger="click" placement="leftBottom">
              <template slot="title">
                <a-checkbox :checked="chkAll" :indeterminate="indeterminate" @change="ckAllChange">全部</a-checkbox>
              </template>
              <template slot="content">
                <a-checkbox-group v-model="ckValues" :options="columnList" @change="ckChange" style="width: 120px;">
                  <span slot="label" :title="option.title" slot-scope="option" style="width:300px">{{ option.title }}</span>
                </a-checkbox-group>
                <a-divider style="margin:5px; " />
                <a-space>
                  <a-button type="primary" size="small" @click="createColumns">确认</a-button>
                  <a-button type="primary" size="small" @click="poped = false">取消</a-button>
                </a-space>
              </template>
              <a-button type="primary" style="margin:0 10px;" icon="table" shape="circle" />
            </a-popover>
          </span>
        </a-form>
        <div class="operator">
          <a-button v-if="hasPerm('export')" :disabled="dataSource.length == 0" type="primary" @click="exportExcel" icon="export">导出</a-button>
          <a-button v-else type="primary" @click="exportExcel" icon="export">导出</a-button>
        </div>
        <a-table :columns="columns" :data-source="dataSource" size="small" :scroll="{ y: scrollY, x: true }" :loading="loading" :pagination="pagination" @change="handleTableChange" :rowKey="(dataSource, index) => dataSource.OrderNo + '_' + index" bordered>
          <template slot="index" slot-scope="text, record, index">
            <div>
              <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
            </div>
          </template>
          <!-- <template slot="WorkShopName" slot-scope="text, record">
            <span>{{record.LineName}}-{{record.}}</span>
          </template> -->
        </a-table>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getDailyReport } from "@/services/web.js";
import { exportjsontoexcelMore } from "@/utils/ExportExcel";
import { renderStripe } from "@/utils/stripe.js";
import getTableScroll from "@/utils/setTableHeight";
import { splitData } from "@/utils/util.js";
import { PublicVar } from "@/mixins/publicVar.js";
import { columnsData } from "./aggregate";
export default {
  mixins: [PublicVar],
  data() {
    return {
      ckValues: [], //checkgroup设置值
      chkAll: true, //全选
      indeterminate: false, //模糊状态
      poped: false, //弹窗显示
      columns: [], //显示列
      columnList: columnsData, //全部列
      scrollY: "",
      advanced: true,
      dataSource: [],
      isDrawer: false,
      plantList: [],
      plantId: "",
      drawerItem: [],
      isSearch: 0,
      statistic: [],
      isUserList: false,
      isExportLod: false,
      statisticType: "",
      stateList: [],
      workshopList: [],
      lineList: [],
      workshopId: "",
      editData: [],
      isEdit: false,
      isPrint: false,
      printData: [],
      processList: [],
    };
  },
  updated() {
    renderStripe();
  },
  created() {
    this.$nextTick(() => {
      this.scrollY = getTableScroll(100);
      let local = JSON.parse(localStorage.getItem("AGGREGATE_COLUMN"));
      this.columnList.forEach((col) => {
        col.value = col.dataIndex; //设置value值，用于checkedgroup
      });
      if (local) {
        this.ckValues = [];
        local.forEach((col) => {
          this.ckValues.push(col.value);
        });
      } else {
        this.createChGroupValue(); //初始全部选中
      }
      this.createColumns(); //生成显示列
      // this.setDelCol(); //设置删除标记列的显示样式
      let primaryKey = this.columns.find((f) => f.primaryKey == true);
      if (primaryKey) {
        this.primaryKey = primaryKey.dataIndex;
      }
    });
    // this.search();
    this.getPlant();
    this.getProcessList();
  },
  methods: {
    splitData,
    createChGroupValue() {
      this.ckValues = [];
      this.columnList.forEach((col) => {
        this.ckValues.push(col.value);
      });
    },
    ckChange(checkedList) {
      console.log("checkedList===", this.columnList);
      this.indeterminate = !!checkedList.length && checkedList.length < this.columnList.length;
      this.chkAll = checkedList.length === this.columnList.length;
    },
    ckAllChange(e) {
      this.chkAll = e.target.checked;
      this.indeterminate = false;
      if (this.chkAll) {
        this.createChGroupValue();
      } else {
        this.ckValues = [];
      }
    },
    createColumns() {
      if (this.ckValues.length == 0) {
        this.$message.error("请至少留下一列");
        return;
      }
      this.columns = [];
      this.ckValues.forEach((item) => {
        let col = this.columnList.find((f) => f.dataIndex == item);
        console.log("col===", col);
        if (col) {
          this.columns.push(col);
        }
      });
      this.poped = false;
      localStorage.setItem("AGGREGATE_COLUMN", JSON.stringify(this.columns));
    },
    //查看详情
    details(item) {
      console.log("111====", item);
      this.isDrawer = true;
      this.drawerItem = item;
    },
    //重置搜索
    reset() {
      this.week = "";
      this.isSearch = 0;
      this.searchForm.resetFields();
      this.getPlant();
    },
    plantChange(e) {
      if (e == "") return;
      this.plantId = e;
      this.searchForm.setFieldsValue({
        workshopid: "",
        lineid: "",
      });
      this.getWorkshopList();
    },
    //车间选择
    workshopChange(e) {
      if (e == "") return;
      this.workshopId = e;
      this.searchForm.setFieldsValue({
        lineid: "",
      });
      this.getLineList();
    },
    getPlant() {
      let params1 = {
        entertypecode: "PLANT",
      };
      getDailyReport(params1, "getplantlist").then((res) => {
        if (res.data.success) {
          this.plantList = res.data.data;
          this.plantId = this.plantList[0].EnterId;
          this.searchForm.setFieldsValue({
            plantid: this.plantList[0].EnterId,
          });
          this.search();
          // this.getWorkshopList()
        }
      });
    },
    //获取车间
    getWorkshopList() {
      let params = {
        plantid: this.plantId,
      };
      getDailyReport(params, "getworkshoplist").then((res) => {
        if (res.data.success) {
          this.workshopList = res.data.data;
        }
      });
    },
    //获取产线
    getLineList() {
      let params = {
        workshop: this.workshopId,
      };
      getDailyReport(params, "getlinelist").then((res) => {
        if (res.data.success) {
          this.lineList = res.data.data;
        }
      });
    },
    getProcessList() {
      let params = {
        process: "",
      };
      getDailyReport(params, "getprocess").then((res) => {
        if (res.data.success) {
          this.processList = res.data.data;
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //获取列表
    getListAll() {
      this.loading = true;
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getDailyReport(params, "realtime/getall").then((res) => {
        if (res.data.success) {
          this.dataSource = res.data.data.list;
          this.addListparams();
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = 0;
        } else {
          this.loading = false;
        }
      });
    },
    addListparams() {
      this.dataSource.map((item) => {
        item.material = "";
        item.production_remarks = "";
      });
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
    //收起展开
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    searchBtn() {
      this.pagination.current = 1;
      this.search();
    },
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
            const rangeValue = values["range-time-picker"];
            var begindate = rangeValue[0].format("YYYY-MM-DD");
            var enddate = rangeValue[1].format("YYYY-MM-DD");
          }
          let params = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            workshop: values.workshopid,
            line: values.lineid,
            orderno: values.orderno,
            mocode: values.mocode,
            procode: values.procode,
            stratdate: begindate,
            enddate: enddate,
            proname: values.proname,
            process: values.process,
          };
          getDailyReport(params, "realtime/gettotal").then((res) => {
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
    //单个删除
    exportExcel() {
      this.isExportLod = true;
      let values = this.searchForm.getFieldsValue();
      if (values["range-time-picker"] && values["range-time-picker"].length == 2) {
        const rangeValue = values["range-time-picker"];
        var begindate = rangeValue[0].format("YYYY-MM-DD");
        var enddate = rangeValue[1].format("YYYY-MM-DD");
      }
      let params = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.total,
        plantid: values.plantid,
        workshop: values.workshopid,
        line: values.lineid,
        orderno: values.orderno,
        mocode: values.mocode,
        procode: values.procode,
        stratdate: begindate,
        enddate: enddate,
        proname: values.proname,
        process: values.process,
      };
      getDailyReport(params, "realtime/gettotal").then((res) => {
        if (res.data.success) {
          let _data = [];
          let excelArray = [];
          let list = res.data.data.list;
          const header = [];
          const sheetCols = [];
          this.columns.map((item) => {
            if (item.dataIndex) {
              header.push(item.title);
              sheetCols.push({
                wch: item.wch,
              });
            }
          });
          _data.push(header);
          list.map((item, index) => {
            let array = [];
            this.columns.map((items) => {
              if (items.dataIndex) {
                if (items.dataIndex === "index") {
                  array.push(index + 1);
                } else {
                  let data = item[items.dataIndex] !== null ? item[items.dataIndex] : "";
                  array.push(data);
                }
              }
            });
            _data.push(array);
          });
          //工单数量
          let sumMoQty = list.reduce((prev, curr) => prev + parseInt(curr.MoQty), 0);
          //订单数量
          let sumOrderQty = list.reduce((prev, curr) => prev + parseInt(curr.OrderQty), 0);
          //产出数量
          let sumProQty = list.reduce((prev, curr) => prev + parseInt(curr.ProQty), 0);
          //累计数量
          let sumCumulativeQty = list.reduce((prev, curr) => prev + parseInt(curr.CumulativeQty), 0);
          //尚欠数量
          let sumDeficiencyQty = list.reduce((prev, curr) => prev + parseInt(curr.DeficiencyQty), 0);
          let sumArray = [];
          this.columns.map((items,index) => {
            sumArray.push("");
            if(items.title === '工单数量'){
              sumArray[index] = '工单数量:' +sumMoQty
            }
            if(items.title === '订单数量'){
              sumArray[index] = '订单数量:' +sumOrderQty
            }
            if(items.title === '产出数量(PCS)'){
              sumArray[index] = '产出数量:' +sumProQty
            }
            if(items.title === '累计数量(PCS)'){
              sumArray[index] = '累计数量:' +sumCumulativeQty
            }
            if(items.title === '尚欠数量(PCS)'){
              sumArray[index] = '尚欠数量:' +sumDeficiencyQty
            }
          });
          sumArray[0] = '汇总'
          console.log("_data====",_data)
          console.log("sumArray====",sumArray)
          _data.push(sumArray);
          let contentList = [];
          let aoa = [..._data, ...contentList]; // 导出的数据
          let merges = []; // 合并单元格
          let formStyle = {
            font: {
              name: "宋体",
              sz: 10,
            },
            alignment: {
              wrapText: 1,
              horizontal: "center",
              vertical: "center",
              indent: 0,
            },
          };
          excelArray.push({
            Sheet: `生产日报表`, // 下方tab切换名称
            data: aoa, // 表格数据
            merges, //  合并单元格
            autoWidth: false, // 自适应宽度
            formStyle: {}, // 特殊行或列样式
            sheetCols,
          });
          try {
            var timestamp = Date.parse(new Date());
            exportjsontoexcelMore(
              {
                dataList: excelArray,
                bookType: "xlsx", // 导出类型
                filename: `生产日报表汇总_` + timestamp, // 导出标题名
              },
              formStyle
            );
            this.$message.success("导出数据成功!");
          } catch (error) {
            this.$message.error("导出数据失败");
          }
          this.isExportLod = false;
          this.isExportLod = false;
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
</style>

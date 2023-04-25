<!--
 * @Author: max
 * @Date: 2022-05-11 11:40:06
 * @LastEditTime: 2023-04-25 13:59:49
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/borrowed/testJig/index.vue
-->
<template>
    <div>
      <a-spin tip="导出中..." :spinning="isExportLod">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-form layout="horizontal" :form="searchForm">
            <div :class="advanced ? null : 'fold'">
              <a-row>
                <a-col :md="6" :sm="24">
                  <a-form-item label="公司名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-decorator="['enterpriseid']" placeholder="请选择公司名称">
                      <a-select-option v-for="item in enterList" :key="item.EnterId" :value="item.EnterId">{{ item.EnterName }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="位号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input style="width: 200px" allowClear placeholder="请输入位号" v-decorator="['placecode']" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input style="width: 200px" allowClear placeholder="请输入品号" v-decorator="['itemcode']" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="规格" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input style="width: 200px" allowClear placeholder="请输入规格" v-decorator="['itemspecification']" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="尺寸" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input style="width: 200px" allowClear placeholder="请输入尺寸" v-decorator="['size']" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="使用次数" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input-number v-decorator="['usetimesstart']" :min="0" />
                    <span>-</span>
                    <a-input-number v-decorator="['usetimesend']" :min="0" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select style="width: 200px" allowClear placeholder="请选择状态" v-decorator="['status']">
                      <a-select-option value="">全部</a-select-option>
                      <a-select-option value="已借出">已借出</a-select-option>
                      <a-select-option value="已归还">已归还</a-select-option>
                      <a-select-option value="钢网异常">钢网异常</a-select-option>
                      <a-select-option value="未使用">未使用</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="排序" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select style="width: 200px" allowClear placeholder="请选择排序" v-decorator="['orderway']">
                      <a-select-option value="PLACE_CODE_ASC">位号 - 正序</a-select-option>
                      <a-select-option value="PLACE_CODE_DESC">位号 - 倒序</a-select-option>
                      <a-select-option value="DATETIME_LEND_ASC">最后借出时间 - 正序</a-select-option>
                      <a-select-option value="DATETIME_LEND_DESC">最后借出时间 - 倒序</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="searchBtn">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-form>
          <div class="operator">
            <!-- <a-button type="primary" @click="exportExcel" icon="export">导出</a-button> -->
            <a-button v-if="hasPerm('import')" icon="import" type="primary" :loading="loading" @click="isImportExcel = true" style="margin-left: 8px">导入</a-button>
          </div>
          <a-table
            :columns="columns"
            :data-source="dataSource"
            size="small"
            :scroll="{ y: scrollY }"
            :loading="loading"
            :pagination="pagination"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            @change="handleTableChange"
            :rowKey="(dataSource) => dataSource.Id"
            bordered
          >
            <template slot="index" slot-scope="text, record, index">
              <div>
                <span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
              </div>
            </template>
            <template slot="Status" slot-scope="record">
              <div>
                <a-tag color="orange" v-if="record === '已借出'">{{ record }}</a-tag>
                <a-tag color="green" v-if="record === '已归还'">{{ record }}</a-tag>
                <a-tag color="red" v-if="record === '钢网异常'">{{ record }}</a-tag>
                <a-tag color="blue" v-if="record === '未使用'">{{ record }}</a-tag>
              </div>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a-popconfirm title="确定删除?" v-if="record.Status !== '已借出'" @confirm="() => onDelete(record.Id)">
                  <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                    <a-icon type="delete" />
                    删除
                  </a>
                </a-popconfirm>
                <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
                  <a-icon type="edit" />
                  编辑
                </a>
                <a style="margin-right: 8px" @click="history(record)" :disabled="record.RowNumber == 0">
                  <a-icon type="clock-circle" />
                  历史
                </a>
                <a style="margin-right: 8px" @click="borrowed(record)" :disabled="record.Status == '已借出' || record.Status == '钢网异常'">
                  <a-icon type="export" />
                  借出
                </a>
              </div>
            </template>
          </a-table>
        </a-card>
        <useForm v-if="isForm" :isEdit="isEdit" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
        <HistoryList v-if="isHistory" :editData="editData" @closeModal="closeModal" @success="searchBtn" />
        <ImportExcel v-if="isImportExcel" @closeModal="closeModal" :enterList="enterList" @success="searchBtn" />
      </a-spin>
    </div>
  </template>
  
  <script>
  import { getLampAction, setLampAction } from "@/services/web.js";
  import { renderStripe } from "@/utils/stripe.js";
  import getTableScroll from "@/utils/setTableHeight";
  import { splitData } from "@/utils/util.js";
  import { PublicVar } from "@/mixins/publicVar.js";
  import { columns, innerColumns } from "./data";
  import useForm from "./form.vue";
  import HistoryList from "./history.vue";
  import ExportExcel from "@/utils/ExportExcelJS";
  import ImportExcel from "./ImportExcel.vue";
  export default {
    mixins: [PublicVar],
    components: { useForm, HistoryList, ImportExcel },
    data() {
      return {
        scrollY: "",
        advanced: true,
        columns,
        innerColumns,
        dataSource: [],
        deviceTypeList: [],
        isSearch: 0,
        isExportLod: false,
        editData: [],
        isEdit: false,
        isForm: false,
        selectedRowKeys: [],
        enterList: [],
        enterId: "",
        innerData: [],
        expandedRowKeys: [],
        defaultExpandedRowKeys: [],
        defFlowId: "",
        qrData: [],
        isHistory: false,
        isBorrowed: false,
        isImportExcel: false,
      };
    },
    updated() {
      renderStripe();
    },
    created() {
      this.$nextTick(() => {
        this.scrollY = getTableScroll(70);
      });
      this.getEnterList();
    },
    methods: {
      splitData,
      history(record) {
        this.editData = record;
        this.isHistory = true;
      },
      //重置搜索
      reset() {
        this.isSearch = 0;
        this.searchForm.resetFields();
        this.getEnterList();
      },
      edit(record) {
        this.isForm = true;
        this.isEdit = true;
        this.editData = record;
      },
      borrowed(record) {
        this.isBorrowed = true;
        this.editData = record;
      },
      closeModal() {
        this.isForm = false;
        this.isHistory = false;
        this.isBorrowed = false;
        this.isImportExcel = false;
      },
      getEnterList() {
        getLampAction({ entertypecode: "COMPANY" }, "getenterlist").then((res) => {
          if (res.data.success) {
            this.enterList = res.data.data;
            this.searchForm.setFieldsValue({
              enterpriseid: this.enterList[0].EnterId,
            });
            this.searchBtn();
          }
        });
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
      },
      searchBtn() {
        this.pagination.current = 1;
        this.search();
      },
      search() {
        this.searchForm.validateFields((err, values) => {
          if (!err) {
            this.loading = true;
            let params = {
              pageindex: this.pagination.current,
              pagesize: this.pagination.pageSize,
              enterpriseid: values.enterpriseid,
              placecode: values.placecode,
              itemcode: values.itemcode,
              itemspecification: values.itemspecification,
              size: values.size,
              status: values.status,
              usetimesstart: values.usetimesstart,
              usetimesend: values.usetimesend,
              orderway: values.orderway,
            };
            getLampAction(params, "getlpsmlist").then((res) => {
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
      //多选删除
      allDel() {
        let self = this;
        self.$confirm({
          title: "确定要删除选中内容",
          onOk() {
            let params = {
              List: [],
            };
            self.dataSource.forEach((res) => {
              if (self.selectedRowKeys.includes(res.Id)) {
                params.List.push({
                  Id: res.Id,
                });
              }
            });
            setLampAction(params, "deletelpsm").then((res) => {
              if (res.data.success) {
                self.selectedRowKeys = [];
                self.$message.success("删除成功!");
                self.searchBtn();
              }
            });
          },
          onCancel() {},
        });
      },
      //单个删除
      onDelete(id) {
        let params = {
          List: [
            {
              Id: id, //员工ID
            },
          ],
        };
        setLampAction(params, "deletelpsm").then((res) => {
          if (res.data.success) {
            this.$message.success("删除成功!");
            this.searchBtn();
          }
        });
      },
      exportExcel() {
        let values = this.searchForm.getFieldsValue();
        let params = {
          pageindex: this.pagination.current,
          pagesize: this.pagination.total,
          enterpriseid: values.enterpriseid,
          placecode: values.placecode,
          itemcode: values.itemcode,
          itemspecification: values.itemspecification,
          size: values.size,
          status: values.status,
          usetimesstart: values.usetimesstart,
          usetimesend: values.usetimesend,
          orderway: values.orderway,
        };
        getLampAction(params, "getlpsmlist").then((res) => {
          if (res.data.success) {
            let list = res.data.data.list;
            const dataSource = list.map((item) => {
              Object.keys(item).forEach((key) => {
                // 后端传null node写入会有问题
                if (item[key] === null) {
                  item[key] = "";
                }
                if (Array.isArray(item[key])) {
                  item[key] = item[key].join(",");
                }
              });
              return item;
            });
            const header = [];
            this.columns.map((item) => {
              if (item.dataIndex) {
                header.push({ key: item.dataIndex, title: item.title });
              }
            });
            var timestamp = Date.parse(new Date());
            try {
              ExportExcel(header, dataSource, `灯板钢网借还登记_${timestamp}.xlsx`);
              this.$message.success("导出数据成功!");
            } catch (error) {
              // console.log(error);
              this.$message.error("导出数据失败");
            }
            this.isExportLod = false;
          }
        });
      },
    },
  };
  </script>
  
  <style scoped lang="less">
  /deep/.ant-table:nth-of-type(0) {
    min-height: 62vh;
  }
  .ant-form-item {
    margin-bottom: 5px;
  }
  </style>
  
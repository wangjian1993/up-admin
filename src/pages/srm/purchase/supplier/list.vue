<template>
    <div>
      <a-spin tip="导出中..." :spinning="isExportLod">
        <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
          <a-form layout="horizontal" :form="searchForm">
            <a-row>
              <!-- <a-col :span="8">
                <a-radio-group style="margin-top: 5px;" default-value="全部" v-model="listType" button-style="solid" @change="searchBtn">
                  <a-radio-button v-for="(item, index) in tagItem" :value="item" :key="index">
                    {{ item }}
                  </a-radio-button>
                </a-radio-group></a-col
              > -->
              <a-col :md="6" :sm="24">
                <a-form-item label="" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                  <a-input style="width: 300px" placeholder="请输入搜索内容" v-decorator="['keyword']" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-button type="primary" style="margin-top: 5px;" @click="searchBtn">查询</a-button>
                <a-button style="margin-left: 8px;margin-top: 5px;" @click="toggleAdvanced">高级搜索</a-button>
              </a-col>
            </a-row>
            <div :class="advanced ? null : 'fold'" v-if="advanced">
              <a-row>
                <a-col :md="6" :sm="24">
                  <a-form-item label="标题" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-input style="width: 200px" placeholder="请输入标题" v-decorator="['title']" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="到期时间" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-range-picker style="width: 300px" v-decorator="['range-time-picker1']" />
                  </a-form-item>
                </a-col>
                <a-col :md="6" :sm="24">
                  <a-form-item label="状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
                    <a-select v-decorator="['status']" placeholder="请选择订单状态" style="width: 200px">
                      <a-select-option :value="item" v-for="(item, index) in tagItem" :key="index">{{ item }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <span style="float: right; margin-top: 3px;">
                <a-button type="primary" @click="searchBtn">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              </span>
            </div>
          </a-form>
          <div class="operator">
            <a-button style="margin-left: 8px" type="primary" @click="isSetClass = true" icon="usergroup-add">设置资质分类</a-button>
            <span style="margin-left: 8px">
              <template v-if="hasSelected">
                {{ `共选中 ${selectedRowKeys.length} 条` }}
              </template>
            </span>
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
                <a-tag color="green" v-if="record == '有效'">{{ record }}</a-tag>
                <a-tag color="red" v-else>{{ record }}</a-tag>
              </div>
            </template>
            <template slot="InviteStatus" slot-scope="record">
              <div>
                <a-tag color="green" v-if="record == '已加入'">{{ record }}</a-tag>
                <a-tag color="red" v-else>{{ record }}</a-tag>
              </div>
            </template>
            <template slot="action" slot-scope="text, record">
              <div>
                <a style="margin-right: 8px" @click="detail(record)">
                  <a-icon type="plus" />
                  查看
                </a>
                <!-- <a v-if="record.InviteStatus == '已加入'" style="margin-right: 8px" @click="actionBtn(record, 'remove')" :disabled="!hasPerm('relieve')">
                  <a-icon type="stop" />
                  解除
                </a>
                <a style="margin-right: 8px" @click="authority(record.Id)" :disabled="!hasPerm('astrict')">
                  <a-icon type="warning" />
                  交易限制
                </a>
                <a v-if="record.InviteStatus != '已加入'" style="margin-right: 8px" @click="actionBtn(record, 'agree')" :disabled="!hasPerm('ok')">
                  <a-icon type="check-circle" />
                  同意
                </a>
                <a v-if="record.InviteStatus != '已加入'" style="margin-right: 8px" @click="actionBtn(record, 'reject')" :disabled="!hasPerm('ng')">
                  <a-icon type="close-circle" />
                  拒绝
                </a> -->
              </div>
            </template>
          </a-table>
        </a-card>
        <SetClass v-if="isSetClass" @closeModal="closeModal"/>
      </a-spin>
    </div>
  </template>
  
  <script>
  import { getQuaList } from "@/services/srm.js";
  import { renderStripe } from "@/utils/stripe.js";
  import getTableScroll from "@/utils/setTableHeight";
  import { splitData } from "@/utils/util.js";
  import { PublicVar } from "@/mixins/publicVar.js";
  import { columns } from "./data/list";
  import SetClass from './component/setClass.vue'
  export default {
    mixins: [PublicVar],
    components: {SetClass},
    data() {
      return {
        scrollY: "",
        advanced: false,
        columns,
        dataSource: [],
        isSearch: 0,
        isExportLod: false,
        selectedRowKeys: [],
        isImport: false,
        listType: "全部",
        isDetail: false,
        docno: "",
        isInvite: false,
        isAuthority:false,
        detailId: "",
        authorityId:"",
        isSetClass:false,
        tagItem: ["全部", "邀请中", "已加入", "未加入", "黑名单", "临近到期", "已过期"],
      };
    },
    updated() {
      renderStripe();
    },
    created() {
      this.$nextTick(() => {
        this.scrollY = getTableScroll(70);
      });
      this.search();
    },
    methods: {
      splitData,
      //重置搜索
      reset() {
        this.isSearch = 0;
        this.searchForm.resetFields();
        this.listType = "全部";
        this.search();
      },
      toggleAdvanced() {
        this.advanced = !this.advanced;
        if (this.advanced) {
          console.log("打开====");
          this.scrollY = getTableScroll(120);
        } else {
          console.log("关闭====");
          this.scrollY = getTableScroll(0);
        }
        console.log("scrollY===", this.scrollY);
      },
      authority(Id){
        this.authorityId = Id;
        this.isAuthority = true
      },
      detail(record) {
        this.isDetail = true;
        this.detailId = record.Id;
      },
      closeModal() {
        this.isInvite = false;
        this.isDetail = false;
        this.isSetClass = false;
      },
      //多选
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      //分页
      handleTableChange(pagination) {
        this.pagination.current = pagination.current;
        this.pagination.pageSize = pagination.pageSize;
        this.search();
      },
      invite() {
        this.isInvite = true;
      },
      searchBtn() {
        this.pagination.current = 1;
        this.search();
      },
      search() {
        this.searchForm.validateFields((err, values) => {
          if (!err) {
            this.loading = true;
            if (values["range-time-picker1"] && values["range-time-picker1"].length == 2) {
              const rangeValue = values["range-time-picker1"];
              var starttime = rangeValue[0].format("YYYY-MM-DD");
              var endtime = rangeValue[1].format("YYYY-MM-DD");
            }
            let params = {
              pageindex: this.pagination.current,
              pagesize: this.pagination.pageSize,
              keyword: values.keyword,
              tag: this.listType,
              title: values.title,
              starttime: starttime,
              endtime: endtime,
              status: values.status,
            };
            getQuaList(params, "get").then((res) => {
              if (res.data.success) {
                this.dataSource = res.data.data.list;
                const pagination = { ...this.pagination };
                pagination.total = res.data.data.totalCount;
                this.pagination = pagination;
                this.isSearch = 2;
              }
              this.loading = false;
            });
            // do something
          }
        });
      }
    },
  };
  </script>
  
  <style lang="less">
  /deep/.ant-table {
    min-height: 62vh;
  }
  .ant-form-item {
    margin-bottom: 5px;
  }
  </style>
  
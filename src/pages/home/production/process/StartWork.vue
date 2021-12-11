<!--
 * @Author: max
 * @Date: 2021-12-11 09:42:18
 * @LastEditTime: 2021-12-11 17:05:02
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/production/process/StartWork.vue
-->
<template>
  <!-- 搜索 -->
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-card :bodyStyle="{ padding: '5px' }" bordered>
      <a-descriptions :column="5" size="small">
        <a-descriptions-item label="工单/工单扫码" :span="2">
          <div style="display:flex"><a-textarea style="width:400px" allowClear ref="orderValue" v-model="orderValue" placeholder="" @pressEnter="startWork" auto-size /></div>
        </a-descriptions-item>
        <a-descriptions-item label="生产工厂">
          {{ userLineData.PlantName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产车间">
          {{ userLineData.WorkshopName }}
        </a-descriptions-item>
        <a-descriptions-item label="生产产线">
          {{ userLineData.LineName }}
        </a-descriptions-item>
        <a-descriptions-item label="填单人/填单时间">
          {{ userLineData.UserName }}
        </a-descriptions-item>
        <a-descriptions-item label="产品品号">{{ orderInfo.ProCode }}</a-descriptions-item>
        <a-descriptions-item label="产品品名">{{ orderInfo.ProName }}</a-descriptions-item>
        <a-descriptions-item label="计划生产时间">{{ orderInfo.PlanDate }}</a-descriptions-item>
        <a-descriptions-item label="计划生产数量">{{ orderInfo.PlanQty }}</a-descriptions-item>
        <a-descriptions-item label="开工数量"><a-input-number :min="0" :max="10" style="width:200px"/></a-descriptions-item>
        <a-descriptions-item>
          <a-button type="primary" icon="check-circle" @click="startWork">
            开工
          </a-button>
          <a-button style="margin-left:10px" type="primary" icon="export" @click="handlePrint()">
            打印工单
          </a-button></a-descriptions-item
        >
      </a-descriptions>
    </a-card>
    <div style="margin:10px 0">
      <a-list size="small" bordered :data-source="listData" style="height:180px;overflow: auto;">
        <a-list-item slot="renderItem" slot-scope="item" :split="false">
          <span :style="!IsSuccess ? 'color:red' : 'color:#0223e0'">[{{ item.time }}] {{ item.content }}</span>
        </a-list-item>
      </a-list>
      <a-button style="margin:5px 0;" type="primary" icon="delete" @click="closeListData">
        清空消息
      </a-button>
    </div>
    <!-- 列表 -->
    <div class="tab">
      <a-table
        v-if="hasPerm('search')"
        :columns="columns"
        :data-source="data"
        size="small"
        :scroll="{ y: true }"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
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
        <template slot="Enable" slot-scope="text">
          <div>
            <a-tag :color="text == 'Y' ? 'green' : 'red'">{{ text == "Y" ? "启用" : "禁用" }}</a-tag>
          </div>
        </template>
        <template slot="action" slot-scope="text, record">
          <div>
            <a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
              <a style="margin-right: 8px" :disabled="!hasPerm('delete')">
                <a-icon type="delete" />
                删除
              </a>
            </a-popconfirm>
            <a style="margin-right: 8px" @click="edit(record)" :disabled="!hasPerm('edit')">
              <a-icon type="edit" />
              编辑
            </a>
          </div>
        </template>
      </a-table>
      <a-empty v-else description="暂无权限" />
      <print v-if="isPrint" :printData="printData" @closeModal="closeModal"></print>
    </div>
  </a-card>
</template>
<script>
import { getProductionPersonnel, setProductionPersonnel, setStartWorkApi, getPrintInfo } from "@/services/web.js";
import { renderStripe } from "@/utils/stripe.js";
import { columns } from "./data.js";
import { PublicVar } from "@/mixins/publicVar.js";
import Print from "../components/print.vue";
export default {
  components: { Print },
  mixins: [PublicVar],
  data() {
    return {
      data: [],
      listData: [],
      columns,
      isEdit: false,
      editForm: [],
      visible: false,
      plantList: [],
      codeTags: [],
      plantid: "",
      isAddUser: false,
      isAddCategory: false,
      searcValue: "",
      processData: [],
      userLineData: [],
      orderValue: "",
      loading: false,
      busy: false,
      orderInfo: [],
      printData: [],
      isPrint: false,
      IsSuccess: false,
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
    this.getWorkInfo();
    // this.getCategorysList();
  },
  mounted() {
    this.$refs.orderValue.focus();
  },
  methods: {
    closeListData() {
      this.listData = [];
    },
    //打印工单
    handlePrint() {
      let parmas = {
        id: this.orderInfo.ProPlanId,
      };
      getPrintInfo(parmas, "getprintinfo").then((res) => {
        if (res.data.success) {
          this.isPrint = true;
          this.printData = res.data.data;
        }
      });
    },
    getTimeData() {
      var date = new Date();
      var year = date.getFullYear(); //年 ,从 Date 对象以四位数字返回年份
      var month = date.getMonth() + 1; //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
      var day = date.getDate(); //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
      var hours = date.getHours(); //小时 ,返回 Date 对象的小时 (0 ~ 23)
      var minutes = date.getMinutes(); //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
      var seconds = date.getSeconds(); //秒 ,返回 Date 对象的秒数 (0 ~ 59)
      //修改月份格式
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      //修改日期格式
      if (day >= 0 && day <= 9) {
        day = "0" + day;
      }
      //修改小时格式
      if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
      }
      //修改分钟格式
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      }
      //修改秒格式
      if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
      }
      //获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
      let currentFormatDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
      return currentFormatDate;
    },
    pushKeyword(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        return false;
      }
    },
    closeModal() {
      this.visible = false;
      this.isPrint = false;
    },
    getWorkInfo() {
      setStartWorkApi("", "loaduserline").then((res) => {
        if (res.data.success) {
          this.processData = res.data.data.Process;
          this.userLineData = res.data.data.UserLine;
        }
      });
    },
    //开工
    startWork(e) {
      if (e.keyCode == 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
      }
      if (!this.orderValue) {
        let message = {
          content: "请先输入工单号，或者扫描工单二维码",
          time: this.getTimeData(),
        };
        this.IsSuccess = false;
        this.listData.unshift(message);
        return;
      }
      let parmas = {
        ScanCode: this.orderValue.trim(),
        ProcessCode: "ASSEMBLE_PROCESS",
        ProcessStatus: "PROCESS_START",
      };
      setStartWorkApi(parmas, "scan").then((res) => {
        res.data.message.time = this.getTimeData();
        if (res.data.success) {
          this.IsSuccess = res.data.data.IsSuccess;
          if (res.data.data.IsSuccess) {
            res.data.message.content = "开工提交成功";
            this.orderInfo = res.data.data;
            this.listData.unshift(res.data.message);
          } else {
            res.data.message.content = res.data.data.Msg;
            this.listData.unshift(res.data.message);
          }
        }
      });
    },
    //多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //重置搜索
    reset() {
      this.getListAll();
      this.searchForm.resetFields();
    },
    //关键词搜索
    search() {
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          console.log("Received values of form: ", values);
          this.data = [];
          this.pagination.total = 0;
          let parmas = {
            pageindex: this.pagination.current,
            pagesize: this.pagination.pageSize,
            plantid: values.plantid,
            workshop: values.workshop,
            line: values.line,
            user: values.user,
          };
          getProductionPersonnel(parmas, "getall").then((res) => {
            if (res.data.success) {
              this.data = res.data.data.list;
              const pagination = { ...this.pagination };
              pagination.total = res.data.data.recordsTotal;
              this.pagination = pagination;
              this.loading = false;
              this.isSearch = true;
            }
          });
          // do something
        }
      });
    },
    //获取机构类型列表
    getListAll() {
      this.loading = true;
      let parmas = {
        pageindex: this.pagination.current,
        pagesize: this.pagination.pageSize,
      };
      getProductionPersonnel(parmas, "getall").then((res) => {
        if (res.data.success) {
          this.data = res.data.data.list;
          const pagination = { ...this.pagination };
          pagination.total = res.data.data.recordsTotal;
          this.pagination = pagination;
          this.loading = false;
          this.isSearch = false;
        } else {
          this.loading = false;
        }
      });
    },
    //打开对话框
    add() {
      this.isEdit = false;
      this.visible = true;
    },
    //编辑
    edit(item) {
      this.visible = true;
      this.isEdit = true;
      this.editData = item;
    },
    //多选删除
    allDel() {
      let self = this;
      self.$confirm({
        title: "确定要删除选中内容",
        onOk() {
          let parmas = [];
          self.selectedRowKeys.forEach((item) => {
            parmas.push({
              PlantId: self.data[item].PlantId,
              UserCode: self.data[item].UserCode,
              WorkshopId: self.data[item].WorkshopId,
            });
          });
          setProductionPersonnel(parmas, "delete").then((res) => {
            if (res.data.success) {
              self.selectedRowKeys = [];
              self.$message.success("删除成功!");
              self.getListAll();
            }
          });
        },
        onCancel() {},
      });
    },
    //单个删除
    onDelete(item) {
      let parmas = [];
      parmas.push({
        UserCode: item.UserCode,
        PlantId: item.PlantId,
        WorkshopId: item.WorkshopId,
      });
      setProductionPersonnel(parmas, "delete").then((res) => {
        if (res.data.success) {
          this.$message.success("删除成功!");
          this.getListAll();
        }
      });
    },
    //删除tag
    handleClose(index, type) {
      if (type == 2) {
        this.codeTags.splice(index, 1);
        return;
      }
      this.categorytags.splice(index, 1);
    },
    //分页操作
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      if (this.isSearch) {
        this.search();
        return;
      }
      this.getListAll();
    },
  },
};
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 5px;
}
/deep/.ant-table {
  min-height: 71vh;
  max-height: 71vh;
  overflow: auto;
}
/deep/ .ant-list-sm .ant-list-item {
  padding-top: 2px;
  padding-bottom: 2px;
}
/deep/ .ant-list-split .ant-list-item {
  border-bottom: none;
}
/deep/ .ant-list {
  font-size: 10px;
}
</style>

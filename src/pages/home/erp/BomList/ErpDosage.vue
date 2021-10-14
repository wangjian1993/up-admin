<!--
 * @Author: max
 * @Date: 2021-10-14 16:15:42
 * @LastEditTime: 2021-10-14 16:49:56
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/home/erp/BomList/ErpDosage.vue
-->
<template>
  <div>
    <a-modal v-model="visible" title="BOM用量信息" @cancel="close" width="90%" :footer="null" centered>
      <a-spin tip="loading..." :spinning="loading">
        <div>
          <a-descriptions :column="5" bordered>
            <a-descriptions-item label="主件品号">
              {{ info.ITEM_CODE }}
            </a-descriptions-item>
            <a-descriptions-item label="快捷码">
              {{ info.SHORTCUT }}
            </a-descriptions-item>
            <a-descriptions-item label="品号类型">
              {{ modelType(info.ITEM_PROPERTY) }}
            </a-descriptions-item>
            <a-descriptions-item label="版次">
              {{ info.VERSION_TIMES }}
            </a-descriptions-item>
            <a-descriptions-item label="单位">
              {{ info.UNIT_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label="产品型号">
              {{ info.ITEM_NAME }}
            </a-descriptions-item>
            <a-descriptions-item label=" 备注">
              {{ info.REMARK }}
            </a-descriptions-item>
            <a-descriptions-item label=" 工厂">
              {{ info.PLANT_NAME_P }}
            </a-descriptions-item>
            <a-descriptions-item label="引用工厂">
              {{ info.PLANT_CODE_R }}
            </a-descriptions-item>
            <a-descriptions-item label=" 图号">
              {{ info.DRAWING_NO }}
            </a-descriptions-item>
            <a-descriptions-item label=" 标准批量">
              {{ info.ItemSpecification }}
            </a-descriptions-item>
            <a-descriptions-item label=" 创建日期:">
              {{ splitData(info.CreateDate) }}
            </a-descriptions-item>
            <a-descriptions-item label=" 生效状态">
              {{ info.ApproveStatus }}
            </a-descriptions-item>
            <a-descriptions-item label=" 最后修改日期">
              {{ splitData(info.LastModifiedDate) }}
            </a-descriptions-item>
            <a-descriptions-item label=" 规格">
              {{ info.ITEM_SPECIFICATION }}
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div>
          <a-card title="物料列表" class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
            <a-table :columns="columns" :data-source="list" :size="size" :scroll="{ y: true }" :pagination="pagination" :rowKey="(list) => list.IndexNo + 'tab1'" bordered>
                  <div slot="e10" slot-scope="text, record">
                    <p>{{ record.PriceErpSource == "" ? text : text + `(${record.PriceErpSource})` }}</p>
                  </div>
                </a-table>
          </a-card>
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { getERPReportAction } from "@/services/erp.js";
import { splitData, modelType } from "@/utils/util.js";
export default {
  props: ["info","columns"],
  data() {
    return {
      size: "small",
      visible: true,
      list: [],
      pagination: false,
      ConfigList: [],
      loading: false,
      treeData: [],
    };
  },
  created() {
    // this.getList();
  },
  methods: {
    splitData, modelType,
    close() {
      this.$emit("closeModal");
    },
    getList() {
      this.loading = true;
      let parmas = {
        Id: this.detailsId,
      };
      getERPReportAction(parmas, "getbominfo").then((res) => {
        if (res.data.success) {
          this.list = res.data.data.ItemInfo.ItemChildList;
          this.info = res.data.data.ItemInfo;
          this.ConfigList = this.arrayGroup(res.data.data.ConfigList);
          let data = [];
          this.list.forEach((item) => {
            {
              if (item.LastCode !== this.info.ItemCode) {
                data.push(item);
              }
            }
          });
          this.treeData = this.initTree(data, 3);
          this.calField(this.treeData);
        }
        this.loading = false;
      });
    },
    calField(tree) {
      tree.forEach((node) => {
        if (node.children && node.children.length > 0) {
          // console.log(node.children)
          this.calField(node.children);
          node.Amount = node.children.reduce((sum, item) => ((sum += item.Amount), parseFloat(sum.toFixed(4))), 0);
        } else {
          let sum = node.Amount * 1;
          node.Amount = parseFloat(sum.toFixed(4));
          delete node.children;
        }
      });
      return tree;
    },
    initTree(parent_id, no) {
      // jsonArray 变量数据
      // 第一次以后：根据id去查询parent_id相同的（相同为子数据）
      // 第一次：查找所有parent_id为-1的数据组成第一级
      const child = this.list.filter((item) => item.LastCode == parent_id || item.LvNo == no);
      // 第一次：循环parent_id为-1数组
      return child.map((item) => ({
        ...item,
        // 当前存在id（id与parent_id应该是必须有的）调用initTree() 查找所有parent_id为本id的数据
        // childs字段写入
        children: this.initTree(item.ChildCode),
      }));
    },
    //查看详情
    onClose() {
      this.isDrawer = false;
    },
    //关闭对话框
    handleCancel() {
      this.isAddModal = false;
    },
  },
  components: {},
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
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
  background: rgba(0, 0, 0, 0.05);
}
/deep/.ant-card-head {
  padding: 0;
}
/deep/.ant-table{
  min-height:77vh;
  max-height:77vh;
  overflow: auto;
}
</style>

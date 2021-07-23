<!--
 * @Author: max
 * @Date: 2021-07-07 10:19:01
 * @LastEditTime: 2021-07-07 15:38:49
 * @LastEditors: max
 * @Description: 配置版本
 * @FilePath: /mb-admin/src/pages/bom/versionsConfig/VersionsConfig.vue
-->

<template>
  <div class="content">
    <a-table
      :columns="columns"
      :pagination="false"
      :data-source="list"
      size="small"
      :loading="isLoading"
    >
      <template slot="action" slot-scope="text, record, index">
        <div>
          <a
            style="margin-right: 8px"
            v-if="
              record.field_name != 'bom_cost' &&
                record.field_name != 'total_cost'
            "
            @click="deleteList(index)"
          >
            <a-icon type="delete" />
            删除
          </a>
        </div>
      </template>
      <template slot="use" slot-scope="text, record, index">
        <a-checkbox
          v-if="record.is_use"
          default-checked
          disabled
          @change="(e) => setChange(record, index)"
        ></a-checkbox>
      </template>
      <template slot="read" slot-scope="text, record, index">
        <a-checkbox
          v-if="
            record.field_name == 'bom_cost' || record.field_name == 'total_cost'
          "
          default-checked
          disabled
        ></a-checkbox>
        <a-checkbox
          v-else-if="record.is_readonly"
          default-checked
          @change="(e) => setChange('is_readonly', index)"
        ></a-checkbox>
        <a-checkbox
          v-else
          @change="(e) => setChange('is_readonly', index)"
        ></a-checkbox>
      </template>
      <template slot="compute" slot-scope="text, record, index">
        <a-checkbox
          v-if="
            record.field_name == 'bom_cost' || record.field_name == 'total_cost'
          "
          default-checked
          disabled
        ></a-checkbox>
        <a-checkbox
          v-else-if="record.is_auto_compute"
          default-checked
          @change="(e) => setChange('is_auto_compute', index)"
        ></a-checkbox>
        <a-checkbox
          v-else
          @change="(e) => setChange('is_auto_compute', index)"
        ></a-checkbox>
      </template>
      <template slot="msg" slot-scope="text, record, index">
        <a-input @change="(e) => inputChange(e, 'tips_desc', index)" />
      </template>
      <template slot="parameter" slot-scope="text, record, index">
        <a-input-number
          :min="0"
          @change="(e) => numberChange(e, 'base_number', index)"
        ></a-input-number>
      </template>
      <template slot="sort" slot-scope="text, record, index">
        <a-input-number
          :min="0"
          @change="(e) => numberChange(e, 'order', index)"
        ></a-input-number>
      </template>
    </a-table>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      type="dashed"
      icon="plus"
      @click="newMember"
      >添加更多费用</a-button
    >
    <a-modal
      v-model="visible"
      title="添加更多费用"
      ok-text="确认"
      cancel-text="取消"
      @ok="hideModal"
    >
      <a-checkbox-group
        v-model="checkValue"
        name="checkboxgroup"
        :options="dataSource"
      />
    </a-modal>
    <footer-tool-bar>
      <a-select
        default-value="UP"
        style="width: 120px;padding-right: 20px;"
        @change="companyChange"
      >
        <a-select-option value="UP">深圳民爆</a-select-option>
        <a-select-option value="AGC">艾格斯特</a-select-option>
        <a-select-option value="EP">易欣光电</a-select-option>
        <a-select-option value="依炮尔">依炮尔</a-select-option>
      </a-select>
      <a-button type="primary" @click="validate">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from "@/components/tool/FooterToolBar";
const columns = [
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: "80px",
    scopedSlots: { customRender: "action" },
  },
  {
    title: "费用名称",
    dataIndex: "cost_name",
    align: "center",
  },
  {
    title: "字段名",
    dataIndex: "field_name",
    align: "center",
  },
  {
    title: "是否使用",
    dataIndex: "is_use",
    align: "center",
    scopedSlots: { customRender: "use" },
  },
  {
    title: "是否只读",
    dataIndex: "is_readonly",
    align: "center",
    scopedSlots: { customRender: "read" },
  },
  {
    title: "是否自动计算",
    dataIndex: "is_auto_compute",
    align: "center",
    scopedSlots: { customRender: "compute" },
  },
  {
    title: "提示描述",
    dataIndex: "tips_desc",
    align: "center",
    scopedSlots: { customRender: "msg" },
  },
  {
    title: "基础参数",
    dataIndex: "base_number",
    align: "center",
    width: "120px",
    scopedSlots: { customRender: "parameter" },
  },
  {
    title: "排序",
    dataIndex: "order",
    align: "center",
    width: "80px",
    scopedSlots: { customRender: "sort" },
  },
];
const options = [
  { label: "Apple", value: "Apple" },
  { label: "Pear", value: "Pear" },
  { label: "Orange", value: "Orange" },
];
import { getBomBaseConfig, setVersionsConfig } from "@/services/bom.js";
export default {
  data() {
    return {
      list: [],
      columns,
      isLoading: true,
      company: "UP",
      dataSource: [],
      visible: false,
      checkValue: [],
      options,
    };
  },
  created() {
    this.getBomBaseConfig();
  },
  methods: {
    /**
     * @description: 获取初始配置数据
     * @param {*}
     * @return {*}
     */
    getBomBaseConfig() {
      getBomBaseConfig("get_base").then((res) => {
        if (res.data.success) {
          // this.list = res.data.data;
          this.isLoading = false;
          const defaultObj = {
            is_use: false,
            is_readonly: false,
            is_auto_compute: false,
            tips_desc: "",
            base_number: "",
            order: 0,
          };
          res.data.data.forEach((item) => {
            var array = {
              ...item,
              ...defaultObj,
            };
            array.label = array.cost_name;
            array.value = array.id;
            // this.dataSource = array;
            if (
              array.field_name == "bom_cost" ||
              array.field_name == "total_cost"
            ) {
              array.is_use = true;
              array.is_readonly = true;
              array.is_auto_compute = true;
              this.list.push(array);
            } else {
              this.dataSource.push(array);
            }
          });
        }
      });
    },

    /**
     * @description: 提交设置
     * @param {*}
     * @return {*}
     */
    validate() {
      let param = {
        act: "add_version",
        company_sign: this.company,
        configArray: [],
      };
      this.list.forEach((item) => {
        let obj = {};
        obj.id = item.id;
        obj.is_use = item.is_use ? 1 : 0;
        obj.is_readonly = item.is_readonly ? 1 : 0;
        obj.is_auto_compute = item.is_auto_compute ? 1 : 0;
        obj.tips_desc = item.tips_desc;
        obj.base_number = item.base_number;
        obj.order = item.order;
        param.configArray.push(obj);
      });
      console.log(param);
      setVersionsConfig(param).then((res) => {
        if (res.data.success) {
          this.$message.success("添加成功");
          // this.list = res.data.data;
          // this.isLoading = false;
        }
      });
    },
    /**
     * @description:
     * @param {*}
     * @return {*}
     */

    newMember() {
      this.visible = true;
      this.checkValue = [];
    },
    /**
     * @description: 设置是否使用
     * @param {*} key 修改key值
     * @param {*} index 索引
     * @return {*}
     */
    setChange(key, index) {
      this.list[index][key] = !this.list[index][key];
    },
    inputChange(e, key, index) {
      this.list[index][key] = e.target.value;
    },
    numberChange(e, key, index) {
      console.log(e);
      this.list[index][key] = e;
    },
    /**
     * @description: 添加行数据
     * @param {*}
     * @return {*}
     */

    hideModal() {
      this.dataSource = this.dataSource.filter((item) => {
        return this.checkValue.every((item2) => {
          if (item.id == item2) {
            item.is_use = true;
            this.list.push(item);
          }
          return item.id != item2;
        });
      });
      this.visible = false;
    },
    /**
     * @description: 删除行数据
     * @param {*} index 索引
     * @return {*}
     */

    deleteList(index) {
      this.dataSource.unshift(this.list[index]);
      this.list.splice(index, 1);
    },
    onChange() {},
    companyChange(value) {
      this.company = value;
    },
  },
  components: { FooterToolBar },
};
</script>

<style lang="less" scoped>
.content {
  background-color: @base-bg-color;
  padding: 0px;
}
</style>

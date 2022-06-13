<!--
 * @Author: max
 * @Date: 2022-06-13 09:53:31
 * @LastEditTime: 2022-06-13 10:23:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/eap/workbench/component/Bar.vue
-->
<template>
  <div :style="{ padding: '10px' }">
    <div :style="{ marginBottom: '20px' }" class="bar-table">
      <p>{{ title }}</p>
      <div>
        <a-radio-group default-value="a" button-style="solid" size="small">
          <a-radio-button value="a">
            昨日
          </a-radio-button>
          <a-radio-button value="b">
            今日
          </a-radio-button>
          <a-radio-button value="c">
            最近7天
          </a-radio-button>
        </a-radio-group>
        <a-range-picker style="margin-left:10px;width:240px" size="small" />
      </div>
    </div>
    <v-chart height="254" :data="data" :forceFit="true" :padding="['auto', 'auto', '40', '50']">
      <v-tooltip />
      <v-axis />
      <v-bar position="x*y" />
    </v-chart>
  </div>
</template>

<script>
export default {
  name: "Bar",
  props: {
    title: {
      type: String,
      default: "",
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    scale: {
      type: Array,
      default: () => {
        return [
          {
            dataKey: "x",
            min: 2,
          },
          {
            dataKey: "y",
            title: "时间",
            min: 1,
            max: 22,
          },
        ];
      },
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          "x*y",
          (x, y) => ({
            name: x,
            value: y,
          }),
        ];
      },
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="less">
.bar-table {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

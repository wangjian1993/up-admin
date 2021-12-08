/*
 * @Author: max
 * @Date: 2021-12-07 17:56:17
 * @LastEditTime: 2021-12-07 17:59:10
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/mes/productionBi/utils/resizeMixin.js
 */
// 混入代码 resize-mixins.js
import { debounce } from '../utils';
const resizeChartMethod = '$__resizeChartMethod';

export default {
  data() {
    // 在组件内部将图表 init 的引用映射到 chart 属性上
    return {
      chart: null,
    };
  },
  created() {
    window.addEventListener('resize', this[resizeChartMethod], false);
  },
  activated() {
    // 防止 keep-alive 之后图表变形
    if (this.chart) {
      this.chart.resize()
    }
  },
  beforeDestroy() {
    window.removeEventListener('reisze', this[resizeChartMethod]);
  },
  methods: {
    // 防抖函数来控制 resize 的频率
    [resizeChartMethod]: debounce(function() {
      if (this.chart) {
        this.chart.resize();
      }
    }, 300),
  },
};

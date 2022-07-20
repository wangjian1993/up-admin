<template>
  <a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
    <a-spin :spinning="spinning">
      <div class="content-title">
        <p>{{ title }}</p>
      </div>
      <div class="time-box">
        <a-icon @click="timeBefore" type="left-circle" :style="{ fontSize: '20px', color: '#e7e7e7' }" />
        <a-date-picker v-model="dayTime" class="date-box" @change="dateChange" />
        <a-icon @click="timeAfter" type="right-circle" :style="{ fontSize: '20px', color: '#e7e7e7' }" />
      </div>
      <div ref="chart" class="echarts-box" style="height:700px"></div>
    </a-spin>
  </a-card>
</template>

<script>
import * as echarts from "echarts";
import axios from "axios";
import moment from "moment";
export default {
  data() {
    return {
      ecItem: [],
      seriesData: [], //数据
      yAxisData_plant: [], //工厂名
      timeArr: [], //横坐标
      title: "生产工单进度看板",
      spinning: false,
      timeValue: "",
      dayTime: "",
      myChart: "",
    };
  },
  mounted() {
    let date = moment().format("YYYY-MM-DD");
    this.dayTime = date;
    // this.getEchartData();
    this.getDataList(date, false);
    this.timeSlot();
  },
  methods: {
    timeBefore() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() - 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      console.log(time);
      this.dayTime = time;
      this.getDataList(time, true);
    },
    timeAfter() {
      var diyDate = new Date(this.timeValue);
      let date = new Date(diyDate.setDate(diyDate.getDate() + 1));
      let time = date.getFullYear() + "-" + (date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
      console.log(time);
      this.dayTime = time;
      this.getDataList(time, true);
    },
    dateChange(e) {
      let date = e.format("YYYY-MM-DD");
      this.getDataList(date, true);
    },
    getDataList(date, flag) {
      // console.log("date");
      this.spinning = true;
      this.timeValue = date;
      this.ecItem = [];
      this.yAxisData_plant = [];
      this.seriesData = [];
      let process = this.$route.query.process;
      let plant = this.$route.query.plant;
      let workshop = this.$route.query.workshop;
      let line = this.$route.query.line;
      axios({
        method: "GET",
        url: "http://192.168.1.245:6688/api/kanban/mo/progress/getall?pageindex=1&pagesize=10&process=" + process + "&plant=" + plant + "&workshop=" + workshop + "&line=" + line + "&date=" + date,
      }).then((response) => {
        const { data } = response;
        if (data.success) {
          this.ecItem = data.data.Data;
          this.title = data.data.Title;
          this.ecItem.forEach((item, index) => {
            this.yAxisData_plant.push(item.Line);
            let bgColor;
            item.List.forEach((listItem) => {
              let start = "";
              if (listItem.StartTime != "") {
                start = this.timeFormatting(listItem.StartTime);
              }
              let end = "";
              if (listItem.EndTime != "") {
                end = this.timeFormatting(listItem.EndTime);
              }
              switch (listItem.ColorNum) {
                case 0:
                  bgColor = "rgba(0,187,255,.4)";
                  break;
                case 1:
                  bgColor = "rgba(80,227,194,.4)";
                  break;
                case 2:
                  bgColor = "rgba(255,115,115,.4)";
                  break;
                case 3:
                  bgColor = "rgba(255,207,107,.4)";
                  break;
                default:
                  bgColor = "rgba(0,187,255,.4)";
              }
              let StartTime = listItem.StartTime.substring(11, 16); //获取时间
              let EndTime = listItem.EndTime.substring(11, 16); //获取时间
              this.seriesData.push({
                name: listItem.item,
                value: [index, start, end, listItem.Quantity, StartTime, EndTime, listItem.MoCode],
                itemStyle: {
                  normal: {
                    color: bgColor,
                    borderType: [5, 10],
                  },
                },
              });
              console.log(this.seriesData);
            });
          });
          if (!flag) {
            this.$nextTick(() => {
              this.getEchartData();
            });
          } else {
            this.myChart.setOption({
              series: [
                {
                  data: this.seriesData,
                },
              ],
            });
            console.log(this.seriesData);
          }
          this.spinning = false;
        }
        // console.log(response);
      });
    },
    timeFormatting(time) {
      let t = time.substring(11, 16); //获取时间
      let tSplit = t.split(":"); //分割时分
      let h = Number(tSplit[0] < 10 ? tSplit[0].replace(/\b(0+)/gi, "") : tSplit[0]); //判断是否小于10
      let minute = Math.ceil(parseInt(tSplit[1] / 15 + 1) * 15);
      console.log("tSplit[1]", tSplit[1]);
      console.log("minute", minute);
      console.log("m", h);
      let m = tSplit[1] != 60 && h != 23 ? h : h + 1;
      console.log("m", m);
      minute = minute == 60 ? "00" : minute < 10 ? "0" + minute : minute;
      return m < 10 ? "0" + m + ":" + minute : m + ":" + minute;
    },
    setEchartsData() {},
    timeSlot() {
      for (var f = 8; f < 24; f++) {
        let t = f < 10 ? "0" + f : f;
        this.timeArr.push(t + ":00");
        if (t < 23) {
          this.timeArr.push(t + ":15");
          this.timeArr.push(t + ":30");
          this.timeArr.push(t + ":45");
        }
      }
      // console.log("timeArr===", this.timeArr);
    },
    getEchartData() {
      // this.setEchartsData();
      const chart = this.$refs.chart;
      if (chart) {
        this.myChart = echarts.init(chart);
        const option = {
          backgroundColor:"../../../../assets/img/pageBg.png",
          tooltip: {
            formatter: function(params) {
              // console.log(params);
              return "工单:" + params.value[6] + " 开始时间:" + params.value[4] + " 结束时间:" + params.value[5];
            },
          },
          grid: {
            top: 48,
            left: 100,
            right: 50,
            bottom: 50,
            height: 600,
          },
          dataZoom: [
            {
              xAxisIndex: 0, //这里是从X轴的0刻度开始
              show: true, //是否显示滑动条，不影响使用
              type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
              startValue: 0, // 从头开始。
              endValue: 60, // 一次性展示6个
              height: 8, //组件高度
              bottom: 10,
              borderColor: "rgba(43,48,67,.1)",
              fillerColor: "rgb(36,71,141)",
              zoomLock: true,
              showDataShadow: false, //是否显示数据阴影 默认auto
              backgroundColor: "#051A3B",
              showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
              realtime: true, //是否实时更新
              filterMode: "filter",
              handleIcon: "M-9.35,34.56V42m0-40V9.5m-2,0h4a2,2,0,0,1,2,2v21a2,2,0,0,1-2,2h-4a2,2,0,0,1-2-2v-21A2,2,0,0,1-11.35,9.5Z",
              handleStyle: {
                color: "rgb(36,71,141)",
                borderColor: "rgb(36,71,141)",
              },
              moveHandleSize: 20,
              moveOnMouseMove: true,
              maxValueSpan: 100,
              minValueSpan: 60,
              brushSelect: false, //刷选功能，设为false可以防止拖动条长度改变 ************（这是一个坑）
            },
          ],
          xAxis: {
            type: "category",
            data: this.timeArr,
            scale: true,
            position: "buttom",
            splitNumber: 6,
            axisLabel: {
              show: true,
              interval: 0,
              color: "#fff",
              rotate: 30
            },
            axisLine: {
              lineStyle: {
                color: "#38384d",
                width: 1, //这里是为了突出显示加上的
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(233,233,233,0.1)",
              },
            },
            // splitArea: {
            //   show: true, // 是否显示分隔区域
            //   interval: "0", // 坐标轴刻度标签的显示间隔，在类目轴中有效.0显示所有
            //   areaStyle: {
            //     // color分隔区域颜色。分隔区会按数组中颜色顺序依次循环设置颜色。默认是一个深浅的间隔色
            //     color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
            //     opacity: 0.5, // 图形透明度。支持从0到1的数字，为0时不绘制该图形
            //   },
            // },
            axisTick: {
              show: true, // 是否显示坐标轴刻度
              lineStyle: {
                color: "#FFF", // 刻度线的颜色
              },
            },
          },
          yAxis: {
            axisLine: {
              onZero: false,
              show: false,
            },

            axisLabel: {
              show: true,
              textStyle: {
                color: "#ffffff",
              },
              fontSize: 14,
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "",
              },
            },
            inverse: false,
            data: this.yAxisData_plant,
          },
          series: [
            {
              type: "custom",
              renderItem: function(params, api) {
                var categoryIndex = api.value(0);
                var start = api.coord([api.value(1), categoryIndex]);
                var end = api.coord([api.value(2), categoryIndex]);
                // var height = api.size([0, 1])[1] * 0.6;
                var rectShape = echarts.graphic.clipRectByRect(
                  {
                    x: start[0],
                    y: start[1] - 5,
                    width: end[0] - start[0],
                    height: 50,
                  },
                  {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height,
                  }
                );

                return (
                  rectShape && {
                    type: "rect",
                    shape: rectShape,
                    style: api.style(),
                  }
                );
              },
              encode: {
                x: [1, 2],
                y: 0,
              },
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: "#ffffff",
                  },
                  formatter: function(params) {
                    return "数量:" + params.value[3];
                  },
                },
              },
              data: this.seriesData,
            },
            {
              show: false,
              type: "radar",
              renderItem: function(params, api) {
                var categoryIndex = api.value(0);
                var start = api.coord([api.value(1), categoryIndex]);
                var end = api.coord([api.value(2), categoryIndex]);
                // var height = api.size([0, 1])[1] * 0.6;
                var rectShape = echarts.graphic.clipRectByRect(
                  {
                    x: start[0],
                    y: start[1] - 5,
                    width: end[0] - start[0],
                    height: 10,
                  },
                  {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height,
                  }
                );

                return (
                  rectShape && {
                    type: "rect",
                    shape: rectShape,
                    style: api.style(),
                  }
                );
              },
              encode: {
                x: [1, 2],
                y: 0,
              },
              data: this.seriesData,
            },
          ],
        };
        this.myChart.setOption(option, true);
        window.addEventListener("resize", function() {
          this.myChart.resize();
        });
      }
      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", function() {
          this.myChart.resize();
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content-title {
  display: flex;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  p {
    margin: 0;
  }
}
.time-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}
.date-box {
  margin: 0 10px;
}
.echarts-box{
  background:url('../../../../assets/img/pageBg.png') no-repeat;
  background-size:cover;
}
</style>

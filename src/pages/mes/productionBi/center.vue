<template>
  <div id="center">
    <div class="up">
      <div class="bg-color-black item" v-for="item in titleItem" :key="item.title">
        <dv-border-box-10>
          <p class="colorBlue" style="padding-left: 10px;padding-top:10px">{{ item.title }}</p>
          <dv-digital-flop class="dv-dig-flop" style="height:60px;padding-left: 10px;margin-bottom: 10px;" :config="item.number" />
        </dv-border-box-10>
        <!-- <dv-decoration-4 style="width:5px;height:70px;" /> -->
      </div>
    </div>
  </div>
</template>

<script>
// import CenterChart from "@/components/echart/center/centerChartRate";

export default {
  data() {
    return {
      titleItem: [
        {
          title: "今年累计任务建次数",
          number: {
            number: [120],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "本月累计任务次数",
          number: {
            number: [18],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "今日累计任务次数",
          number: {
            number: [2],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
      ],
      ranking: {
        data: [
          {
            name: "周口",
            value: 55,
          },
          {
            name: "南阳",
            value: 120,
          },
          {
            name: "西峡",
            value: 78,
          },
          {
            name: "驻马店",
            value: 66,
          },
          {
            name: "新乡",
            value: 80,
          },
          {
            name: "新乡2",
            value: 80,
          },
          {
            name: "新乡3",
            value: 80,
          },
          {
            name: "新乡4",
            value: 80,
          },
          {
            name: "新乡5",
            value: 80,
          },
          {
            name: "新乡6",
            value: 80,
          },
        ],
        carousel: "single",
        unit: "人",
      },
      water: {
        data: [24, 45],
        shape: "roundRect",
        formatter: "{value}%",
        waveNum: 3,
      },
      // 通过率和达标率的组件复用数据
      rate: [
        {
          id: "centerRate1",
          tips: 60,
          colorData: {
            textStyle: "#3fc0fb",
            series: {
              color: ["#00bcd44a", "transparent"],
              dataColor: {
                normal: "#03a9f4",
                shadowColor: "#97e2f5",
              },
            },
          },
        },
        {
          id: "centerRate2",
          tips: 40,
          colorData: {
            textStyle: "#67e0e3",
            series: {
              color: ["#faf3a378", "transparent"],
              dataColor: {
                normal: "#ff9800",
                shadowColor: "#fcebad",
              },
            },
          },
        },
        {
          id: "centerRate3",
          tips: 20,
          colorData: {
            textStyle: "#c81624",
            series: {
              color: ["#fa00378", "transparent"],
              dataColor: {
                normal: "#ff0000",
                shadowColor: "#fcebad",
              },
            },
          },
        },
      ],
    };
  },
  components: {},
};
</script>

<style lang="less" scoped>
#center {
  display: flex;
  flex-direction: column;
  .up {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .item {
      padding: 8px;
      width: 32%;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .dv-dig-flop {
        width: 150px;
      }
    }
  }
  .down {
    padding: 6px 4px;
    padding-bottom: 0;
    width: 100%;
    display: flex;
    height: 255px;
    justify-content: space-between;
    .bg-color-black {
      border-radius: 5px;
      padding:10px;
    }
    .ranking {
      padding: 10px;
      width: 59%;
      .dv-scr-rank-board {
        height: 225px;
      }
    }
    .percent {
      display: flex;
      flex-wrap: wrap;
      .item {
        width: 33.33%;
        height: 150px;
        span {
          display: flex;
          margin-top: 18px;
          font-size: 20px;
          text-align: left;
        }
      }
      .water {
        width: 100%;
        .dv-wa-le-po {
          height: 120px;
        }
      }
    }
  }
}
</style>

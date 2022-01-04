<template>
  <div id="center">
    <div class="up">
      <div class="bg-color-black item" v-for="item in titleItem" :key="item.title">
        <dv-border-box-10>
          <p class="colorBlue" style="color:#fff;padding-left: 10px;padding-top:10px">{{ item.title + item.number.number }}</p>
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
  props: ["TodayProqtyData"],
  data() {
    return {
      dataType: "",
      titleItem: [
        {
          title: "今日生产量",
          number: {
            number: [0],
            textAlign: "left",
            content: "{nt}",
            toFixed:2,
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "今日目标量",
          number: {
            number: [0],
            textAlign: "left",
            content: "{nt}",
            toFixed:2,
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "达成率",
          number: {
            number: [0],
            textAlign: "left",
            content: "{nt}",
            toFixed:2,
            style: {
              fontSize: 26,
            },
          },
        },
      ],
    };
  },
  created() {
    let type = this.$route.path.split("&");
    this.dataType = type[1];
    if (this.dataType == "lh") {
      this.titleItem[1].title = "总接收量";
      this.titleItem[2].title = "今日转移量";
    }
    this.titleItem[0].number.number[0] = Number(this.TodayProqtyData.ReachProportion);
    this.titleItem[1].number.number[0] = Number(this.TodayProqtyData.TotalPlanQty);
    this.titleItem[2].number.number[0] = Number(this.TodayProqtyData.TotalFinishedQty);
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
      padding: 10px;
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

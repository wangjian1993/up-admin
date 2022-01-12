<template>
  <div id="center">
    <div class="up">
      <div class="bg-color-black item" v-for="item in titleItem" :key="item.title">
        <dv-border-box-10>
          <p class="colorBlue" style="color:#fff;padding-left: 10px;font-size: 20px;margin:0">{{ item.title }}</p>
          <dv-digital-flop class="dv-dig-flop" style="width:100%;height:70px" :config="item.number" />
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
            textAlign: "center",
            content: "{nt}",
            style: {
              fill: "rgba(235, 15, 15)",
              fontSize: 34,
            },
          },
        },
        {
          title: "今日目标量",
          number: {
            number: [0],
            textAlign: "center",
            content: "{nt}",
            style: {
              fill: "rgba(235, 15, 15)",
              fontSize: 34,
            },
          },
        },
        {
          title: "达成率",
          number: {
            number: [0],
            textAlign: "center",
            content: "{nt}",
            style: {
              fill: "rgba(235, 15, 15)",
              fontSize: 34,
            },
          },
        },
      ],
    };
  },
  watch: {
    TodayProqtyData() {
      this.getListData();
      console.log("2222");
    },
  },
  created() {
    this.getListData();
    console.log("11111111");
  },
  methods: {
    getListData() {
      let type = this.$route.path.split("&");
      this.dataType = type[1];
      // let num = parseInt(Math.random() * (8 + 1));
      if (this.dataType == "lh") {
        this.titleItem[0].title = "今日进站量";
        this.titleItem[1].title = "总接收量";
        this.titleItem[2].title = "今日出站量";
        this.titleItem[2].number.content = "{nt}";
        this.titleItem[0].number.number[0] = Number(this.TodayProqtyData.TotalStartQty);
        this.titleItem[1].number.number[0] = Number(this.TodayProqtyData.TotalPlanQty);
        this.titleItem[2].number.number[0] = Number(this.TodayProqtyData.TotalFinishedQty);
      } else {
        this.titleItem[2].number.content = "{nt}%";
        this.titleItem[0].number.number[0] = Number(this.TodayProqtyData.TotalFinishedQty);
        this.titleItem[1].number.number[0] = Number(this.TodayProqtyData.TotalPlanQty);
        this.titleItem[2].number.number[0] = Number(this.TodayProqtyData.ReachProportion);
      }
      // console.log(Number(this.TodayProqtyData.TotalFinishedQty + num));

      this.titleItem.map((item) => {
        item.number = { ...item.number };
      });
      // this.titleItem = { ...this.titleItem };
    },
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

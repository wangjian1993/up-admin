<template>
  <div>
    <a-row type="flex" justify="space-between" align="bottom" :gutter="16">
      <a-col :flex="1" v-for="(item, index) in headData" :key="index">
        <div class="chart-card">
          <div class="card-left">
            <div class="card-card-title">
              {{ item.title }}
            </div>
            <div class="card-card-total">
              <span>{{ item.total }}</span>
            </div>
          </div>
          <div class="card-right">
            <img src="@/assets/img/logo.png" alt="" />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-between" :gutter="16" style="margin-top:16px;">
      <a-col :span="18">
        <div style="background:#fff;">
          <device-node :list="stateData" title="设备节点"></device-node>
        </div>
        <div style="background:#fff;margin-top: 10px;">
          <bar :data="barData" title="故障次数统计" />
        </div>
      </a-col>
      <a-col :span="6">
        <div style="background:#fff;">
          <rank-list title="设备节点速度" :list="rankList" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from "moment";
const barData = [];
for (let i = 0; i < 6; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}
const stateData = []
for (let i = 0; i < 24; i += 1) {
  stateData.push({
    name: `设备${i + 1}`,
    state: "1",
    duration: Math.ceil(Math.random() * 1000),
  });
}
const searchUserData = [];
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment()
      .add(i, "days")
      .format("YYYY-MM-DD"),
    y: Math.ceil(Math.random() * 10),
  });
}
const rankList = [];
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: "白鹭岛 " + (i + 1) + " 号店",
    total: 1234.56 - i * 100,
  });
}
import Bar from "../component/Bar.vue";
import RankList from "../component/RankList.vue";
import DeviceNode from "../component/DeviceNode.vue";
export default {
  name: "Analysis",
  components: { Bar, RankList, DeviceNode },
  data() {
    return {
      loading: true,
      barData,
      rankList,
      stateData,
      headData: [
        {
          title: "设备节点数量",
          total: "11111",
          icon: "",
        },
        {
          title: "设备节点数量",
          total: "11111",
          icon: "",
        },
        {
          title: "设备节点数量",
          total: "11111",
          icon: "",
        },
        {
          title: "设备节点数量",
          total: "11111",
          icon: "",
        },
        {
          title: "设备节点数量",
          total: "11111",
          icon: "",
        },
      ],
      pieStyle: {
        stroke: "#fff",
        lineWidth: 1,
      },
    };
  },
  computed: {
   
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading;
    }, 1000);
  },
};
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
.chart-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10px;
  background: #fff;
  border-radius: 10px;
  .meta {
    width: 100%;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    line-height: 22px;
  }
  .card-right {
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

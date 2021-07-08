<template>
	<div class="demo"><div id="gantt-chart" class="chart-content"></div></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
	name: 'project-progress',
	data() {
		return {
			ganttChart: null,
			chartData: [
				{
					name: '可熊-库内',
					start: '2020-02-10',
					end: '2020-02-15',
					status: 1 // 1 待完成 2 已完成 3 超时
				},
				{
					name: '游梦-退仓退供接收-计划',
					start: '2020-02-03',
					end: '2020-02-05',
					status: 2
				},
				{
					name: '李坤-退货出库单页-计划',
					start: '2020-02-02',
					end: '2020-02-09',
					status: 3
				},
				{
					name: '苍岳-合批+合波+占用-计划',
					start: '2020-02-03',
					end: '2020-02-17',
					status: 1
				},
				{
					name: '善博-拣货单生成-计划',
					start: '2020-02-03',
					end: '2020-02-17',
					status: 1
				},
				{
					name: '唐汇波-拣货单获取-实操',
					start: '2020-02-04',
					end: '2020-02-05',
					status: 3
				},
				{
					name: '唐汇波-拣货单批量提交-实操',
					start: '2020-02-05',
					end: '2020-02-17',
					status: 3
				},
				{
					name: '宸斐-发运',
					start: '2020-02-10',
					end: '2020-02-19',
					status: 2
				},
				{
					name: '联调',
					start: '2020-02-17',
					end: '2020-02-23',
					status: 2
				},
				{
					name: '测试',
					start: '2020-02-24',
					end: '2020-03-10',
					status: 1
				},
				{
					name: '灰度',
					start: '2020-02-29',
					end: '2020-03-11',
					status: 1
				},
				{
					name: '发布',
					start: '2020-03-10',
					end: '2020-03-12',
					status: 1
				}
			]
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.initChart();
		});
	},
	methods: {
		initChart() {
			this.ganttChart = echarts.init(document.getElementById('gantt-chart'));
			var option = {
				backgroundColor: '#fff',
				title: {
					text: '生产排产情况',
					padding: 20,
					textStyle: {
						fontSize: 17,
						fontWeight: 'bolder',
						color: '#333'
					},
					subtextStyle: {
						fontSize: 13,
						fontWeight: 'bolder'
					}
				},
				legend: {
					data: ['计划工期', '可行性研究阶段', '初步设计阶段', '施工图设计阶段', '项目实施阶段', '项目验收阶段'],
					align: 'right',
					right: 80,
					top: 50
				},
				grid: {
					containLabel: true,
					show: false,
					right: 130,
					left: 40,
					bottom: 40,
					top: 90
				},
				xAxis: {
					type: 'time',
					axisLabel: {
						show: true,
						interval: 0
					}
				},
				yAxis: {
					axisLabel: {
						show: true,
						interval: 0,
						formatter: function(value) {
							var last = '';
							var max = 5;
							var len = value.length;
							var hang = Math.ceil(len / max);
							if (hang > 1) {
								for (var i = 0; i < hang; i++) {
									var start = i * max;
									var end = start + max;
									var temp = value.substring(start, end) + '\n';
									last += temp; //凭借最终的字符串
								}
								return last;
							} else {
								return value;
							}
						}
					},
					data: ['第一个任务', '第二个任务', '第三个任务']
				},
				tooltip: {
					trigger: 'axis',
					formatter: function(params) {
						var res = '';
						var name = '';
						var start0 = '';
						var start = '';
						var end0 = '';
						var end = '';
						for (var i in params) {
							var k = i % 2;
							if (!k) {
								//偶数
								start0 = params[i].data;
								console.log(start0);
								start = start0.getFullYear() + '-' + (start0.getMonth() + 1) + '-' + start0.getDate();
							}
							if (k) {
								//奇数
								name = params[i].seriesName;
								end0 = params[i].data;
								end = end0.getFullYear() + '-' + (end0.getMonth() + 1) + '-' + end0.getDate();
								res += name + ' : ' + end + '~' + start + '</br>';
							}
						}
						return res;
					}
				},
				series: [
					{
						name: '计划工期',
						type: 'bar',
						stack: '总量0',
						label: {
							normal: {
								show: true,
								color: '#000',
								position: 'right',
								formatter: function(params) {
									return params.seriesName;
								}
							}
						},
						itemStyle: {
							normal: {
								color: 'skyblue',
								borderColor: '#fff',
								borderWidth: 2
							}
						},
						zlevel: -1,
						data: [new Date('2020-05-01'), new Date('2020-03-14'), new Date('2020-05-01')]
					},
					{
						name: '计划工期',
						type: 'bar',
						stack: '总量0',
						itemStyle: {
							normal: {
								color: 'white'
							}
						},
						zlevel: -1,
						z: 3,
						data: [new Date('2020-01-01'), new Date('2020-01-01'), new Date('2020-03-15')]
					},
					{
						name: '可行性研究阶段',
						type: 'bar',
						stack: '总量2',
						label: {
							normal: {
								show: true,
								color: '#000',
								position: 'right',
								formatter: function(params) {
									return params.seriesName;
								}
							}
						},
						itemStyle: {
							normal: {
								color: 'green',
								borderColor: '#fff',
								borderWidth: 2
							}
						},
						zlevel: -1,
						data: [new Date('2020-01-10'), new Date('2020-01-10'), new Date('2020-03-30')]
					},
					{
						name: '可行性研究阶段',
						type: 'bar',
						stack: '总量2',
						itemStyle: {
							normal: {
								color: 'white'
							}
						},
						zlevel: -1,
						z: 3,
						data: [new Date('2020-01-02'), new Date('2020-01-02'), new Date('2020-03-16')]
					},
					{
						name: '初步设计阶段',
						type: 'bar',
						stack: '总量3',
						label: {
							normal: {
								show: true,
								color: '#000',
								position: 'right',
								formatter: function(params) {
									return params.seriesName;
								}
							}
						},
						itemStyle: {
							normal: {
								color: 'red',
								borderColor: '#fff',
								borderWidth: 2
							}
						},
						zlevel: -1,
						data: [new Date('2020-02-20'), new Date('2020-01-20'), new Date('2020-04-10')]
					},
					{
						name: '初步设计阶段',
						type: 'bar',
						stack: '总量3',
						itemStyle: {
							normal: {
								color: 'white'
							}
						},
						zlevel: -1,
						z: 3,
						data: [new Date('2020-02-01'), new Date('2020-01-12'), new Date('2020-04-01')]
					},
					{
						name: '施工图设计阶段',
						type: 'bar',
						stack: '总量4',
						label: {
							normal: {
								show: true,
								color: '#000',
								position: 'right',
								formatter: function(params) {
									return params.seriesName;
								}
							}
						},
						itemStyle: {
							normal: {
								color: 'brown',
								borderColor: '#fff',
								borderWidth: 2
							}
						},
						zlevel: -1,
						data: [new Date('2020-03-09'), new Date('2020-01-25'), new Date('2020-04-20')]
					},
					{
						name: '施工图设计阶段',
						type: 'bar',
						stack: '总量4',
						itemStyle: {
							normal: {
								color: 'white'
							}
						},
						zlevel: -1,
						z: 3,
						data: [new Date('2020-02-25'), new Date('2020-01-21'), new Date('2020-04-11')]
					},
					{
						name: '项目实施阶段',
						type: 'bar',
						stack: '总量5',
						label: {
							normal: {
								show: true,
								color: '#000',
								position: 'right',
								formatter: function(params) {
									return params.seriesName;
								}
							}
						},
						itemStyle: {
							normal: {
								color: 'yellow',
								borderColor: '#fff',
								borderWidth: 2
							}
						},
						zlevel: -1,
						data: [new Date('2020-03-12'), new Date('2020-02-15'), new Date('2020-04-30')]
					},
					{
						name: '项目实施阶段',
						type: 'bar',
						stack: '总量5',
						itemStyle: {
							normal: {
								color: 'white'
							}
						},
						zlevel: -1,
						z: 3,
						data: [new Date('2020-03-10'), new Date('2020-01-26'), new Date('2020-04-21')]
					},
					{
						name: '项目验收阶段',
						type: 'bar',
						stack: '总量6',
						label: {
							normal: {
								show: true,
								color: '#000',
								position: 'right',
								formatter: function(params) {
									return params.seriesName;
								}
							}
						},
						itemStyle: {
							normal: {
								color: 'orange',
								borderColor: '#fff',
								borderWidth: 2
							}
						},
						zlevel: -1,
						data: [new Date('2020-03-30'), new Date('2020-03-13'), new Date('2020-05-01')]
					},
					{
						name: '项目验收阶段',
						type: 'bar',
						stack: '总量6',
						itemStyle: {
							normal: {
								color: 'white'
							}
						},
						zlevel: -1,
						z: 3,
						data: [new Date('2020-03-15'), new Date('2020-02-16'), new Date('2020-04-30')]
					}
				]
			};
			this.ganttChart.setOption(option);
		}
	}
};
</script>

<style lang="less" scoped>
.chart-content {
	width: 100%;
	height: 500px;
}
.demo {
	margin: 0 auto;
}
</style>

<template>
	<div class="card">
		<a-tabs default-active-key="1" @change="callback" size="small">
			<a-tab-pane key="1" tab="BOM费用-查询发布"><bom-issue></bom-issue></a-tab-pane>
			<a-tab-pane key="2" tab="BOM费用-发布记录"><bom-record></bom-record></a-tab-pane>
		</a-tabs>
		<!-- <a-tabs type="card" @change="callback">
			<a-tab-pane key="1" tab="BOM费用-查询发布"><bom-issue></bom-issue></a-tab-pane>
			<a-tab-pane key="2" tab="BOM费用-发布记录"><bom-record></bom-record></a-tab-pane>
		</a-tabs> -->
		<details-list :pagination="pagination" :columns="columns" :dataSource="dataSource" :selectedRows="selectedRows" :inputList="inputList"></details-list>
		<footer-tool-bar>
			<a-button type="dashed" style="margin-right: 10px;" @click="validate" :loading="loading">导出</a-button>
			<a-button type="primary" @click="validate" :loading="loading">{{ tabIndex == 1 ? '提交' : '更新' }}</a-button>
		</footer-tool-bar>
	</div>
</template>
<script>
import detailsList from '../components/Details.vue';
import BomIssue from './issue/index.js';
import BomRecord from './record/index.js';
import { inputList } from '@/mock/common/bomData.js';
import FooterToolBar from '@/components/tool/FooterToolBar';
const columns = [
	{
		title: '序号编号',
		dataIndex: 'no'
	},
	{
		title: '阶次',
		dataIndex: 'degree'
	},
	{
		title: '类型',
		dataIndex: 'type'
	},
	{
		title: '上阶料号',
		dataIndex: 'uppn'
	},
	{
		title: '料号',
		dataIndex: 'pn'
	},
	{
		title: '料名',
		dataIndex: 'designation'
	},
	{
		title: '料规格',
		dataIndex: 'specification'
	},
	{
		title: '单位',
		dataIndex: 'unit'
	},
	{
		title: 'E10单价',
		dataIndex: 'e10price'
	},
	{
		title: '单价',
		dataIndex: 'price',
		scopedSlots: { customRender: 'price' }
	},
	{
		title: '用量',
		dataIndex: 'dosage'
	},
	{
		title: '金额',
		dataIndex: 'money'
	},
	{
		title: '提示',
		dataIndex: 'hint'
	},
	{
		title: '备注',
		scopedSlots: { customRender: 'action' }
	}
];

const dataSource = [];

for (let i = 0; i < 5; i++) {
	dataSource.push({
		key: i,
		no: i,
		degree: i,
		type: '委外加工件',
		uppn: '0-03199-30100004' + i,
		pn: '0-03199-30100004' + i,
		designation: 'DL103电源盒上盖/DL103电源压 线盖 丝印 BW-6.0785',
		specification: '委外油墨丝印白色字 DDT-8-10W-180-250mA-20-40V 10W(欧切斯) ODM电源盒（委外丝印，含上盖+压线盖）',
		unit: 'pcs',
		e10price: '0.53(询价)',
		price: '0.53',
		dosage: i,
		money: 0.53,
		hint: '价格不全'
	});
}
export default {
	data() {
		return {
			inputList: inputList,
			columns: columns,
			dataSource: dataSource,
			selectedRows: false,
			isSearch: true,
			pagination: false,
			tabIndex: 0
		};
	},
	methods: {
		callback(key) {
			console.log(key);
			this.tabIndex = key;
		}
	},
	components: { detailsList, FooterToolBar, BomIssue, BomRecord }
};
</script>
<style type="text/css" lang="less">
.card {
	background-color: @base-bg-color;
	padding: 0px;
}
</style>

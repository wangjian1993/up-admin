<template>
	<div class="list">
		<a-tabs default-active-key="1" @change="callback" size="small">
			<a-tab-pane key="1" tab="Tab 1"></a-tab-pane>
			<a-tab-pane key="2" tab="Tab 2"></a-tab-pane>
			<a-tab-pane key="3" tab="Tab 3"></a-tab-pane>
		</a-tabs>
		<div>
			<standard-table :columns="columns" :dataSource="dataSource" :selectedRows.sync="selectedRows" @clear="onClear" @change="onChange" @selectedRowChange="onSelectChange">
				<div slot="description" slot-scope="{ text }">{{ text }}</div>
				<div slot="action" slot-scope="{ text, record }">
					<a style="margin-right: 8px">
						<a-icon type="plus" />
						新增
					</a>
					<a style="margin-right: 8px">
						<a-icon type="edit" />
						编辑
					</a>
					<a @click="deleteRecord(record.key)">
						<a-icon type="delete" />
						删除1
					</a>
				</div>
				<template slot="statusTitle">
					<a-icon @click.native="onStatusTitleClick" type="info-circle" />
				</template>
			</standard-table>
		</div>
	</div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable';
const columns = [
	{
		title: '规则编号',
		dataIndex: 'no'
	},
	{
		title: '描述',
		dataIndex: 'description',
		scopedSlots: { customRender: 'description' }
	},
	{
		title: '服务调用次数',
		dataIndex: 'callNo',
		sorter: true,
		needTotal: true,
		customRender: text => text + ' 次'
	},
	{
		dataIndex: 'status',
		needTotal: true,
		slots: { title: 'statusTitle' }
	},
	{
		title: '更新时间',
		dataIndex: 'updatedAt',
		sorter: true
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' }
	}
];

const dataSource = [];

for (let i = 0; i < 100; i++) {
	dataSource.push({
		key: i,
		no: 'NO ' + i,
		description: '这是一段描述',
		callNo: Math.floor(Math.random() * 1000),
		status: Math.floor(Math.random() * 10) % 4,
		updatedAt: '2018-07-26'
	});
}	
export default {
	data() {
		return {
			columns: columns,
			dataSource: dataSource,
			selectedRows: []
		};
	},
	components: { StandardTable },
	methods: {
		onClear() {
			this.$message.info('您清空了勾选的所有行');
		},
		onStatusTitleClick() {
			this.$message.info('你点击了状态栏表头');
		},
		onChange() {
			this.$message.info('表格状态改变了');
		},
		onSelectChange() {
			this.$message.info('选中行改变了');
		},
		callback(activeKey) {
			console.log(activeKey);
		}
	}
};
</script>

<style lang="less" scoped>
.list {
	background-color: @base-bg-color;
	padding: 10px;
}
</style>

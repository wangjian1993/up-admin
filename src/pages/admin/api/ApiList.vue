<template>
	<div class="table">
		<a-space class="operator">
			<a-button @click="addNew" type="primary">新建</a-button>
			<a-button>批量操作</a-button>
			<a-dropdown>
				<a-menu @click="handleMenuClick" slot="overlay">
					<a-menu-item key="delete">删除</a-menu-item>
					<a-menu-item key="audit">审批</a-menu-item>
				</a-menu>
				<a-button>
					更多操作
					<a-icon type="down" />
				</a-button>
			</a-dropdown>
		</a-space>
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
	name: 'QueryList',
	components: { StandardTable },
	data() {
		return {
			advanced: true,
			columns: columns,
			dataSource: dataSource,
			selectedRows: []
		};
	},
	authorize: {
		deleteRecord: 'delete'
	},
	methods: {
		deleteRecord(key) {
			this.dataSource = this.dataSource.filter(item => item.key !== key);
			this.selectedRows = this.selectedRows.filter(item => item.key !== key);
		},
		toggleAdvanced() {
			this.advanced = !this.advanced;
		},
		remove() {
			this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1);
			this.selectedRows = [];
		},
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
		addNew() {
			this.dataSource.unshift({
				key: this.dataSource.length,
				no: 'NO ' + this.dataSource.length,
				description: '这是一段描述',
				callNo: Math.floor(Math.random() * 1000),
				status: Math.floor(Math.random() * 10) % 4,
				updatedAt: '2018-07-26'
			});
		},
		handleMenuClick(e) {
			if (e.key === 'delete') {
				this.remove();
			}
		}
	}
};
</script>

<style lang="less" scoped>
.table {
	background-color: @base-bg-color;
	padding: 10px;
}
.search {
	margin-bottom: 54px;
}
.fold {
	width: calc(100% - 216px);
	display: inline-block;
}
.operator {
	margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
	.fold {
		width: 100%;
	}
}
</style>

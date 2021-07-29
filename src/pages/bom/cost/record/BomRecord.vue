<template>
	<div class="content">
		<div :class="advanced ? 'search' : null">
			<a-form layout="horizontal" :form="form">
				<div :class="advanced ? null : 'fold'">
					<a-row>
						<a-col :md="6" :sm="24">
							<a-form-item label="产品大类" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
								<a-select placeholder="请选择产品大类" v-decorator="['one_sort']">
									<a-select-option v-for="(item, index) in productHeadingList" :value="item.one_sort" :key="index">{{ item.one_sort }}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :md="6" :sm="24">
							<a-form-item label="产品型号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
								<a-select placeholder="请选择产品型号" v-decorator="['two_sort']">
									<a-select-option v-for="(item, index) in productModelList" :value="item.one_sort" :key="index">{{ item.one_sort }}</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :md="6" :sm="24">
							<a-form-item label="产品品号" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
								<a-input placeholder="请输入" v-decorator="['item_code']" />
							</a-form-item>
						</a-col>
						<a-col :md="6" :sm="24">
							<a-form-item label="产品品名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
								<a-input placeholder="请输入" v-decorator="['item_name']" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row v-if="advanced">
						<a-col :md="6" :sm="24">
							<a-form-item label="更新日期" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
								<a-date-picker style="width: 100%" placeholder="请输入更新日期" v-decorator="['date_range']" />
							</a-form-item>
						</a-col>
						<a-col :md="6" :sm="24">
							<a-form-item label="审核状态" :labelCol="{ span: 5 }" :wrapperCol="{ span: 18, offset: 1 }">
								<a-select placeholder="请选择" v-decorator="['check_status']">
									<a-select-option value="1">关闭</a-select-option>
									<a-select-option value="2">运行中</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<span style="float: right; margin-top: 3px;">
					<a-button type="primary" @click="query">查询</a-button>
					<a-button style="margin-left: 8px">重置</a-button>
					<a @click="toggleAdvanced" style="margin-left: 8px">
						{{ advanced ? '收起' : '展开' }}
						<a-icon :type="advanced ? 'up' : 'down'" />
					</a>
				</span>
			</a-form>
		</div>
		<div>
			<standard-table
				:columns="columns"
				:dataSource="dataSource"
				:selectedRows.sync="selectedRows"
				@clear="onClear"
				@change="onChange"
				@selectedRowChange="onSelectChange"
				:pagination="pagination"
			>
				<div slot="description" slot-scope="{ text }">{{ text }}</div>
				<div slot="action" slot-scope="{ text, record }">
					<a style="margin-right: 8px">
						<a-icon type="edit" />
						编辑
					</a>
					<a @click="deleteRecord(record.key)">
						<a-icon type="delete" />
						删除
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
import { getProductModel } from '@/services/bom.js';
const columns = [
	{
		title: '序号',
		dataIndex: 'no'
	},
	{
		title: '产品品号',
		dataIndex: 'article'
	},
	{
		title: '产品品名',
		dataIndex: 'articleName'
	},
	{
		title: '产品规格',
		dataIndex: 'specification'
	},
	{
		title: '物料成本',
		dataIndex: 'cost'
	},
	{
		title: '最终成本',
		dataIndex: 'lastCost'
	},
	{
		title: '备注',
		dataIndex: 'remark'
	},
	{
		title: '版本',
		dataIndex: 'versions'
	},
	{
		title: '添加时间',
		dataIndex: 'addTime'
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' }
	}
];

const dataSource = [];

for (let i = 0; i < 4; i++) {
	dataSource.push({
		key: i,
		no: i + 1,
		article: '0-05010322-31001 (ACC)',
		articleName: 'ACC-DL322A-BK-0100',
		specification: 'Φ79.4*16.8mm/吸顶安装/黑色RAL9005/带包装/6PCS/牛皮纸盒/12PCS/外箱（配件默认贴公司常规灯具贴纸）',
		cost: '5.2066',
		lastCost: '6.7847',
		remark: '加工费预估',
		versions: '21.05.26_v1  刘志优 - 已审核',
		addTime: '21-05-26 09:52'
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
			selectedRows: false,
			pagination: false,
			productModelList: [],
			productHeadingList: [],
			form: this.$form.createForm(this)
		};
	},
	authorize: {
		deleteRecord: 'delete'
	},
	created() {
		this.getProductModel();
	},
	methods: {
		//获取产品大类
		getProductModel() {
			let parmas = {
				act: 'get_bom_one_sort'
			};
			getProductModel(parmas).then(res => {
				if (res.data.success) {
					this.productHeadingList = res.data.data;
				}
			});
			let parmas1 = {
				act: 'get_bom_two_sort'
			};
			getProductModel(parmas1).then(res => {
				if (res.data.success) {
					this.productModelList = res.data.data;
				}
			});
		},
		query() {
			this.form.validateFields((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values);
					let parmas = {
						act: 'query_bom_cb_version',
						...values
					};
					getProductModel(parmas).then(res => {
						if (res.data.success) {
							// this.productHeadingList = res.data.data;
						}
					});
				}
			});
		},
		deleteRecord(key) {
			this.dataSource = this.dataSource.filter(item => item.key !== key);
			this.selectedRows = this.selectedRows.filter(item => item.key !== key);
		},
		toggleAdvanced() {
			this.advanced = !this.advanced;
		},
		onChange() {},
		onSelectChange() {},
		onClear() {}
	}
};
</script>

<style lang="less" scoped>
.content {
	background-color: @base-bg-color;
	padding: 10px;
}
.ant-form-item {
	margin-bottom: 10px;
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

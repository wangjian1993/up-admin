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
		<div v-if="isSearch">
			<standard-table
				:columns="columns"
				:dataSource="dataSource"
				:loading="isLoading"
				@clear="onClear"
				@change="onChange"
				@selectedRowChange="onSelectChange"
				:pagination="pagination"
			>
				<div slot="check_status" slot-scope="{ text }">
					<div>
						<a-tag color="green" v-if="text == 1">已审核</a-tag>
						<a-tag color="red" v-else>未审核</a-tag>
					</div>
				</div>
				<div slot="action" slot-scope="{ text, record }">
					<a style="margin-right: 8px" v-if="record.check_status == 0">审核</a>
					<a @click="deleteRecord(record.key)">
						<a-icon type="delete" />
						删除
					</a>
					<a @click="detail(record.key)">
						<a-icon type="bars" />
						展开明细
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
		dataIndex: 'id'
	},
	{
		title: '产品品号',
		dataIndex: 'item_code'
	},
	{
		title: '产品品名',
		dataIndex: 'item_name'
	},
	{
		title: '产品规格',
		dataIndex: 'item_specification'
	},
	{
		title: '备注',
		dataIndex: 'remark'
	},
	{
		title: '版本',
		dataIndex: 'bom_version'
	},
	{
		title: '添加时间',
		dataIndex: 'add_time'
	},
	{
		title: '状态',
		dataIndex: 'check_status',
		scopedSlots: { customRender: 'check_status' }
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	name: 'QueryList',
	components: { StandardTable },
	data() {
		return {
			advanced: true,
			columns: columns,
			dataSource: [],
			pagination: false,
			productModelList: [],
			productHeadingList: [],
			form: this.$form.createForm(this),
			isSearch: false,
			isLoading: true
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
						one_sort: 'AL',
						two_sort: 'AL108',
						item_code: '1-03009602-012041009',
						item_name: 'AL108-',
						date_range: '2021-07-01 - 2021-08-30',
						check_status: '1'
					};
					getProductModel(parmas).then(res => {
						if (res.data.success) {
							this.dataSource = res.data.data;
							this.isSearch = true;
							this.isLoading = false;
						}
					});
				}
			});
		},
		detail(item) {
			console.log("详情===")
			this.$emit('onSearch', item);
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

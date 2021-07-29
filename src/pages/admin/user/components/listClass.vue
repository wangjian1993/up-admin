<template>
	<div>
		<a-modal v-model="visible" :title="classItem.OrgDimensionName + '-等级选择'" @cancel="close" @ok="handleOk" centered :width="800">
			<div>
				<div class="search-box">
					<a-row>
						<a-col :span="15">
							<a-form layout="horizontal" :form="searchForm">
								<div>
									<a-col :md="15" :sm="24">
										<a-form-item label="等级编码/名称" :labelCol="{ span: 9 }" :wrapperCol="{ span: 14, offset: 1 }">
											<a-input
												placeholder="请输入"
												v-decorator="[
													'searcValue',
													{
														rules: [{ required: true, message: '等级编码/名称' }]
													}
												]"
											/>
										</a-form-item>
									</a-col>
								</div>
								<span style="float: right; margin-top: 3px;">
									<a-button type="primary" @click="search">查询</a-button>
									<a-button style="margin-left: 8px" @click="reset">重置</a-button>
								</span>
							</a-form>
						</a-col>
					</a-row>
				</div>
				<!-- 列表 -->
				<div class="tab">
					<a-table
						:columns="columns"
						:data-source="list"
						:size="size"
						:pagination="pagination"
						@change="handleTableChange"
						:rowKey="tableDatas => list.EnterTypeId"
						:row-selection="{
							type: rowSelectionType,
							selectedRowKeys: selectedRowKeys,
							onChange: onSelectChange
						}"
						bordered
					>
						<template slot="index" slot-scope="text, record, index">
							<div>
								<span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
							</div>
						</template>
						<template slot="enable" slot-scope="record">
							<div>
								<a-tag color="green" v-if="record == 'Y'">是</a-tag>
								<a-tag color="red" v-else>否</a-tag>
							</div>
						</template>
						<template slot="IsPartAuth" slot-scope="record">
							<div>
								<a-tag color="green" v-if="record == 'Y'">是</a-tag>
								<a-tag color="red" v-else>否</a-tag>
							</div>
						</template>
					</a-table>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
const columns = [
	{
		title: '序号',
		scopedSlots: { customRender: 'index' },
		align: 'center'
	},
	{
		title: '组织等级编号',
		dataIndex: 'OrgLevelCode',
		scopedSlots: { customRender: 'OrgLevelCode' },
		align: 'center'
	},
	{
		title: '组织等级名称',
		dataIndex: 'OrgLevelName',
		scopedSlots: { customRender: 'OrgLevelName' },
		align: 'center'
	},
	{
		title: '组织维度',
		dataIndex: 'OrgDimensionName',
		scopedSlots: { customRender: 'OrgDimensionName' },
		align: 'center'
	},
	{
		title: '级别',
		dataIndex: 'OrgLevelSortNo',
		scopedSlots: { customRender: 'OrgLevelSortNo' },
		align: 'center'
	}
];
import { getOrginfo } from '@/services/admin.js';
export default {
	props: ['classItem','enterValue'],
	data() {
		return {
			size: 'small',
			visible: true,
			isAddModal: false,
			columns,
			list: [],
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			selectedRowKeys: [],
			searchForm: this.$form.createForm(this),
			rowSelectionType: 'radio',
			pagination: {
				current: 1,
				total: 0,
				pageSize: 10, //每页中显示10条数据
				showSizeChanger: true,
				showLessItems: true,
				showQuickJumper: true,
				pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
				showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`
			}
		};
	},
	created() {
		this.getList();
	},
	methods: {
		close() {
			this.$emit('closeModal');
		},
		getList() {
			let parmas = {
				pageindex: this.pagination.current,
				pagesize: this.pagination.pageSize,
				dimsensionId: this.classItem.OrgDimensionId,
				enterid:this.enterValue[0]
			};
			getOrginfo(parmas).then(res => {
				if (res.data.success) {
					this.list = res.data.data.list;
					const pagination = { ...this.pagination };
					pagination.total = res.data.data.recordsTotal;
					this.pagination = pagination;
				}
			});
		},
		//查看详情
		onClose() {
			this.isDrawer = false;
		},
		//多选
		onSelectChange(selectedRowKeys) {
			console.log('选择====', selectedRowKeys);
			this.selectedRowKeys = selectedRowKeys;
		},
		handleOk() {
			if (this.selectedRowKeys.length > 0) {
				console.log(this.list[this.selectedRowKeys[0]]);
				this.$emit('orgSubSelect', this.list[this.selectedRowKeys[0]]);
			} else {
				this.$emit('orgSubSelect');
			}
		},
		reset() {
			this.getList();
			this.searchForm.resetFields();
		},
		//关键词搜索
		search() {
			this.searchForm.validateFields((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values);
					this.data = [];
					this.pagination.total = 0;
					let parmas = {
						pageindex: this.pagination.current,
						pagesize: this.pagination.pageSize,
						dimsensionId: this.classItem.OrgDimensionId,
						enterid:this.enterValue[0],
						keyword: values.searcValue
					};
					getOrginfo(parmas).then(res => {
						if (res.data.success) {
							this.list = res.data.data.list;
							const pagination = { ...this.pagination };
							pagination.total = res.data.data.recordsTotal;
							this.pagination = pagination;
						}
					});
					// do something
				}
			});
		},
		//关闭对话框
		handleCancel() {
			this.isAddModal = false;
		},
		//分页
		handleTableChange(pagination) {
			this.pagination.current = pagination.current;
			this.pagination.pageSize = pagination.pageSize;
			this.getList();
		}
	},
	components: {}
};
</script>

<style lang="less" scoped></style>

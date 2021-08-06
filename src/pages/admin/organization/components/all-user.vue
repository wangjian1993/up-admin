<template>
	<div>
		<a-modal v-model="visible" title="添加用户"  v-if="visible" destoryOnClose @cancel="close" :footer="null" centered :width="800">
			<div>
				<div class="search-box">
					<a-row>
						<a-col :span="9">
							<div>
								<a-button type="primary" :disabled="!hasSelected" @click="allAdd" style="margin-left: 8px">添加</a-button>
								<span style="margin-left: 8px">
									<template v-if="hasSelected">
										{{ `共选中 ${selectedRowKeys.length} 条` }}
									</template>
								</span>
							</div>
						</a-col>
						<a-col :span="15">
							<a-form layout="horizontal" :form="searchForm">
								<div>
									<a-col :md="15" :sm="24">
										<a-form-item label="用户编码/名称" :labelCol="{ span: 9 }" :wrapperCol="{ span: 14, offset: 1 }">
											<a-input
												placeholder="请输入"
												allowClear
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
						size="small"
						:pagination="pagination"
						@change="handleTableChange"
						:rowKey="tableDatas => list.EnterTypeId"
						:row-selection="{
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
								<a-tag color="green" v-if="record == 'Y'">启用</a-tag>
								<a-tag color="red" v-else>禁用</a-tag>
							</div>
						</template>
						<template slot="IsPartAuth" slot-scope="record">
							<div>
								<a-tag color="green" v-if="record == 'Y'">是</a-tag>
								<a-tag color="red" v-else>否</a-tag>
							</div>
						</template>
						<template slot="action" slot-scope="text, record">
							<div>
								<a style="margin-right: 8px" @click="add(record)">
									<a-icon type="plus-circle" />
									添加
								</a>
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
		title: '用户账号',
		dataIndex: 'UserName',
		scopedSlots: { customRender: 'UserName' },
		align: 'center'
	},
	{
		title: '用户名称',
		dataIndex: 'UserLoginId',
		scopedSlots: { customRender: 'UserLoginId' },
		align: 'center'
	},
	{
		title: '用户类型',
		dataIndex: 'UserTypeName',
		scopedSlots: { customRender: 'UserTypeName' },
		align: 'center'
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' },
		align: 'center'
	}
];
import { getUserList, addOrgUser } from '@/services/admin.js';
export default {
	props: ['classItem', 'orgId', 'enterid'],
	data() {
		return {
			visible: true,
			isAddModal: false,
			columns,
			list: [],
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			selectedRowKeys: [],
			searchForm: this.$form.createForm(this),
			pagination: {
				current: 1,
				total: 0,
				pageSize: 10, //每页中显示10条数据
				showSizeChanger: true,
				showLessItems: true,
				showQuickJumper: true,
				pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
				showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`
			},
			id: '',
			enterId: ''
		};
	},
	computed: {
		hasSelected() {
			return this.selectedRowKeys.length > 0;
		}
	},
	created() {
		this.id = this.orgId;
		this.enterId = this.enterid;
		this.getList(this.orgId);
	},
	methods: {
		close() {
			this.$emit('closeModal');
		},
		getList(id) {
			let parmas = {
				pageindex: this.pagination.current,
				pagesize: this.pagination.pageSize,
				orgid: id,
				enterid: this.enterId
			};
			getUserList(parmas).then(res => {
				if (res.data.success) {
					this.list = res.data.data.list;
					const pagination = { ...this.pagination };
					pagination.total = res.data.data.recordsTotal;
					this.pagination = pagination;
				}
			});
		},
		onClose() {
			this.isDrawer = false;
		},
		//多选
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
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
						keyword: values.searcValue
					};
					getUserList(parmas).then(res => {
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
		//打开对话框
		add(item) {
			let parmas = {
				OrgId: this.id,
				OrgUserInfo: [
					{
						UserId: item.UserId
					}
				]
			};
			addOrgUser(parmas).then(res => {
				if (res.data.success) {
					this.$message.success('添加成功!');
					this.$emit('succeed');
				}
			});
		},
		allAdd() {
			let self = this;
			self.$confirm({
				title: '确定要添加选中内容',
				onOk() {
					let parmas = {
						OrgId: self.id,
						OrgUserInfo: []
					};
					self.selectedRowKeys.forEach(item => {
						let obj = {};
						obj.UserId = self.list[item].UserId;
						parmas.OrgUserInfo.push(obj);
					});
					addOrgUser(parmas).then(res => {
						if (res.data.success) {
							self.$message.success('添加成功!');
							self.$emit('succeed');
						} else {
							self.$message.warning(res.data.message.content);
						}
					});
				},
				onCancel() {}
			});
		},
		defaultForm() {
			this.form = {
				OrgDimensionCode: '',
				OrgDimensionName: '',
				Enable: 'Y',
				IsPartAuth: 'Y',
				SortNo: 0
			};
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

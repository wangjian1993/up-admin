<template>
	<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
		<div class="search-box">
			<a-row>
				<a-col :span="24">
					<div>
						<a-button @click="add" type="primary" icon="form">添加</a-button>
						<a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">移除</a-button>
						<span style="margin-left: 8px">
							<template v-if="hasSelected">
								{{ `共选中 ${selectedRowKeys.length} 条` }}
							</template>
						</span>
					</div>
				</a-col>
			</a-row>
		</div>
		<div><all-user v-if="isModal" :orgId="orgId" @closeModal="closeModal"></all-user></div>
		<!-- 列表 -->
		<div class="tab">
			<a-table
				:columns="columns"
				:data-source="data"
				size="small"
				:pagination="pagination"
				@change="handleTableChange"
				:rowKey="tableDatas => data.EnterTypeId"
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
						<a-tag color="green" v-if="record == 'Y'">是</a-tag>
						<a-tag color="red" v-else>否</a-tag>
					</div>
				</template>
				<template slot="defualt" slot-scope="record">
					<div>
						<a-tag color="green" v-if="record == 'Y'">是</a-tag>
						<a-tag color="red" v-else>否</a-tag>
					</div>
				</template>
				<template slot="action" slot-scope="text, record">
					<div>
						<a-popconfirm title="确定删除?" @confirm="() => onDelete(record)">
							<a style="margin-right: 8px">
								<a-icon type="delete" />
								移除
							</a>
						</a-popconfirm>
						<a style="margin-right: 8px" @click="edit(record)">
							<a-icon type="edit" />
							编辑
						</a>
					</div>
				</template>
			</a-table>
		</div>
		<!-- 查看详情 -->
		<div>
			<a-drawer width="400" placement="right" :closable="false" :visible="isDrawer" @close="onClose">
				<a-descriptions title="用户类型详情" :column="1">
					<a-descriptions-item label="用户编码">{{ drawerItem.UserTypeCode }}</a-descriptions-item>
					<a-descriptions-item label="用户名称">{{ drawerItem.UserTypeName }}</a-descriptions-item>
					<a-descriptions-item label="是否启用">
						<div>
							<a-tag color="green" v-if="drawerItem.Enable == 'Y'">是</a-tag>
							<a-tag color="red" v-else>否</a-tag>
						</div>
					</a-descriptions-item>
					<a-descriptions-item label="描述">{{ drawerItem.UserTypeDesc }}</a-descriptions-item>
					<a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
					<a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
				</a-descriptions>
			</a-drawer>
		</div>
	</a-card>
</template>
<script>
const columns = [
	{
		title: '用户账号',
		dataIndex: 'UserLoginId',
		scopedSlots: { customRender: 'UserLoginId' },
		align: 'center'
	},
	{
		title: '用户名称',
		dataIndex: 'UserName',
		scopedSlots: { customRender: 'UserName' },
		align: 'center'
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' },
		align: 'center'
	}
];
import { getUserTypeList, userTypeAction, getOrgUser } from '@/services/admin.js';
import { renderStripe } from '@/utils/stripe.js';
import AllUser from './all-user.vue';
import paging from '@/config/paging.js';
export default {
	props: ['orgId'],
	data() {
		return {
			data: [],
			columns,
			isEdit: false,
			editForm: [],
			title: '添加机构类型',
			loading: false,
			isDrawer: false,
			isModal: false,
			selectedRowKeys: [], // Check here to configure the default column
			visible: false,
			drawerItem: [],
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			pagination: paging.pagination,
			searcValue: '',
			searchForm: this.$form.createForm(this),
			id: '',
			form: {
				UserTypeCode: '',
				UserTypeName: '',
				UserTypeDesc: '',
				Enable: 'Y'
			},
			rules: {
				UserTypeCode: [
					{
						required: true,
						message: '请输入用户编码',
						trigger: 'blur'
					}
				],
				UserTypeName: [
					{
						required: true,
						message: '请输入用户名称',
						trigger: 'blur'
					}
				]
			}
		};
	},
	updated() {
		renderStripe();
	},
	computed: {
		hasSelected() {
			return this.selectedRowKeys.length > 0;
		}
	},
	created() {
		this.id = this.orgId;
		this.getOrgUser(this.orgId);
	},
	methods: {
		enableChange(value) {
			this.form.Enable = value.target.value;
		},
		defualtChange(value) {
			this.form.IsDefualt = value.target.value;
		},
		//查看详情
		detail(item) {
			this.isDrawer = true;
			this.drawerItem = item;
		},
		onClose() {
			this.isDrawer = false;
		},
		//多选
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		//重置搜索
		reset() {
			this.getUserTypeList();
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
						keyword: values.searcValue
					};
					getUserTypeList(parmas).then(res => {
						if (res.data.success) {
							this.data = res.data.data.list;
							const pagination = { ...this.pagination };
							pagination.total = res.data.data.recordsTotal;
							this.pagination = pagination;
						}
					});
					// do something
				}
			});
		},
		//获取机构类型列表
		getOrgUser() {
			let parmas = {
				pageindex: this.pagination.current,
				pagesize: this.pagination.pageSize,
				orgid: this.id
			};
			getOrgUser(parmas).then(res => {
				if (res.data.success) {
					this.data = res.data.data.list;
					const pagination = { ...this.pagination };
					pagination.total = res.data.data.recordsTotal;
					this.pagination = pagination;
				}
			});
		},
		//打开对话框
		add() {
			this.isModal = true;
		},
		closeModal(){
			this.isModal = false;
		},
		defaultForm() {
			this.form = {
				EnterTypeCode: '',
				EnterTypeName: '',
				EnterTypeDesc: '',
				IndexUrl: '',
				Enable: 'Y',
				IsDefualt: 'Y'
			};
		},
		//关闭对话框
		handleCancel() {
			this.visible = false;
		},
		edit(item) {
			this.visible = true;
			this.isEdit = true;
			this.title = '编辑机构类型';
			this.form = item;
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					if (this.isEdit) {
						let editForm = {
							UserTypeId: this.form.UserTypeId,
							UserTypeName: this.form.UserTypeName,
							UserTypeDesc: this.form.UserTypeDesc,
							Enable: this.form.Enable
						};
						userTypeAction(editForm, 'update').then(res => {
							if (res.data.success) {
								this.$message.success('编辑成功!');
								this.defaultForm();
								this.visible = false;
								this.getUserTypeList();
							} else {
								this.$message.warning(res.data.message.content);
							}
						});
					} else {
						userTypeAction(this.form, 'add').then(res => {
							if (res.data.success) {
								this.$message.success('添加成功!');
								this.getUserTypeList();
								this.defaultForm();
								this.visible = false;
							} else {
								this.$message.warning(res.data.message.content);
							}
						});
					}
				}
			});
		},
		//多选删除
		allDel() {
			let self = this;
			self.$confirm({
				title: '确定要删除选中内容',
				onOk() {
					const params = [];
					self.selectedRowKeys.forEach(item => {
						params.push(self.data[item].UserTypeId);
					});
					userTypeAction(params, 'delete').then(res => {
						if (res.data.success) {
							self.selectedRowKeys = [];
							self.$message.success('删除成功!');
							self.getUserTypeList();
						} else {
							self.$message.warning(res.data.message.content);
						}
					});
				},
				onCancel() {}
			});
		},
		//单个删除
		onDelete(item) {
			let parmas = [];
			parmas.push(item.UserTypeId);
			userTypeAction(parmas, 'delete').then(res => {
				if (res.data.success) {
					this.$message.success('删除成功!');
					this.getUserTypeList();
				} else {
					this.$message.warning(res.data.message.content);
				}
			});
		},
		handleTableChange(pagination) {
			this.pagination.current = pagination.current;
			this.pagination.pageSize = pagination.pageSize;
			this.getUserTypeList();
		}
	},
	components: { AllUser }
};
</script>
<style lang="less">
.ant-form-item {
	margin-bottom: 5px;
}
</style>

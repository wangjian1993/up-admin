<template>
	<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
		<div class="search-box">
			<a-row>
				<a-col :span="12">
					<div>
						<a-button @click="add" type="primary" icon="form">添加</a-button>
						<a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
						<span style="margin-left: 8px">
							<template v-if="hasSelected">
								{{ `共选中 ${selectedRowKeys.length} 条` }}
							</template>
						</span>
					</div>
				</a-col>
				<a-col :span="12">
					<a-form layout="horizontal" :form="searchForm">
						<div>
							<a-col :md="18" :sm="24">
								<a-form-item label="组织编码/名称" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 1 }">
									<a-input
										placeholder="请输入"
										v-decorator="[
											'searcValue',
											{
												rules: [{ required: true, message: '机构类型编码/名称!' }]
											}
										]"
									/>
								</a-form-item>
							</a-col>
						</div>
						<span style="float: right; margin-top: 3px;">
							<a-button type="primary" @click="search">查询</a-button>
							<a-button style="margin-left: 8px" @click="getOrganizationList">重置</a-button>
						</span>
					</a-form>
				</a-col>
			</a-row>
		</div>
		<div>
			<a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel">
				<a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
					<a-form-model-item ref="OrgDimensionName" label="维度名称" prop="OrgDimensionName">
						<a-input
							v-model="form.OrgDimensionName"
							@blur="
								() => {
									$refs.OrgDimensionName.onFieldBlur();
								}
							"
						/>
					</a-form-model-item>
					<a-form-model-item ref="OrgDimensionCode" label="编码" prop="OrgDimensionCode">
						<a-input
							v-model="form.OrgDimensionCode"
							@blur="
								() => {
									$refs.OrgDimensionCode.onFieldBlur();
								}
							"
						/>
					</a-form-model-item>
					<a-form-model-item ref="SortNo" label="排序" prop="SortNo">
						<a-input
							v-model="form.SortNo"
							@blur="
								() => {
									$refs.SortNo.onFieldBlur();
								}
							"
						/>
					</a-form-model-item>
					<a-form-model-item ref="IsPartAuth" label="是否授权">
						<a-radio-group :value="form.IsPartAuth" button-style="solid" @change="authChange">
							<a-radio-button value="N">否</a-radio-button>
							<a-radio-button value="Y">是</a-radio-button>
						</a-radio-group>
					</a-form-model-item>
					<a-form-model-item ref="Enable" label="是否启动">
						<a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
							<a-radio-button value="N">否</a-radio-button>
							<a-radio-button value="Y">是</a-radio-button>
						</a-radio-group>
					</a-form-model-item>
				</a-form-model>
			</a-modal>
		</div>
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
				<template slot="IsPartAuth" slot-scope="record">
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
								删除
							</a>
						</a-popconfirm>
						<a style="margin-right: 8px" @click="cluster(record)">
							<a-icon type="cluster" />
							等级管理
						</a>
						<a style="margin-right: 8px" @click="edit(record)">
							<a-icon type="edit" />
							编辑
						</a>
						<a style="margin-right: 8px" @click="detail(record)">
							<a-icon type="profile" />
							查看
						</a>
					</div>
				</template>
			</a-table>
		</div>
		<!-- 查看详情 -->
		<div>
			<a-drawer width="400" placement="right" :closable="false" :visible="isDrawer" @close="onClose">
				<a-descriptions title="机构类型详情" :column="1">
					<a-descriptions-item label="添加时间">{{ drawerItem.DateTimeCreated }}</a-descriptions-item>
					<a-descriptions-item label="组织id">{{ drawerItem.OrgDimensionId }}</a-descriptions-item>
					<a-descriptions-item label="组织编码">{{ drawerItem.OrgDimensionCode }}</a-descriptions-item>
					<a-descriptions-item label="维度名称">{{ drawerItem.OrgDimensionName }}</a-descriptions-item>
					<a-descriptions-item label="是否授权">
						<div>
							<a-tag color="green" v-if="drawerItem.IsPartAuth == 'Y'">是</a-tag>
							<a-tag color="red" v-else>否</a-tag>
						</div>
					</a-descriptions-item>
					<a-descriptions-item label="启动">
						<div>
							<a-tag color="green" v-if="drawerItem.Enable == 'Y'">是</a-tag>
							<a-tag color="red" v-else>否</a-tag>
						</div>
					</a-descriptions-item>
					<a-descriptions-item label="是否删除">
						<div>
							<a-tag color="green" v-if="drawerItem.IsDel == 'Y'">是</a-tag>
							<a-tag color="red" v-else>否</a-tag>
						</div>
					</a-descriptions-item>
					<a-descriptions-item label="排序">{{ drawerItem.SortNo }}</a-descriptions-item>
					<a-descriptions-item label="添加人">{{ drawerItem.UserCreated }}</a-descriptions-item>
				</a-descriptions>
			</a-drawer>
		</div>
		<!-- 等级管理 -->
		<div v-if="isListClass"><list-class @closeModal="closeModal" :classItem="classItem"></list-class></div>
	</a-card>
</template>
<script>
const columns = [
	{
		title: '序号',
		scopedSlots: { customRender: 'index' },
		align: 'center'
	},
	{
		title: '维度名称',
		dataIndex: 'OrgDimensionName',
		scopedSlots: { customRender: 'OrgDimensionName' },
		align: 'center'
	},
	{
		title: '编码',
		dataIndex: 'OrgDimensionCode',
		scopedSlots: { customRender: 'OrgDimensionCode' },
		align: 'center'
	},
	{
		title: '参与授权',
		dataIndex: 'IsPartAuth',
		scopedSlots: { customRender: 'IsPartAuth' },
		align: 'center'
	},
	{
		title: '状态',
		dataIndex: 'Enable',
		scopedSlots: { customRender: 'enable' },
		align: 'center'
	},
	{
		title: '排序号',
		dataIndex: 'SortNo',
		scopedSlots: { customRender: 'SortNo' },
		align: 'center'
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' },
		align: 'center'
	}
];
import { getOrganizationList, orgdimensionAction } from '@/services/admin.js';
import ListClass from './components/listClass.vue';
export default {
	data() {
		return {
			data: [],
			columns,
			isEdit: false,
			editForm: [],
			title: '添加机构类型',
			loading: false,
			isDrawer: false,
			selectedRowKeys: [], // Check here to configure the default column
			visible: false,
			isListClass: false,
			drawerItem: [],
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			classItem: [],
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
			searcValue: '',
			searchForm: this.$form.createForm(this),
			form: {
				OrgDimensionCode: '',
				OrgDimensionName: '',
				Enable: 'Y',
				IsPartAuth: 'Y',
				SortNo: 0
			},
			rules: {
				OrgDimensionCode: [
					{
						required: true,
						message: '请输入组织编码',
						trigger: 'blur'
					}
				],
				OrgDimensionName: [
					{
						required: true,
						message: '请输入组织名称',
						trigger: 'blur'
					}
				],
				SortNo: [
					{
						required: true,
						message: '请输入排序',
						trigger: 'blur'
					}
				]
			}
		};
	},
	computed: {
		hasSelected() {
			return this.selectedRowKeys.length > 0;
		}
	},
	created() {
		this.getOrganizationList();
	},
	methods: {
		enableChange(value) {
			this.form.Enable = value.target.value;
		},
		authChange(value) {
			this.form.IsPartAuth = value.target.value;
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
					getOrganizationList(parmas).then(res => {
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
		getOrganizationList() {
			let parmas = {
				pageindex: this.pagination.current,
				pagesize: this.pagination.pageSize
			};
			getOrganizationList(parmas).then(res => {
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
			this.defaultForm();
			this.isEdit = false;
			this.title = '添加组织';
			this.visible = true;
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
			this.visible = false;
		},
		edit(item) {
			this.visible = true;
			this.isEdit = true;
			this.title = '编辑组织列表';
			this.form = item;
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					if (this.isEdit) {
						let editForm = {
							OrgDimensionId: this.form.OrgDimensionId,
							OrgDimensionCode: this.form.OrgDimensionCode,
							OrgDimensionName: this.form.OrgDimensionName,
							Enable: this.form.Enable,
							IsPartAuth: this.form.IsPartAuth,
							SortNo: this.form.SortNo
						};
						orgdimensionAction(editForm, 'update').then(res => {
							if (res.data.success) {
								this.$message.success('编辑成功!');
								this.defaultForm();
								this.visible = false;
								this.getOrganizationList();
							} else {
								this.$message.warning(res.data.message.content);
							}
						});
					} else {
						orgdimensionAction(this.form, 'add').then(res => {
							if (res.data.success) {
								this.$message.success('添加成功!');
								this.getOrganizationList();
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
						params.push(self.data[item].OrgDimensionId);
					});
					orgdimensionAction(params, 'delete').then(res => {
						if (res.data.success) {
							self.$message.success('删除成功!');
							self.selectedRowKeys = [];
							self.$message.success('删除成功!');
							self.getOrganizationList();
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
			parmas.push(item.OrgDimensionId);
			orgdimensionAction(parmas, 'delete').then(res => {
				if (res.data.success) {
					this.$message.success('删除成功!');
					this.getOrganizationList();
				} else {
					this.$message.warning(res.data.message.content);
				}
			});
		},
		//分页
		handleTableChange(pagination) {
			this.pagination.current = pagination.current;
			this.pagination.pageSize = pagination.pageSize;
			this.getOrganizationList();
		},
		//等级管理
		cluster(item) {
			this.classItem = item;
			this.isListClass = true;
		},
		closeModal() {
			this.isListClass = false;
		}
	},
	components: { ListClass }
};
</script>
<style lang="less">
.ant-form-item {
	margin-bottom: 5px;
}
</style>

<template>
	<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
		<!-- 查询 -->
		<div class="search-box">
			<a-row>
				<a-col :span="6">
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
				<a-col :span="18">
					<a-form layout="horizontal" :form="searchForm">
						<div>
							<a-col :md="10" :sm="24">
								<a-form-item label="机构类型编码/名称" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 1 }">
									<!-- <a-input placeholder="请输入" v-decorator="['entertype']" /> -->
									<a-select placeholder="选择机构" v-decorator="['entertype']">
										<a-select-option v-for="(item, index) in selectList" :key="index" :value="item.EnterTypeName">{{ item.EnterTypeName }}</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :md="10" :sm="24">
								<a-form-item label="机构编码/名称" :labelCol="{ span: 8 }" :wrapperCol="{ span: 14, offset: 1 }">
									<a-input placeholder="请输入" v-decorator="['enter']" />
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
		<!-- 添加 -->
		<div>
			<a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :width="840">
				<a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
					<a-row>
						<a-col :span="12">
							<a-form-model-item ref="EnterCode" label="机构编码" prop="EnterCode" :labelCol="{ span: 6 }">
								<a-input
									v-model="form.EnterCode"
									placeholder="请输入机构编码"
									@blur="
										() => {
											$refs.EnterCode.onFieldBlur();
										}
									"
								/>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item ref="EnterEMail" label="管理员邮箱" prop="EnterEMail" :labelCol="{ span: 6 }">
								<a-input
									v-model="form.EnterEMail"
									placeholder="请输入管理员邮箱"
									@blur="
										() => {
											$refs.EnterEMail.onFieldBlur();
										}
									"
								/>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item ref="EnterName" label="机构中文名" prop="EnterName" :labelCol="{ span: 6 }">
								<a-input
									v-model="form.EnterName"
									placeholder="请输入机构中文名"
									@blur="
										() => {
											$refs.EnterEMail.onFieldBlur();
										}
									"
								/>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="机构简称(中文)" :labelCol="{ span: 6 }">
								<a-input v-model="form.EnterShortName" placeholder="请输入机构简称(中文)" />
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="机构英文名" :labelCol="{ span: 6 }"><a-input v-model="form.EnterEnName" placeholder="请输入机构英文名" /></a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="上级机构" prop="SuperiorEnterId" :labelCol="{ span: 6 }">
								<a-select v-model="form.SuperiorEnterName" :disabled="isEdit" placeholder="请选择上级机构" @change="enterOption">
									<a-select-option v-for="(item, index) in data" :key="index" :value="item.EnterName">{{ item.EnterName }}</a-select-option>
								</a-select>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="机构简称(英文)" :labelCol="{ span: 6 }">
								<a-input v-model="form.EnterShortEnName" placeholder="请输入机构简称(英文)" />
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="机构域名" :labelCol="{ span: 6 }"><a-input v-model="form.EnterUrl" placeholder="请输入机构域名" /></a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="机构法人" :labelCol="{ span: 6 }"><a-input v-model="form.EnterCorporate" placeholder="请输入机构法人" /></a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="营业执照编码" :labelCol="{ span: 6 }">
								<a-input v-model="form.EnterLicense" placeholder="请输入营业执照编码" />
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="机构描述" :labelCol="{ span: 6 }">
								<a-textarea v-model="form.EnterDesc" placeholder="请输入机构描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="机构类型" prop="EnterTypeName" :labelCol="{ span: 6 }">
								<a-select v-model="form.EnterTypeName" placeholder="选择机构" @change="enterTypeOption">
									<a-select-option v-for="(item, index) in selectList" :key="index" :value="item.EnterTypeName">{{ item.EnterTypeName }}</a-select-option>
								</a-select>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item ref="Enable" label="是否启用" :labelCol="{ span: 6 }">
								<a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
									<a-radio-button value="N">否</a-radio-button>
									<a-radio-button value="Y">是</a-radio-button>
								</a-radio-group>
							</a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="联系人" :labelCol="{ span: 6 }"><a-input v-model="form.EnterContacts" placeholder="请输入联系人" /></a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="联系电话" :labelCol="{ span: 6 }"><a-input v-model="form.EnterPhone" placeholder="请输入联系电话" /></a-form-model-item>
						</a-col>
						<a-col :span="12">
							<a-form-model-item label="传真" :labelCol="{ span: 6 }"><a-input v-model="form.EnterFax" placeholder="请输入联系传真" /></a-form-model-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="24">
							<a-form-model-item label="地址" :labelCol="{ span: 3 }">
								<a-textarea v-model="form.EnterAddr" placeholder="请输入联系地址" :auto-size="{ minRows: 3, maxRows: 5 }" />
							</a-form-model-item>
						</a-col>
					</a-row>
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
				<template slot="Enable" slot-scope="record">
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
			<a-drawer width="700" placement="right" :closable="false" :visible="isDrawer" @close="onClose">
				<a-descriptions title="机构列表详情" :column="2">
					<a-descriptions-item label="机构中文名">{{ drawerItem.EnterName }}</a-descriptions-item>
					<a-descriptions-item label="管理员邮箱">{{ drawerItem.EnterEMail }}</a-descriptions-item>
					<a-descriptions-item label="机构英文名">{{ drawerItem.EnterEnName }}</a-descriptions-item>
					<a-descriptions-item label="机构中文名(简称)">{{ drawerItem.EnterShortName }}</a-descriptions-item>
					<a-descriptions-item label="机构英文名(简称)">{{ drawerItem.EnterShortEnName }}</a-descriptions-item>
					<a-descriptions-item label="营业执照编码">{{ drawerItem.EnterLicense }}</a-descriptions-item>
					<a-descriptions-item label="上级机构">{{ drawerItem.SuperiorEnterName }}</a-descriptions-item>
					<a-descriptions-item label="机构域名">{{ drawerItem.EnterUrl }}</a-descriptions-item>
					<a-descriptions-item label="机构法人">{{ drawerItem.EnterCorporate }}</a-descriptions-item>
					<a-descriptions-item label="机构描述">{{ drawerItem.EnterDesc }}</a-descriptions-item>
					<a-descriptions-item label="联系人">{{ drawerItem.EnterContacts }}</a-descriptions-item>
					<a-descriptions-item label="联系电话">{{ drawerItem.EnterPhone }}</a-descriptions-item>
					<a-descriptions-item label="地址">{{ drawerItem.EnterAddr }}</a-descriptions-item>
					<a-descriptions-item label="传真">{{ drawerItem.EnterFax }}</a-descriptions-item>
					<a-descriptions-item label="机构编码">{{ drawerItem.EnterTypeCode }}</a-descriptions-item>
					<a-descriptions-item label="机构类型">{{ drawerItem.EnterTypeName }}</a-descriptions-item>
					<a-descriptions-item label="是否启用">
						<div>
							<a-tag color="green" v-if="drawerItem.Enable == 'Y'">是</a-tag>
							<a-tag color="red" v-else>否</a-tag>
						</div>
					</a-descriptions-item>
					<a-descriptions-item label="描述">{{ drawerItem.EnterTypeDesc }}</a-descriptions-item>
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
		title: '序号',
		scopedSlots: { customRender: 'index' },
		align: 'center'
	},
	{
		title: '机构中文名',
		dataIndex: 'EnterName',
		scopedSlots: { customRender: 'name' },
		align: 'center'
	},
	{
		title: '机构编号',
		dataIndex: 'EnterTypeCode',
		scopedSlots: { customRender: 'age' },
		align: 'center'
	},
	{
		title: '机构类型',
		dataIndex: 'EnterTypeName',
		scopedSlots: { customRender: 'type' },
		align: 'center'
	},
	{
		title: '状态',
		dataIndex: 'Enable',
		scopedSlots: { customRender: 'Enable' },
		align: 'center'
	},
	{
		title: '上级机构名称',
		dataIndex: 'SuperiorEnterName',
		scopedSlots: { customRender: 'SuperiorEnterName' },
		align: 'center'
	},
	{
		title: '创建时间',
		dataIndex: 'DateTimeCreated',
		scopedSlots: { customRender: 'address' },
		align: 'center'
	},
	{
		title: '创建人',
		dataIndex: 'UserCreated',
		scopedSlots: { customRender: 'UserCreated' },
		align: 'center'
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' },
		align: 'center'
	}
];
import { getEnterList, addEnterList, updateEnterList, deleteEnterList, getInstitutionList } from '@/services/admin.js';
import { renderStripe } from '@/utils/stripe.js';
export default {
	data() {
		return {
			data: [],
			columns,
			isEdit: false,
			editForm: [],
			title: '添加机构',
			loading: false,
			selectedRowKeys: [], // Check here to configure the default column
			visible: false,
			drawerItem: [],
			isDrawer: false,
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
			labelCol: { span: 4 },
			wrapperCol: { span: 14 },
			other: '',
			selectList: [],
			form: {
				OAId: '',
				EnterCode: '',
				EnterName: '',
				EnterEnName: '',
				EnterDesc: '',
				EnterTypeId: '',
				EnterTypeCode: '',
				EnterTypeName: '',
				EnterEMail: '',
				EnterFax: '',
				EnterUrl: '',
				EnterLicense: '',
				EnterCorporate: '',
				EnterContacts: '',
				EnterPhone: '',
				EnterAddr: '',
				SuperiorEnterId: '',
				SuperiorEnterName: '',
				Enable: 'Y'
			},
			rules: {
				EnterCode: [
					{
						required: true,
						message: '请选择机构编码',
						trigger: 'blur'
					}
				],
				EnterEMail: [
					{
						required: true,
						message: '请输入管理员邮箱',
						trigger: 'blur'
					}
				],
				SuperiorEnterId: [
					{
						required: true,
						message: '请选择上级机构',
						trigger: 'blur'
					}
				],
				EnterTypeName: [
					{
						required: true,
						message: '请选择机构类型',
						trigger: 'blur'
					}
				],
				EnterName: [
					{
						required: true,
						message: '请输入机构中文名',
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
		this.getEnterList();
		this.getInstitutionList();
	},
	methods: {
		//设置是否默认
		enableChange(value) {
			this.form.Enable = value.target.value;
		},
		//查看详情
		detail(item) {
			this.isDrawer = true;
			this.drawerItem = item;
		},
		onClose() {
			this.isDrawer = false;
		},
		//获取机构类型
		getInstitutionList() {
			let parmas = {
				pageindex: 1,
				pagesize: 100
			};
			getInstitutionList(parmas).then(res => {
				if (res.data.success) {
					this.selectList = res.data.data.list;
				}
			});
		},
		//设置上级机构
		enterOption(value) {
			this.form.SuperiorEnterName = value;
			this.data.filter(item => {
				if (item.EnterName == value) {
					this.form.SuperiorEnterId = item.SuperiorEnterId;
					// this.form.SuperiorEnterName =item.SuperiorEnterName
				}
			});
		},
		//设置机构类型
		enterTypeOption(value) {
			this.selectList.filter(item => {
				if (item.EnterTypeName == value) {
					this.form.EnterTypeName = item.EnterTypeName;
					this.form.EnterTypeId = item.EnterTypeId;
					this.form.EnterTypeCode = item.EnterTypeCode;
					console.log(this.form);
				}
			});
		},
		//重置搜索
		reset() {
			this.getEnterList();
			this.searchForm.resetFields();
		},
		//搜索
		search() {
			this.searchForm.validateFields((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values);
					this.data = [];
					this.pagination.total = 0;
					let parmas = {
						pageindex: this.pagination.current,
						pagesize: this.pagination.pageSize,
						entertype: values.entertype,
						keyword: values.enter
					};
					getEnterList(parmas).then(res => {
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
		//多选
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		//获取机构类型列表
		getEnterList() {
			let parmas = {
				pageindex: this.pagination.current,
				pagesize: this.pagination.pageSize
			};
			getEnterList(parmas).then(res => {
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
			this.title = '添加机构';
			this.visible = true;
		},
		defaultForm() {
			this.form = {
				OAId: '',
				EnterCode: '',
				EnterName: '',
				EnterEnName: '',
				EnterDesc: '',
				EnterTypeId: '',
				EnterTypeCode: '',
				EnterTypeName: '',
				EnterEMail: '',
				EnterFax: '',
				EnterUrl: '',
				EnterLicense: '',
				EnterCorporate: '',
				EnterContacts: '',
				EnterPhone: '',
				EnterAddr: '',
				SuperiorEnterId: '',
				SuperiorEnterName: '',
				Enable: 'Y'
			};
		},
		//关闭对话框
		handleCancel() {
			this.visible = false;
		},
		edit(item) {
			this.getInstitutionList();
			this.visible = true;
			this.isEdit = true;
			this.title = '编辑机构';
			this.form = item;
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					if (this.isEdit) {
						let editForm = {
							EnterId: this.form.EnterId,
							EnterName: this.form.EnterName,
							EnterEnName: this.form.EnterEnName,
							EnterShortName: this.form.EnterShortName,
							EnterShortEnName: this.form.EnterShortEnName,
							EnterDesc: this.form.EnterDesc,
							EnterTypeId: this.form.EnterTypeId,
							EnterTypeCode: this.form.EnterTypeCode,
							EnterTypeName: this.form.EnterTypeName,
							EnterEMail: this.form.EnterEMail,
							EnterFax: this.form.EnterFax,
							EnterUrl: this.form.EnterUrl,
							EnterLicense: this.form.EnterLicense,
							EnterCorporate: this.form.EnterCorporate,
							EnterContacts: this.form.EnterContacts,
							EnterPhone: this.form.EnterPhone,
							EnterAddr: this.form.EnterAddr,
							SuperiorEnterId: this.form.SuperiorEnterId,
							SuperiorEnterName: this.form.SuperiorEnterName,
							Enable: this.form.Enable
						};
						updateEnterList(editForm).then(res => {
							if (res.data.success) {
								this.$message.success('编辑成功!');
								this.defaultForm();
								this.visible = false;
								this.getEnterList();
							} else {
								this.$message.warning(res.data.message.content);
							}
						});
					} else {
						addEnterList(this.form).then(res => {
							if (res.data.success) {
								this.$message.success('添加成功!');
								this.getEnterList();
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
						params.push(self.data[item].EnterId);
					});
					deleteEnterList(params).then(res => {
						if (res.data.success) {
							self.selectedRowKeys = [];
							self.$message.success('删除成功!');
							self.getEnterList();
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
			parmas.push(item.EnterId);
			deleteEnterList(parmas).then(res => {
				if (res.data.success) {
					this.$message.success('删除成功!');
					this.getEnterList();
				} else {
					this.$message.warning(res.data.message.content);
				}
			});
		},
		handleTableChange(pagination) {
			this.pagination.current = pagination.current;
			this.pagination.pageSize = pagination.pageSize;
			this.getEnterList();
		}
	}
};
</script>
<style lang="less">
.ant-form-item {
	margin-bottom: 5px;
}
</style>

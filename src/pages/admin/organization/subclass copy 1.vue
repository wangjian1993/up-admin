<template>
	<div>
		<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
			<a-row>
				<a-col style="padding: 0 5px" :span="12">
					<p>
						组织选择:
						<a-tree-select
							@change="treeClick"
							v-model="enterValue"
							style="width: 300px"
							:dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
							:tree-data="treeList"
							placeholder="组织选择"
							:replaceFields="replaceFields"
							tree-default-expand-all
						></a-tree-select>
					</p>
				</a-col>
				<a-col style="padding: 0 5px" :span="12">
					<p>
						组织维度选择:
						<a-tree-select
							@change="leverClick"
							v-model="leverValue"
							style="width: 300px"
							:dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
							:tree-data="orgList"
							placeholder="组织维度选择"
							:replaceFields="replaceFields1"
							tree-default-expand-all
						></a-tree-select>
					</p>
				</a-col>
			</a-row>
		</a-card>
		<a-row>
			<a-col :span="18">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<div>
						<a-button @click="addSubclass" type="primary" icon="form">添加</a-button>
						<a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="allDel" style="margin-left: 8px">删除</a-button>
						<span style="margin-left: 8px">
							<template v-if="hasSelected">
								{{ `共选中 ${selectedRowKeys.length} 条` }}
							</template>
						</span>
					</div>
					<div style="margin-top: 10px;">
						<a-table :columns="columns" :data-source="tabData" :pagination="pagination" size="small">
							<template slot="index" slot-scope="text, record, index">
								<div>
									<span>{{ (pagination.current - 1) * pagination.pageSize + (index + 1) }}</span>
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
									<a style="margin-right: 8px" @click="addSubclass(record, 'sub')">
										<a-icon type="profile" />
										新增子组
									</a>
								</div>
							</template>
						</a-table>
					</div>
					<div>
						<a-modal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel">
							<a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
								<a-form-model-item ref="OrgName" label="用户组名称" prop="OrgName">
									<a-input
										v-model="form.OrgName"
										placeholder="请输入用户组名称"
										@blur="
											() => {
												$refs.OrgName.onFieldBlur();
											}
										"
									/>
								</a-form-model-item>
								<a-form-model-item ref="OrgCode" label="编码" prop="OrgCode">
									<a-input
										v-model="form.OrgCode"
										placeholder="请输入用户组编码"
										@blur="
											() => {
												$refs.OrgCode.onFieldBlur();
											}
										"
									/>
								</a-form-model-item>
								<a-form-model-item ref="SuperiorId" label="上级组织" v-if="subType"><a-input v-model="subItem.OrgName" disabled /></a-form-model-item>
								<a-form-model-item ref="OrgDesc" label="描述">
									<a-textarea v-model="form.OrgDesc" placeholder="请输入用户组描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
								</a-form-model-item>
								<a-form-model-item ref="OrgDimensionId" label="组织选择" prop="OrgDimensionId">
									<a-select placeholder="选择组织维" @change="orgChange" v-model="form.OrgDimensionId" allowClear v-decorator="['OrgDimensionId']">
										<a-select-option v-for="(item, index) in orgList" :key="index" :value="item.OrgDimensionId">{{ item.OrgDimensionName }}</a-select-option>
									</a-select>
								</a-form-model-item>
								<a-form-model-item ref="OrgDimensionId" label="组织维度" prop="OrgDimensionId">
									<a-select placeholder="选择组织维度" @change="orgChange" v-model="form.OrgDimensionId" allowClear v-decorator="['OrgDimensionId']">
										<a-select-option v-for="(item, index) in orgList" :key="index" :value="item.OrgDimensionId">{{ item.OrgDimensionName }}</a-select-option>
									</a-select>
								</a-form-model-item>
								<a-form-model-item ref="OrgLevelId" label="所属等级指" prop="OrgLevelId">
									<a-select placeholder="选择组织等级" v-model="form.OrgLevelId" allowClear v-decorator="['OrgLevelId']">
										<a-select-option v-for="(item, index) in LevelList" :key="index" :value="item.OrgLevelId">{{ item.OrgLevelName }}</a-select-option>
									</a-select>
								</a-form-model-item>
								<a-form-model-item ref="Enable" label="是否启用">
									<a-radio-group :value="form.Enable" button-style="solid" @change="enableChange">
										<a-radio-button value="N">否</a-radio-button>
										<a-radio-button value="Y">是</a-radio-button>
									</a-radio-group>
								</a-form-model-item>
							</a-form-model>
						</a-modal>
					</div>
				</a-card>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { getEnterTree, getOrganizationList, getOrginfo, orginfoAction, getOrgLevelList } from '@/services/admin.js';
const columns = [
	{
		title: '序号',
		scopedSlots: { customRender: 'index' },
		align: 'center'
	},
	{
		title: '组名',
		dataIndex: 'OrgName',
		scopedSlots: { customRender: 'OrgName' },
		align: 'center'
	},
	{
		title: '组key',
		dataIndex: 'OrgCode',
		scopedSlots: { customRender: 'OrgCode' },
		align: 'center'
	},
	{
		title: '等级',
		dataIndex: 'OrgLevelName',
		scopedSlots: { customRender: 'OrgLevelName' },
		align: 'center'
	},
	{
		title: '操作',
		scopedSlots: { customRender: 'action' },
		align: 'center'
	}
];
export default {
	data() {
		return {
			tabData: [],
			treeList: [],
			LevelList: [],
			columns,
			orgList: [],
			replaceFields: {
				title: 'EnterName',
				key: 'Id',
				value: 'Id'
			},
			fieldNames:{
				label:"OrgDimensionName",
				value: 'OrgDimensionId',
				children:'children'
			},
			replaceFields1: {
				title: 'OrgDimensionName',
				key: 'OrgDimensionId',
				value: 'OrgDimensionId'
			},
			title: '添加机构类型',
			loading: false,
			selectedRowKeys: [],
			expandRowByClick: false,
			visible: false,
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			dimsensionId: null,
			enterid: null,
			defaultEnterid: null,
			enterValue: null,
			leverValue: null,
			subType: false,
			subItem: [],
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
			form: {
				OrgCode: '',
				OrgName: '',
				OrgDesc: '',
				SuperiorId: '',
				Enable: 'Y',
				OrgLevelId: '',
				OrgDimensionId: '',
				EnterId: ''
			},
			rules: {
				OrgCode: [
					{
						required: true,
						message: '请输入用户组编码',
						trigger: 'blur'
					}
				],
				OrgName: [
					{
						required: true,
						message: '请输入用户组名称',
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
	async created() {
		await this.getTreeList();
	},
	methods: {
		orgChange(value){
			this.LevelList =[]
			this.getList(value)
		},
		//多选
		onSelectChange(selectedRowKeys) {
			this.selectedRowKeys = selectedRowKeys;
		},
		getTreeList() {
			getEnterTree().then(res => {
				if (res.data.success) {
					console.log(res);
					this.treeList = res.data.data;
					this.enterValue = this.treeList[0].Id;
					this.getOrganizationList();
				}
			});
		},
		//获取机构类型列表
		getOrganizationList() {
			let parmas = {
				pageindex: 1,
				pagesize: 100
			};
			getOrganizationList(parmas).then(res => {
				if (res.data.success) {
					this.orgList = res.data.data.list;
					this.leverValue = this.orgList[0].OrgDimensionId;
					this.getList(this.leverValue);
					this.getOrginfo();
				}
			});
		},
		getList(id) {
			let parmas = {
				pageindex: 1,
				pagesize: 100,
				dimsensionId: id
			};
			getOrgLevelList(parmas).then(res => {
				if (res.data.success) {
					this.LevelList = res.data.data.list;
					console.log('等级值====', this.LevelList);
				}
			});
		},
		//获取组织列表
		getOrginfo() {
			console.log(this.leverValue);
			let parmas = {
				pageindex: this.pagination.current,
				pagesize: this.pagination.pageSize,
				dimsensionId: this.leverValue,
				enterid: this.enterValue
			};
			getOrginfo(parmas).then(res => {
				if (res.data.success) {
					this.tabData = res.data.data.list;
					const pagination = { ...this.pagination };
					pagination.total = res.data.data.recordsTotal;
					this.pagination = pagination;
				}
			});
		},
		loadData(selectedOptions) {
			console.log(selectedOptions);
		},
		enableChange(value) {
			this.form.Enable = value.target.value;
		},
		//关闭对话框
		handleCancel() {
			this.visible = false;
		},
		leverClick(value) {
			this.getOrginfo();
			this.getList(value);
			console.log('等级选择');
		},
		treeClick() {
			console.log('组织选择');
			this.getOrginfo();
		},
		defaultForm() {
			this.form = {
				OrgCode: '',
				OrgName: '',
				OrgDesc: '',
				SuperiorId: '',
				Enable: 'Y',
				OrgLevelId: '',
				OrgDimensionId: '',
				EnterId: ''
			};
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					if (this.isEdit) {
						let editForm = {
							OrgCode: this.OrgCode,
							OrgName: '6435645111',
							OrgDesc: '3456345',
							SuperiorId: '',
							Enable: 'Y',
							OrgLevelId: '78E5797AE9784891BE195B60045B8159',
							OrgDimensionId: 'A815BAE28B3346849C189A27C678BB40',
							EnterId: '50D18646C74D4EAA81D086EE0671D6F2'
						};
						orginfoAction(editForm, 'update').then(res => {
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
						let parma = {
							OrgCode: this.form.OrgCode,
							OrgName: this.form.OrgName,
							OrgDesc: this.form.OrgDesc,
							SuperiorId: this.subItem.OrgId || '',
							Enable: this.form.Enable,
							OrgLevelId: this.form.OrgLevelId,
							OrgDimensionId: this.leverValue,
							EnterId: this.enterValue
						};
						orginfoAction(parma, 'add').then(res => {
							if (res.data.success) {
								this.$message.success('添加成功!');
								this.getOrganizationList();
								this.getOrginfo();
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
		addSubclass(item, type) {
			this.defaultForm();
			this.subItem = [];
			this.subType = false;
			this.visible = !this.visible;
			if (type == 'sub') {
				this.subItem = item;
				this.subType = true;
				console.log(this.subItem);
			}
		},
		//单个删除
		onDelete(item) {
			let parmas = [];
			parmas.push(item.OrgId);
			orginfoAction(parmas, 'delete').then(res => {
				if (res.data.success) {
					this.$message.success('删除成功!');
					this.getOrginfo()();
				} else {
					this.$message.warning(res.data.message.content);
				}
			});
		},
		//分页
		handleTableChange(pagination) {
			this.pagination.current = pagination.current;
			this.pagination.pageSize = pagination.pageSize;
			this.getOrginfo();
		},
		allDel() {}
	},
	components: {}
};
</script>

<style lang="less"></style>

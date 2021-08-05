<template>
	<div>
		<a-row>
			<!-- 机构类型 -->
			<a-col style="padding: 0 5px" :span="5">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<span class="card-title">机构类型:</span>
					<a-select v-model="defaultEnterTypeId" style="width: 200px" @change="enterTypeSelect">
						<a-select-option :value="item.EnterTypeId" v-for="(item, index) in enterTypeData" :key="index">{{ item.EnterTypeName }}</a-select-option>
					</a-select>
					<div style="padding: 10px 0;">
						<a-tree
							@select="enterTreeClick"
							v-if="enterTreeData.length"
							:tree-data="enterTreeData"
							:replaceFields="replaceFields"
							default-expand-all
							:default-selected-keys="enterValue"
						></a-tree>
						<a-empty v-if="enterTreeData.length == 0" />
					</div>
				</a-card>
			</a-col>
			<!-- 组织维度 -->
			<a-col style="padding: 0 5px" :span="5">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<span class="card-title">组织维度:</span>
					<a-select v-model="defaultOrgDimensionId" style="width: 200px" @change="orgTypeSelect" :disabled="isNotEnter">
						<a-select-option :value="item.OrgDimensionId" v-for="(item, index) in OrganizationData" :key="index">{{ item.OrgDimensionName }}</a-select-option>
					</a-select>
					<div style="padding: 10px 0;">
						<a-tree
							@select="orgTreeClick"
							v-if="orgTreeData.length"
							:tree-data="orgTreeData"
							:replaceFields="replaceFields1"
							default-expand-all
							:default-selected-keys="orgValue"
						></a-tree>
						<a-empty v-if="orgTreeData.length == 0" />
					</div>
				</a-card>
			</a-col>
			<!-- 应用类型 -->
			<a-col style="padding: 0 5px" :span="5">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<span class="card-title">应用类型:</span>
					<a-select v-model="defaultAppTypeId" style="width: 200px" @change="appTypeSelect" :disabled="isNotEnter">
						<a-select-option :value="item.AppTypeId" v-for="(item, index) in appTypeData" :key="index">{{ item.AppTypeName }}</a-select-option>
					</a-select>
					<div style="padding: 10px 0;">
						<a-tree
							@select="appTreeClick"
							v-if="appTreeData.length"
							:tree-data="appTreeData"
							:replaceFields="replaceFields2"
							default-expand-all
							checkable
							:default-selected-keys="appValue"
						></a-tree>
						<a-empty v-if="appTreeData.length == 0" />
					</div>
				</a-card>
			</a-col>
			<!-- 添加 -->
			<div>
				<a-modal :title="isEdit ? '编辑权限' : '添加权限'"  v-if="visible" :visible="visible" @ok="handleOk" destoryOnClose @cancel="handleCancel">
					<a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
						<a-form-model-item ref="EnterTypeId" has-feedback label="机构类型" prop="EnterTypeId">
							<a-select v-model="form.EnterTypeId" placeholder="请选择机构类型">
								<a-select-option v-for="item in enterTypeData" :key="item.EnterTypeId">{{ item.EnterTypeName }}</a-select-option>
							</a-select>
						</a-form-model-item>
						<a-form-model-item ref="EnterId" has-feedback label="机构选择" prop="EnterId">
							<a-tree-select
								style="width: 100%"
								:tree-data="enterTreeData"
								placeholder="Please select"
								tree-default-expand-all
								:replaceFields="replaceFields"
							></a-tree-select>
						</a-form-model-item>
						<a-form-model-item ref="UserTypeDesc" label="描述">
							<a-textarea v-model="form.UserTypeDesc" placeholder="请输入用户描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
						</a-form-model-item>
					</a-form-model>
				</a-modal>
			</div>
			<!-- 列表 -->
			<a-col :span="9">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<div>
						<a-row type="flex" justify="start">
							<a-col :span="2"><a-button @click="goAdd()" type="primary" icon="form">添加</a-button></a-col>
						</a-row>
					</div>
					<div>
						<a-table :columns="columns" :data-source="permissionList" size="small" bordered>
							<template v-for="col in ['name', 'age', 'address']" :slot="col" slot-scope="text, record">
								<div :key="col">
									<a-input v-if="record.editable" allowClear style="margin: -5px 0" :value="text" @change="e => handleChange(e.target.value, record.key, col)" />
									<template v-else>
										{{ text }}
									</template>
								</div>
							</template>
							<template slot="operation">
								<div>
									<a style="margin-right: 8px">
										<a-icon type="plus" />
										新增
									</a>
									<a style="margin-right: 8px">
										<a-icon type="edit" />
										编辑
									</a>
								</div>
							</template>
						</a-table>
					</div>
				</a-card>
			</a-col>
		</a-row>
	</div>
</template>

<script>
const columns = [
	{
		title: '筛选字段',
		dataIndex: 'EnterName',
		scopedSlots: { customRender: 'EnterName' },
		align: 'center'
	},
	{
		title: '比较符',
		dataIndex: 'Compartor',
		scopedSlots: { customRender: 'Compartor' },
		align: 'center'
	},
	{
		title: '字段值',
		dataIndex: 'EnterName',
		scopedSlots: { customRender: 'EnterName' },
		align: 'center'
	}
];
import { getInstitutionList, getEnterTree, getOrganizationList, getOrgTree, getAppTypeList, getAppMdules, getPermissionList } from '@/services/admin.js';
export default {
	data() {
		return {
			columns,
			editingKey: '',
			autoExpandParent: true,
			selectedKeys: [],
			enterTypeData: [],
			OrganizationData: [],
			appTypeData: [],
			defaultEnterTypeId: null,
			defaultOrgDimensionId: null,
			defaultAppTypeId: null,
			enterTreeData: [],
			orgTreeData: [],
			appTreeData: [],
			isEdit: false,
			visible: false,
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			replaceFields: {
				title: 'EnterName',
				key: 'Id',
				value: 'Id',
				children: 'children'
			},
			replaceFields1: {
				title: 'OrgName',
				key: 'OrgId',
				value: 'OrgId',
				children: 'children'
			},
			replaceFields2: {
				title: 'Name',
				key: 'Id',
				value: 'Id',
				children: 'children'
			},
			form: {
				EnterTypeId: '30A5E3E37C014F5FAA378DE79E39C596',
				EnterId: '50D18646C74D4EAA81D086EE0671D6F2',
				Compartor: '=',
				OrgId: '054EF08AAEF348DC81C995E2497D02EE'
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
			},
			enterValue: [],
			orgValue: [],
			appValue: [],
			enterid: 0,
			orgdimensionid: 0,
			appTypeId: 0,
			OrgId: 0,
			isNotEnter: false,
			permissionList: []
		};
	},
	watch: {
		checkedKeys(val) {
			console.log('onCheck', val);
		}
	},
	created() {
		this.getData();
	},
	methods: {
		//机构类型
		getData() {
			let parmas = {
				pageindex: 1,
				pagesize: 50
			};
			getInstitutionList(parmas).then(res => {
				if (res.data.success) {
					this.enterTypeData = res.data.data.list;
					this.defaultEnterTypeId = res.data.data.list[0].EnterTypeId;
					this.getEnterTree();
				}
			});
			getOrganizationList(parmas).then(res => {
				if (res.data.success) {
					this.OrganizationData = res.data.data.list;
					this.defaultOrgDimensionId = res.data.data.list[0].OrgDimensionId;
					this.orgdimensionid = res.data.data.list[0].OrgDimensionId;
				}
			});
			getAppTypeList(parmas).then(res => {
				if (res.data.success) {
					this.appTypeData = res.data.data.list;
					this.defaultAppTypeId = res.data.data.list[0].AppTypeId;
					this.appTypeId = res.data.data.list[0].AppTypeId;
				}
			});
		},
		//机构列表
		getEnterTree() {
			let parmas = {
				entertypeid: this.defaultEnterTypeId
			};
			getEnterTree(parmas).then(res => {
				if (res.data.success) {
					this.enterTreeData = res.data.data;
					console.log('this.enterTreeData ', this.enterTreeData);
					//没有机构
					if (this.enterTreeData.length == 0) {
						this.orgTreeData = [];
						this.appTreeData = [];
						this.isNotEnter = true;
						return;
					}
					this.isNotEnter = false;
					this.enterValue.push(this.enterTreeData[0].Id);
					this.enterid = this.enterTreeData[0].Id;
					console.log('this.enterid===', this.enterid);
					this.getOrgTree();
				}
			});
		},
		//获取组织维度
		getOrgTree() {
			let parmas = {
				enterid: this.enterid,
				orgdimensionid: this.orgdimensionid
			};
			getOrgTree(parmas).then(res => {
				if (res.data.success) {
					this.orgTreeData = res.data.data;
					if (this.orgTreeData.length == 0) {
						return;
					}
					this.orgValue.push(this.orgTreeData[0].OrgId);
					console.log('this.orgValue', this.orgValue);
					this.OrgId = this.orgTreeData[0].OrgId;
					console.log('this.OrgId===', this.OrgId);
					this.getAppMdules();
					this.getPermissionList();
				}
			});
		},
		//获取应用类型
		getAppMdules() {
			let parmas = {
				orgid: this.OrgId,
				apptypeid: this.appTypeId
			};
			getAppMdules(parmas).then(res => {
				if (res.data.success) {
					this.appTreeData = res.data.data;
					this.appValue.push(this.appTreeData[0].Id);
				}
			});
		},
		//获取权限列表
		getPermissionList() {
			let parmas = {
				orgid: this.OrgId
			};
			getPermissionList(parmas).then(res => {
				if (res.data.success) {
					this.permissionList = res.data.data;
				}
			});
		},
		//机构选择
		enterTreeClick(e) {
			this.enterid = e[0];
			this.getOrgTree();
			this.orgTreeData = [];
			this.appTreeData = [];
			this.orgValue = [];
		},
		//组织选择
		orgTreeClick(e) {
			this.OrgId = e[0];
			this.getAppMdules();
			this.appTreeData = [];
			this.appValue = [];
		},
		//应用选择
		appTreeClick(e) {
			console.log(e);
		},
		//机构类型选择
		enterTypeSelect(e) {
			this.defaultEnterTypeId = e;
			this.getEnterTree();
		},
		//组织类型选择
		orgTypeSelect(e) {
			this.orgdimensionid = e;
			this.orgTreeData = [];
			this.appTreeData = [];
			this.orgValue = [];
			this.getOrgTree();
		},
		//应用类型选择
		appTypeSelect(e) {
			this.appTypeId = e;
			this.appTreeData = [];
			this.appValue = [];
			this.getAppMdules();
		},
		onExpand(expandedKeys) {
			this.expandedKeys = expandedKeys;
			this.autoExpandParent = false;
		},
		onCheck(checkedKeys) {
			console.log('onCheck', checkedKeys);
			this.checkedKeys = checkedKeys;
		},
		goAdd() {
			this.visible = true;
		},
		onSelect(selectedKeys, info) {
			console.log('onSelect', info);
			this.selectedKeys = selectedKeys;
		},
		handleOk() {},
		handleCancel() {
			this.visible = true;
		}
	},
	components: {}
};
</script>

<style lang="less">
.left-list {
	padding: 10px 20px;
	text-align: center;
	p {
		font-size: 12px;
		color: @title-color;
		span {
			padding-left: 10px;
			&:hover {
				color: @primary-color;
				// background: @theme-color;
				cursor: pointer;
			}
		}
	}
}
.list-tab {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 10px;
	p {
		height: 30px;
		line-height: 30px;
		color: @title-color;
		font-size: 12px;
		&:hover {
			color: @primary-color;
			cursor: pointer;
		}
	}
}
.card-title {
	padding: 0 10px;
}
</style>

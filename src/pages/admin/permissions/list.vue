<template>
	<div>
		<a-row>
			<a-col style="padding: 0 5px" :span="5">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<span>机构类型:</span>
					<a-select v-model="defaultEnterTypeId" style="width: 200px" @change="enterTypeSelect">
						<a-select-option :value="item.EnterTypeId" v-for="(item, index) in enterTypeData" :key="index">{{ item.EnterTypeName }}</a-select-option>
					</a-select>
					<a-tree
						@select="enterTreeClick"
						v-if="enterTreeData.length"
						:tree-data="enterTreeData"
						:replaceFields="replaceFields"
						default-expand-all
						:default-selected-keys="enterValue"
					></a-tree>
					<a-empty v-if="enterTreeData.length == 0" />
				</a-card>
			</a-col>
			<a-col style="padding: 0 5px" :span="5">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<span>组织维度:</span>
					<a-select v-model="defaultOrgDimensionId" style="width: 200px" @change="orgTypeSelect">
						<a-select-option :value="item.OrgDimensionId" v-for="(item, index) in OrganizationData" :key="index">{{ item.OrgDimensionName }}</a-select-option>
					</a-select>
					<a-tree
						@select="orgTreeClick"
						v-if="orgTreeData.length"
						:tree-data="orgTreeData"
						:replaceFields="replaceFields1"
						default-expand-all
						:default-selected-keys="orgValue"
					></a-tree>
					<a-empty v-if="orgTreeData.length == 0" />
				</a-card>
			</a-col>
			<a-col style="padding: 0 5px" :span="5">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<span>应用类型:</span>
					<a-select v-model="defaultAppTypeId" style="width: 200px" @change="appTypeSelect">
						<a-select-option :value="item.AppTypeId" v-for="(item, index) in appTypeData" :key="index">{{ item.AppTypeName }}</a-select-option>
					</a-select>
					<a-tree
						@select="appTreeClick"
						v-if="appTreeData.length"
						:tree-data="appTreeData"
						:replaceFields="replaceFields2"
						default-expand-all
						:default-selected-keys="appValue"
					></a-tree>
					<a-empty v-if="appTreeData.length == 0" />
				</a-card>
			</a-col>
			<a-col :span="9">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<div>
						<a-row type="flex" justify="start">
							<a-col :span="2"><a-button @click="goAdd()" type="primary" icon="form">添加</a-button></a-col>
						</a-row>
					</div>
					<div>
						<a-table :columns="columns" :data-source="data" size="small" bordered>
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
		title: '类型编码',
		dataIndex: 'name',
		width: '25%',
		scopedSlots: { customRender: 'name' },
		align: 'center'
	},
	{
		title: '类型名称',
		dataIndex: 'age',
		width: '15%',
		scopedSlots: { customRender: 'age' },
		align: 'center'
	},
	{
		title: '是否启用',
		dataIndex: 'address',
		width: '40%',
		scopedSlots: { customRender: 'address' },
		align: 'center'
	},
	{
		title: '默认',
		dataIndex: 'operation',
		scopedSlots: { customRender: 'operation' },
		align: 'center'
	}
];

const data = [];
for (let i = 0; i < 100; i++) {
	data.push({
		key: i.toString(),
		name: `Edrward ${i}`,
		age: 32,
		address: `London Park no. ${i}`
	});
}
import { getInstitutionList, getEnterTree, getOrganizationList, getOrgTree, getAppTypeList, getAppMdules } from '@/services/admin.js';
export default {
	data() {
		return {
			data,
			columns,
			editingKey: '',
			expandedKeys: ['0-0-0', '0-0-1'],
			autoExpandParent: true,
			checkedKeys: ['0-0-0'],
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
			enterValue: [],
			orgValue: [],
			appValue: [],
			enterid: 0,
			orgdimensionid: 0,
			appTypeId: 0,
			OrgId: 0
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
		onSelect(selectedKeys, info) {
			console.log('onSelect', info);
			this.selectedKeys = selectedKeys;
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
</style>

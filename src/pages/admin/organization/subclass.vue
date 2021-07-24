<template>
	<div>
		<a-row>
			<a-col style="padding: 0 5px" :span="6">
				<a-card class="card" :bordered="false" :bodyStyle="{ margin: '5px', padding: '10px' }">
					<p>组织选择</p>
					<a-tree :tree-data="treeList" :replaceFields="replaceFields" show-icon default-expand-all :default-selected-keys="[treeList[0].Id]">
					</a-tree>
				</a-card>
				<a-card class="card" :bordered="false" :bodyStyle="{ margin: '5px', padding: '10px' }">
					<p>组织维度选择</p>
					<a-tree @select="leverClick" :default-selected-keys="[orgList[0].Id]" :tree-data="orgList" :replaceFields="replaceFields1"></a-tree>
				</a-card>
			</a-col>
			<a-col :span="18">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<div>
						<a-space size="small"><a-button type="primary" size="small" @click="addSubclass">新建</a-button></a-space>
					</div>
					<div>
						<!-- <a-table
							:columns="columns"
							:data-source="tabData"
							size="small"
							:row-selection="{
								selectedRowKeys: selectedRowKeys,
								onSelectAll: onSelectAll,
								onSelect: onSelect
							}"
						/> -->
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
								<a-form-model-item ref="OrgDesc" label="描述">
									<a-textarea v-model="form.OrgDesc" placeholder="请输入用户组描述" :auto-size="{ minRows: 3, maxRows: 5 }" />
								</a-form-model-item>
								<!-- <a-form-model-item ref="OrgCode" label="编码" prop="OrgCode">
									<a-input
										v-model="form.OrgCode"
										placeholder="请输入用户组编码"
										text="number"
										@blur="
											() => {
												$refs.OrgCode.onFieldBlur();
											}
										"
									/>
								</a-form-model-item> -->
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
import { getEnterTree, getOrganizationList, getOrginfo } from '@/services/admin.js';
export default {
	data() {
		return {
			treeList: [],
			orgList: [],
			replaceFields: {
				title: 'EnterName',
				key: 'Id'
			},
			replaceFields1: {
				title: 'OrgDimensionName',
				key: 'OrgDimensionId'
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
	created() {
		this.getTreeList();
		this.getOrganizationList();
	},
	methods: {
		getTreeList() {
			getEnterTree().then(res => {
				if (res.data.success) {
					console.log(res);
					this.treeList = res.data.data;
					this.defaultEnterid = this.treeList[0].Id;
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
					this.getOrginfo();
				}
			});
		},
		//获取组织列表
		getOrginfo() {
			if (this.enterid == null) {
				this.$message.warning('请选择组织');
				return;
			}
			if (this.dimsensionId == null) {
				this.$message.warning('请选择组织维度');
				return;
			}
			let parmas = {
				pageindex: this.pagination.current,
				pagesize: this.pagination.pageSize,
				dimsensionId: this.dimsensionId,
				enterid: this.enterid
			};
			getOrginfo(parmas).then(res => {
				if (res.data.success) {
					this.orgList = res.data.data.list;
				}
			});
		},
		enableChange(value) {
			this.form.Enable = value.target.value;
		},
		//关闭对话框
		handleCancel() {
			this.visible = false;
		},
		leverClick(value) {
			console.log(value);
			this.dimsensionId = value[0];
		},
		treeClick(value) {
			console.log(value);
			this.enterid = value[0];
		},

		handleOk() {},
		addSubclass() {
			this.visible = !this.visible;
		},
		onSelectAll(selected) {
			if (selected) {
				const tabData = this.tabData;
				const arr = [];
				setVal(tabData, arr);
				this.selectedRowKeys = arr;
			} else {
				this.selectedRowKeys = [];
			}
			function setVal(list, arr) {
				list.forEach(v => {
					arr.push(v.key);
					if (v.children) {
						setVal(v.children, arr);
					}
				});
			}
		},
		onSelect(record, selected) {
			const set = new Set(this.selectedRowKeys);
			const tabData = this.tabData;
			const key = record.key;
			if (selected) {
				set.add(key);
				record.children && setChildCheck(record.children);
				setParentCheck(key);
			} else {
				set.delete(key);
				record.children && setChildUncheck(record.children);
				setParentUncheck(key);
			}
			this.selectedRowKeys = Array.from(set);
			// 设置父级选择
			function setParentCheck(key) {
				let parent = getParent(key);
				if (parent) {
					set.add(parent.key);
					setParentCheck(parent.key);
				}
			}
			// 设置父级取消，如果父级的子集有选择，则不取消
			function setParentUncheck(key) {
				let childHasCheck = false,
					parent = getParent(key);
				if (parent) {
					let childlist = parent.children;
					childlist.forEach(function(v) {
						if (set.has(v.key)) childHasCheck = true;
					});
					if (!childHasCheck) {
						set.delete(parent.key);
						setParentUncheck(parent.key);
					}
				}
			}
			// 获取当前对象的父级
			function getParent(key) {
				for (let i = 0; i < tabData.length; i++) {
					if (tabData[i].key === key) {
						return null;
					}
				}
				return _getParent(tabData);
				function _getParent(list) {
					let childlist,
						isExist = false;
					for (let i = 0; i < list.length; i++) {
						if ((childlist = list[i].children)) {
							childlist.forEach(function(v) {
								if (v.key === key) isExist = true;
							});
							if (isExist) {
								return list[i];
							}
							if (_getParent(childlist)) {
								return _getParent(childlist);
							}
						}
					}
				}
			}
			// 设置child全选
			function setChildCheck(list) {
				list.forEach(function(v) {
					set.add(v.key);
					v.children && setChildCheck(v.children);
				});
			}
			// 设置child取消
			function setChildUncheck(list) {
				list.forEach(function(v) {
					set.delete(v.key);
					v.children && setChildUncheck(v.children);
				});
			}
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

<template>
	<div>
		<a-row>
			<a-col style="padding: 0 5px" :span="3">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<a-tree :tree-data="treeList">
						<template #title="{ key: treeKey, title }">
							<a-dropdown :trigger="['contextmenu']">
								<span>{{ title }}</span>
								<template #overlay>
									<a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
										<a-menu-item key="1">1st menu item</a-menu-item>
										<a-menu-item key="2">2nd menu item</a-menu-item>
										<a-menu-item key="3">3rd menu item</a-menu-item>
									</a-menu>
								</template>
							</a-dropdown>
						</template>
					</a-tree>
					<!--  -->
				</a-card>
			</a-col>
			<a-col :span="15">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<div>
						<a-space size="small">
							<a-button type="primary" size="small" @click="addSubclass">新建</a-button>
							<a-button size="small">新建</a-button>
							<a-button type="dashed" size="small">新建</a-button>
						</a-space>
					</div>
					<div>
						<a-table
							:columns="columns"
							:data-source="tabData"
							size="small"
							:row-selection="{
								selectedRowKeys: selectedRowKeys,
								onSelectAll: onSelectAll,
								onSelect: onSelect
							}"
						/>
					</div>
					<div>
						<a-modal v-model="visible" title="添加子用户名" @ok="handleOk">
							<a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
								<a-form-item label="用户组名称">
									<a-input
										v-decorator="[
											'note',
											{
												rules: [
													{
														required: true,
														message: 'Please input your note!'
													}
												]
											}
										]"
									/>
								</a-form-item>
								<a-form-item label="编码">
									<a-input
										v-decorator="[
											'note',
											{
												rules: [
													{
														required: true,
														message: 'Please input your note!'
													}
												]
											}
										]"
									/>
								</a-form-item>
								<a-form-item label="所属等级">
									<a-select
										v-decorator="[
											'gender',
											{
												rules: [
													{
														required: true,
														message: 'Please select your gender!'
													}
												]
											}
										]"
										placeholder="Select a option and change input text above"
										@change="handleSelectChange"
									>
										<a-select-option value="male">male</a-select-option>
										<a-select-option value="female">female</a-select-option>
									</a-select>
								</a-form-item>
							</a-form>
						</a-modal>
					</div>
				</a-card>
			</a-col>
			<a-col style="padding: 0 5px" :span="6">
				<a-card class="card" :bordered="false" :bodyStyle="{ padding: '5px' }">
					<a-tabs default-active-key="1" size="small">
						<a-tab-pane key="1" tab="用户关系">
							<div>
								<a-space size="small">
									<a-button type="primary" size="small">新建</a-button>
									<a-button size="small">新建</a-button>
									<a-button type="dashed" size="small">新建</a-button>
								</a-space>
							</div>
							<div class="list-tab">
								<p>组内用户</p>
								<p>组负责人</p>
								<p>上下级</p>
							</div>
						</a-tab-pane>
						<a-tab-pane key="2" tab="组关系" force-render>Content of Tab Pane 2</a-tab-pane>
					</a-tabs>
				</a-card>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import { getEnterTree } from '@/services/admin.js';
export default {
	data() {
		return {
			treeList:[],
			selectedRowKeys: [],
			columns: [
				{
					title: 'Name',
					dataIndex: 'name',
					key: 'name'
				},
				{
					title: 'Age',
					dataIndex: 'age',
					key: 'age',
					width: '12%'
				},
				{
					title: 'Address',
					dataIndex: 'address',
					width: '30%',
					key: 'address'
				}
			],

			tabData: [
				{
					key: 1,
					name: 'John Brown sr.',
					age: 60,
					address: 'New York No. 1 Lake Park',
					children: [
						{
							key: 11,
							name: 'John Brown',
							age: 42,
							address: 'New York No. 2 Lake Park'
						},
						{
							key: 12,
							name: 'John Brown jr.',
							age: 30,
							address: 'New York No. 3 Lake Park',
							children: [
								{
									key: 121,
									name: 'Jimmy Brown',
									age: 16,
									address: 'New York No. 3 Lake Park'
								}
							]
						},
						{
							key: 13,
							name: 'Jim Green sr.',
							age: 72,
							address: 'London No. 1 Lake Park',
							children: [
								{
									key: 131,
									name: 'Jim Green',
									age: 42,
									address: 'London No. 2 Lake Park',
									children: [
										{
											key: 1311,
											name: 'Jim Green jr.',
											age: 25,
											address: 'London No. 3 Lake Park'
										},
										{
											key: 1312,
											name: 'Jimmy Green sr.',
											age: 18,
											address: 'London No. 4 Lake Park'
										}
									]
								}
							]
						}
					]
				},
				{
					key: 2,
					name: 'Joe Black',
					age: 32,
					address: 'Sidney No. 1 Lake Park'
				}
			],
			expandRowByClick: false,
			visible: false
		};
	},
	created() {
		this.getTreeList();
	},
	methods: {
		getTreeList() {
			getEnterTree().then(res => {
				if (res.data.success) {
					console.log(res);
					this.treeList =res.data.data;
				}
			});
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

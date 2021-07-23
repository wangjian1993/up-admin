<template>
	<div class="content">
		<a-table :columns="columns" :pagination="false" :data-source="list" size="small" :loading="isLoading">
			<template slot="use" slot-scope="text, record, index">
				<a-checkbox v-if="record.field_name == 'bom_cost' || record.field_name == 'total_cost'" default-checked disabled></a-checkbox>
				<a-checkbox v-else @change="e => useChange(record, index)"></a-checkbox>
				<!-- <p v-if="record.field_name == 'bom_cost' || record.field_name == 'total_cost'">{{record.field_name}}</p>
				<p v-else>{{index}}</p> -->
			</template>
			<template slot="read">
				<a-checkbox></a-checkbox>
			</template>
			<template slot="compute">
				<a-checkbox></a-checkbox>
			</template>
			<template slot="msg">
				<a-input />
			</template>
			<template slot="parameter">
				<a-input />
			</template>
			<template slot="sort">
				<a-input />
			</template>
		</a-table>
		<footer-tool-bar>
			<a-select default-value="深圳民爆" style="width: 120px;padding-right: 20px;" @change="companyChange">
				<a-select-option value="深圳民爆">深圳民爆</a-select-option>
				<a-select-option value="艾格斯特">艾格斯特</a-select-option>
				<a-select-option value="易欣光电">易欣光电</a-select-option>
				<a-select-option value="依炮尔">依炮尔</a-select-option>
			</a-select>
			<a-button type="primary" @click="validate">提交</a-button>
		</footer-tool-bar>
	</div>
</template>

<script>
import FooterToolBar from '@/components/tool/FooterToolBar';
// import { setVersionsConfig } from '@/services/bom.js';
const columns = [
	{
		title: '费用名称',
		dataIndex: 'cost_name',
		align: 'center'
	},
	{
		title: '字段名',
		dataIndex: 'field_name',
		align: 'center'
	},
	{
		title: '是否使用',
		dataIndex: 'is_use',
		align: 'center',
		scopedSlots: { customRender: 'use' }
	},
	{
		title: '是否只读',
		dataIndex: 'is_readonly',
		align: 'center',
		scopedSlots: { customRender: 'read' }
	},
	{
		title: '是否自动计算',
		dataIndex: 'is_auto_compute',
		align: 'center',
		scopedSlots: { customRender: 'compute' }
	},
	{
		title: '提示描述',
		dataIndex: 'tips_desc',
		align: 'center',
		scopedSlots: { customRender: 'msg' }
	},
	{
		title: '基础参数',
		dataIndex: 'base_number',
		align: 'center',
		width: '120px',
		scopedSlots: { customRender: 'parameter' }
	},
	{
		title: '排序',
		dataIndex: 'order',
		align: 'center',
		width: '80px',
		scopedSlots: { customRender: 'sort' }
	}
];
import { getBomBaseConfig } from '@/services/bom.js';
export default {
	data() {
		return {
			list: [],
			columns,
			isLoading: true,
			company: ''
		};
	},
	created() {
		this.getBomBaseConfig();
	},
	methods: {
		getBomBaseConfig() {
			getBomBaseConfig('get_base').then(res => {
				if (res.data.success) {
					this.list = res.data.data;
					this.isLoading = false;
					this.list.forEach(item => {
						item.is_use = 0;
						item.is_readonly = 0;
						item.is_auto_compute = 0;
						item.tips_desc = '';
						item.base_number = '';
						item.order = 0;
					});
				}
			});
		},
		validate() {
			console.log(this.list);
		},
		useChange(item, index) {
			this.list[index].is_use = this.list[index].is_use == 1 ? 0 : 1;
		},
		companyChange(value) {
			this.company = value;
		}
	},
	components: { FooterToolBar }
};
</script>

<style lang="less" scoped>
.content {
	background-color: @base-bg-color;
	padding: 0px;
}
</style>

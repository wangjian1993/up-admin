<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-07-10 10:32:18
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/bom/components/Details.vue
-->
<template>
	<div>
		<a-card class="card" title="搜索结果" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '0px 24px',minHeight:'30px'}">
			<a-descriptions title="">
				<a-descriptions-item label="产品品号">Zhou Maomao</a-descriptions-item>
				<a-descriptions-item label="产品大类"><a-input placeholder="" type="text" /></a-descriptions-item>
				<a-descriptions-item label="产品型号"><a-input placeholder="" type="text" /></a-descriptions-item>
				<a-descriptions-item label="产品品名">Hangzhou, Zhejiang</a-descriptions-item>
				<a-descriptions-item label="产品规格">empty</a-descriptions-item>
			</a-descriptions>
		</a-card>
		<a-card class="card" title="物料成本" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px',minHeight:'30px'}">
			<div id="input-box">
				<a-row>
					<a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12" :xxl="12" v-for="(item, index) in inputList" :key="index">
						<div class="input-item">
							<p class="input-lable">{{ item.name }}:</p>
							<p class="input-number"><a-input-number :disabled="!item.isImport" v-model="item.value" :min="0" :max="10" @change="costNumber"/></p>
							<p class="input-text">{{ item.text }}</p>
						</div>
					</a-col>
				</a-row>
			</div>
		</a-card>
		<a-card class="card" title="物料" :bordered="false" :bodyStyle="{ padding: '0px 24px' }" :headStyle="{ padding: '5px 24px',minHeight:'30px'}">
			<a-form layout="horizontal">
				<div>
					<a-row>
						<a-col :md="8" :sm="24">
							<a-form-item label="关键字匹配" :labelCol="{ span: 5 }" :wrapperCol="{ span: 16, offset: 1 }">
								<a-input placeholder="请输入料名、料规格、提示" />
							</a-form-item>
						</a-col>
						<a-col :md="8" :sm="24"><a-button type="primary" style="margin-top: 3px;">查询</a-button></a-col>
					</a-row>
				</div>
			</a-form>
			<standard-table :pagination="pagination" :columns="columns" :dataSource="dataSource">
				<div slot="price" slot-scope="{ text, record }"><a-input-number :id="record.key" v-model="record.price" :min="0" :max="30" /></div>
				<div slot="action">
					<a><a-input /></a>
				</div>
			</standard-table>
		</a-card>
	</div>
</template>

<script>
import StandardTable from '@/components/table/StandardTable';
export default {
	props: ['columns', 'dataSource', 'selectedRows', 'inputList','pagination'],
	data() {
		return {};
	},
	methods:{
		costNumber(item){
			console.log("itme===",item)
		}
	},
	components: { StandardTable }
};
</script>

<style lang="less">
.input-item {
	display: flex;
	align-items: center;
	.input-lable {
		width: 100px;
		text-align: right;
	}
	.input-number {
		padding-left: 5px;
	}
	.input-text {
		padding-left: 5px;
	}
}
.ant-card-body{
	padding: 0;
}
.ant-card-head-title{
	padding:0;
}
.ant-form-item{
	margin-bottom:0;
}
</style>

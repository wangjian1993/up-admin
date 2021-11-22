<!--
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-11-22 10:17:42
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/user/add.vue
-->
<template>
	<a-card class="card" :bordered="false">
		<a-tabs default-active-key="1">
			<a-tab-pane key="1" tab="基本信息">
				<a-form layout="horizontal">
					<div class="">
						<a-row>
							<a-col :md="8" :sm="24">
								<a-form-item label="产品品号" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
									<a-input placeholder="请输入" v-decorator="['username', { rules: [{ required: true, message: 'Please input your name' }] }]" />
								</a-form-item>
							</a-col>
							<a-col :md="8" :sm="24">
								<a-form-item label="需求公司" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
									<a-select placeholder="请选择">
										<a-select-option value="1">关闭</a-select-option>
										<a-select-option value="2">运行中</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :md="8" :sm="24">
								<a-form-item label="生产工厂" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
									<a-input placeholder="请输入" v-decorator="['username', { rules: [{ required: true, message: 'Please input your name' }] }]" />
								</a-form-item>
							</a-col>
						</a-row>
						<a-row v-if="advanced">
							<a-col :md="8" :sm="24">
								<a-form-item label="更新日期" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
									<a-date-picker style="width: 100%" placeholder="请输入更新日期" />
								</a-form-item>
							</a-col>
							<a-col :md="8" :sm="24">
								<a-form-item label="使用状态" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
									<a-select placeholder="请选择">
										<a-select-option value="">全部</a-select-option>
										<a-select-option value="1">关闭</a-select-option>
										<a-select-option value="2">运行中</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :md="8" :sm="24">
								<a-form-item label="描述" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }"><a-input placeholder="请输入" /></a-form-item>
							</a-col>
						</a-row>
					</div>
				</a-form>
			</a-tab-pane>
			<a-tab-pane key="2" tab="联系方式" force-render>Content of Tab Pane 2</a-tab-pane>
			<a-tab-pane key="3" tab="扩展属性">Content of Tab Pane 3</a-tab-pane>
		</a-tabs>
		<div>
			<a-row type="flex" justify="center">
				<a-col :span="2"><a-button @click="goAdd()" type="primary" icon="form">添加</a-button></a-col>
			</a-row>
		</div>
	</a-card>
</template>
<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

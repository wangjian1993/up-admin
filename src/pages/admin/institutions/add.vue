<!--
 * @Author: max
 * @Date: 2021-06-22 17:03:37
 * @LastEditTime: 2021-07-21 09:47:37
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/pages/admin/institutions/add.vue
-->
<template>
	<a-card class="card" :bordered="false" :bodyStyle="{ padding: '15px' }">
		<div class="">
			<a-form layout="horizontal">
				<div class="">
					<a-row>
						<a-col :md="8" :sm="24">
							<a-form-item label="机构编码" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
								<a-input placeholder="请输入" v-decorator="['username', { rules: [{ required: true, message: 'Please input your name' }] }]" />
							</a-form-item>
						</a-col>
						<a-col :md="8" :sm="24">
							<a-form-item label="管理员邮箱" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
								<a-select placeholder="请选择">
									<a-select-option value="1">关闭</a-select-option>
									<a-select-option value="2">运行中</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :md="8" :sm="24">
							<a-form-item label="公司中文名" :labelCol="{ span: 4 }" :wrapperCol="{ span: 12, offset: 1 }">
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
		</div>
		<div>
			<a-row type="flex" justify="center">
				<a-col :span="2"><a-button size="small" type="primary">确认</a-button></a-col>
				<a-col :span="2"><a-button size="small"  type="primary">取消</a-button></a-col>
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

<style lang="less">
.ant-form-item {
	margin-bottom: 5px;
}
</style>

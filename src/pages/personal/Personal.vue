<template>
	<div class="user">
		<a-tabs default-active-key="1" :tab-position="tabPosition" :tabBarStyle="tabStyle">
			<a-tab-pane key="1" tab="基本设置">
				<a-card :bordered="false">
					<a-form>
						<a-form-item label="邮箱" :labelCol="{ span: 2 }" :wrapperCol="{ span: 10 }"><a-input placeholder="邮箱" /></a-form-item>
					</a-form>
					<a-form>
						<a-form-item label="昵称" :labelCol="{ span: 2 }" :wrapperCol="{ span: 10 }"><a-input placeholder="昵称" /></a-form-item>
					</a-form>
					<a-form>
						<a-form-item label="电话" :labelCol="{ span: 2 }" :wrapperCol="{ span: 10 }"><a-input placeholder="电话" /></a-form-item>
					</a-form>
				</a-card>
			</a-tab-pane>
			<a-tab-pane key="2" tab="安全设置"></a-tab-pane>
			<a-tab-pane key="3" tab="新消息通知"></a-tab-pane>
		</a-tabs>
	</div>
</template>
<script>
export default {
	data() {
		return {
			tabPosition: 'left'
		};
	},
	methods: {
		callback(val) {
			console.log(val);
		}
	}
};
</script>
<style lang="less" scoped>
.user {
	background-color: @base-bg-color;
	padding: 10px;
	min-height: 600px;
}
.ant-tabs .ant-tabs-left-bar .ant-tabs-tab,
.ant-tabs .ant-tabs-right-bar .ant-tabs-tab {
	padding: 8px 40px;
}
// .ant-tabs-tab{
// 	padding: 8px 40px;
// }
// .tabStyle{
// 	padding: 8px 40px;
// }
</style>

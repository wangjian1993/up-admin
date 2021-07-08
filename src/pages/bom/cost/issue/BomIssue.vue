<template>
	<div>
		<a-card class="card" :bordered="false">
			<div class="search-input"><a-input-search class="search-ipt" style="width: 322px" placeholder="请输入产品品号" size="large" enterButton="搜索" /></div>
		</a-card>
		<!-- <div class="loading" v-if="isSearch"><a-spin tip="加载中..."></a-spin></div> -->
	</div>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	created() {
		console.log(this.inputList);
	},
	components: { }
};
</script>

<style lang="less" scoped>
.loading {
	display: flex;
	justify-content: center;
	align-items: center;
}
.content {
	background-color: @base-bg-color;
	padding: 10px;
}
.search-input {
	display: flex;
	justify-content: center;
	margin: 0 auto;
}
.content-list {
	margin-top: 10px;
}
</style>

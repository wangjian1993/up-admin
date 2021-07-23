<template>
	<div>
		<a-modal v-model="visible" title="Basic Modal">
			<p>Some contents...</p>
			<p>Some contents...</p>
			<p>Some contents...</p>
		</a-modal>
	</div>
</template>

<script>
export default {
	data() {
		return {
			visible:true
		};
	},
	components: {}
};
</script>

<style lang="less" scoped></style>

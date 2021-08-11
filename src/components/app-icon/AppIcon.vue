<!--
 * @Author: max
 * @Date: 2021-08-03 14:49:07
 * @LastEditTime: 2021-08-10 10:15:19
 * @LastEditors: max
 * @Description: 图标
 * @FilePath: /up-admin/src/components/app-icon/AppIcon.vue
-->
<template>
	<div>
		<a-modal title="图标选择" :visible="visible" :width="800" centered :footer="null" :confirm-loading="confirmLoading" @cancel="handleCancel">
			<a-row :gutter="[1, 1]">
				<a-col :span="2" v-for="(item, index) in webIcons" :key="index">
					<div class="icon-box" @click="iconClick(item)">
						<a-icon :type="item" />
						<p>{{ item }}</p>
					</div>
				</a-col>
			</a-row>
		</a-modal>
	</div>
</template>
<script>
import icon from '@/common/icon.js';
export default {
	data() {
		return {
			ModalText: 'Content of the modal',
			visible: true,
			confirmLoading: false,
			webIcons: icon.webIcons
		};
	},
	methods: {
		handleCancel() {
			console.log("guanbi")
			this.$emit("closeModal")
		},
		iconClick(item){
			this.$emit("iconClick",item)
		}
	}
};
</script>
<style type="text/css">
.icon-box {
	text-align: center;
	cursor: pointer;
}
.icon-box:hover {
	background-color: #1890ff;
	color: #fff;
}
p {
	margin: 2px 0;
	padding: 0;
	font-size: 13px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

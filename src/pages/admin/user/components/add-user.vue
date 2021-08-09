<template>
	<div>
		<a-modal
			:title="modalType == 'edit' ? '编辑用户' : '添加用户'"
			:visible="visible"
			:width="800"
			centered
			:confirm-loading="confirmLoading"
			@ok="handleOk"
			@cancel="handleCancel"
		>
			<a-tabs default-active-key="1">
				<a-tab-pane key="1" tab="基本信息">
					<a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
						<a-row>
							<a-col :span="12">
								<a-form-model-item ref="EnterCode" label="头像">
									<a-upload
										name="avatar"
										list-type="picture-card"
										class="avatar-uploader"
										:show-upload-list="false"
										:before-upload="beforeUpload"
										action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
										@change="handleChange"
										:custom-request="uploadImg"
										accept="image/png, image/jpeg"
									>
										<img v-if="imageUrl" :src="imageUrl" alt="avatar" class="head" />
										<div v-else>
											<a-icon :type="loading ? 'loading' : 'plus'" />
											<div class="ant-upload-text">Upload</div>
										</div>
									</a-upload>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="UserName" has-feedback  label="姓名" prop="UserName">
									<a-input
										v-model="form.UserName"
										allowClear
										placeholder="请输入用户姓名"
										@blur="
											() => {
												$refs.UserName.onFieldBlur();
											}
										"
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="UserLoginId" has-feedback  label="账号" prop="UserLoginId">
									<a-input
										v-model="form.UserLoginId"
										placeholder="请输入用户账号"
										allowClear
										:disabled="modalType == 'edit'"
										@blur="
											() => {
												$refs.UserLoginId.onFieldBlur();
											}
										"
									/>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="EnterWechatAccount" label="企业微信">
									<a-input v-model="form.EnterWechatAccount" allowClear placeholder="请输入企业微信" />
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="UserTypeId" has-feedback  label="用户类型" prop="UserTypeId">
									<a-select v-model="form.UserTypeId" placeholder="请选择用户类型">
										<a-select-option v-for="item in usetTypeList" :key="item.UserTypeId" :value="item.UserTypeId">{{ item.UserTypeName }}</a-select-option>
									</a-select>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="Birthday" label="出生日期">
									<a-date-picker v-model="form.Birthday" type="date" placeholder="请选出生日期" style="width: 100%;" />
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="EntryDate" label="入职日期">
									<a-date-picker v-model="form.EntryDate" type="date" placeholder="请选择入职日期" style="width: 100%;" />
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="Gender" label="性别">
									<a-radio-group :value="form.Gender" default-value="Y" button-style="solid" @change="enableChange">
										<a-radio-button value="M">男</a-radio-button>
										<a-radio-button value="F">女</a-radio-button>
									</a-radio-group>
								</a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="Email" label="邮箱"><a-input v-model="form.Email" allowClear placeholder="请输入邮箱" /></a-form-model-item>
							</a-col>
							<a-col :span="12">
								<a-form-model-item ref="MobilePhone" label="手机"><a-input v-model="form.MobilePhone" placeholder="请输入手机" allowClear /></a-form-model-item>
							</a-col>
						</a-row>
						<a-row>
							<a-col :span="24">
								<a-form-model-item ref="Address" label="地址" :labelCol="{ span: 3 }">
									<a-textarea v-model="form.Address" placeholder="请输入用户地址" :auto-size="{ minRows: 3, maxRows: 5 }" />
								</a-form-model-item>
							</a-col>
						</a-row>
					</a-form-model>
				</a-tab-pane>
				<a-tab-pane key="2" tab="组织信息">
					<a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
						<a-form-model-item v-for="item in orgList" :key="item.OrgDimensionId" :label="item.OrgDimensionName">
							<a-input v-if="item.levelArray" style="width: 200px" disabled :value="item.levelArray.OrgLevelName" />
							<a-input v-else style="width: 200px" disabled />
							<a-button type="primary" @click="orgSelect(item)">选择</a-button>
						</a-form-model-item>
					</a-form-model>
				</a-tab-pane>
				<a-tab-pane key="3" tab="权限角色">
					<template>
						<a-radio-group name="radioGroup" v-model="form.UserInRoleList[0].RoleId" default-value="0" @change="rolesChange">
							<a-radio :value="item.RoleId" v-for="item in rolesList" :key="item.RoleId">{{ item.RoleName }}</a-radio>
						</a-radio-group>
					</template>
				</a-tab-pane>
			</a-tabs>
		</a-modal>
		<!-- 等级管理 -->
		<div v-if="isListClass"><list-class @closeModal="closeModal" :enterValue="enterValue" @orgSubSelect="orgSubSelect" :classItem="classItem"></list-class></div>
	</div>
</template>
<script>
import { getUserTypeList, getUserRoles, getOrganizationList, userAction, uploadFile } from '@/services/admin.js';
import listClass from './listClass.vue';
function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}
export default {
	props: ['enterValue', 'editItem', 'modalType'],
	data() {
		return {
			ModalText: 'Content of the modal',
			visible: true,
			confirmLoading: false,
			loading: false,
			isListClass: false,
			classItem: [],
			form: {
				UserLoginId: '',
				UserName: '',
				Enable: 'Y',
				UserTypeId: '',
				EnterId: '',
				Address: '',
				Birthday: '',
				Email: '',
				EnterWechatAccount: '',
				EntryDate: '',
				Gender: 'M',
				MobilePhone: '',
				Photo: '',
				UserInOrgList: [],
				UserInRoleList: [
					{
						RoleId: '',
						RoleCode: '',
						RoleName: '',
						RoleDesc: null,
						AuthLevel: 0,
						UserId: ''
					}
				]
			},
			rules: {
				UserName: [
					{
						required: true,
						message: '请输入用户名称',
						trigger: 'blur'
					}
				],
				UserLoginId: [
					{
						required: true,
						message: '请输入用户账号',
						trigger: 'blur'
					}
				],
				UserTypeId: [
					{
						required: true,
						message: '请选择用户类型',
						trigger: 'blur'
					}
				]
			},
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
			usetTypeList: [],
			rolesList: [],
			rolesDefault: null,
			orgList: [],
			imageUrl: '',
			roleList: [],
			fileData: []
		};
	},
	created() {
		this.getUsetType();
		this.getUserRoles();
		this.getOrganizationList();
		console.log(this.modalType);
		if (this.modalType == 'edit') {
			this.form = this.editItem;
			this.imageUrl = this.editItem.PhotoUrl;
			this.roleList = this.editItem.UserInRoleList;
		}
	},
	methods: {
		defaultForm() {
			this.form = {
				UserLoginId: '',
				UserName: '',
				Enable: 'Y',
				UserTypeId: '',
				EnterId: '',
				Address: '',
				Birthday: '',
				Email: '',
				EnterWechatAccount: '',
				EntryDate: '',
				Gender: 'M',
				MobilePhone: '',
				Photo: '',
				UserInOrgList: [],
				UserInRoleList: []
			};
		},
		closeModal() {
			this.isListClass = false;
		},
		enableChange(e) {
			this.form.Gender = e.target.value;
		},
		uploadImg(info) {
			getBase64(info.file, imageUrl => {
				this.imageUrl = imageUrl;
				console.log(info.file);
				let typeArray = info.file.type.split('/');
				let fileType = typeArray[1].toUpperCase();
				let parmas = {
					FileName: info.file.name,
					FileContent: imageUrl,
					FileSuffix: '.' + fileType
				};
				uploadFile(parmas).then(res => {
					if (res.data.success) {
						this.$message.success('上传成功!');
						this.fileData = res.data.data;
					} else {
						this.$message.error(`上传失败`);
					}
				});
				this.loading = false;
			});
		},
		handleChange(info) {
			if (info.file.status === 'error') {
				this.loading = true;
				this.$message.error(`上传失败`);
				return;
			}
		},
		beforeUpload(file) {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				this.$message.error('请选择jpg或者png格式图片');
			}
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				this.$message.error('图片太大了.请上传小于2M图片');
			}
			return isJpgOrPng && isLt2M;
		},
		//获取用户类型
		getUsetType() {
			let parmas = {
				pageindex: 1,
				pagesize: 50
			};
			getUserTypeList(parmas).then(res => {
				if (res.data.success) {
					this.usetTypeList = res.data.data.list;
				}
			});
		},
		getOrganizationList() {
			let parmas = {
				pageindex: 1,
				pagesize: 50
			};
			getOrganizationList(parmas).then(res => {
				if (res.data.success) {
					this.orgList = res.data.data.list;
					this.form.UserInOrgList.forEach(item => {
						console.log(item);
						this.orgSubSelect(item);
					});
				}
			});
		},
		getUserRoles() {
			getUserRoles().then(res => {
				if (res.data.success) {
					this.rolesList = res.data.data.list;
					this.roleList = this.rolesList[0];
					this.rolesDefault = this.rolesList[0].RoleId;
				}
			});
		},
		orgSelect(item) {
			console.log(item);
			this.isListClass = true;
			this.classItem = item;
		},
		orgSubSelect(value) {
			this.isListClass = false;
			this.classItem = [];
			console.log(this.orgList);
			this.orgList.filter(item => {
				console.log(item);
				if (item.OrgDimensionId == value.OrgDimensionId) {
					item.levelArray = value;
				}
			});
		},
		rolesChange(e) {
			console.log(e.target.value);
			this.rolesList.filter(item => {
				if (item.RoleId == e.target.value) {
					this.roleList = item;
				}
			});
			console.log(this.roleList);
		},
		showModal() {
			this.visible = true;
		},
		handleOk() {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					if (this.modalType == 'edit') {
						let role = [
							{
								RoleId: this.roleList.RoleId,
								RoleCode: this.roleList.RoleCode,
								RoleName: this.roleList.RoleName
							}
						];
						let org = [];
						this.orgList.forEach(item => {
							let obj = {
								OrgId: item.levelArray.OrgId,
								OrgCode: item.levelArray.OrgCode,
								OrgName: item.levelArray.OrgName
							};
							org.push(obj);
						});
						this.form.UserInOrgList = org;
						this.form.UserInRoleList = role;
						this.form.EnterId = this.enterValue[0];
						this.form.Photo = this.fileData.ResourceId || this.form.Photo;
						this.UserId = this.form.UserId;
						console.log(this.form);
						userAction(this.form, 'update').then(res => {
							if (res.data.success) {
								this.$message.success('编辑成功!');
								this.defaultForm();
								this.$emit('succeed');
							}
						});
					} else {
						if (this.roleList.RoleId == '') {
							this.$message.warning('请选择用户权限角色');
							return;
						}
						// if (this.roleList.RoleId == '') {
						// 	this.$message.warning('请选择用户权限角色');
						// 	return;
						// }
						let role = [
							{
								RoleId: this.roleList.RoleId,
								RoleCode: this.roleList.RoleCode,
								RoleName: this.roleList.RoleName
							}
						];
						let org = [];
						this.orgList.forEach(item => {
							let obj = {
								OrgId: item.levelArray.OrgId,
								OrgCode: item.levelArray.OrgCode,
								OrgName: item.levelArray.OrgName
							};
							org.push(obj);
						});
						console.log('提交222=====', org);
						this.form.UserInOrgList = org;
						this.form.UserInRoleList = role;
						this.form.EnterId = this.enterValue[0];
						this.form.Photo = this.fileData.ResourceId || '';
						console.log(this.form);
						userAction(this.form, 'add').then(res => {
							if (res.data.success) {
								this.$message.success('添加成功!');
								this.defaultForm();
								this.$emit('succeed');
							}
						});
					}
				}
			});
		},
		handleCancel() {
			this.$emit('cloneModal');
			this.defaultForm();
		}
	},
	components: { listClass }
};
</script>
<style type="text/css" lang="less" scoped>
.ant-modal-body {
	padding: 5px 15px;
}
/deep/.ant-modal-body {
	height: 450px;
	min-height: 450px;
}
.head {
	width: 104px;
	height: 104px;
}
.ant-upload.ant-upload-select-picture-card {
	width: 104px;
	height: 104px;
}
.avatar-uploader > .ant-upload {
	width: 104px;
	height: 104px;
}
.ant-upload-select-picture-card i {
	font-size: 32px;
	color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
	margin-top: 8px;
	color: #666;
}
</style>

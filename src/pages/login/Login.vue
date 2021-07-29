<template>
	<common-layout>
		<div class="login">
			<div class="top">
				<div class="header">
					<!-- <img alt="logo" class="logo" src="../../assets/img/upshine-logo.png" /> -->
					<span class="title">{{ systemName }}</span>
				</div>
			</div>
			<a-form @submit="onSubmit" :form="form">
				<a-form-item>
					<a-input
						autocomplete="autocomplete"
						size="large"
						placeholder="Administrator"
						v-decorator="[
							'name',
							{
								rules: [{ required: true, message: '请输入账户名', whitespace: true }]
							}
						]"
					>
						<a-icon slot="prefix" type="user" />
					</a-input>
				</a-form-item>
				<a-form-item>
					<a-input
						size="large"
						placeholder="14789632"
						autocomplete="autocomplete"
						type="password"
						v-decorator="[
							'password',
							{
								rules: [{ required: true, message: '请输入密码', whitespace: true }]
							}
						]"
					>
						<a-icon slot="prefix" type="lock" />
					</a-input>
				</a-form-item>
				<a-form-item><a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button></a-form-item>
			</a-form>
		</div>
	</common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout';
import { login } from '@/services/user';
import { setAuthorization } from '@/utils/request';
// import { loadRoutes } from '@/utils/routerUtil';
import { mapMutations } from 'vuex';

export default {
	name: 'Login',
	components: { CommonLayout },
	data() {
		return {
			logging: false,
			error: '',
			form: this.$form.createForm(this),
			timeList: [
				{
					CN: '早上好',
					HK: '早晨啊',
					US: 'Good morning'
				},
				{
					CN: '上午好',
					HK: '上午好',
					US: 'Good morning'
				},
				{
					CN: '中午好',
					HK: '中午好',
					US: 'Good afternoon'
				},
				{
					CN: '下午好',
					HK: '下午好',
					US: 'Good afternoon'
				},
				{
					CN: '晚上好',
					HK: '晚上好',
					US: 'Good evening'
				}
			]
		};
	},
	computed: {
		systemName() {
			return this.$store.state.setting.systemName;
		}
	},
	methods: {
		...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
		onSubmit(e) {
			e.preventDefault();
			this.form.validateFields(err => {
				if (!err) {
					this.logging = true;
					const name = this.form.getFieldValue('name');
					const password = this.form.getFieldValue('password');
					// const name = 'admin';
					// const password = '888888';
					login(name, password).then(this.afterLogin);
				}
			});
		},
		timeFix() {
			const time = new Date();
			const hour = time.getHours();
			return hour < 9 ? this.timeList[0] : hour <= 11 ? this.timeList[1] : hour <= 13 ? this.timeList[2] : hour <= 20 ? this.timeList[3] : this.timeList[4];
		},
		afterLogin(res) {
			this.logging = false;
			console.log(res);
			const loginRes = res.data;
			if (loginRes.success) {
				const { userId } = loginRes.data;
				console.log(loginRes.data);
				this.setUser(userId);
				var inFifteenMinutes = new Date(new Date().getTime() + 4 * 60 * 60 * 1000);
				setAuthorization({ token: res.headers.token, expireAt: inFifteenMinutes });
				this.$router.push('/home/workplace');
				this.$message.success(this.timeFix().CN + '，欢迎回来!', 3);
			} else {
				console.log(loginRes.message.content);
				this.error = loginRes.message.content;
				this.$message.warning(this.error);
			}
		}
	}
};
</script>

<style lang="less" scoped>
.common-layout {
	.top {
		text-align: center;
		margin-bottom: 5vw;
		.header {
			height: 44px;
			line-height: 44px;
			.logo {
				height: 44px;
				vertical-align: top;
				margin-right: 16px;
			}
			.title {
				font-size: 33px;
				color: #004595;
				font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
				font-weight: 600;
				position: relative;
				top: 2px;
			}
		}
	}
	.login {
		margin-top: 5vw;
		@media screen and (max-width: 576px) {
			width: 95%;
		}
		@media screen and (max-width: 320px) {
			.captcha-button {
				font-size: 14px;
			}
		}
		.icon {
			font-size: 24px;
			color: @text-color-second;
			margin-left: 16px;
			vertical-align: middle;
			cursor: pointer;
			transition: color 0.3s;

			&:hover {
				color: @primary-color;
			}
		}
	}
}
.ant-input-affix-wrapper {
	border: none;
	width: 317px;
}
.ant-input {
	border-radius: 5px;
}
</style>

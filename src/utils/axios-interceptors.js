/*
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-10-21 17:24:14
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/utils/axios-interceptors.js
 */
import Cookie from 'js-cookie'
// 401拦截
const resp401 = {
	/**
	 * 响应数据之前做点什么
	 * @param response 响应对象
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {*}
	 */
	onFulfilled(response, options) {
		const {
			message
		} = options
		// console.log(response);
		if (response.status === 401) {
			message.error('token失效,请重新登陆!')
		}
		if (response.data.message.code == 401) {
			message.error('token失效,请重新登陆!');
			localStorage.removeItem('admin.routes');
			setTimeout(() => {
				location.href = './';
			}, 200)
		}
		if (!response.data.success) {
			message.error(response.data.message.content);
			return response;
		}
		return response
	},
	/**
	 * 响应出错时执行
	 * @param error 错误对象
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {Promise<never>}
	 */
	onRejected(error, options) {
		const {
			message
		} = options
		const {
			response
		} = error
		if (response.status === 401) {
			message.error('无此权限')
		}
		return Promise.reject(error)
	}
}

const resp403 = {
	onFulfilled(response, options) {
		const {
			message
		} = options
		if (response.code === 403) {
			message.error('请求被拒绝')
		}
		return response
	},
	onRejected(error, options) {
		const {
			message
		} = options
		const {
			response
		} = error
		if (response.status === 403) {
			message.error('请求被拒绝')
		}
		return Promise.reject(error)
	}
}

const reqCommon = {
	/**
	 * 发送请求之前做些什么
	 * @param config axios config
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {*}
	 */
	onFulfilled(config, options) {
		const { message } = options
		const {
			url,
			xsrfCookieName
		} = config
		if (url.indexOf('uservalidate') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
			message.warning('认证 token 已过期，请重新登录');
			setTimeout(() => {
				location.href = './';
			}, 200)
		}
		return config
	},
	/**
	 * 请求出错时做点什么
	 * @param error 错误对象
	 * @param options 应用配置 包含: {router, i18n, store, message}
	 * @returns {Promise<never>}
	 */
	onRejected(error, options) {
		const {
			message
		} = options
		message.error(error.message)
		return Promise.reject(error)
	}
}

export default {
	request: [reqCommon], // 请求拦截
	response: [resp401, resp403] // 响应拦截
}

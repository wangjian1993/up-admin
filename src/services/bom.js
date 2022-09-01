/*
 * @Author: max
 * @Date: 2021-07-08 09:23:52
 * @LastEditTime: 2021-07-20 17:15:09
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/bom.js
 */
import {
	MB_CLOUD
} from '@/services/api'
import {
	request,
	METHOD
} from '@/utils/request'
import qs from 'qs';
/**
 * 获取费用配置项
 * @param get_base 
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getBomBaseConfig() {
	var data = new FormData();
	data.append('act', 'get_base');
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, data)
}
/**
 * 设置费用项
 * @param parma 
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function setBomBaseConfig(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
/**
 * 设置费用项
 * @param 设置配置版本 
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function setVersionsConfig(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
/**
 * 获取版本列表
 * @param parma 
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getVersionsManage(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
/**
 * 审核版本
 * @param id 版本id 
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function setVersionsAudit(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
/**
 * 获取版本详细信息
 * @param id 版本id
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getVersionsDetail(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
export async function getCompanyBomCost(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
/**
 * @description: 获取bom费用
 * @param {*} parma
 * @return {*}
 */
export async function getBomSerchList(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/e10_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	},false)
}
/**
 * @description: 发布bom信息
 * @param {*} parma
 * @return {*}
 */
export async function bomForm(parma) {
	let params = qs.stringify(parma)
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	},false)
}

/**
 * @description: 获取产品大类型号
 * @param {*} parma
 * @return {*}
 */
export async function getProductModel(parma) {
	return request(`${MB_CLOUD}/bom_cost_api.php`, METHOD.POST, parma,false)
}
export default {
	getBomBaseConfig,
	setBomBaseConfig,
	getVersionsManage,
	setVersionsConfig,
	setVersionsAudit,
	getVersionsDetail,
	getBomSerchList,
	getCompanyBomCost,
	bomForm,
	getProductModel
}

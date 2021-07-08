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
	return request(MB_CLOUD, METHOD.POST, data, false)
}
/**
 * 设置费用项
 * @param parma 
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function setBomBaseConfig(parma) {
	let parmas = qs.stringify(parma)
	return request(`${MB_CLOUD}`, METHOD.POST, parmas, false, {
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
	let parmas = qs.stringify(parma)
	return request(`${MB_CLOUD}`, METHOD.POST, parmas, false, {
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
	let parmas = qs.stringify(parma)
	return request(`${MB_CLOUD}`, METHOD.POST, parmas, false, {
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
	let parmas = qs.stringify(parma)
	return request(`${MB_CLOUD}`, METHOD.POST, parmas, false, {
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
	let parmas = qs.stringify(parma)
	return request(`${MB_CLOUD}`, METHOD.POST, parmas, false, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
}
export default {
	getBomBaseConfig,
	setBomBaseConfig,
	getVersionsManage,
	setVersionsConfig,
	setVersionsAudit,
	getVersionsDetail
}

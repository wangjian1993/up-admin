/*
 * @Author: max
 * @Date: 2021-07-14 08:51:07
 * @LastEditTime: 2021-07-14 09:08:19
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/admin.js
 */
import {
	UP_ADMIN
} from '@/services/api'
import {
	request,
	METHOD
} from '@/utils/request'
export async function adminTest(params) {
	console.log(UP_ADMIN)
	return request(UP_ADMIN, METHOD.GET,params, false)
}
export default {
	adminTest
}

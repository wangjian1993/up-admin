/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2021-07-20 16:10:15
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/services/user.js
 */
import {ROUTES} from '@/services/api';
import {request, METHOD, removeAuthorization} from '@/utils/request';

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(`http://192.168.1.245:6688/api/auth/user/uservalidate`, METHOD.POST, {
    userName: name,
    userPwd: password
  },false)
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig
}

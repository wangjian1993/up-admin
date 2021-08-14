/*
 * @Author: max
 * @Date: 2021-08-13 09:17:21
 * @LastEditTime: 2021-08-13 13:37:52
 * @LastEditors: max
 * @Description: 权限按钮判断
 * @FilePath: /up-admin/src/utils/permissions.js
 */
import store from '@/store'

export function actionToObject(json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}

/**
 * 控制按钮是否显示
 *
 * @author yubaoshan
 * @date 2020/06/27 02:34
 */
export function hasBtnPermission(permission) {
  const myBtns = store.getters['buttons']
  // console.log("权限===",myBtns)
  return myBtns.indexOf(permission) > -1
}

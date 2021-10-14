/*
 * @Author: max
 * @Date: 2021-06-23 09:27:52
 * @LastEditTime: 2021-10-14 16:07:24
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/utils/util.js
 */
import enquireJs from 'enquire.js'

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}
//截取时间
export function splitData(data) {
  let str = data.split('T');
  return str[0];
}

export function enquireScreen(call) {
  const handler = {
    match: function () {
      call && call(true)
    },
    unmatch: function () {
      call && call(false)
    }
  }
  enquireJs.register('only screen and (max-width: 767.99px)', handler)
}
//品号类型转换
export function modelType(type) {
  let obj = [
    {
      type: "P",
      name: "采购价"
    },
    {
      type: "M",
      name: "自制件"
    },
    {
      type: "S",
      name: "委外加工件"
    },
    {
      type: "Y",
      name: "采购价"
    },
    {
      type: "F",
      name: "采购价"
    },
    {
      type: "O",
      name: "采购价"
    },
    {
      type: "T",
      name: "采购价"
    },
  ];
  let codeName ="";
  obj.map(item => {
    if (item.type == type) {
      codeName = item.name;
    }
  })
  return codeName;
}
const _toString = Object.prototype.toString

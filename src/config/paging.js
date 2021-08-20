/*
 * @Author: max
 * @Date: 2021-08-17 08:26:18
 * @LastEditTime: 2021-08-19 10:35:44
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/config/paging.js
 */
 const pagination ={
	current: 1,
	total: 0,
	pageSize: 20, //每页中显示10条数据
	showSizeChanger: true,
	showLessItems: true,
	showQuickJumper: true,
	pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
	showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`
}
export default {
	pagination
}
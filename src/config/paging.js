 const pagination ={
	current: 1,
	total: 0,
	pageSize: 10, //每页中显示10条数据
	showSizeChanger: true,
	showLessItems: true,
	showQuickJumper: true,
	pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
	showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`
}
export default {
	pagination
}
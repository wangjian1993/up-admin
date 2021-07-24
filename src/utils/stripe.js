function renderStripe() {
	const table = document.getElementsByClassName('ant-table-row');
	if (table.length > 0) {
		const rowList = [...table];
		rowList.forEach(row => {
			const index = rowList.indexOf(row);
			if (index % 2 !== 0) {
				row.style.backgroundColor = '#f7f7f7';
			} else {
				row.style.backgroundColor = '#ffffff';
			}
		});
	}
}
module.exports = {
  renderStripe
}
/*
 * @Author: max
 * @Date: 2021-12-08 16:36:25
 * @LastEditTime: 2021-12-14 18:30:42
 * @LastEditors: max
 * @Description: 
 * @FilePath: /up-admin/src/utils/resizeableTitle.js
 */
export function resizeableTitle(h, props, children, columns) {
    const { key, ...restProps } = props
    const col = columns.find(col => {
        const k = col.dataIndex || col.key
        return k === key
    })
    if (!col || !col.width) {
        return h('th', { ...restProps }, [...children])
    }
    const dragProps = {
        key: col.dataIndex || col.key,
        class: 'table-draggable-handle',
        attrs: {
            w: 10,
            x: col.width,
            z: 1,
            axis: 'x',
            draggable: true,
            resizable: false
        },
        on: {
            dragging: (x) => {
                if (x > 45) {
                    col.width = Math.max(x, 1)
                } else {
                    col.width = Math.max(45, 1)
                }
            }
        }
    }
    const drag = h('vue-draggable-resizable', { ...dragProps })
    return h('th', { ...restProps, class: 'resize-table-th' }, [...children, drag])
}
import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
	routes: [{
			path: '/login',
			name: '登录页',
			component: () => import( /* webpackChunkName: 'login' */ '@/pages/login')
		},
		{
			path: '*',
			name: '404',
			component: () => import( /* webpackChunkName: 'exception' */ '@/pages/exception/404'),
		},
		{
			path: '/403',
			name: '403',
			component: () => import( /* webpackChunkName: 'exception' */ '@/pages/exception/403'),
		},
		{
			path: '/',
			name: '民爆',
			component: TabsView,
			redirect: '/login',
			children: [{
				path: 'home',
				name: '首页',
				meta: {
					icon: 'home'
				},
				component: BlankView,
				children: [{
						path: 'workplace',
						name: '工作台',
						component: () => import( /* webpackChunkName: 'dashboard' */
							'@/pages/dashboard/workplace'),
						meta: {
							icon: 'appstore'
						}
					},
					{
						path: 'bom',
						name: 'BOM管理',
						meta: {
							icon: 'file-protect'
						},
						component: BlankView,
						children: [{
								path: 'bom-cost',
								name: '费用管理',
								component: () => import( /* webpackChunkName: 'bom' */
									'@/pages/bom/cost'),
							},
							{
								path: 'cost-config',
								name: '费用项管理',
								component: () => import( /* webpackChunkName: 'bom' */
									'@/pages/bom/costConfig')
							},
							{
								path: 'versions-config',
								name: '配置版本',
								component: () => import( /* webpackChunkName: 'bom' */
									'@/pages/bom/versionsConfig')
							},
							{
								path: 'versions-manage',
								name: '版本管理',
								component: () => import( /* webpackChunkName: 'bom' */
									'@/pages/bom/versionsManage')
							}
						],
					}
				]
			}],

		}
	]
}
export default options

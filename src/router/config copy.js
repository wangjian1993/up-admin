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
							path: 'analysis',
							name: '分析页',
							component: () => import( /* webpackChunkName: 'dashboard' */
								'@/pages/dashboard/analysis'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'bom',
							name: 'BOM管理',
							meta: {
								icon: 'fund'
							},
							component: BlankView,
							children: [{
									path: 'bom-cost',
									name: '费用管理',
									component: () => import( /* webpackChunkName: 'purchase' */
										'@/pages/bom/cost'),
								},
								{
									path: 'cost-config',
									name: '费用项管理',
									component: () => import( /* webpackChunkName: 'purchase' */
										'@/pages/bom/config')
								}
							]
						},
						{
							path: 'purchase',
							name: '采购报价管理',
							meta: {
								icon: 'fund'
							},
							component: BlankView,
							children: [{
									path: 'purchase-add',
									name: '新建报价',
									component: () => import( /* webpackChunkName: 'purchase' */
										'@/pages/purchase/add'),
								},
								{
									path: 'purchase-list',
									name: '报价列表',
									component: () => import( /* webpackChunkName: 'purchase' */
										'@/pages/purchase/list')
								}
							]
						},
						{
							path: 'market',
							name: '销售报价管理',
							meta: {
								icon: 'fund'
							},
							component: BlankView,
							children: [{
									path: 'market-purchase',
									name: '新建销售采购',
									component: () => import( /* webpackChunkName: 'market' */
										'@/pages/market/market-add'),
								},
								{
									path: 'market-offer',
									name: '新建销售报价',
									component: () => import( /* webpackChunkName: 'market' */
										'@/pages/market/offer-add'),
								}
							]
						},
						{
							path: 'pmc',
							name: 'PMC管理',
							meta: {
								icon: 'fund'
							},
							component: BlankView,
							children: [{
									path: 'pmc-material-plan',
									name: '物料需求计划',
									component: () => import( /* webpackChunkName: 'pmc' */
										'@/pages/pmc/material-plan'),
								},
								{
									path: 'pmc-process-plan',
									name: '生产计划',
									component: () => import( /* webpackChunkName: 'pmc' */
										'@/pages/pmc/process-plan'),
								},
								{
									path: 'pmc-all-plan',
									name: '物料需求总计划',
									component: () => import( /* webpackChunkName: 'pmc' */
										'@/pages/pmc/all-plan'),
								}
							]
						},
						{
							path: 'production',
							name: '生产模块',
							meta: {
								icon: 'fund'
							},
							component: BlankView,
							children: [{
									path: 'production-dailyplan',
									name: '生产日计划',
									component: () => import( /* webpackChunkName: 'production' */
										'@/pages/production/dailyPlan'),
								},
								{
									path: 'production-process',
									name: '工序报工',
									component: () => import( /* webpackChunkName: 'production' */
										'@/pages/production/process'),
								},
							]
						},
						{
							path: 'supply',
							name: '供应链管理',
							meta: {
								icon: 'fund'
							},
							component: BlankView,
							children: [{
									path: 'supply-purchase-plan',
									name: '采购计划',
									component: () => import( /* webpackChunkName: 'supply' */
										'@/pages/supply/purchasePlan'),
								},
								{
									path: 'supply-supplier-plan',
									name: '供应商计划',
									component: () => import( /* webpackChunkName: 'supply' */
										'@/pages/supply/supplierPlan'),
								},
								{
									path: 'supply-supplied-list',
									name: '来料质检列表',
									component: () => import( /* webpackChunkName: 'supply' */
										'@/pages/supply/suppliedList'),
								}
							]
						},
						{
							path: 'user',
							name: '个人中心',
							component: BlankView,
							meta: {
								icon: 'user'
							},
							children: [{
								path: 'setting',
								name: '个人设置',
								component: () => import( /* webpackChunkName: 'user' */
									'@/pages/personal'),
							}]
						}
					]
				},
				{
					path: 'report',
					name: 'BI报表',
					meta: {
						icon: 'area-chart'
					},
					component: BlankView,
					children: [{
						path: 'production-bi',
						name: '生产排产情况',
						component: () => import( /* webpackChunkName: 'production' */
							'@/pages/bi/production'),
						meta: {
							icon: 'appstore'
						}
					}]
				},
				{
					path: 'mes',
					name: '生产MES',
					meta: {
						icon: 'control'
					},
					component: BlankView,
					children: [{
							path: 'workplace',
							name: '工作台',
							component: () => import( /* webpackChunkName: 'mes' */
								'@/pages/dashboard/workplace'),
							meta: {
								icon: 'appstore'
							}
						},
						{
							path: 'analysis',
							name: '分析页',
							component: () => import( /* webpackChunkName: 'mes' */
								'@/pages/dashboard/analysis'),
							meta: {
								icon: 'fund'
							}
						}
					]
				},
				{
					path: 'template',
					name: 'SRM门户',
					meta: {
						icon: 'deployment-unit',
					},
					component: BlankView,
					children: [{
							path: 'process',
							name: '流程图',
							component: () => import( /* webpackChunkName: 'process' */
								'@/pages/process/process'),
							meta: {
								icon: 'appstore'
							}
						},
						{
							path: 'form',
							name: '表单',
							meta: {
								icon: 'form',
							},
							component: BlankView,
							children: [{
									path: 'basic',
									name: '基础表单',
									component: () => import( /* webpackChunkName: 'form' */
										'@/pages/form/basic'),
								},
								{
									path: 'step',
									name: '分步表单',
									component: () => import( /* webpackChunkName: 'form' */
										'@/pages/form/step'),
								},
								{
									path: 'advance',
									name: '高级表单',
									component: () => import( /* webpackChunkName: 'form' */
										'@/pages/form/advance'),
								}
							]
						}, {
							path: 'list',
							name: '列表页',
							meta: {
								icon: 'table'
							},
							component: BlankView,
							children: [{
									path: 'query',
									name: '查询表格',
									meta: {
										authority: 'queryForm',
									},
									component: () => import( /* webpackChunkName: 'query' */
										'@/pages/list/QueryList'),
								},
								{
									path: 'primary',
									name: '标准列表',
									component: () => import( /* webpackChunkName: 'primary' */
										'@/pages/list/StandardList'),
								},
								{
									path: 'card',
									name: '卡片列表',
									component: () => import( /* webpackChunkName: 'card' */
										'@/pages/list/CardList'),
								},
								{
									path: 'search',
									name: '搜索列表',
									component: () => import( /* webpackChunkName: 'market' */
										'@/pages/list/search/SearchLayout'),
									children: [{
											path: 'article',
											name: '文章',
											component: () =>
												import( /* webpackChunkName: 'search' */
													'@/pages/list/search/ArticleList'),
										},
										{
											path: 'application',
											name: '应用',
											component: () =>
												import( /* webpackChunkName: 'search' */
													'@/pages/list/search/ApplicationList'),
										},
										{
											path: 'project',
											name: '项目',
											component: () =>
												import( /* webpackChunkName: 'search' */
													'@/pages/list/search/ProjectList'),
										}
									]
								}
							]
						}
					]
				},
				{
					path: 'admin',
					name: '后台管理',
					meta: {
						icon: 'control'
					},
					component: BlankView,
					children: [{
							path: 'institutions',
							name: '机构管理',
							meta: {
								icon: 'cluster'
							},
							component: BlankView,
							children: [{
									path: 'institutions-type',
									name: '机构类型',
									component: () => import( /* webpackChunkName: 'institutions' */
										'@/pages/admin/institutions/type'),
								},
								{
									path: 'institutions-list',
									name: '机构列表',
									component: () => import( /* webpackChunkName: 'institutions' */
										'@/pages/admin/institutions/list'),
								},
								{
									path: 'institutions-add',
									name: '添加机构',
									component: () => import( /* webpackChunkName: 'institutions' */
										'@/pages/admin/institutions/add'),
									meta: {
										invisible: true
									}
								}
							]
						},
						{
							path: 'organization',
							name: '组织管理',
							component: BlankView,
							meta: {
								icon: 'team'
							},
							children: [{
									path: 'organization-list',
									name: '组织列表',
									component: () => import( /* webpackChunkName: 'organization' */
										'@/pages/admin/organization/list'),
								},
								{
									path: 'organization-subclass',
									name: '组织管理',
									component: () => import( /* webpackChunkName: 'organization' */
										'@/pages/admin/organization/subclass'),
								}
							]
						},
						{
							path: 'user',
							name: '用户管理',
							meta: {
								icon: 'user'
							},
							component: BlankView,
							children: [{
								path: 'organization-list',
								name: '用户列表',
								component: () => import( /* webpackChunkName: 'user' */
									'@/pages/admin/user/list'),
							}]
						},
						{
							path: 'permissions',
							name: '权限管理',
							component: BlankView,
							meta: {
								icon: 'safety'
							},
							children: [{
								path: 'permissions-list',
								name: '权限列表',
								component: () => import( /* webpackChunkName: 'permissions' */
									'@/pages/admin/permissions/list'),
							}]
						},
						{
							path: 'menu',
							name: '菜单管理',
							meta: {
								icon: 'bars'
							},
							component: BlankView,
							children: [{
								path: 'menu-list',
								name: '菜单列表',
								component: () => import( /* webpackChunkName: 'menu' */
									'@/pages/admin/menu/list'),
							}]
						},
						{
							path: 'system',
							name: '系统工具',
							component: () => import( /* webpackChunkName: 'system' */
								'@/pages/admin/system'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'application',
							name: '应用管理',
							component: () => import( /* webpackChunkName: 'application' */
								'@/pages/dashboard/analysis'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'log',
							name: '系统日志',
							component: () => import( /* webpackChunkName: 'log' */ '@/pages/admin/log'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'api',
							name: 'API网关',
							component: () => import( /* webpackChunkName: 'api' */ '@/pages/admin/api'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'phone',
							name: '移动端管理',
							component: () => import( /* webpackChunkName: 'phone' */
								'@/pages/dashboard/analysis'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'database',
							name: '数据管理',
							component: () => import( /* webpackChunkName: 'database' */
								'@/pages/admin/database'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'report',
							name: '报表管理',
							component: () => import( /* webpackChunkName: 'report' */
								'@/pages/dashboard/analysis'),
							meta: {
								icon: 'fund'
							}
						},
						{
							path: 'message',
							name: '消息管理',
							meta: {
								icon: 'fund'
							},
							component: BlankView,
							children: [{
									path: 'message-type',
									name: '消息类型设置',
									component: () => import( /* webpackChunkName: 'message' */
										'@/pages/admin/message/type'),
								},
								{
									path: 'message-list',
									name: '消息列表',
									component: () => import( /* webpackChunkName: 'message' */
										'@/pages/admin/message/list'),
								}
							]
						},
					]
				}
			]
		},
	]
}

export default options

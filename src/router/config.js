import TabsView from "@/layouts/tabs/TabsView";
import BlankView from "@/layouts/BlankView";
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
	routes: [{
		path: "/login",
		name: "登录页",
		component: () => import( /* webpackChunkName: 'login' */ "@/pages/login"),
	},
	{
		path: "*",
		name: "404",
		component: () =>
			import( /* webpackChunkName: 'exception' */ "@/pages/exception/404"),
	},
	{
		path: "/403",
		name: "403",
		component: () =>
			import( /* webpackChunkName: 'exception' */ "@/pages/exception/403"),
	},
	{
		path: "/",
		name: "民爆",
		component: TabsView,
		redirect: "/login",
		children: [{
			path: "dashboard",
			name: "工作台",
			component: () =>
				import(
					/* webpackChunkName: 'dashboard' */
					"@/pages/dashboard/workplace"
				),
			meta: {
				icon: "appstore",
			},
		}, {
			path: "home",
			name: "首页",
			meta: {
				icon: "home",
			},
			component: BlankView,
			children: [],
		},
		{
			path: "admin",
			name: "后台管理",
			meta: {
				icon: "control",
			},
			component: BlankView,
			children: [{
				path: "institutions",
				name: "机构管理",
				meta: {
					icon: "cluster",
				},
				component: BlankView,
				children: [{
					path: "type",
					name: "机构类型",
					component: () =>
						import(
							/* webpackChunkName: 'institutions' */
							"@/pages/admin/institutions/type"
						),
				},
				{
					path: "list",
					name: "机构列表",
					component: () =>
						import(
							/* webpackChunkName: 'institutions' */
							"@/pages/admin/institutions/list"
						),
				},
				{
					path: "add",
					name: "添加机构",
					component: () =>
						import(
							/* webpackChunkName: 'institutions' */
							"@/pages/admin/institutions/add"
						),
					meta: {
						invisible: true,
					},
				},
				],
			},
			{
				path: "organization",
				name: "组织管理",
				component: BlankView,
				meta: {
					icon: "team",
				},
				children: [{
					path: "list",
					name: "组织维度",
					component: () =>
						import(
							/* webpackChunkName: 'organization' */
							"@/pages/admin/organization/list"
						),
				},
				{
					path: "subclass",
					name: "组织管理",
					component: () =>
						import(
							/* webpackChunkName: 'organization' */
							"@/pages/admin/organization/subclass"
						),
				},
				],
			},
			{
				path: "user",
				name: "用户管理",
				meta: {
					icon: "user",
				},
				component: BlankView,
				children: [{
					path: "type",
					name: "用户类型",
					component: () =>
						import(
							/* webpackChunkName: 'user' */
							"@/pages/admin/user/type"
						),
				},
				{
					path: "list",
					name: "用户列表",
					component: () =>
						import(
							/* webpackChunkName: 'user' */
							"@/pages/admin/user/list"
						),
				},
				],
			},
			{
				path: "permissions",
				name: "权限管理",
				component: BlankView,
				meta: {
					icon: "safety",
				},
				children: [{
					path: "list",
					name: "权限列表",
					component: () =>
						import(
							/* webpackChunkName: 'permissions' */
							"@/pages/admin/permissions/list"
						),
				},],
			},
			{
				path: "menu",
				name: "菜单管理",
				meta: {
					icon: "menu",
				},
				component: BlankView,
				children: [{
					path: "list",
					name: "菜单列表",
					component: () =>
						import(
							/* webpackChunkName: 'menu' */
							"@/pages/admin/menu"
						),
				},],
			},
			{
				path: "application",
				name: "应用管理",
				meta: {
					icon: "appstore",
				},
				component: BlankView,
				children: [{
					path: "type",
					name: "应用类型",
					component: () =>
						import(
							/* webpackChunkName: 'menu' */
							"@/pages/admin/application/appType"
						),
				}, {
					path: "list",
					name: "应用列表",
					component: () =>
						import(
							/* webpackChunkName: 'menu' */
							"@/pages/admin/application/appList"
						),
				}],
			},
			{
				path: "database",
				name: "数据字典",
				component: BlankView,
				meta: {
					icon: "database",
				},
				children: [{
					path: "param-group",
					name: "快码组管理",
					component: () =>
						import(
							/* webpackChunkName: 'database' */
							"@/pages/admin/database/group"
						),
				},
				{
					path: "param",
					name: "快码管理",
					component: () =>
						import(
							/* webpackChunkName: 'database' */
							"@/pages/admin/database/param"
						),
				}
				],
			},
			{
				path: "log",
				name: "系统日志",
				component: () =>
					import( /* webpackChunkName: 'log' */ "@/pages/admin/log"),
				meta: {
					icon: "fund",
				},
			},
			{
				path: "api",
				name: "API网关",
				component: () =>
					import( /* webpackChunkName: 'api' */ "@/pages/admin/api"),
				meta: {
					icon: "fund",
				},
			}
			],
		},
		],
	},
	],
};
export default options;

import routerMap from '@/router/async/router.map';
import {
	mergeI18nFromRoutes
} from '@/utils/i18n';
import Router from 'vue-router';
import deepMerge from 'deepmerge';
import basicOptions from '@/router/async/config.async';
//应用配置
let appOptions = {
	router: undefined,
	i18n: undefined,
	store: undefined
}
/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
	const {
		router,
		store,
		i18n
	} = options;
	appOptions.router = router;
	appOptions.store = store;
	appOptions.i18n = i18n;
}

const view = {
	tabs: () => import('@/layouts/tabs'),
	blank: () => import('@/layouts/BlankView'),
	page: () => import('@/layouts/PageView')
}
/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param routesConfig 路由配置
 * @param routerMap 本地路由组件注册配置
 */
function parseRoutes(routesConfig, routerMap) {
	let routes = [];
	routesConfig.forEach(item => {
		// 获取注册在 routerMap 中的 router，初始化 routeCfg
		let router = undefined,
			routeCfg = {};
		if (typeof item === 'string') {
			router = routerMap[item];
			routeCfg = {
				path: router.path || item,
				router: item
			}
		} else if (typeof item === 'object') {
			let cp = item.component;
			//过滤掉按钮类型
			if (item.component) {
				if (cp.indexOf("button") != -1) return;
			}
			if (item.component == 'BlankView' || item.component == "") {
				//空白页
				item.component = view.blank;
			} else if (item.component === 'OpenView' || item.component === 'IframeView') {
				item.meta.link = item.path;
				item.path = item.component;
				delete item.component;
			} else {
				const item_component = item.component;
				item.component = () => import(`@/pages/${item_component}`)
				// item.component = resolve => require(['${item.component}'], resolve)
			}
			router = routerMap[item.router] || {
				name: item.name,
				component: item.component
			};
			routeCfg = item;
		}
		if (!router) {
			console.warn(`can't find register for router ${routeCfg.router}, please register it in advance.`);
			router = typeof item === 'string' ? {
				path: item,
				name: item
			} : item
		}
		//按钮权限
		if (routeCfg.buttons) {
			let authority = []
			routeCfg.buttons.forEach(item => {
				authority.push(item.component)
			})
			routeCfg.permission = authority;
		}
		// 从 router 和 routeCfg 解析路由
		const route = {
			path: routeCfg.path || router.path || routeCfg.router,
			name: routeCfg.name || router.name,
			component: router.component,
			redirect: routeCfg.redirect || router.redirect,
			meta: {
				authority: routeCfg.authority || router.authority || routeCfg.meta?.authority || router.meta
					?.authority || '*',
				icon: routeCfg.icon || router.icon || routeCfg.meta?.icon || router.meta?.icon,
				page: routeCfg.page || router.page || routeCfg.meta?.page || router.meta?.page,
				link: routeCfg.link || router.link || routeCfg.meta?.link || router.meta?.link,
				permission: routeCfg.permission || [],
				invisible: routeCfg.invisible || router.invisible
			}
		};
		if (routeCfg.invisible || router.invisible) {
			route.meta.invisible = true
		}
		if (routeCfg.children && routeCfg.children.length > 0) {
			route.children = parseRoutes(routeCfg.children, routerMap)
		}
		routes.push(route)
	});
	return routes
}

/**
 * 加载路由
 * @param routesConfig {RouteConfig[]} 路由配置
 */
function loadRoutes(routesConfig) {
	//兼容 0.6.1 以下版本
	/*************** 兼容 version < v0.6.1 *****************/
	if (arguments.length > 0) {
		const arg0 = arguments[0]
		if (arg0.router || arg0.i18n || arg0.store) {
			routesConfig = arguments[1]
			console.error(
				'the usage of signature loadRoutes({router, store, i18n}, routesConfig) is out of date, please use the new signature: loadRoutes(routesConfig).'
			)
			console.error(
				'方法签名 loadRoutes({router, store, i18n}, routesConfig) 的用法已过时, 请使用新的方法签名 loadRoutes(routesConfig)。')
		}
	}
	/*************** 兼容 version < v0.6.1 *****************/

	// 应用配置
	const {
		router,
		store,
		i18n
	} = appOptions

	// 如果 routesConfig 有值，则更新到本地，否则从本地获取
	console.log(routesConfig);
	if (routesConfig) {
		console.log("有路由信息")
		store.commit('account/setRoutesConfig', routesConfig)
	} else {
		console.log("没有路由信息")
		routesConfig = store.getters['account/routesConfig'];
		// this.$message.error('token失效,请重新登陆!');
		// this.$message.error("添加成功!");
		// window.location.href = "./"
	}
	// 如果开启了异步路由，则加载异步路由配置
	const asyncRoutes = store.state.setting.asyncRoutes
	if (asyncRoutes) {
		if (routesConfig && routesConfig.length > 0) {
			const routes = parseRoutes(routesConfig, routerMap)
			const finalRoutes = mergeRoutes(basicOptions.routes, routes)
			formatRoutes(finalRoutes)
			router.options = {
				...router.options,
				routes: finalRoutes
			}
			router.matcher = new Router({
				...router.options,
				routes: []
			}).matcher
			router.addRoutes(finalRoutes)
		}
	}
	// 提取路由国际化数据
	mergeI18nFromRoutes(i18n, router.options.routes)
	// 初始化Admin后台菜单数据
	const rootRoute = router.options.routes.find(item => item.path === '/')
	const menuRoutes = rootRoute && rootRoute.children
	// console.log(menuRoutes);
	if (menuRoutes) {
		store.commit('setting/setMenuData', menuRoutes)
	}
}

/**
 * 合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
	const routesMap = {}
	target.forEach(item => routesMap[item.path] = item)
	source.forEach(item => routesMap[item.path] = item)
	return Object.values(routesMap)
}

/**
 * 深度合并路由
 * @param target {Route[]}
 * @param source {Route[]}
 * @returns {Route[]}
 */
function deepMergeRoutes(target, source) {
	// 映射路由数组
	const mapRoutes = routes => {
		const routesMap = {}
		routes.forEach(item => {
			routesMap[item.path] = {
				...item,
				children: item.children ? mapRoutes(item.children) : undefined
			}
		})
		return routesMap
	}
	const tarMap = mapRoutes(target)
	const srcMap = mapRoutes(source)

	// 合并路由
	const merge = deepMerge(tarMap, srcMap)

	// 转换为 routes 数组
	const parseRoutesMap = routesMap => {
		return Object.values(routesMap).map(item => {
			if (item.children) {
				item.children = parseRoutesMap(item.children)
			} else {
				delete item.children
			}
			return item
		})
	}
	return parseRoutesMap(merge)
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes(routes) {
	routes.forEach(route => {
		const {
			path
		} = route
		if (!path.startsWith('/') && path !== '*') {
			route.path = '/' + path
		}
	})
	formatAuthority(routes)
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority(routes, pAuthorities = []) {
	routes.forEach(route => {
		const meta = route.meta
		const defaultAuthority = pAuthorities[pAuthorities.length - 1] || {
			permission: '*'
		}
		if (meta) {
			let authority = {}
			if (!meta.authority) {
				authority = defaultAuthority
			} else if (typeof meta.authority === 'string') {
				authority.permission = meta.authority
			} else if (typeof meta.authority === 'object') {
				authority = meta.authority
				const {
					role
				} = authority
				if (typeof role === 'string') {
					authority.role = [role]
				}
				if (!authority.permission && !authority.role) {
					authority = defaultAuthority
				}
			}
			meta.authority = authority
		} else {
			const authority = defaultAuthority
			route.meta = {
				authority
			}
		}
		route.meta.pAuthorities = pAuthorities
		if (route.children) {
			formatAuthority(route.children, [...pAuthorities, route.meta.authority])
		}
	})
}

/**
 * 从路由 path 解析 i18n key
 * @param path
 * @returns {*}
 */
function getI18nKey(path) {
	const keys = path.split('/').filter(item => !item.startsWith(':') && item != '')
	keys.push('name')
	return keys.join('.')
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
	const {
		beforeEach,
		afterEach
	} = guards
	const {
		router
	} = options
	beforeEach.forEach(guard => {
		if (guard && typeof guard === 'function') {
			router.beforeEach((to, from, next) => guard(to, from, next, options))
		}
	})
	afterEach.forEach(guard => {
		if (guard && typeof guard === 'function') {
			router.afterEach((to, from) => guard(to, from, options))
		}
	})
}

export {
	parseRoutes,
	loadRoutes,
	formatAuthority,
	getI18nKey,
	loadGuards,
	deepMergeRoutes,
	formatRoutes,
	setAppOptions
}

import TabsView from "@/layouts/tabs/TabsView";
import BlankView from "@/layouts/BlankView";
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: "/login",
      name: "登录页",
      component: () => import(/* webpackChunkName: 'login' */ "@/pages/login"),
    },
    {
      path: "*",
      name: "404",
      component: () =>
        import(/* webpackChunkName: 'exception' */ "@/pages/exception/404"),
    },
    {
      path: "/403",
      name: "403",
      component: () =>
        import(/* webpackChunkName: 'exception' */ "@/pages/exception/403"),
    },
    {
      path: "/",
      name: "民爆",
      component: TabsView,
      redirect: "/login",
      children: [
        {
          path: "home",
          name: "首页",
          meta: {
            icon: "home",
          },
          component: BlankView,
          children: [
            {
              path: "workplace",
              name: "工作台",
              component: () =>
                import(
                  /* webpackChunkName: 'dashboard' */
                  "@/pages/dashboard/workplace"
                ),
              meta: {
                icon: "appstore",
              },
            },
            {
              path: "bom",
              name: "BOM管理",
              meta: {
                icon: "file-protect",
              },
              component: BlankView,
              children: [
                {
                  path: "bom-cost",
                  name: "费用管理",
                  component: () =>
                    import(
                      /* webpackChunkName: 'bom' */
                      "@/pages/bom/cost"
                    ),
                },
                {
                  path: "cost-config",
                  name: "费用项管理",
                  component: () =>
                    import(
                      /* webpackChunkName: 'bom' */
                      "@/pages/bom/costConfig"
                    ),
                },
                {
                  path: "versions-config",
                  name: "配置版本",
                  component: () =>
                    import(
                      /* webpackChunkName: 'bom' */
                      "@/pages/bom/versionsConfig"
                    ),
                },
                {
                  path: "versions-manage",
                  name: "版本管理",
                  component: () =>
                    import(
                      /* webpackChunkName: 'bom' */
                      "@/pages/bom/versionsManage"
                    ),
                },
              ],
            },
          ],
        },
        {
          path: "admin",
          name: "后台管理",
          meta: {
            icon: "control",
          },
          component: BlankView,
          children: [
            {
              path: "institutions",
              name: "机构管理",
              meta: {
                icon: "cluster",
              },
              component: BlankView,
              children: [
                {
                  path: "institutions-type",
                  name: "机构类型",
                  component: () =>
                    import(
                      /* webpackChunkName: 'institutions' */
                      "@/pages/admin/institutions/type"
                    ),
                },
                {
                  path: "institutions-list",
                  name: "机构列表",
                  component: () =>
                    import(
                      /* webpackChunkName: 'institutions' */
                      "@/pages/admin/institutions/list"
                    ),
                },
                {
                  path: "institutions-add",
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
              children: [
                {
                  path: "organization-list",
                  name: "组织维度",
                  component: () =>
                    import(
                      /* webpackChunkName: 'organization' */
                      "@/pages/admin/organization/list"
                    ),
                },
                {
                  path: "organization-subclass",
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
              children: [
                {
                  path: "user-list",
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
              children: [
                {
                  path: "permissions-list",
                  name: "权限列表",
                  component: () =>
                    import(
                      /* webpackChunkName: 'permissions' */
                      "@/pages/admin/permissions/list"
                    ),
                },
              ],
            },
            {
              path: "menu",
              name: "菜单管理",
              meta: {
                icon: "bars",
              },
              component: BlankView,
              children: [
                {
                  path: "menu-list",
                  name: "菜单列表",
                  component: () =>
                    import(
                      /* webpackChunkName: 'menu' */
                      "@/pages/admin/menu/list"
                    ),
                },
              ],
            },
            {
              path: "system",
              name: "系统工具",
              component: () =>
                import(
                  /* webpackChunkName: 'system' */
                  "@/pages/admin/system"
                ),
              meta: {
                icon: "fund",
              },
            },
            {
              path: "application",
              name: "应用管理",
              component: () =>
                import(
                  /* webpackChunkName: 'application' */
                  "@/pages/dashboard/analysis"
                ),
              meta: {
                icon: "fund",
              },
            },
            {
              path: "log",
              name: "系统日志",
              component: () =>
                import(/* webpackChunkName: 'log' */ "@/pages/admin/log"),
              meta: {
                icon: "fund",
              },
            },
            {
              path: "api",
              name: "API网关",
              component: () =>
                import(/* webpackChunkName: 'api' */ "@/pages/admin/api"),
              meta: {
                icon: "fund",
              },
            },
            {
              path: "phone",
              name: "移动端管理",
              component: () =>
                import(
                  /* webpackChunkName: 'phone' */
                  "@/pages/dashboard/analysis"
                ),
              meta: {
                icon: "fund",
              },
            },
            {
              path: "database",
              name: "数据管理",
              component: () =>
                import(
                  /* webpackChunkName: 'database' */
                  "@/pages/admin/database"
                ),
              meta: {
                icon: "fund",
              },
            },
            {
              path: "report",
              name: "报表管理",
              component: () =>
                import(
                  /* webpackChunkName: 'report' */
                  "@/pages/dashboard/analysis"
                ),
              meta: {
                icon: "fund",
              },
            },
            {
              path: "message",
              name: "消息管理",
              meta: {
                icon: "fund",
              },
              component: BlankView,
              children: [
                {
                  path: "message-type",
                  name: "消息类型设置",
                  component: () =>
                    import(
                      /* webpackChunkName: 'message' */
                      "@/pages/admin/message/type"
                    ),
                },
                {
                  path: "message-list",
                  name: "消息列表",
                  component: () =>
                    import(
                      /* webpackChunkName: 'message' */
                      "@/pages/admin/message/list"
                    ),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
export default options;

# 优雅实现服务端控制页面权限动态路由
权限访问管理在日常开发中扮演着重要角色。无论是控制不同角色访问特定页面、模块，还是管理按钮级别的权限，都需要一个灵活的方案来实现。在`uni-app`中，我们可以结合[uni-simple-router](https://v3.hhyang.cn/)来达成这个目标。

现在我们假设系统中我们有三个不同的角色，分别是：管理员（admin）、经理（manager）和员工（employee）。然后根据不同角色拥有不同的权限来举例详细说明，假设我们有以下三个页面：`Dashboard`、`UserManagement`和`Settings`。


## 角色权限定义 

* 管理员（admin）：拥有访问所有页面的权限。
* 经理（manager）：可以访问`Dashboard`和`UserManagement`页面。
* 员工（employee）：只能访问`Dashboard`页面。


## 定义路由表 

当准备让后台控制所有页面权限时，首先需要与后台人员约定好权限数据结构，以便有效管理和控制用户权限。为了简化示例并降低复杂度，我们可以采用一个最简单的示例来演示整个流程。

首先我们可观察到三个用户之间都共享一个名为`Dashboard`的页面，但每个用户还有各自专属的页面。

为了实现页面权限的动态管理，我们可以将`Dashboard`作为应用的起始静态页面，这意味着所有用户都可以访问它。其他用户专属页面可以在用户完成登录后，通过异步加载的方式动态添加到路由管理器中，从而实现按需加载的效果。

我们先构建最基本的路由表及插件配置如下：
### routes.js

```js
import {
    __dynamicImportComponent__
} from '@/uni-simple-router'

const Dashboard = __dynamicImportComponent__(`@/pages/dashboard.vue`,{ pageType:`top` })
const Settings = __dynamicImportComponent__(`@/pages/settings.vue`,{ pageType:`top` })
const UserManagement = __dynamicImportComponent__(`@/pages/userManagement.vue`,{ pageType:`top` })
export const NotFound404 = __dynamicImportComponent__(`@/pages/404.vue`,{ pageType:`top` })
export const Login = __dynamicImportComponent__(`@/pages/login.vue`,{ pageType:`top` })

export const routesMap = {
	'dashboard':{
		path:`/dashboard`,
		name:`dashboard`,
		component:Dashboard,
	},
	'settings':{
		path:`/settings`,
		name:`settings`,
		component:Settings,
	},
	'userManagement':{
		path:`/userManagement`,
		name:`userManagement`,
		component:UserManagement,
	},
}

```

### router.js
```js
import {
    createRouter
} from '@/uni-simple-router'
import {
	NotFound404,
	Login
} from '@/router/routes.js'

/**
 * 实例化路由插件
 */
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routeNotFound:(to)=> {
		return {name:`404`}
	},
    routes:[
		{
			path:`/login`,
			name:`login`,
			component:Login
		},
		{
			path:`/404`,
			name:`404`,
			component:NotFound404
		}
	]
})

export default router
```


在上述配置中，我们实例化了路由插件，并创建了两个基本的路由表：`dashboard`和`404`。这里，`dashboard`是用户登录后访问的起始页面，而`404`页面用于展示未授权或无匹配权限时的访问状态，以提供更直观的提示信息。

通过这种设置，当用户成功登录后，系统将自动跳转到`dashboard`页面，因为它是应用的起始静态页面，对所有用户开放。而其他用户专属页面将在用户登录后，通过异步加载的方式动态添加到路由管理器中。

当用户尝试访问没有权限的页面时，系统将显示`404`页面，提示用户当前操作未被授权或者访问的页面不存在。这样的用户体验能够帮助用户清楚地知道他们的权限范围，并且减少混淆和不必要的请求。

## 与后端人员约定数据结构

在实际开发中，权限数据结构的复杂程度通常会根据项目的具体情况和需求来进行约定。如果项目涉及多个角色和嵌套路由页面，那么约定的权限数据结构可能会更加复杂。然而，为了简化示例，我们仍然采用最简单的方式来呈现。根据上一步的路由定义，我们可以让后端人员在登录完成后返回如下数据结构：


* 管理员（admin）：拥有访问所有页面的权限。
```js
  auth:[`dashboard`,`settings`,`userManagement`]
```
* 经理（manager）：可以访问`Dashboard`和`UserManagement`页面。
```js
  auth:[`dashboard`,`userManagement`]
```
* 员工（employee）：只能访问`Dashboard`页面。
```js
  auth:[`dashboard`]
```

上面的权限列表是根据路由表的`name`字段约定而成，根据不同角色拥有的权限来生成对应的`auth`字段。


## 根据权限名生成对应的路由 

如上，我们已经与后台约定好了数据结构，并且也定义了基础的路由结构。现在，我们只需要将对应的路由表根据权限动态加载进路由插件即可。

### router.js
```js
import {
    createRouter
} from '@/uni-simple-router'
import {
	currentUserInfo
} from '@/state.js'
import {
	NotFound404,
	Login,
	addAuthList,
	routesMap
} from '@/router/routes.js'

/**
 * 实例化路由插件
 */
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routeNotFound:(to)=> {
		const authList = currentUserInfo.value.auth
		if(authList){
			const {locationRawToMatched} = router.initEnvOptions.matcher
			addAuthList(router,authList);
			const matcher = locationRawToMatched(to)
			if( Object.prototype.toString.call(matcher) === `[object Array]` ){
				return {...to}
			}
		}
		return {name:`404`}
	},
    routes:[
		{
			path:`/login`,
			name:`login`,
			component:Login
		},
		{
			path:`/404`,
			name:`404`,
			component:NotFound404
		}
	]
})
export default router
```

### routes.js

`routes.js` 中的配置非常简单，我们只需要再额外添加一个函数即可，如下：

```js
export function addAuthList (router,authList){
	const {nameToRecordMatcher} = router.initEnvOptions.matcher
	for(let i = 0 ;i<authList.length;i++){
		const name = authList[i];
		const route = routesMap[name];
		if(!nameToRecordMatcher(name)){
			router.addRoute(route);
		}
	}
}
```
`uni-simple-router `相比`vue-router`确实在动态添加路由方面更加简单，我们已经尽可能地抹平了一些潜在的陷阱，以确保在开发过程中不会因为这些细小问题而扰乱心智。在示例中，我们展示了常规的动态路由页面，包括添加页面、删除页面以及404页面捕捉等功能。如果需要了解更多细节，[可以参考该demo，里面包含了完整的演示代码。](https://github.com/SilurianYang/router-authority-routes-demo)

## 最终示例效果展示 

![](https://ask.dcloud.net.cn/uploads/article/20230803/6fa1e6f36d17595b2c9a3151b054c485.gif)

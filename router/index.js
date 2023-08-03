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

console.log(
	router
)

export default router
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
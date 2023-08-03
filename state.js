import {
	ref
} from 'vue'

let cacheUserInfo = uni.getStorageSync(`cacheCurrentUserInfo`);
cacheUserInfo = cacheUserInfo ? JSON.parse(cacheUserInfo) : {};

export const currentUserInfo = ref(cacheUserInfo)

export function changeUserInfo(info){
	currentUserInfo.value = info;
	uni.setStorageSync(`cacheCurrentUserInfo`,JSON.stringify(info))
}

export function clearLoginOut(router){
	// 将已经添加的路由表删除并退出登录
	const authList = currentUserInfo.value.auth
	if(authList){
		authList.map(name=>{
			router.removeRoute(name);
		})
	}
	
	uni.removeStorageSync(`cacheCurrentUserInfo`);
	currentUserInfo.value = {};
	router.replaceAll({name:`login`});
}
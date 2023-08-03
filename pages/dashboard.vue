<template>
	<view>
		<h1>dashboard</h1>
		
		<button @click="goToPage({name:`settings`})">跳转到-settings</button>
		<button @click="goToPage({name:`userManagement`})">跳转到-userManagement</button>
		<button @click="outPage" type="warn">退出登录</button>
	</view>
</template>

<script>
	import {
		clearLoginOut
	} from '@/state.js'
	export default {
		data() {
			return {
	
			}
		},
		methods: {
			goToPage(option){
				this.$Router.push(option)
			},
			outPage(){
				clearLoginOut(this.$Router);
			}
		}
	}
</script>

<style>

</style>

<template>
	<view>
		<radio-group class="uni-list" @change="radioChange">
			<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in radioItems" :key="index">
				<view>
					<radio :id="item.value" :value="item.value" :checked="item.checked"></radio>
				</view>
				<view>
					<label class="label-2-text" :for="item.name">
						<text>{{item.name}}</text>
					</label>
				</view>
			</label>
		</radio-group>

		<button @click="mockLogin">模拟登录</button>
	</view>
</template>

<script>
	import {
		changeUserInfo
	} from '@/state.js'
	import {
		addAuthList
	} from '@/router/routes.js'
	export default {
		data() {
			return {
				checkedValue:`admin`,
				radioItems:[{
					name:`管理员`,
					value:`admin`,
					checked:true,
					auth:[`dashboard`,`settings`,`userManagement`]
				},{
					name:`经理`,
					value:`manager`,
					checked:false,
					auth:[`dashboard`,`userManagement`]
				},{
					name:`员工`,
					value:`employee`,
					checked:false,
					auth:[`dashboard`]
				}]
			}
		},
		methods: {
			radioChange(e){
				this.checkedValue = e.detail.value
			},
			mockLogin(){
				uni.showToast({
					title:`登录成功`,
					icon:`success`,
					duration:1000
				})
				const router = this.$Router
				const value = this.checkedValue;
				const [{
					auth
				}]= this.radioItems.filter((it)=>{
					return it.value == value
				})
				const authList =JSON.parse(JSON.stringify(auth)) 
				changeUserInfo({
					value,
					auth:authList
				});
				setTimeout(()=>{
					addAuthList(router,authList);
					router.replaceAll({
						name:`dashboard`
					})
				},1000)
			}
		}
	}
</script>

<style>

</style>

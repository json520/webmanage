<template>
  <div class="header">
    <div class="header_left">
    	<img src="../assets/logo.png"/>
    	<span>网吧云管理平台</span>
    </div>
    <div class="header_right">
    	<span>{{userName}}，欢迎您！</span>
    	<span class="quitLoginClass" @click="loginOut">退出登录</span>
    </div>
  </div>
</template>

<script>
	import { loginOut } from 'api'
export default {
  name: 'header',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      userName:''
    }
  },
	methods: {
		loginOut(){ //退出登录
				
				sessionStorage.removeItem('userinfo');
				this.$router.push({path:'/login'})
				
		},
		_initUserName(){
			
				let userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
				let userMap = new Map(userinfo)
				
				this.userName = userMap.get('realName')
				console.log(userinfo)
		}
	},
	mounted(){
			this._initUserName();
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@mixin display_flex($direction:row,$wrap:nowrap,$justify:center,$align:center){
	display:-webkit-flex;
	display:-ms-flexbox;
	display:flex;
	-webkit-flex-flow:$direction $wrap;
	flex-flow:$direction $wrap;
	justify-content:$justify;
	-webkit-justify-content:$justify;
	align-content:$align;
	-webkit-align-content:$align;
	
}

.header{
		width:100%;
		@include display_flex(row,wrap,space-between,center);
		height:128px;
		background:#157ae1;
		.header_left{
			@include display_flex(cloumn,nowrap,center,center);
			font-size:48px;
			color:#48bcff;
				img{
					width:68px;
					height:75px;
					margin:auto 20px auto 60px;
				}
				span{
					line-height:128px;
				}
		}
		.header_right{
			font-size:16px;
			color:#48bcff;
			line-height:128px;
			.quitLoginClass{
				color:white;
				margin:0 60px 0 20px;
				cursor:pointer;
			}
		}
}

</style>

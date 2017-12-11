<template>
  <div class="login" :style="{'height':loginHeight}">
 		  <!--登录界面-->
   	<!--<router-link tag="p" :to="{path:'/index/index'}">登录成功</router-link>-->
<!--   	<img class="bg" src="../assets/login.jpg"/>-->
		<el-row style="height:100%;">
			<el-col :span="24" align="center">
				<img class="login_img" src="../assets/logo.png"/>
				<span class="login_title">网吧云管理平台</span>
			</el-col>
			
			<el-col :span="24" align="center">
				<el-form class="form_wrapper" :model="userData" ref="userData" :rules="userDataRules">
					<el-form-item class="userName_input" prop="userName">
							<el-input type="text" placeholder="请输入账号" v-model="userData.userName" auto-complete="off" >
								<!--
								1. auto-complete 自动补全
								2.在el-form添加:rules属性		>	在data数据里面写rules属性值的验证规则		>	在对应要验证的el-form-item添加prop标识符
								-->
								<template slot="prepend"><i class="iconfont icon-yonghuming"></i></template>
								<!--slot通过里面添加阿里icon可以自由设置！prepend添加到前面-->
							</el-input>
					</el-form-item>
					
					<el-form-item class="userPassword_input" prop="userPassword">
							<el-input type="password" placeholder="请输入密码" v-model="userData.userPassword">
								<template slot="prepend"><i class="iconfont icon-mima"></i></template>
							</el-input>
					</el-form-item>
					
					<el-form-item align="center">
							<el-button type="primary"  class="clickLogin_btn" @click.native.prevent="login_btn" :loading="logining" >登录</el-button>
					</el-form-item>
		   			
		   	</el-form>
	   </el-col>
	   <el-col style="position:absolute;bottom:0;left:0;color:white;height:80px;background:rgba(0,0,0,0.2);line-height:80px;text-align:center;">
	   		<span style="margin-right:30px;">杭州市西湖区网警大队主办</span>
	   		<span>备案号：浙CIP备435657号-4</span>
	  </el-col>
	   
   </el-row>
   
  </div>
  
</template>

<script>
	
import { getLogin } from 'api'	
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      userData:{ //用户名密码
      	userName:'',
      	userPassword:''
      },
      loginHeight:'',
      logining:false,
      userDataRules:{
      	userName : [
      		{ required : true , message :'请输入账号', trigger : 'blur' }
      	],
      	userPassword : [
      		{ required : true , message : '请输入密码', trigger : 'blur' }
      	]
      }
    }
  },
  methods:{
    bodyHeight(){
    		let h = window.screen.availHeight;
    		this.loginHeight = h+'px';
		},
		login_btn(event){
				
				let _this = this;
				
				this.$refs.userData.validate((valid) =>{
					if(valid){
						
						this.logining = true;
						let para = {
								userName : _this.userData.userName,
								password : _this.userData.userPassword
						};
							let config = {
	              headers: {
	                'Content-Type': 'application/x-www-form-urlencoded'
	              }
	            }
//						var qs = require('qs');
//						console.log(qs.stringify(para))
//						axios.post('http://192.168.1.9:8080/getLogin.do',qs.stringify({ 
//							userName : _this.userData.userName,
//							password : _this.userData.userPassword
//						},{
//					  headers: {
//					    'Content-Type': 'application/x-www-form-urlencoded',
//					  },
//					}))
						getLogin(para).then((res) =>{
//								console.log(res)
								this.logining = false;
								if(res.data.code == '1' && res.data.token){
//									console.log(res)	
									let info = new Map();
									info.set('token',res.data.token);
									info.set('roleId',res.data.roleId);
									info.set('userId',res.data.userId);
									info.set('realName',res.data.realName);
									if(res.data.policeId){
										info.set('policeId',res.data.policeId);
									}
//									console.log(info)
									
									sessionStorage.setItem('userinfo',JSON.stringify(info))
									this.$router.push({ path: '/index' });
								}else if(res.data.code == '0'){
										this.$message({
											message:'账户或密码错误',
											type:'error'
										})
								}
						})
						.catch((err) =>{
							console.log(err)
						})
//						
					}
				})
		}
	},
    mounted(){
    	
    		this.bodyHeight();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/font/iconfont.css';	
	
	.bg{
		width:100%;
		height:100%;
		background-size:cover;
	}
.login{
	width:100%;
	height:100%;
	background:url('../assets/pic_01.png') center center no-repeat;
	background-size:100% 100%;
	
}
.login_img{
	width:124px;
	/*height:140px;*/
	margin-top:3%;
}
.login_title{
	display:block;
	font-size:34px;
	color:#ffffff;
	margin-bottom:2%;
}
.userNmae_img{
	width:40px;
	height:40px;
}
.form_wrapper{
	width:410px;
	height:340px;
	background:rgba(250,250,250,0.5);
	display:-ms-flexbox;
	-ms-flex-align:center;
	-ms-flex-pack:center;
	-ms-flex-direction: column;
	display:-moz-box;
	-moz-box-orient:vertical;
	-moz-box-align:center;
	-moz-box-pack:center;
	display:-webkit-box;
	-webkit-box-align:center;
	-webkit-box-pack:center;
	-webkit-box-orient: vertical;
	border-radius:5px;
}
.userName_input,.userPassword_input{
	width:340px;
	height:50px;
	border-radius: 50px;
}
.clickLogin_btn{
	font-size:24px;
	color:#ffffff;
	width:340px;
	height:50px;
	border-radius: 50px;
	background:#0096ff;
}
.iconfont{
	font-size:26px;
}
</style>

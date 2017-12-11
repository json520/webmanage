<template>
	
<!--<div class="hello">-->

 <el-row class="container">
 	
 	<el-col class="header">
 		<!--头部-->
   		<v-header :name="userName"></v-header>
 	</el-col>
 	
   	
  <el-col :span="8" class="main">
  	<aside class="main_aside">
	    <el-menu default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" @select="handleselect"
	    	unique-opened router >
	      <!--<el-menu-item index="1"><i class="el-icon-menu"></i>首页</el-menu-item>-->
	      <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden"> 
	      	<!--$router.options.routes是循环路由里面的所有路由,hidden是路由里面设置为true的就隐藏      -->
	      	
		      <el-submenu :index="index+''" v-if="!item.leaf" >
		      	<!--这里每个子集导航必须绑定index作为区分,item.leaf用于判断是不是只有一个自导航-->
		        <template slot="title"><i class="iconfont" :class="classObject(item.path)"></i>{{item.name}}</template>
		        <!--通过slot插入标签，-->
		        <!--<el-menu-item-group> 去掉这层！因为顶部会有几像素的高度-->
		        	
		          <el-menu-item v-for="items in item.children" :index="items.path" :key="items.path" v-if="!items.hidden">{{items.name}}</el-menu-item>
		          <!--或者路由里面的children路由！这里绑定的index不能用index！会和下面的其他下标重合！要有唯一的路径区分-->
		        <!--</el-menu-item-group>-->
		      </el-submenu>
		      
		      <el-menu-item v-if="item.leaf && item.children.length > 0" :index="item.children[0].path"><i class="iconfont icon-shouye"></i>{{item.children[0].name}}</el-menu-item>
		      <!--<el-menu-item></el-menu-item>-->
		      	
		      <!--不用v-else,用具体的条件判断里面的值不能为空-->
	      </template>
	    </el-menu>
	   </aside>
	   
	   
	   <!--内容部分-->
	   <section class="main_container">
	   		<div class="main_container_center">
	   			<!--<header>{{$route.name}}</header>-->
	   			<el-col :span="24" class="main_container_header">{{$route.name}}</el-col>
	   			<!--$route.name 当前的路由名字-->
	   		
	   			<router-view></router-view>
	   		</div>
	   		
	   </section>
	   
	   
  </el-col>
</el-row>

   
  <!--</div>-->
</template>

<script>
	import VHeader from '@/components/header'
	
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      userName:''
    }
  },
 	components:{
 		VHeader
 	},
 	methods:{
 		handleOpen(){
 			
 		},
 		handleClose(){
 			
 		},
 		handleselect(a,b){
 			
 		},
 		classObject(path){ //通过路由路径改变图标
 			switch (path){
 				case '/': return 'icon-shouye'
 					break;
 				case '/inform': return 'icon-xinxi'
 					break;
 				case '/detective': return 'icon-wangluo'
 					break;
 				case '/video': return 'icon-yuan'
 					break;
 				case '/inspect': return 'icon-inspect_01'
 					break;	
 				case '/firefighting': return 'icon-xiaofang'
 					break;
 				case '/clue': return 'icon-xiansuo'
 					break;
 				case '/cybercafe': return 'icon-wangba'
 					break;
 				case '/unit': return 'icon-danwei'
 					break;	
 				case '/user': return 'icon-yonghu'
 					break;	
 				default:  return 'icon-xinxi'
 					break;
 			}
 		}
 	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
@import '../assets/font2/iconfont.css';
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
.iconfont{
	margin-right:5px;
	font-size:18px;
	
}
.container{
		position: absolute;
		left:0;
		top:0;
		bottom:0;
		
		width:100%;
		.header{
			
		}	
		.main{
			width:100%;
			position: absolute;
			left:0;
			top:128px;
			overflow:hidden;
			@include display_flex(row,nowrap,start,start);
			.main_aside{
				width:180px;
				height:100%;
				.el-menu-item{
					min-width:160px;
				}
			}
			.main_container{
				width:100%;
				padding:20px;
				/*overflow-y: scroll;*/
				background:#eff4f8;
				.main_container_center{
					width:100%;
					height:100%;
					background:white;
					.main_container_header{
						height:50px;
						width:100%;
						background:#dee5ea;
						color:#333;
						font-size:16px;
						line-height:50px;
						padding-left:20px;
						border-top-left-radius:4px;
						border-top-right-radius:4px;
					}
				}
			}
		}
}

/*.section_body{
	padding:0 20px;
	height:100%;
	.header{
		border:solid 1px #DEE5EA;
		font-size:14px;
		color:#333;
		margin:20px 0;
		height:44px;
		@include display_flex(row,nowrap,flex-end,center);
		.header_form{
			@include display_flex(row,nowrap,center,center);
			.label_color{
				color:#dee5ea;
				.label_input{
					width:196px;
					height:24px;
				}
			}
		}
		
	}
}*/


.pageContainer{
	 @include display_flex(row,nowrap,flex-end,center)
}


</style>

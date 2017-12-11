<template>
  <section class="echarts_container">
  		<el-row>
  				<!--<el-col :span="24"><div class="bg-purple">总汇</div></el-col>-->
					<el-col :span="12">
							<div v-if="this.informData" id="inform" style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;">通知协查</div>
							<div v-else style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;text-align:center;vertical-align:middle;">通知协查暂无数据</div>
					</el-col>
					<el-col :span="12">
							<div v-if="this.detectiveData" id="detective" style="width:100%;height:270px;border:solid 1px #dee5ea;border-top:none;border-right:none;">网络神探</div>
							<div v-else style="width:100%;height:270px;border:solid 1px #dee5ea;border-top:none;border-right:none;text-align:center;vertical-align:middle;">网络神探暂无数据</div>
					</el-col>
					<el-col :span="12">
							<div v-if="this.videoData" id="video" style="width:100%;height:270px;border-right:solid 1px #dee5ea;border-bottom:solid 1px #dee5ea;">视频巡查</div>
							<div v-else style="width:100%;height:270px;border-right:solid 1px #dee5ea;border-bottom:solid 1px #dee5ea;text-align:center;vertical-align:middle;">视频巡查暂无数据</div>
					</el-col>
					<el-col :span="12">
							<div v-if="this.vidoeCameraData" id="videoCamera" style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;">监控巡查</div>
							<div v-else style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;text-align:center;vertical-align:middle;">监控巡查暂无数据</div>
					</el-col>
					<el-col :span="12">
							<div v-if="this.fireFightingData" id="fireFighting" style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;border-right:solid 1px #dee5ea;">消防自查</div>
							<div v-else style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;border-right:solid 1px #dee5ea;text-align:center;vertical-align:middle;">消防自查暂无数据</div>
					</el-col>
					<el-col :span="12" >
							<div v-if="this.clueData" id="clue" style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;">线索上报</div>
							<div v-else style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;text-align:center;vertical-align:middle;">线索上报暂无数据</div>
					</el-col>
					<el-col :span="12">
							<div v-if="this.faceContrastData" id="faceContrast" style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;border-right:solid 1px #dee5ea;">人证对比</div>
							<div v-else style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;border-right:solid 1px #dee5ea;text-align:center;vertical-align:middle;">人证对比暂无数据</div>
					</el-col>
					<el-col :span="12">
							<div v-if="this.inspectData" id="inspect" style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;border-right:solid 1px #dee5ea;">现场检查</div>
							<div v-else style="width:100%;height:270px;border-bottom:solid 1px #dee5ea;border-right:solid 1px #dee5ea;text-align:center;vertical-align:middle;">现场检查暂无数据</div>
					</el-col>
  		</el-row>
  </section>
</template>

<script>
	
	import echarts from 'echarts'
	import { getChartAllLists } from '../../api/api'
	
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      inform: null,
      detective: null,
      video: null,
      videoCamera: null ,
      fireFighting: null,
      clue: null,
      faceContrast: null,
      inspect:null,
      allDate: {}, 
      informData:[],
      detectiveData : [],
      videoData : [],
      vidoeCameraData : [],
      fireFightingData : [],
      clueData : [],
      faceContrastData : [],
      inspectData:[],
      userData:null
    }
  },
  methods:{
  	getEcharthData(){
  		
  		let portParameter = this.$store.getters.getPortParameter;
//		let userData = this.$store.getters.getUserData
  		this.inform =  echarts.init(document.getElementById("inform"));
  		this.inform.showLoading();
  		
  		let para = {
  				system : portParameter.system,
  				token : this.userData.get('token'),
  				userId : this.userData.get('userId'),
  				version : portParameter.version
  		};
  		
  		getChartAllLists(para).then((res) =>{
  			
  			
  			
  				console.log(res);
  				if(res.data.code == '1'){
  					this.allDate = res.data.data;
  					
  					let d = res.data.data;
  					//通知协查
  					if(this.allDate.InformList){
  						this.informData = [this.allDate.InformList.check,this.allDate.InformList.noCheck];
  					}else{
  						this.informData = null;
  					}
  					//网络神探
  					if(this.allDate.detectiveList){
  						this.detectiveData = [this.allDate.detectiveList.onLine,this.allDate.detectiveList.offLine,this.allDate.detectiveList.abnormal];
  					}else{
  						this.detectiveData = null;
  					}
  					//网吧巡查
  					if(d.videoList){
  						this.videoData = [d.videoList.endPatrolCybercafe,d.videoList.nonePatrolCybercafe,d.videoList.partPatrolCybercafe,d.videoList.violationCybercofe];
  					}else{
  						this.videoData = null;
  					}
  					//监控巡查
  					if(d.videoList){
  						this.vidoeCameraData = [d.videoList.endPatrolCamera, d.videoList.nonePatrolCamera];
  					}else{
  						this.vidoeCameraData = null;
  					}
  					
  					
  					//消防自查
  					if(d.fireFightList){
  						this.fireFightingData = [d.fireFightList.endPatrolCybercafe,d.fireFightList.nonePatrolCybercafe];
  					}else{
  						this.fireFightingData = null;
  					}
  					
  					//线索上报
  					if(d.clueList){
  						this.clueData = [d.clueList.endRead,d.clueList.noneRead];
  					}else{
  						this.clueData = null;
  					}
  					
  					//人证对比
  					if(d.faceContrastList){
  						
  						this.faceContrastData = [d.faceContrastList.normal,d.faceContrastList.abnormal];
  					}else{
  						this.faceContrastData = null;
  					}
  					
  					//现场检查
  					if(d.inspectList){
  						this.inspectData = [d.inspectList.qualified,d.inspectList.disqualification];
  					}else{
  						this.inspectData = null;
  					}
  					
  					
  					this.drawAll();
  				}
  				
  				
  		})
  		.catch((err) =>{
  				console.log(err)
  		})
  		
  	},
  	
  	drawInform(){  //通知协查
  		let totalNum = this.informData[0]+this.informData[1]
  		
  		let i = 0
  		
  		let _this = this;
			this.inform.hideLoading();
  		this.inform.setOption({
                  title: { //标题 
                  	show : true ,
                  	text : '通知协查',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'50%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right:20,
                  	top:10,
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.informData[i++]
                  	},
                  	data : [
	                  	{
	                  		name: '查看',
	                  		icon: 'circle'
	                  	},
	                  	{
                  			name: '未查看',
                  			icon: 'circle'
                  		}
	                  	]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: false ,
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			{name: '查看', value: _this.informData[0]},
                  			{name: '未查看', value: _this.informData[1]}
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff',] //默认的颜色
                  
                });
  		
  	},
  	drawDetective(){  //网络神探
  			this.detective = echarts.init(document.getElementById("detective"));
//			this.detective.resize({  //设置实例的宽高
//				width	: 270,
//				height: 270
//			});
				let totalNum = this.detectiveData[0] + this.detectiveData[1] + this.detectiveData[2]
				let _this = this;
				let i = 0;
				
				
  			this.detective.setOption({
  								 title: { //标题 
                  	show : true ,
                  	text : '网络神探',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'40%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right: '5%',
                  	top: '3%',
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.detectiveData[i++]
                  	},
                  	data : [
	                  	{	name: '在线', icon: 'circle'},
	                  	{ name: '离线', icon: 'circle'},
	                  	{ name: '异常', icon: 'circle'}
	                  ]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: false ,
                  		center: ['40%', '50%'],
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			{name: '在线', value: _this.detectiveData[0]},
                  			{name: '离线', value: _this.detectiveData[1]},
                  			{name: '异常', value: _this.detectiveData[2]}
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff','#8f99ff'] //默认的颜色
  			})
  	},
  	drawVideo(){ //视频网吧巡查
  			this.video = echarts.init(document.getElementById("video"));
//			this.video.resize({  //设置实例的宽高
//				width	: 270,
//				height: 270
//			});
				let totalNum = this.videoData[0]+this.videoData[1]+this.videoData[2]
				let _this = this;
				let i = 0;
  			this.video.setOption({
  									 title: { //标题 
                  	show : true ,
                  	text : '网吧巡查',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'50%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right: '5%',
                  	top: '3%',
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.videoData[i++]
                  	},
                  	data : [
	                  	{	name: '已巡查网吧', icon: 'circle'},
	                  	{ name: '未巡查网吧', icon: 'circle'},
	                  	{ name: '部分巡查网吧', icon: 'circle'},
	                  	{ name: '违规网吧', icon: 'circle'}
	                  	
	                  ]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: true ,
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			{name: '已巡查网吧', value: _this.videoData[0]},
                  			{name: '未巡查网吧', value: _this.videoData[1]},
                  			{name: '部分巡查网吧', value: _this.videoData[2]},
                  			{name: '违规网吧', value: _this.videoData[3]}
                  			
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff','#8f99ff','#ffc16c'] //默认的颜色
  			})	
  	},
  	drawVideoCamera(){ //监控巡查
  			this.videoCamera = echarts.init(document.getElementById("videoCamera"));
//			this.video.resize({  //设置实例的宽高
//				width	: 270,
//				height: 270
//			});
				
				let totalNum = this.vidoeCameraData[0]+this.vidoeCameraData[1]
				let _this = this;
				let i = 0;
  			this.videoCamera.setOption({
  									 title: { //标题 
                  	show : true ,
                  	text : '监控巡查',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'40%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right: '5%',
                  	top: '3%',
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.vidoeCameraData[i++]
                  	},
                  	data : [
	                  	
	                  	{ name: '已巡查监控', icon: 'circle'},
	                  	{ name: '未巡查监控', icon: 'circle'}
	                  ]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: true ,
                  		center: ['40%', '50%'],
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			
                  			{name: '已巡查监控', value: _this.vidoeCameraData[0]},
                  			{name: '未巡查监控', value: _this.vidoeCameraData[1]},
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff'] //默认的颜色
  			})	
  	},
  	drawFireFighting(){ //消防自查
  			this.fireFighting = echarts.init(document.getElementById("fireFighting"));

				let totalNum = this.fireFightingData[0]+this.fireFightingData[1]
				let _this = this;
				let i = 0;
  			this.fireFighting.setOption({
  									title: { //标题 
                  	show : true ,
                  	text : '消防自查',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'50%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right: '5%',
                  	top: '3%',
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.fireFightingData[i++]
                  	},
                  	data : [
	                  	{	name: '自查网吧', icon: 'circle'},
	                  	{ name: '未自查', icon: 'circle'}
	                  ]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: false ,
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			{name: '自查网吧', value: _this.fireFightingData[0]},
                  			{name: '未自查', value: _this.fireFightingData[1]},
                  			
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff'] //默认的颜色
  			})
  	},
  	drawClue(){
  			this.clue = echarts.init(document.getElementById("clue"));
//			this.clue.resize({  //设置实例的宽高
//				width	: 270,
//				height: 270
//			});
				let totalNum = this.clueData[0]+this.clueData[1]
				let _this = this;
				let i = 0;
  			this.clue.setOption({
  								title: { //标题 
                  	show : true ,
                  	text : '线索上报',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'40%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right: '5%',
                  	top: '3%',
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.clueData[i++]
                  	},
                  	data : [
	                  	{	name: '阅读', icon: 'circle'},
	                  	{ name: '未阅读', icon: 'circle'}
	                  ]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: false ,
                  		center: ['40%', '50%'],
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			{name: '阅读', value: _this.clueData[0]},
                  			{name: '未阅读', value: _this.clueData[1]},
                  			
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff'] //默认的颜色
  			})
  	},
  	drawFaceContrast(){
  			this.faceContrast = echarts.init(document.getElementById("faceContrast"));
				let totalNum = this.faceContrastData[0]+this.faceContrastData[1]
				let _this = this;
				let i = 0;
  			this.faceContrast.setOption({
  								title: { //标题 
                  	show : true ,
                  	text : '人证对比',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'50%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right: '5%',
                  	top: '3%',
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.faceContrastData[i++]
                  	},
                  	data : [
	                  	{	name: '正常', icon: 'circle'},
	                  	{ name: '异常', icon: 'circle'}
	                  ]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: false ,
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			{name: '正常', value: _this.faceContrastData[0]},
                  			{name: '异常', value: _this.faceContrastData[1]},
                  			
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff'] //默认的颜色
  			})
  			
  	},
  	drawInspect(){
  			this.inspect = echarts.init(document.getElementById("inspect"));
				let totalNum = this.inspectData[0]+this.inspectData[1]
				let _this = this;
				let i = 0;
  			this.inspect.setOption({
  								title: { //标题 
                  	show : true ,
                  	text : '现场检查',
                  	textStyle: {
                  		color : '#b7b7b7',
                  		fontSize: 16,
                  		fontWeight: 'normal'
                  	},
                  	left:'50%',
                  	top: '40%',
                  	subtext:totalNum,
                  	subtextStyle:{
                  		fontSize:20,
                  		color:'#48a7ff'
                  	},
                  	textAlign: 'center',
//                	textAlign: 'center',
//                	textBaseline: 'middle'
                  },
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  legend:{ //顶部需要显示的数据
                  	orient : 'vertical',
                  	x : 'right',
                  	align:'left',
                  	textStyle:{
                  			color: '#a9a9a9',
                  			fontSize: 14
                  	},
                  	right: '5%',
                  	top: '3%',
                  	itemGap:10, //图例的间距！
                  	formatter:function(name){
                  		
                  		return name + ' : ' + _this.inspectData[i++]
                  	},
                  	data : [
	                  	{	name: '合格数', icon: 'circle'},
	                  	{ name: '不合格数', icon: 'circle'}
	                  ]
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: false ,
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
//                				position: 'inside', //标签与图形的位置
                  				formatter : '{b}：{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#a9a9a9',
                  						fontSize: 14
                  				}
                  			},
                  			
                  			emphasis:{ //鼠标停留高亮
                  					show: true,
                  					textStyle: {
                  							fontSize: 14,
                  							fontWeight: 'bold',
                  							color: '#a9a9a9'
                  					}
                  			}
                  		},
                  		
                  		labelLine:{ //标签线
                  			normal:{
                  				show: true
                  			}
                  		},
                  		data:[ //数据
                  			{name: '合格数', value: _this.inspectData[0]},
                  			{name: '不合格数', value: _this.inspectData[1]},
                  			
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff'] //默认的颜色
  			})
  		},
  	drawAll(){
  		
      if(this.informData){
				this.drawInform();
      }
      if(this.detectiveData){
  			this.drawDetective();
      }
      if(this.videoData){
      		this.drawVideo();
      }
  		if(this.vidoeCameraData){
  			this.drawVideoCamera();
  		}
  		
  		if(this.fireFightingData){
    			this.drawFireFighting();
  		}
			if(this.clueData){
  			this.drawClue();
			}
			if(this.faceContrastData){
				
				this.drawFaceContrast();
			}
  		if(this.inspectData){
  			
  			this.drawInspect();
  		}
  	},
  	getUserData(){
			let data = JSON.parse(sessionStorage.getItem('userinfo'));
			let map = new Map(data);
			this.userData = map
			console.log(this.userData)
		}
  },
  mounted(){
  	this.getUserData();
  	this.$store.dispatch('getAjaxPoliceAllMessage');
  	
  	this.getEcharthData();
  	
  	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

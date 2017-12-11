<template>
  <div class="informStatistics section_body">
    <el-col :span="24" class="header" style="margin-top:10px;" align="right">
	 			<el-form  :inline="true" :model="filters" class="header_form" ref="filters" >
	 				<!--派出所下拉选择-->
	 				<el-form-item label="派出所">
	 						<el-select v-model="filters.policeId" placeholder="请选择派出所">
	 								<el-option label="所有派出所" value="0" v-if="userData && userData.get('policeId') == '1' "></el-option>
	 								<el-option :label="item.policeName" :value="item.policeId" v-for="(item,index) in upDatePoliceId" :key="index"></el-option>
	 						</el-select>
	 						
	 				</el-form-item>
		 			<!--日期选择-->
		 			<el-form-item>
		 				<div class="block">
						    <span class="demonstration">时间：</span>
						    <el-date-picker
						      v-model="filters.dateTime"
						      type="daterange"
						      align="right"
						      placeholder="选择日期范围"
						      >
						    </el-date-picker>
					  </div>
		 			</el-form-item>
		 				<!--查询-->
		 			<el-form-item>
					 	<el-button  @click="getUsers">查询</el-button>
		  		</el-form-item>
		  			
	 			</el-form>
 		</el-col>
 		
 		<!--统计表格-->
		<template>
				<el-table :data="tableData" border stripe highlight-current-row style="width:100%" v-loading="listLoading">
						<el-table-column type="index" label="序号" width="140" align="center"></el-table-column>
						<el-table-column prop="policeName" label="派出所" align="center"></el-table-column>
						<el-table-column prop="informNum" label="通知发布数" align="center"></el-table-column>
						<el-table-column prop="signProbability" label="签收率" align="center"></el-table-column>
						<el-table-column label="操作" align="center" width="220">
								<template scope="scope">
										<el-button  size="small" @click="handleAnalyze(scope.$index,scope.row)">图表分析</el-button> 
										<el-button  size="small" @click="handleUnSign(scope.$index,scope.row)">未签收详情</el-button>
								</template>
						</el-table-column>
				</el-table>
		</template> 		
		<!--分页-->
 		<el-col class="pageContainer" style="margin:10px 0 0 0;">
		    <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :page-size="20"
		      layout="total,  prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		 </el-col>
		 
		 <!--图表分析-->
		 <el-dialog title="图表" :visible.sync="echartDialog">
		 			<el-row>
		 					<el-col :span="24" class="bg-purple" align="center" >{{echartDialogTitle}}通告签收情况</el-col>
		 					<el-col :sapn="24" align="center">
		 						<div id="echartsBox" style="width:600px;height:450px;"></div>
		 					</el-col>
		 					
		 			</el-row>
		 </el-dialog>
		
		 <!--未签收详情-->
		 <el-dialog title="未签收网吧" :visible.sync="notSignDialog" class="cj_InformInquireDialog">
		 		<!--表格-->
		 		<template>
		 			<el-table :data="notSignTableData" border stripe highlight-current-row style="width: 100%;" v-loading="listLoading">
		 				
		 				<el-table-column prop="cybercafeName" label="未签收网吧"   align="center"></el-table-column>
		 				<el-table-column prop="type" label="类型" align="center"></el-table-column>
		 				<el-table-column prop="title" label="标题" align="center"></el-table-column>
		 			</el-table>
		 		</template>
		 		<!--未签收分页-->
		 		<el-col class="pageContainer" style="margin:10px 0;">
				    <el-pagination
				      @size-change="unsignHandleSizeChange"
				      @current-change="unsignHandleCurrentChange"
				      :page-size="10"
				      layout="total,  prev, pager, next, jumper"
				      :total="unsignTotal">
				    </el-pagination>
				 </el-col>
		 		
		 </el-dialog>
 		
  </div>
</template>

<script>
	import echarts from 'echarts'
	import {getPoliceAllMsg ,getInformStatisticsTable , getInquireStatisticsUnsign } from 'api'
	
export default {
  name: 'informStatistics',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      echartsBox: null,
      inform: null,
      chartColumn: null,
      echartsData:[],
      notSignDialogTitle:'',  //未签收网吧标题
      total:0, //总数据
      unsignTotal:0,  //未签收数量
      unsignPage:1,   //未签收页数
      page:1,   
      echartDialog:false, //图表的dialog
      notSignDialog:false, //未签收的dialog
      notSignTableData:[{ cybercafeName : '玉泉派出所', title : '通知标题' , type : '通知类型'}],  //未签收的表格数据
      notSignPage:1,
      listLoading:false,
      tableData:[],
      policeIdLists:[],
      data:'',
      filters:{ //要查询的数据
      	policeId:'',
      	dateTime:''
      },
      policeList:[{ name:'古墩路派出所',policeId:'1' },{ name:'文新派出所',policeId:'2'}],
      echartFialogDate:{ //图表dialog的数据
      		title : '',
      		signProbability : '',  //签收率
      		unsignProbability : '' //未签收率
      },
      userData:null,
      echartDialogTitle:'',
      handleUnSignId:null
    }
  },
  methods:{
  	
  	handleSizeChange(val){
  		console.log(`每页 ${val} 条`);
  		
  	},
  	handleCurrentChange(val){
  		console.log(`当前页码${val}`)
  		this.page = val;
  		this.getUsers()
		},
		unsignHandleSizeChange(val){
			console.log(`每页${val}条`)
			
		},
		unsignHandleCurrentChange(val){
			console.log(`当前页码${val}`)
			this.unsignPage = val ;
			this.handleUnSign()
		},
  	handleAnalyze(index,row){  //图表分析
  			this.echartDialog = true;
  			let _this = this
  			this.echartDialogTitle = row.policeName
//			echarts.dispose()
				console.log(document.getElementById("echartsBox"))
				setTimeout(function(){
				this.echartsBox =  echarts.init(document.getElementById("echartsBox"));
				
				this.echartsBox.setOption({
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
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
                  				position: 'insideTop', //标签与图形的位置
                  				formatter : '{b}:{d}%', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#000',
                  						fontSize: 16
                  				}
                  			}
                  		},
                  		labelLine:{ //标签线
                  			normal:{
                  				show: false
                  			}
                  		},
                  		data:[ //数据
                  			{name: '签收率', value:row.signNum },
                  			{name: '未签收率', value:row.unsignNum }
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff',] //默认的颜色
                  
               });
               
        },100)
  	},
  	handleUnSign(index,row){  //未签收详情
  			if(row && row.policeId){
  				this.handleUnSignId = row.policeId
  			}else{
  				
  			}
  			
//			this.notSignDialogTitle = row.policeName + ''		
  			this.notSignDialog = true;
  			let portParameter = this.$store.getters.getPortParameter;
//	  		let userData = this.$store.getters.getUserData;
	  		let para = {
	  				system : portParameter.system,
	  				token : this.userData.get('token'),
	  				userId : this.userData.get('userId'),
	  				version : portParameter.version,
	  				page:this.unsignPage,
	  				policeId:this.handleUnSignId
	  		};
  			
  			getInquireStatisticsUnsign(para).then((res) =>{
  					
  					if(res && res.data.code == '1'){
  						
  						this.notSignTableData = res.data.data;
  						this.unsignTotal = res.data.total;
  					}
  			}).catch((err) =>{
  				
  			})
  			
  	},
  	handleEdit(index,row){  
  			
  			
  		
  	},
  	getUsers(){
  		this.listLoading = true;
  		
  		let portParameter = this.$store.getters.getPortParameter;
//		let userData = this.$store.getters.getUserData;
			let dateTimeList = null ;
			if(this.filters.dateTime && this.filters.dateTime[0]){
  			dateTimeList = this.formatDateTime(this.filters.dateTime);
  		}else{
  			dateTimeList = ['','']
  		};
  		
  		let para = {
  				system : portParameter.system,
					token : this.userData.get('token'),
  				userId : this.userData.get('userId'),
  				version : portParameter.version,
  				endDateTime: dateTimeList[1],
  				startDateTime: dateTimeList[0],
  				page:this.page,
  				policeId:this.filters.policeId
  		};
  			
			getInformStatisticsTable(para).then((res) =>{
				this.listLoading = false;
				
				if(res.data && res.data.code == '1'){
					console.log(res)
						this.tableData = res.data.data;
						this.total = res.data.total;
						
				}
						
			})
			.catch((err) =>{
				console.log(err)
			})
  	},
  	formatDateTime(ArrayDate){
				let NewDate = [];
				if(ArrayDate.length > 1){
					
					for(let value of ArrayDate){
						
						let d = new Date(value);
						let y = d.getFullYear();
						let m = (d.getMonth()+1) < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
						let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
						let newValue = y +''+ m+''+ date
						NewDate.push(newValue)
					}
				}
				return NewDate
		},
		getUserData(){
			let data = JSON.parse(sessionStorage.getItem('userinfo'));
			let map = new Map(data);
			this.userData = map
			console.log(this.userData)
		}
  	
  },
  computed:{
  	upDatePoliceId(){
  		if(this.$store.getters.getPoliceAllMsg.length < 1){
			  		
			  			this.$store.dispatch('getAjaxPoliceAllMessage');
			  			return 
			  	}else{
				  		let box = this.$store.getters.getPoliceAllMsg;
				  		let data = JSON.parse(sessionStorage.getItem('userinfo'));
							let map = new Map(data);
				  		if(map.has('policeId')){
				  			if(map.get('policeId') == '1'){
					  				for(let value of box){
											value.policeId = (value.policeId).toString()
										}
										this.policeIdLists = box;
							  		return this.policeIdLists
				  			}else{
					  				let newBox = []
					  				for(let value of box){
					  					if(value.policeId == map.get('policeId')){
					  						value.policeId = (value.policeId).toString()
					  						
					  						newBox.push(value)
					  						this.filters.policeId = value.policeId
					  					}
										}
					  				console.log(newBox)
									this.policeIdLists = newBox;
						  		return this.policeIdLists
				  			}
				  				
				  		}else{
				  			for(let value of box){
									value.policeId = (value.policeId).toString()
								}
								this.policeIdLists = box;
					  		return this.policeIdLists
				  		}
								
			  	}
  	}
  },
  mounted(){
  	
  	this.getUserData();
  	this.getUsers();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

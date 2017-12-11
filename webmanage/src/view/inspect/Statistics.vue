<template>
  <div class="inspect_statistics">
  	
    <el-col :span="24" align="right" style="margin-top:10px">
    		<el-form v-model="filters" :inline="true">
    			<!--派出所-->
    				<el-form-item label="派出所">
    						<el-select v-model="filters.policeId" placeholder="请选择派出所">
    								<el-option label="所有派出所" value="0" v-if="userData && userData.get('policeId') == '1' "></el-option>
    								<el-option v-for="(item,index) in upDatePoliceId" :value="item.policeId" :label="item.policeName" :key="index"></el-option>
    						</el-select>
    				</el-form-item>
    				
    				<!--时间-->
    				<el-form-item label="时间">
    						 <el-date-picker
							      v-model="filters.dateTime"
							      type="daterange"
							      align="right"
							      placeholder="选择日期范围"
							     >
					    	</el-date-picker>
    				</el-form-item>
    				
    				<!--查询-->
    				<el-form-item>
    					<el-button @click="getUsers">查询</el-button>
    				</el-form-item>
    		</el-form>
    	</el-col>  	
    	
    	<!--表格-->
    	<template>
	 			<el-table :data="tableData" border stripe highlight-current-row style="width: 100%;" v-loading="listLoading">
		 				<el-table-column type="index"  label="序号" width="140" align="center"></el-table-column>
		 				<el-table-column prop="policeName" label="所属派出所"  align="center"></el-table-column>
		 				<el-table-column prop="inspectNum" label="检查网吧数" align="center"></el-table-column>
		 				<el-table-column prop="qualifiedNum" label="合格网吧数" align="center"></el-table-column>
		 				<el-table-column prop="qualifiedProbability" label="合格率" align="center" ></el-table-column>
		 				<el-table-column prop="dateTime" label="时间" align="center" :formatter="formatterTableDateTime"></el-table-column>
		 				<el-table-column  label="操作" align="center" width="220">
		 					<template scope="scope">
		 						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">图表分析</el-button>
		 					</template>
		 				</el-table-column>
	 			</el-table>
 			</template>
 			<!--分页-->
	 		<el-col class="pageContainer" style="margin:10px 0 0 0">
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
		 					<el-col :span="24" class="bg-purple" align="center" >{{echartDialogTitle}}现场检查网吧合格情况</el-col>
		 					<el-col :sapn="24" align="center">
		 						<div id="echartsBox" style="width:600px;height:450px;"></div>
		 					</el-col>
		 					
		 			</el-row>
		 </el-dialog>
			 
  </div>
</template>

<script>
	
import { getInspectStatisticsTable } from 'api'
import echarts from 'echarts'

export default {
  name: 'inspect_statistics',
 data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      filters:{
      	policeId:'',
      	dateTime:''
      },
      policeIdLists:[],
      tablePage:1,  //当前页码
      tableData:[], //表格数据
      listLoading: false, //加载状态
      total:0,  //分页的总记录数
      echartDialog:false,
      echartDialogTitle:'',
      echartsBox:null,
      userData:null
    }
  },
  methods:{
  	formatterTableDateTime : function(row,column){ //格式表格时间
  		let time = row.dateTime;
  		let y = time.substring(0,4);
  		let m = time.substring(4,6);
  		let d = time.substring(6,8);
  		return m +'/' +d
  	},
  	getUsers(){
  	let portParameter = this.$store.getters.getPortParameter;
  		let userData = this.$store.getters.getUserData;
  		
  		let dateTimeList
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
  				page: this.tablePage,
  				policeId: this.filters.policeId,
  				endDateTime: dateTimeList[1],
  				startDateTime: dateTimeList[0]
  		};
  		getInspectStatisticsTable(para).then((res) =>{
  				console.log(res)
  				this.tableData = res.data.data
  				this.total = res.data.total;
  		}).catch((err) =>{
  			
  		})
  	},
  	handleSizeChange(val){
  		console.log(`每页 ${val} 条`);
  		
  	},
  	handleCurrentChange(val){
  		console.log(`当前页码${val}`)
  		this.tablePage = val;
//		this.getUsers()
		},
		formatDateTime(ArrayDate){
				let NewDate = []
			console.log(ArrayDate)
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
				console.log(NewDate)
				return NewDate
		},
		handleEdit(index,row){  //查看
			this.echartDialog = true;
			
			this.echartDialogTitle = row.policeName
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
                  			{name: '合格', value:row.qualifiedNum },
                  			{name: '不合格', value:row.unqualifiedNum }
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff',] //默认的颜色
                  
               });
               
        },100)
			
		},
		getUserData(){
			let data = JSON.parse(sessionStorage.getItem('userinfo'));
			let map = new Map(data);
			this.userData = map
			console.log(this.userData.get('token'))
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

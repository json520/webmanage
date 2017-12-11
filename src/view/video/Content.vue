<template>
  <div class="video_content">
    	<el-col :span="24" align="right" style="margin-top:10px">
    		<el-form v-model="filters" :inline="true">
    			<!--派出所-->
    				<el-form-item label="派出所">
    						<el-select v-model="filters.policeId" placeholder="请选择派出所" style="width:160px;">
    								<el-option label="所有派出所" value="0" v-if="userData && userData.get('policeId') == '1' "></el-option>
    								<el-option v-for="(item,index) in upDatePoliceId" :value="item.policeId" :label="item.policeName" :key="index"></el-option>
    						</el-select>
    				</el-form-item>
    				
    				<!--网吧名称-->
    			<el-form-item label="网吧名称">
    				<el-input v-model="filters.cybercafeName"></el-input>
    			</el-form-item>
    				
    				<!--结果-->
    				<el-form-item label="结果" >
    					<el-select v-model="filters.qualified" placeholder="请选择查询结果" style="width:160px;">
    						<el-option label="所有结果" value=""></el-option>
    						<el-option label="合格" value="1"></el-option>
    						<el-option label="不合格" value="0"></el-option>
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
		 				<el-table-column prop="policeName" label="派出所"  align="center"></el-table-column>
		 				<el-table-column prop="cybercafeName" label="网吧名称" align="center"></el-table-column>
		 				<el-table-column prop="content" label="巡查内容" align="center">
		 					<template scope="scope" style="position:relative;">
				        <p v-if="scope.row.imgUrl"><img :src="uploadImg + '/upload/' + scope.row.imgUrl" style="width:140px;"/></p>
				        <p v-else="scope.row.videoUrl">
				        		<img src="../../assets/post01.jpg" style="width:140px;"/>
		 								<img src="../../assets/play.png" style="width:30px;position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;margin:auto;" @click="playVideo(scope.row.videoUrl)"/>
				        </p>
				      </template>
		 				</el-table-column>
		 				<el-table-column prop="qualified" label="巡查结果" align="center" ></el-table-column>
		 				<el-table-column prop="description" label="说明" align="center" ></el-table-column>
		 				<el-table-column prop="patrolName" label="巡查人" align="center" ></el-table-column>
		 				<el-table-column prop="dateTime" label="巡查时间"  width="220" align="center" :formatter="formatterTableDateTime"></el-table-column>
	 			</el-table>
 			</template>
 			<!--分页-->
	 		<el-col class="pageContainer" style="margin:10px 0 0 0">
			    <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :page-size="20"
			      layout="total,prev, pager, next, jumper"
			      :total="total">
			    </el-pagination>
			</el-col>
    	
    	<!--视频调用-->
		 <el-dialog :visible.sync="checkVideo" @close="checkVideoClose">
		 	<p>视频</p>
		 		<v-video :videoUrl="checkVideoUrl"></v-video>
		 </el-dialog>	 
    	
  </div>
</template>

<script>
	
import { getVideoContentTable , uploadImg } from 'api'	
import VVideo from '@/base/video/video'
export default {
  name: 'video_content',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      filters:{
      	policeId:'',
      	dateTime:'',
      	cybercafeName:'',
      	qualified:''
      },
      policeIdLists:[],
       tablePage:1,  //当前页码
      tableData:[], //表格数据
      listLoading: false, //加载状态
      total:0,  //分页的总记录数
      uploadImg:'',
      checkVideo:false, //查看视频
      checkVideoUrl:'', //查看的video链接
      userData:null
    }
  },
  components:{
  	VVideo
  },
  methods:{
  	formatterTableDateTime : function(row,column){ //格式表格时间
  		
  		let time = row.dateTime;
  		let y = time.substring(0,4);
  		let m = time.substring(4,6);
  		let d = time.substring(6,8);
  		let h = time.substring(8,10);
  		let minutes = time.substring(10,12);
  		let second = time.substring(12,14);
  		return y + '/' + m +'/' +d + ' '+ h + ':' + minutes + ':' + second
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
  				cybercafeName: this.filters.cybercafeName,
  				qualified : this.filters.qualified,
  				endDateTime: dateTimeList[1],
  				startDateTime: dateTimeList[0]
  		};
  		getVideoContentTable(para).then((res) =>{
  			
  				if(res.data && res.data.code == '1'){
  					this.tableData = res.data.data
  					this.total = res.data.total;
  				}
  				
  		}).catch((err) =>{
  			console.log(err)
  		})
  	},
  	checkVideoClose(){  //关闭查看详情
			
			this.checkVideoUrl = ''
		},
  	playVideo(videoUrl){ //点击播放
  		
  		if(videoUrl){
  			this.checkVideo = true;
  			this.checkVideoUrl = uploadImg + '/upload/' + videoUrl
  		}
  	},
  	handleSizeChange(val){
  		console.log(`每页 ${val} 条`);
  		
  	},
  	handleCurrentChange(val){
  		console.log(`当前页码${val}`)
  		this.tablePage = val;
		this.getUsers()
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
  	this.uploadImg = uploadImg;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

<template>
  <div class="clue_reported">
    	<el-col :span="24" align="right" style="margin-top:10px">
    		
    		<el-form v-model="filters" :inline="true">
    			<!--网吧名称-->
    			<el-form-item label="网吧名称">
    				<el-input v-model="filters.cybercafeName"></el-input>
    			</el-form-item>
    			
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
		 				<el-table-column type="index"  label="序号" width="60" align="center"></el-table-column>
		 				<el-table-column prop="cybercafeName" label="网吧名称"  align="center"></el-table-column>
		 				<el-table-column prop="policeName" label="所属派出所" align="center"></el-table-column>
		 				<el-table-column prop="putName" label="上传人" align="center"></el-table-column>
		 				<el-table-column prop="putDateTime" label="上传时间"  width="140" align="center"  :formatter="formatterTableDateTime"></el-table-column>
		 				<el-table-column prop="read" label="状态" align="center" ></el-table-column>
		 				<el-table-column prop="disposeName" label="处理人" align="center" ></el-table-column>
		 				<el-table-column prop="disposeDateTime" label="修改时间" width="140" align="center" :formatter="formatterdisposeDateTime"></el-table-column>
		 				<el-table-column  label="操作" align="center" width="220">
		 					<template scope="scope">
		 						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">查看</el-button>
		 						<el-button size="small" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
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
    	
    	<!--查看-->
    	<el-dialog title="线索内容" :visible.sync="checkContent">
		 			<el-row>
		 					<el-col :span="6" class="bg-purple" align="center" v-for="(item,index) in checkDataList.imgUrlList" v-if="checkDataList.isTypeImg" :key="index"><img :src="item" alt="" /></el-col>
		 					<el-col :span="6" v-if="!checkDataList.isTypeImg" style="position:relative;">
		 						<img src="../../assets/post01.jpg" style="width:100%;height:100%;"/>
		 						<img src="../../assets/play.png" style="width:50px;position:absolute;left:0;right:0;top:0;bottom:0;z-index:1;margin:auto;" @click="playVideo"/>
		 					</el-col>
		 					<el-col :span="24">
		 						<p>说明：</p>
		 						{{checkDataList.description}}</el-col>
		 					<el-col :span="24" align="center">
		 						<el-button v-if="checkDataList.state === 0" type="primary" size="large" @click="checkBtnRead">确定阅读</el-button>
		 						<el-button v-else type="primary" size="large" disabled>已阅读</el-button>
		 					</el-col>
		 			</el-row>
		 </el-dialog>
		 
		 <!--视频调用-->
		 <el-dialog :visible.sync="checkVideo" @close="checkVideoClose">
		 	<p>视频</p>
		 		<v-video :videoUrl="checkDataList.videoUrl"></v-video>
		 </el-dialog>
    	
  </div>
</template>

<script>
	
import { getClueReportedTable , getClueReportedTableDelete , getClueReportedTableCheck , getClueReportedTableRead, uploadImg }  from 'api'	
import VVideo from '@/base/video/video'
export default {
  name: 'clue_reported',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      filters:{
      	policeId:'',
      	dateTime:'',
      	cybercafeName:''
      },
      apiPort:'',
      policeIdLists:[],
       tablePage:1,  //当前页码
      tableData:[], //表格数据
      checkDataList:{ //弹窗数据--查看
      	description:null,
      	state:null,
      	videoUrl:null,
      	imgUrlList:null
      }, //查看表格弹窗数据
      listLoading: false, //加载状态
      total:0,  //分页的总记录数
      checkContent:false,
      checkVideo:false, //查看视频
      checkIndexId:null, //查看当前的id
      userData:null
    }
  },
  components:{
  	VVideo
  },
  methods:{
  	formatterTableDateTime : function(row,column){ //格式表格时间
  		
  		let time = row.putDateTime;
  		let y = time.substring(0,4);
  		let m = time.substring(4,6);
  		let d = time.substring(6,8);
  		let h = time.substring(8,10);
  		let minutes = time.substring(10,12);
  		let second = time.substring(12,14);
  		return m +'/' +d + ' '+ h + ':' + minutes + ':' + second
  	},
		formatterdisposeDateTime : function(row,column){ //格式表格时间
			
			
			let time = row.disposeDateTime;
			if(time){
				let y = time.substring(0,4);
	  		let m = time.substring(4,6);
	  		let d = time.substring(6,8);
	  		let h = time.substring(8,10);
	  		let minutes = time.substring(10,12);
	  		let second = time.substring(12,14);
	  		return m +'/' +d + ' '+ h + ':' + minutes + ':' + second
			}
  		
		},
  	getUsers(){
  		let portParameter = this.$store.getters.getPortParameter;
  		
//		let userData = this.$store.getters.getUserData;
  		
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
  		getClueReportedTable(para).then((res) =>{
  			if(res.data && res.data.code == '1'){
  				console.log(res)
  				this.tableData = res.data.data
  				this.total = res.data.total;
  			}
  				
  		}).catch((err) =>{
  			console.log(err)	
  		})
  	},
  	checkBtnRead(){ //确定阅读 --查看
  		let portParameter = this.$store.getters.getPortParameter;
//		let userData = this.$store.getters.getUserData;
  		let para = {
  				system : portParameter.system,
  				token : this.userData.get('token'),
  				userId : this.userData.get('userId'),
  				version : portParameter.version,
  				id: this.checkIndexId,
  		};
					
			getClueReportedTableRead(para).then((res) =>{
					console.log(res)
					this.checkContent = false;
					if(res.data.code == '1'){
							this.$message({
								message: '操作成功',
								type: 'success'
							})
						this.getUsers();
					}else{
						this.$message({
								message: '操作失败',
								type: 'error'
							})
					}
					
				}).catch((err) =>{
					console.log(err)
				})	
  	},
  	playVideo(){ //点击视频查看
  		this.checkVideo = !this.checkVideo;
  		this.checkContent = false;
  	},
  	checkVideoClose(){
			this.checkVideo = false;
			
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
		handleEdit(index,row){  //查看
			this.checkIndexId = row.id;
			this.checkContent = true;
			let userData = this.$store.getters.getUserData;
  		let para = {
  				token : this.userData.get('token'),
  				userId : this.userData.get('userId'),
  				id : row.id
  		};
			
			getClueReportedTableCheck(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
						let data = res.data.data;
						if(data.imgUrlList.length){
							data.imgUrlList.forEach(function(item,i){
							console.log(item)
								data.imgUrlList[i] = uploadImg + /upload/ + item
							})
						}
						if(data.videoUrl){
							data.videoUrl = uploadImg + /upload/ + data.videoUrl
						}
						
						console.log(data)
						this.checkDataList = Object.assign({},data)
						
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		handleDelete(index,row){  //删除
				this.$confirm('确定要删除该记录吗？','提示',{
			
				type : 'warning'
				
			}).then((res) =>{
					let portParameter = this.$store.getters.getPortParameter;
		  		let userData = this.$store.getters.getUserData;
		  		
		  		let para = {
		  				system : portParameter.system,
		  				token : userData.token,
		  				userId : userData.userId,
		  				version : portParameter.version,
		  				id: row.id,
		  		};
					
					getClueReportedTableDelete(para).then((res) =>{
							console.log(res)
							if(res.data.code == '1'){
									this.$message({
										message: '删除成功',
										type: 'success'
									})
								this.getUsers();
							}else{
								this.$message({
										message: '删除成功',
										type: 'error'
									})
							}
							
						}).catch((err) =>{
							console.log(err)
						})	
					
			}).catch((err) =>{
					console.log(err)
			});
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

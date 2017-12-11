<template>
  <div class="detective_state">
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
    				
    				<!--神探状态-->
    				<el-form-item label="状态">
    						 <el-select v-model="filters.state" placeholder="请选择查询的状态">
    						 		<el-option label="所有" value="-1"></el-option>
    						 		<el-option label="在线" value="1"></el-option>
    						 		<el-option label="离线" value="0"></el-option>
    						 		<el-option label="异常" value="2"></el-option>
    						 </el-select>
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
	 				<el-table-column prop="cybercafeName" label="网吧名称"  align="center"></el-table-column>
	 				<el-table-column prop="state" label="状态" align="center"></el-table-column>
	 				<el-table-column prop="stateNum" label="数量" align="center"></el-table-column>
	 				<el-table-column prop="policeName" label="所属派出所" align="center" width="220"></el-table-column>
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
    	
  </div>
</template>

<script>
	import { getDetectiveStateTable } from 'api'
	
export default {
  name: 'detective_state',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      filters:{
      	policeId:'',
      	state:'',
      	cybercafeName:''
      },
      policeIdLists:[], //派出所列表
      tablePage:1,  //当前页码
      tableData:[], //表格数据
      listLoading: false, //加载状态
      total:0, //分页的总记录数
      userData:null
    }
  },
  methods:{
  	getUsers(){
  		let portParameter = this.$store.getters.getPortParameter;
//		let userData = this.$store.getters.getUserData;
  		let para = {
  				system : portParameter.system,
  				token : this.userData.get('token'),
  				userId : this.userData.get('userId'),
  				version : portParameter.version,
  				cybercafeName: this.filters.cybercafeName,
  				page: this.tablePage,
  				policeId: this.filters.policeId,
  				state: this.filters.state
  		};
  		getDetectiveStateTable(para).then((res) =>{
  				
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
		this.getUsers()
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

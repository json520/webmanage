<template>
  <div class="unit_infor">
    	<el-col :span="24"  align="right" style="margin-top:10px">
    			<el-form :model="filters" :inline="true">
    				<!--派出所-->
    					<el-form-item label="派出所" placeholder="请选择派出所">
    							<el-select v-model="filters.policeId">
    									<el-option label="所有派出所" value="0" v-if="userData && userData.get('policeId') == '1' "></el-option>
    									<el-option v-for="(item,index) in upDatePoliceId" :value="item.policeId" :label="item.policeName" :key="index"></el-option>
    							</el-select>
    					</el-form-item>
    					
    					<!--查询-->
    					<el-form-item>
    							<el-button @click="getUsers">查询</el-button>
    					</el-form-item>
    					
    					<!--新增-->
    					<el-form-item>
    							<el-button @click="addMessage" v-if="userData && userData.get('roleId') == '1' || userData && userData.get('roleId') == '2'">新增</el-button>
    					</el-form-item>
    			</el-form>
    	</el-col>
    	
    	<!--表格-->
    	<template>
	 			<el-table :data="tableData" border stripe highlight-current-row style="width: 100%;" v-loading="listLoading">
		 				<el-table-column type="index"  label="序号" width="140" align="center"></el-table-column>
		 				<el-table-column prop="policeName" label="单位名称"  align="center"></el-table-column>
		 				<el-table-column prop="policeCode" label="单位代码" align="center"></el-table-column>
		 				<el-table-column prop="telephone" label="联系方式" align="center"></el-table-column>
		 				<el-table-column prop="substationName" label="上级单位" align="center" ></el-table-column>
		 				<el-table-column  label="操作" align="center">
		 					<template scope="scope">
		 						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">查看</el-button>
		 						<el-button size="small" @click="handleAmend(scope.$index,scope.row)" v-if="userData && userData.get('roleId') < 3">修改</el-button>
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
    	
    	 
			 
			  
			 
			 <!--新增-->
	    	<el-dialog title="新增" :visible.sync="addContent" class="cj_Dialog" @close="formAddContentClose('formAddContent')" :close-on-click-modal="false">
			 			<el-form :model="formAddContent" label-width="formAddContentWidth"	:rules="formAddContentRules" ref="formAddContent" >
			 				<!--单位代码-->
			 				<el-form-item label="单位代码：" label-width="120px" prop="policeCode" :style="{width:addContentFormItemWidth}">
			 					<el-input type="text" v-model="formAddContent.policeCode"></el-input>
			 				</el-form-item>
			 				<!--单位名称-->
			 				<el-form-item label="单位名称：" label-width="120px" prop="policeName" :style="{width:addContentFormItemWidth}">
			 					<el-input type="text" v-model="formAddContent.policeName"></el-input>
			 				</el-form-item>
			 				<!--联系电话-->
			 				<el-form-item label="联系方式：" label-width="120px" prop="telephone" :style="{width:addContentFormItemWidth}">
			 					<el-input type="text" v-model="formAddContent.telephone"></el-input>
			 				</el-form-item>
			 				<!--上机单位-->
			 				<el-form-item label="上级单位：" label-width="120px" prop="substationName" :style="{width:addContentFormItemWidth}">
			 					<el-input type="text" v-model="formAddContent.substationName" disabled></el-input>
			 				</el-form-item>
			 				<!--保存-->
			 				<el-form-item style="text-align:center;">
			 					<el-button type="primary" size="large" :loading="addSaveLoading" @click="submitAddContent('formAddContent')">保存</el-button>
			 				</el-form-item>
			 			</el-form>
			 </el-dialog>
			 
			 <!--查看-->
	    	<el-dialog title="查看" :visible.sync="checkContent" class="cj_Dialog" @close="formCheckContentClose('formCheckContent')">
			 			<el-form :model="formCheckContent" label-width="formCheckContentWidth" ref="formCheckContent" >
			 				<!--单位代码-->
			 				<el-form-item label="单位代码：" label-width="120px" prop="policeCode" :style="{width:checkContentFormItemWidth}">
			 					<el-input type="text" v-model="formCheckContent.policeCode" disabled></el-input>
			 				</el-form-item>
			 				<!--单位名称-->
			 				<el-form-item label="单位名称：" label-width="120px" prop="policeName" :style="{width:checkContentFormItemWidth}">
			 					<el-input type="text" v-model="formCheckContent.policeName" disabled></el-input>
			 				</el-form-item>
			 				<!--联系电话-->
			 				<el-form-item label="联系方式：" label-width="120px" prop="telephone" :style="{width:checkContentFormItemWidth}">
			 					<el-input type="text" v-model="formCheckContent.telephone" disabled></el-input>
			 				</el-form-item>
			 				<!--上机单位-->
			 				<el-form-item label="上级单位：" label-width="120px" prop="substationName" :style="{width:checkContentFormItemWidth}">
			 					<el-input type="text" v-model="formCheckContent.substationName" disabled></el-input>
			 				</el-form-item>
			 				<!--保存-->
			 				<el-form-item style="text-align:center;">
			 					<el-button type="primary" size="large" :loading="checkSaveLoading" @click="submitAddContent('formAddContent')" disabled>保存</el-button>
			 				</el-form-item>
			 			</el-form>
			 </el-dialog>
    	
    		<!--修改-->
	    	<el-dialog title="修改" :visible.sync="amendContent" class="cj_Dialog" @close="formAmendContentClose('formAmendContent')" :close-on-click-modal="false">
			 			<el-form :model="formAmendContent" label-width="formAmendContentWidth"	:rules="formAmendContentRules" ref="formAmendContent" >
			 				<!--单位代码-->
			 				<el-form-item label="单位代码：" label-width="120px" prop="policeCode" :style="{width:amendContentFormItemWidth}">
			 					<el-input type="text" v-model="formAmendContent.policeCode"></el-input>
			 				</el-form-item>
			 				<!--单位名称-->
			 				<el-form-item label="单位名称：" label-width="120px" prop="policeName" :style="{width:amendContentFormItemWidth}">
			 					<el-input type="text" v-model="formAmendContent.policeName" ></el-input>
			 				</el-form-item>
			 				<!--联系电话-->
			 				<el-form-item label="联系方式：" label-width="120px" prop="telephone" :style="{width:amendContentFormItemWidth}">
			 					<el-input type="text" v-model="formAmendContent.telephone"></el-input>
			 				</el-form-item>
			 				<!--上机单位-->
			 				<el-form-item label="上级单位：" label-width="120px" prop="substationName" :style="{width:amendContentFormItemWidth}">
			 					<el-input type="text" v-model="formAmendContent.substationName" disabled></el-input>
			 				</el-form-item>
			 				<!--保存-->
			 				<el-form-item style="text-align:center;">
			 					<el-button type="primary" size="large" :loading="amendSaveLoading" @click="submitAmendContent('formAmendContent')">保存</el-button>
			 				</el-form-item>
			 			</el-form>
			 </el-dialog>
			 
  </div>
</template>

<script>
	
import { getUnitInforTable , getUnitInforTableAdd , getUnitInforTableAmend , getUnitInforTableCheck} from 'api'	
export default {
  name: 'unit_infor',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      filters:{
    		policeId :''
    	},
    	policeIdLists:[],
    	tablePage:1,  //当前页码
      tableData:[], //表格数据
      listLoading: false, //加载状态
      total:0,  //分页的总记录数
      checkContent:false, //查看Dialog
      amendContent:false, //修改Dialog
      addContent:false, //增加Dialog
    	formAddContent:{  //信息数据--新增
    		policeCode:'',
    		policeName:'',
    		substationName:'杭州市公安局西湖分局',
    		telephone:''
    	},
    	formCheckContent:{  //信息数据--查看
    		policeCode:'',
    		policeName:'',
    		substationName:'杭州市公安局西湖分局',
    		telephone:''
    	},
    	formAmendContent:{  //信息数据--修改
    		policeCode:'',
    		policeName:'',
    		substationName:'杭州市公安局西湖分局',
    		telephone:''
    	},
    	formAmendContentId:null, //修改的id
    	formAddContentRules:{ //表单的验证方法--新增
    		policeCode : [{ required: true, message: '单位代码不能为空', trigger: 'blur' }],
    		policeName : [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
    		substationName : [{ required: true, message: '上级单位不能为空', trigger: 'blur' }],
    		telephone : [{ required: true, message: '联系方式不能为空', trigger: 'blur' }]
    	},
    	formAmendContentRules:{ //表单的验证方法--修改
    		policeCode : [{ required: true, message: '单位代码不能为空', trigger: 'blur' }],
    		policeName : [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
    		substationName : [{ required: true, message: '上级单位不能为空', trigger: 'blur' }],
    		telephone : [{ required: true, message: '联系方式不能为空', trigger: 'blur' }]
    	},
    	formAddContentWidth:'120px', 
    	formAddContentLabelWidth:'110px', //formItem的标签宽度 --新增
    	addContentFormItemWidth:'420px',  //forItme的宽度--新增
    	addSaveLoading:false,  //按钮加载画面--新增
    	formCheckContentWidth:'120px', 
    	formCheckContentLabelWidth:'110px', //formItem的标签宽度 --查看
    	checkContentFormItemWidth:'420px',  //forItme的宽度--查看
    	checkSaveLoading:false,  //按钮加载画面--查看
    	formAmendContentWidth:'120px', 
    	formAmendContentLabelWidth:'110px', //formItem的标签宽度 --修改
    	amendContentFormItemWidth:'420px',  //forItme的宽度--修改
    	amendSaveLoading:false,  //按钮加载画面--修改
    	userData:null
    }
  },
  methods:{
  		getUsers(){
  			this.listLoading = true
  		let portParameter = this.$store.getters.getPortParameter;
  		let userData = this.$store.getters.getUserData;
 
  		let para = {
  				system : portParameter.system,
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				version : portParameter.version,
  				page: this.tablePage,
  				policeId: this.filters.policeId
  		};
  		getUnitInforTable(para).then((res) =>{
  			this.listLoading = false;
  			if(res.data && res.data.code == '1'){
  				
  				this.tableData = res.data.data
  				this.total = res.data.total;
  			}
  			
  				
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
		handleEdit(index,row){  //查看
			this.checkContent = true;
			let userData = this.$store.getters.getUserData;
			let para = {
				token : this.userData.get('token'),
	  		userId : this.userData.get('userId'),
			  id : row.id
			}
			getUnitInforTableCheck(para).then((res) =>{
				console.log(res)
				if(res.data && res.data.code =="1"){
					this.formCheckContent = Object.assign({},res.data.data)
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		handleAmend(index,row){ //修改
			this.amendContent = true;
			this.formAmendContentId = row.id;
//			let userData = this.$store.getters.getUserData;
			let para = {
				token : this.userData.get('token'),
	  		userId : this.userData.get('userId'),
			  id : row.id
			}
			getUnitInforTableCheck(para).then((res) =>{
				
				if(res.data && res.data.code =="1"){
					this.formAmendContent = Object.assign({},res.data.data)
				}
				
			}).catch((err) =>{
				console.log(err)
			})
		},
		addMessage(){ //新增
			this.addContent = true;
			this.addSaveLoading = false;
		},
		formAddContentClose(formAddContent){ //关闭Dialog清除记录--新增
			this.$refs[formAddContent].resetFields()
		},
		formCheckContentClose(formCheckContent){ //关闭Dialog清除记录--查看
			this.$refs[formCheckContent].resetFields()
		},
		formAmendContentClose(formAmendContent){ //关闭Dialog清除记录--修改
			this.$refs[formAmendContent].resetFields()
		},
		submitAddContent(formAddContent){ //保存--新增
			
			this.$confirm('确定要新增该信息吗？','提示',{
			
					type : 'warning'
					
				}).then((res) =>{
					
						this.$refs[formAddContent].validate((valid) =>{
							if(valid){
									this.addSaveLoading = true;
									let portParameter = this.$store.getters.getPortParameter;
//						  		let userData = this.$store.getters.getUserData;
						  		let para = {
						  				system : portParameter.system,
						  				token : this.userData.get('token'),
	  									userId : this.userData.get('userId'),
						  				version : portParameter.version,
						  				policeCode : this.formAddContent.policeCode,
						  				policeName : this.formAddContent.policeName,
						  				substationId : '1', //默认为杭州市公安局西湖分局
						  				telephone : this.formAddContent.telephone
						  		};
						  		
									console.log(para)
									getUnitInforTableAdd(para).then((res) =>{
											this.addSaveLoading = false;
											if(res.data && res.data.code =='1'){
												
												this.$message({
													message:'保存成功',
													type:'success'
												})
												this.$store.dispatch('getAjaxPoliceAllMessage');
												this.$refs[formAddContent].resetFields();
												this.addContent = false;
												this.getUsers()
												
												
											}else if(res.data.code == '0'){
												this.$message({
													message:res.data.msg,
													type:'error'
												})
												
											}
											
									}).catch((err) =>{
										console.log(err)
									})
									
							}else{
								return false;
							}
						});
						
			}).catch((err) =>{
						console.log(err)
				});
		},
		submitAmendContent(formAmendContent){ //保存--修改
			
			this.$confirm('确定要修改该账户吗？','提示',{
			
					type : 'warning'
					
				}).then((res) =>{
			
					this.$refs[formAmendContent].validate((valid) =>{
						if(valid){
							
								this.amendSaveLoading = true;
								
								let portParameter = this.$store.getters.getPortParameter;
//					  		let userData = this.$store.getters.getUserData;
					  		let para = {
					  				system : portParameter.system,
					  				token : this.userData.get('token'),
	  								userId : this.userData.get('userId'),
					  				version : portParameter.version,
					  				policeCode : this.formAmendContent.policeCode,
					  				policeName : this.formAmendContent.policeName,
					  				substationId : '1', //默认为杭州市公安局西湖分局
					  				telephone : this.formAmendContent.telephone,
					  				id : this.formAmendContentId
					  		};
								console.log(para)
								getUnitInforTableAmend(para).then((res) =>{
										this.amendSaveLoading = false;
										if(res.data && res.data.code =='1'){
											
											this.$message({
												message:'修改成功',
												type:'success'
											})
											this.$store.dispatch('getAjaxPoliceAllMessage');
											this.$refs[formAmendContent].resetFields();
											this.amendContent = false;
											this.getUsers()
											
											
										}else{
											this.$message({
												message:'修改失败，请重试！',
												type:'error'
											})
											
										}
										
								}).catch((err) =>{
									console.log(err)
								})
								
						}else{
							return false;
						}
						
					})
					
				}).catch((err) =>{
						console.log(err)
				});	
		},
		getUserData(){
			let data = JSON.parse(sessionStorage.getItem('userinfo'));
			let map = new Map(data);
			this.userData = map
			console.log(this.userData)
		}
		/****** methods over  **/
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

<template>
  <div class="user_acount">
  	
  	<!--顶部搜索-->
    <el-col :span="24" align="right" style="margin-top:10px">
 			<el-form  :inline="true" :model="filters" ref="filters" >
 				<!--输入关键字-->
 				<el-form-item label="用户名" >
	 				<el-input v-model="filters.name"></el-input>
	 			</el-form-item>
	 			
	 			<!--用户类型-->
	 			<el-form-item label="用户类型">
	 					
	 					<el-select v-model="filters.accountType" placeholder="请选择用户类型" >
 								<el-option label="所有类型" value="-1" ></el-option>
 								<el-option :label="item.name" :value="item.id" v-for="(item,index) in accountTypeList" :key="index"></el-option>
	 					</el-select>
	 					
	 			</el-form-item>
	 			
	 			<!--用户状态-->
	 			<!--<el-form-item label="账号状态" >
	 					<el-select v-model="filters.accountState" placeholder="请选择账号状态">
	 							<el-option label="全部" value="-1" ></el-option>
	 							<el-option label="正常" value="1"></el-option>
	 							<el-option label="删除" value="0"></el-option>
	 					</el-select>
	 			</el-form-item>-->
	 			
	 				<!--查询-->
	 			<el-form-item>
				 	<el-button size="small" @click="getUsers">查询</el-button>
  			</el-form-item>
  			<!--新增-->
  			<el-form-item>
			 		<el-button size="small" @click="addMessage">新增</el-button>
  			</el-form-item>
  			
 			</el-form>
 		</el-col>
 		
 		<!--表格-->
    	<template>
	 			<el-table :data="tableData" border stripe highlight-current-row style="width: 100%;" v-loading="listLoading">
		 				<el-table-column type="index"  label="序号" width="140" align="center"></el-table-column>
		 				<el-table-column prop="accountType" label="用户类型"  align="center"></el-table-column>
		 				<el-table-column prop="accountID" label="用户名" align="center"></el-table-column>
		 				<el-table-column prop="accountName" label="姓名" align="center"></el-table-column>
		 				<el-table-column prop="accountState" label="账号状态" align="center" :formatter="formatterState"></el-table-column>
		 				<el-table-column  label="操作" align="center" width="220">
		 					<template scope="scope">
		 						<el-button size="small" @click="handleEdit(scope.$index,scope.row)" v-if="userData.get('roleId') <= scope.row.roleId || userData.get('userId') == scope.row.id">查看</el-button>
		 						<el-button size="small" @click="handleAmend(scope.$index,scope.row)" v-if="userData.get('roleId') < scope.row.roleId">修改</el-button>
		 						<el-button size="small" @click="handleDelete(scope.$index,scope.row)" v-if="userData.get('roleId') < scope.row.roleId">{{scope.row.accountState == '1' ? '删除' : '取消删除'}}</el-button>
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
	    	<el-dialog title="网吧信息" :visible.sync="checkContent" class="cj_Dialog" @close="formCheckContentClose('formCheckContent')">
			 			<el-form :model="formCheckContent" label-width="formAddContentWidth" ref="formCheckContent">
			 				<!--用户名-->
			 				<el-form-item label="用户名：" label-width="110px" prop="accountID" :style="{width:addContentFormItemWidth}"> 
			 						<el-input type="text" v-model="formCheckContent.accountID" placeholder="请输入6~18位字符，只能包括英文字母、数字" disabled></el-input>
			 				</el-form-item>
			 				<!--密码-->
			 				<el-form-item  label="密码："  label-width="110px" prop="accountPassword" :style="{width:addContentFormItemWidth}"> 
			 						<el-input v-if="checkContentPassword" type="text" v-model="formCheckContent.accountPassword" placeholder="请输入6~18位字符" auto-complete="off" disabled></el-input>
			 						<el-input v-else type="password" v-model="formCheckContent.accountPassword" placeholder="请输入6~18位字符" auto-complete="off" disabled></el-input>
			 				</el-form-item>
			 				<!--确认密码-->
			 				<!--<el-form-item label="确认密码："  label-width="110px" prop="accountPasswordTwo" :style="{width:addContentFormItemWidth}">
			 						<el-input type="password" v-model="formCheckContent.accountPasswordTwo" placeholder="请再次输入密码" auto-complete="off"></el-input>
			 				</el-form-item>-->
			 				<!--用户类型-->
			 				<el-form-item label="用户类型：" label-width="110px" prop="roleId" :style="{width:addContentFormItemWidth}">
			 						<el-select  v-model="formCheckContent.roleId" placeholder="请选择用户类型" disabled>
			 							<el-option v-for="(item,index) in accountTypeDialog" :label="item.name" :value="item.id" :key="index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--所属派出所-->
			 				<el-form-item label="所属派出所：" label-width="110px" prop="policeId" :style="{width:addContentFormItemWidth}" v-if="checkContentPoliceIdLoading">
			 						<el-select v-model="formCheckContent.policeId" placeholder="请选择所属派出所" disabled>
			 							<el-option v-for="(item,index) in upDatePoliceId" :label="item.policeName" :value="item.policeId"  :key="index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--所属网吧-->
			 				<el-form-item label="所属网吧：" label-width="110px" prop="cybercafeId" :style="{width:addContentFormItemWidth}" v-if="checkContentCybercafeIdLoading">
			 						<el-select v-model="formCheckContent.cybercafeId" placeholder="请选择所属网吧" disabled>
			 							<el-option v-for="(item,index) in checkAccountCybercafeList" :label="item.cybercafeName" :value="item.cybercafeId" :key="item.index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--姓名-->
			 				<el-form-item label="姓名：" label-width="110px" prop="accountName" :style="{width:addContentFormItemWidth}">
			 						<el-input type="text" v-model="formCheckContent.accountName" placeholder="请输入用户真实姓名" disabled></el-input>
			 				</el-form-item>
			 				
			 				<!--保存-->
			 				<el-form-item style="text-align:center;" >
					    	<el-button type="primary" size="large" disabled>保存</el-button>
					    </el-form-item>
			 				
			 			</el-form>
			 </el-dialog>
			 
			 
			 
			 <!--新增-->
	    	<el-dialog title="账号信息" :visible.sync="addContent" class="cj_Dialog" @close="formAddContentClose('formAddContent')" :close-on-click-modal="false">
			 			<el-form :model="formAddContent" label-width="formAddContentWidth"	:rules="formAddContentRules" ref="formAddContent">
			 			
			 				<!--用户名-->
			 				<el-form-item label="用户名：" label-width="110px" prop="accountID" :style="{width:addContentFormItemWidth}"> 
			 						<el-input type="text" v-model="formAddContent.accountID" placeholder="请输入6~18位字符，只能包括英文字母、数字" ></el-input>
			 				</el-form-item>
			 				<!--密码-->
			 				<el-form-item  label="密码："  label-width="110px" prop="accountPassword" :style="{width:addContentFormItemWidth}"> 
			 						<el-input type="password" v-model="formAddContent.accountPassword" placeholder="请输入6~18位字符" auto-complete="off"></el-input>
			 				</el-form-item>
			 				<!--确认密码-->
			 				<el-form-item label="确认密码："  label-width="110px" prop="accountPasswordTwo" :style="{width:addContentFormItemWidth}">
			 						<el-input type="password" v-model="formAddContent.accountPasswordTwo" placeholder="请再次输入密码" auto-complete="off"></el-input>
			 				</el-form-item>
			 				<!--用户类型-->
			 				<el-form-item label="用户类型：" label-width="110px" prop="accountType" :style="{width:addContentFormItemWidth}">
			 						<el-select  v-model="formAddContent.accountType" placeholder="请选择用户类型" @change="formAddContentSelectAccountType(formAddContent.accountType)">
			 							<el-option v-for="(item,index) in addAccountTypeDialog" :label="item.name" :value="item.id" :key="index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--所属派出所-->
			 				<el-form-item label="所属派出所：" label-width="110px" prop="policeId" :style="{width:addContentFormItemWidth}" v-if="addContentPoliceIdLoading">
			 						<el-select v-model="formAddContent.policeId" placeholder="请选择所属派出所" @change="formAddContentSelect(formAddContent.policeId)">
			 							<el-option v-for="(item,index) in upDatePoliceId" :label="item.policeName" :value="item.policeId"  :key="index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--所属网吧-->
			 				<el-form-item label="所属网吧：" label-width="110px" prop="cybercafeId" :style="{width:addContentFormItemWidth}" v-if="addContentCybercafeIdLoading">
			 						<el-select v-model="formAddContent.cybercafeId" placeholder="请选择所属网吧">
			 							<el-option v-for="(item,index) in accountCybercafeList" :label="item.cybercafeName" :value="item.cybercafeId" :key="item.index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--姓名-->
			 				<el-form-item label="姓名：" label-width="110px" prop="accountName" :style="{width:addContentFormItemWidth}">
			 						<el-input type="text" v-model="formAddContent.accountName" placeholder="请输入用户真实姓名"></el-input>
			 				</el-form-item>
			 				
			 				<!--保存-->
			 				<el-form-item style="text-align:center;" >
					    	<el-button type="primary" size="large" @click="submitAddContent('formAddContent')" :loading="addSaveLoading">保存</el-button>
					    </el-form-item>
			 				
			 			</el-form>
			 </el-dialog>
			 
 			 <!--修改-->
	    	<el-dialog title="网吧信息" :visible.sync="amendContent" class="cj_Dialog" @close="formAmendContentClose('formAmendContent')" :close-on-click-modal="false" :lock-scroll="false">
			 			<el-form :model="formAmendContent" label-width="formAddContentWidth" ref="formAmendContent">
			 				<!--用户名-->
			 				<el-form-item label="用户名：" label-width="110px" prop="accountID" :style="{width:addContentFormItemWidth}"> 
			 						<el-input type="text" v-model="formAmendContent.accountID" placeholder="请输入6~18位字符，只能包括英文字母、数字" ></el-input>
			 				</el-form-item>
			 				<!--密码-->
			 				<el-form-item  label="密码："  label-width="110px" prop="accountPassword" :style="{width:addContentFormItemWidth}"> 
			 						<el-input type="text" v-model="formAmendContent.accountPassword" placeholder="请输入6~18位字符" auto-complete="off" ></el-input>
			 				</el-form-item>
			 				<!--确认密码-->
			 				<!--<el-form-item label="确认密码："  label-width="110px" prop="accountPasswordTwo" :style="{width:addContentFormItemWidth}">
			 						<el-input type="password" v-model="formAmendContent.accountPasswordTwo" placeholder="请再次输入密码" auto-complete="off"></el-input>
			 				</el-form-item>-->
			 				<!--用户类型-->
			 				<el-form-item label="用户类型：" label-width="110px" prop="roleId" :style="{width:addContentFormItemWidth}">
			 						<el-select  v-model="formAmendContent.roleId" placeholder="请选择用户类型" @change="formAmendContentSelectAccountType(formAmendContent.roleId)" disabled>
			 							<el-option v-for="(item,index) in accountTypeDialog" :label="item.name" :value="item.id" :key="index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--所属派出所-->
			 				<el-form-item label="所属派出所：" label-width="110px" prop="policeId" :style="{width:addContentFormItemWidth}" v-if="amendContentPoliceIdLoading">
			 						<el-select v-model="formAmendContent.policeId" placeholder="请选择所属派出所" @change="formAmendContentSelect(formAmendContent.policeId)" disabled>
			 							<el-option v-for="(item,index) in upDatePoliceId" :label="item.policeName" :value="item.policeId"  :key="index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--所属网吧-->
			 				<el-form-item label="所属网吧：" label-width="110px" prop="cybercafeId" :style="{width:addContentFormItemWidth}" v-if="amendContentCybercafeIdLoading">
			 						<el-select v-model="formAmendContent.cybercafeId" placeholder="请选择所属网吧" disabled>
			 							<el-option v-for="(item,index) in amendAccountCybercafeList" :label="item.cybercafeName" :value="item.cybercafeId" :key="item.index"></el-option>
			 						</el-select>
			 				</el-form-item>
			 				<!--姓名-->
			 				<el-form-item label="姓名：" label-width="110px" prop="accountName" :style="{width:addContentFormItemWidth}">
			 						<el-input type="text" v-model="formAmendContent.accountName" placeholder="请输入用户真实姓名" ></el-input>
			 				</el-form-item>
			 				
			 				<!--保存-->
			 				<el-form-item style="text-align:center;" >
					    	<el-button type="primary" size="large" @click="submitAmendContent('formAmendContent')" :loading="amendSaveLoading">保存</el-button>
					    </el-form-item>
			 				
			 			</el-form>
			 </el-dialog>
  </div>
</template>

<script>
	import axios from 'axios';
	import { getUserAcountTable , getUserAcountTableLogout , getUserAcountTableUnlogout , getUserAcountTableAdd , getUserAcountTableAmend , getUserAcountTableCheck , getCybercafeByPoliceId } from 'api';
	import { userAcountType , userAcountTypeDialog } from '@/common/config'
export default {
  name: 'user_acount',
  data () {
  	var validatePass2 = (rule, value, callback) => {
    	if(value === ''){
    		callback(new Error('请再次输入密码'));
    	}else if(value !== this.formAddContent.accountPassword){
    		callback(new Error('两次输入密码不一致'));
    	}else{
    		callback();
    	}
    };
    return {
      msg: 'Welcome to Your Vue.js App',
      filters:{
      	name :'',
      	accountState:'1',
      	accountType:''
      },
      formAmendContent:{ //修改Dialog
      	accountID: null,
      	accountPassword:null,
      	roleId: null,
      	substationId: '1', //分局默认为1
      	policeId:null, //派出所
      	cybercafeId:null, //网吧
      	accountName:null
      },
      formAmendContentId:null,
      formCheckContent:{ //查看Dialog
      	accountID: null,
      	accountPassword:null,
      	roleId: null,
      	substationId: '1', //分局默认为1
      	policeId:null, //派出所
      	cybercafeId:null, //网吧
      	accountName:null
      },
      formAddContent:{ //新增Dialog
      	accountID: null,
      	accountPassword:null,
      	accountPasswordTwo: null,
      	accountType: null,
      	substationId: '1', //分局默认为1
      	policeId:null, //派出所
      	cybercafeId:null, //网吧
      	accountName:null
      },
      formAddContentRules:{ //新增正则表达
      	accountID : [{ required: true, message: '用户名不能为空', trigger: 'blur' }, {min: 6, max: 18, message: '请输入6~18位字符，只能包括英文字母、数字', trigger: 'blur'}],
      	accountPassword : [{ required: true, message: '密码不能为空', trigger: 'blur' },{min: 6, max: 18, message: '请输入6~18位字符', trigger: 'blur'}],
      	accountPasswordTwo : [{ validator: validatePass2, trigger: 'blur' },{ required: true, message: '密码不能为空', trigger: 'blur' }],
      	accountType : [{ required: true, message: '请选择用户类型', trigger: 'change' }],
      	policeId : [{ required: true, message: '请选择所属派出所', trigger: 'change' }],
      	cybercafeId : [{ required: true, message: '请选择所属网吧', trigger: 'change' }],
      	accountName : [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
      	
      },
      addContentPoliceIdLoading:false,  		//新增派出所选项显示
      addContentCybercafeIdLoading:false,  	//新增网吧选项显示
      checkContentPoliceIdLoading:false, 		//查看派出所选项显示
      checkContentCybercafeIdLoading:false, //查看网吧选项显示
      amendContentPoliceIdLoading:false, 		//修改派出所选项显示
      amendContentCybercafeIdLoading:false, //修改网吧选项显示
      addContentFormItemWidth:'420px',
      accountTypeDialog:[],  //弹窗中的用户类型列表
      addAccountTypeDialog:[],  //弹窗中的用户类型--新增
      accountCybercafeList:[],  //新增弹窗中的网吧列表
      checkAccountCybercafeList:[], //查看弹窗中的通过policeId获取的网吧列表
      amendAccountCybercafeList:[], //修改弹窗中的通过policeId获取的网吧列表
      formAddContentWidth:'120px',
      accountTypeList : [],  //所有用户类型
      policeIdLists:[],//所有派出所列表
      tablePage:1,  //当前页码
      tableData:[], //表格数据
      listLoading: false, //加载状态
      total:0,  //分页的总记录数
      checkContent:false, //查看Dialog
      amendContent:false, //修改Dialog
      addContent:false, //增加Dialog
      addSaveLoading:false, //新增保存按钮loading
      amendSaveLoading:false, //修改保存按钮loading
      userData:null,
      checkContentPassword:true
    }
  },
  methods:{
  	getUsers(){
  		
  		this.listLoading = true;
  		let portParameter = this.$store.getters.getPortParameter;
  		let userData = this.$store.getters.getUserData;
  		let para = {
  				system : portParameter.system,
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				version : portParameter.version,
  				page: this.tablePage,
  				accountType: this.filters.accountType,
  				accountName: this.filters.name,
  				accountState: this.filters.accountState
  		};
  		
  		getUserAcountTable(para).then((res) =>{
  				this.listLoading = false;
    										console.log(res)
  				if(res.data.code == '1'&& res.data.data ){
  					
  					this.tableData = res.data.data;
	  				this.total = res.data.total;

  				}else if(res.data.code == '0'){
  					
//					this.$router.push({path:'/login'})
  				}
  				
  		})
  		.catch((err) =>{
  			console.log(err)
  		})
  		
  	},
  	typestring(num){
  		return num.toString();
  	},
		judgeAccountType(){ //判断用户类型
			//通过判断用户类型返回不同的权限选择
			//如果id为1怎返回分局管理员，id为2返回派出所管理员。id为3返回网吧管理员
			
			let arr = JSON.parse(sessionStorage.getItem('userinfo'))
			let map = new Map(arr);
			let type = map.get('roleId')
		
			let AccountTypeList = [];
			
			
			if(type && type == '1'){  //为超级管理员时候
					for(let value of userAcountTypeDialog){
						let typeNum = parseInt(type)
						let idNum = parseInt(value.id)
						if(idNum >= typeNum ){
							AccountTypeList.push(value)
						}
					}
					
					
			}else if(type && type == '2'){ //为分局管理员时候
					for(let value of userAcountTypeDialog){
						let typeNum = parseInt(type)
						let idNum = parseInt(value.id)
						if(idNum >= typeNum ){
							AccountTypeList.push(value)
						}
					}
			}else if(type && type == '3'){  //为派出所管理员时候
					for(let value of userAcountTypeDialog){
						let typeNum = parseInt(type)
						let idNum = parseInt(value.id)
						if(idNum >= typeNum ){
							AccountTypeList.push(value)
						}
					}
			}
			
			
			let AccountTypeListAdd = [];
			if(type && type == '1'){  //为超级管理员时候
					for(let value of userAcountTypeDialog){
						let typeNum = parseInt(type)
						let idNum = parseInt(value.id)
						if(idNum >= typeNum+1 ){
							AccountTypeListAdd.push(value)
						}
					}
					
					
			}else if(type && type == '2'){ //为分局管理员时候
					for(let value of userAcountTypeDialog){
						let typeNum = parseInt(type)
						let idNum = parseInt(value.id)
						if(idNum >= typeNum+1 ){
							AccountTypeListAdd.push(value)
						}
					}
			}else if(type && type == '3'){  //为派出所管理员时候
					for(let value of userAcountTypeDialog){
						let typeNum = parseInt(type)
						let idNum = parseInt(value.id)
						if(idNum >= typeNum+1 ){
							AccountTypeListAdd.push(value)
						}
					}
			}
			
			
			this.addAccountTypeDialog = AccountTypeListAdd;
			this.accountTypeDialog = AccountTypeList;
			
		},
		submitAddContent(formAddContent){  //Dialog确定保存--新增
			
			
			console.log(this.formAddContent)
			this.$refs[formAddContent].validate((valid) => {
					if(valid){
						this.addSaveLoading = true;
						let portParameter = this.$store.getters.getPortParameter;
//			  		let userData = this.$store.getters.getUserData;
			  		let para = {
			  				system : portParameter.system,
			  				token : this.userData.get('token'),
	  						userId : this.userData.get('userId'),
			  				version : portParameter.version,
			  				accountID : this.formAddContent.accountID,
			  				accountPassword : this.formAddContent.accountPassword,
			  				accountType : this.formAddContent.accountType,
			  				substationId : '1', //分局只有一个默认为1
			  				policeId : this.formAddContent.policeId,
			  				cybercafeId : this.formAddContent.cybercafeId,
			  				accountName : this.formAddContent.accountName
			  		};
			  		
			  		getUserAcountTableAdd(para).then((res) =>{
			  			
			  			this.addSaveLoading = false;
			  			if(res.data && res.data.code == '1'){
			  					this.$message({
			  						message: '新增成功',
			  						type: 'success'
			  					});
			  					this.$refs[formAddContent].resetFields();  //这是清空表单里面的数据
			  					this.addContent = false;
			  					this.getUsers();
			  			}else if(res.data.code=='0'){
			  				
			  				this.$message({
			  					message: res.data.msg,
			  					type: 'error'
			  				})
			  			}
			  			
			  		}).catch((err) =>{
			  			console.log(err)
			  		})
						
					}else{
						
						return false
					}
			})
			
			
		},
		submitAmendContent(formAmendContent){  //Dialog确定保存--修改
			
			
		
			this.$refs[formAmendContent].validate((valid) => {
					if(valid){
						this.amendSaveLoading = true;
						let portParameter = this.$store.getters.getPortParameter;
//			  		let userData = this.$store.getters.getUserData;
			  		let para = {
			  				system : portParameter.system,
			  				token : this.userData.get('token'),
	  						userId : this.userData.get('userId'),
			  				version : portParameter.version,
			  				accountID : this.formAmendContent.accountID,
			  				accountPassword : this.formAmendContent.accountPassword,
			  				roleId : this.formAmendContent.roleId,
			  				substationId : '1', //分局只有一个默认为1
			  				policeId : this.formAmendContent.policeId,
			  				cybercafeId : this.formAmendContent.cybercafeId,
			  				accountName : this.formAmendContent.accountName,
			  				id:this.formAmendContentId
			  		};
			  		console.log(para)
			  		getUserAcountTableAmend(para).then((res) =>{
			  			
			  			this.amendSaveLoading = false;
			  			if(res.data && res.data.code == '1'){
			  					this.$message({
			  						message: '修改成功',
			  						type: 'success'
			  					});
			  					this.$refs[formAmendContent].resetFields();  //这是清空表单里面的数据
			  					this.amendContent = false;
			  					this.getUsers();
			  					
			  					
			  			}else if(res.data.code=='0'){
			  				
			  				this.$message({
			  					message: res.data.msg,
			  					type: 'error'
			  				})
			  			}
			  			
			  		}).catch((err) =>{
			  			console.log(err)
			  		})
						
					}else{
						
						return false
					}
			})
			
			
		},
		formAddContentSelectAccountType(accountType){  //通过获取所属用户类型进行下拉框显示--新增
 			if(accountType == '2'){ //设置分局
 				
 				return 
 				
 			}else if(accountType == '3'){ //设置派出所
 				this.addContentPoliceIdLoading = true;
      	return 
 				
 			}else if(accountType == '4'){ //设置网吧管理
 				this.addContentPoliceIdLoading = true;
//    	this.addContentCybercafeIdLoading = true;
      	return 
 			}
 			
		},
		formCheckContentSelectAccountType(accountType){  //通过获取所属用户类型进行下拉框显示--查看
 			if(accountType == '2'){ //设置分局
 				
 				this.checkContentPoliceIdLoading = false;
 				this.checkContentCybercafeIdLoading = false;
 				return 
 				
 			}else if(accountType == '3'){ //设置派出所
 				
 				this.checkContentPoliceIdLoading = true;
 				this.checkContentCybercafeIdLoading = false;
      	return 
 				
 			}else if(accountType == '4'){ //设置网吧管理
 				this.checkContentPoliceIdLoading = true;
 				this.checkContentCybercafeIdLoading = true;
      	return 
 			}
 			
		},
		formAmendContentSelectAccountType(accountType){  //通过获取所属用户类型进行下拉框显示--修改
//			alert('修改了')
 			if(accountType == '2'){ //设置分局
 				
 				this.amendContentPoliceIdLoading = false;
 				this.amendContentCybercafeIdLoading = false;
// 				this.formAmendContent.policeId = ''
// 				this.formAmendContent.cybercafeId = ''
 				return 
 				
 			}else if(accountType == '3'){ //设置派出所
 				
 				this.amendContentPoliceIdLoading = true;
 				this.amendContentCybercafeIdLoading = false;
// 				this.formAmendContent.policeId = ''
// 				this.formAmendContent.cybercafeId = ''
      	return 
 				
 			}else if(accountType == '4'){ //设置网吧管理
 				this.amendContentPoliceIdLoading = true;
 				this.amendContentCybercafeIdLoading = true;
// 				this.formAmendContent.policeId = ''
// 				this.formAmendContent.cybercafeId = ''
      	return 
 			}
 			
		},
		formAmendContentSelectAccountTypeInit(accountType){  //通过获取所属用户类型进行下拉框显示--修改
			
 			if(accountType == '2'){ //设置分局
 				
 				this.amendContentPoliceIdLoading = false;
 				this.amendContentCybercafeIdLoading = false;
 				
 				return 
 				
 			}else if(accountType == '3'){ //设置派出所
 				
 				this.amendContentPoliceIdLoading = true;
 				this.amendContentCybercafeIdLoading = false;
 				
      	return 
 				
 			}else if(accountType == '4'){ //设置网吧管理
 				this.amendContentPoliceIdLoading = true;
 				this.amendContentCybercafeIdLoading = true;
 				
      	return 
 			}
 			
		},
		formAddContentSelect(policeId){  //所属派出所下拉获取对应网吧--新增
		
//		let userData = this.$store.getters.getUserData;
			if(this.formAddContent.accountType == '4'){ //如果当前选择的是网吧专管员则显示否则不显示
				this.addContentCybercafeIdLoading = true;
					
			}else{
				this.addContentCybercafeIdLoading = false;
			}
			

  		let para = {
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				policeId : policeId
  		};
  		
			getCybercafeByPoliceId(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
					
					
					let box = res.data.data; 
					for(let value of box){
						value.cybercafeId = (value.cybercafeId).toString();
					}
					
					this.accountCybercafeList = box ; 
					
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		formCheckContentSelect(policeId){  //所属派出所下拉获取对应网吧--查看
			
//		let userData = this.$store.getters.getUserData;
  		let para = {
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				policeId : policeId
  		};
  		
			getCybercafeByPoliceId(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
//					this.addContentCybercafeIdLoading = true;
					
					let box = res.data.data; 
					for(let value of box){
						value.cybercafeId = (value.cybercafeId).toString();
					}
					
					this.checkAccountCybercafeList = box ; 
					
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		formAmendContentSelect(policeId){  //所属派出所下拉获取对应网吧--修改
//			alert('修改了12')
//		let userData = this.$store.getters.getUserData;
  		let para = {
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				policeId : policeId
  		};
  		
			getCybercafeByPoliceId(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
//					this.amendContentCybercafeIdLoading = true;
					
					let box = res.data.data; 
					for(let value of box){
						value.cybercafeId = (value.cybercafeId).toString();
					}
					console.log('网吧列表')
					console.log(box)
					this.amendAccountCybercafeList = box ; 
					
//					this.formAmendContent.cybercafeId = ''
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		formAddContentClose(formAddContent){ //新增Dialog关闭清除所有数据
			this.addContentPoliceIdLoading = false;
      	this.addContentCybercafeIdLoading = false;
			this.$refs[formAddContent].resetFields();
		},
		formCheckContentClose(formCheckContent){ //查看Dialog关闭清除所有数据
			this.$refs[formCheckContent].resetFields();
		},
		formAmendContentClose(formAmendContent){ //修改Dialog关闭清楚所有数据
  		this.$refs[formAmendContent].resetFields();
  	},
  	formatterState:function(row , column ){
  			return row.accountState == '0' ? '删除' : row.accountState == '1' ? '正常' : '未知' 
  	},
  	
  	handleSizeChange(val){
  		console.log(`每页 ${val} 条`);
  		
  	},
  	handleCurrentChange(val){
//		console.log(`当前页码${val}`)
  		this.tablePage = val;
			this.getUsers();
		},
		handleEdit(index,row){  //查看
			
			//如果是同级但是不是同一个账号则隐藏密码
			if(this.userData.get('roleId') == row.roleId && this.userData.get('userId') !== row.id){
					this.checkContentPassword = false
			}else{
				this.checkContentPassword = true
			}
			
			this.checkContent = true;              
//			let userData = this.$store.getters.getUserData;
  		let para = {
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				id : row. id
  		};
			
			getUserAcountTableCheck(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
						let data = res.data.data
	
											data.roleId = (data.roleId).toString();
											data.policeId = (data.policeId).toString();
											data.cybercafeId = (data.cybercafeId).toString();
											
											this.formCheckContentSelectAccountType(data.roleId);
											
											if(data.cybercafeId > 0){
												this.formCheckContentSelect(data.policeId);
											}
								
							this.formCheckContent = Object.assign({},data)
							console.log(this.formCheckContent)
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
			
		},
		handleAmend(index,row){ //修改
			
			this.formAmendContentId = row.id
			this.amendContent = true;
			
//			let userData = this.$store.getters.getUserData;
  		let para = {
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				id : row. id
  		};
			
			getUserAcountTableCheck(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
						let data = res.data.data
	
								data.roleId = (data.roleId).toString();
								data.policeId = (data.policeId).toString();
								data.cybercafeId = (data.cybercafeId).toString();
								
								this.formAmendContentSelectAccountTypeInit(data.roleId);
								
								if(data.cybercafeId > 0){
									
									this.formAmendContentSelect(data.policeId);
									
								}else{
									this.amendContentCybercafeIdLoading = false;
								}
								
							this.formAmendContent = Object.assign({},data)
							console.log(this.formCheckContent)
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		handleDelete(index,row){ //删除
			
			if(row.accountState == '1'){
		
				this.$confirm('确定要删除该账户吗？','提示',{
			
					type : 'warning'
					
				}).then((res) =>{
						let portParameter = this.$store.getters.getPortParameter;
//			  		let userData = this.$store.getters.getUserData;
			  		
			  		let para = {
			  				system : portParameter.system,
			  				token : this.userData.get('token'),
	  						userId : this.userData.get('userId'),
			  				version : portParameter.version,
			  				id: row.id,
			  		};
						
						getUserAcountTableLogout(para).then((res) =>{
								console.log(res)
								if(res.data.code == '1'){
										this.$message({
											message: '删除成功',
											type: 'success'
										})
									this.getUsers();
								}else{
									this.$message({
											message: '删除失败，请重试！',
											type: 'error'
										})
								}
								
							}).catch((err) =>{
								console.log(err)
							})	
						
				}).catch((err) =>{
						console.log(err)
				});
					
			}else if(row.accountState == '0'){
				
					this.$confirm('确定要恢复该账户吗？','提示',{
						
						type : 'warning'
						
					}).then((res) =>{
							let portParameter = this.$store.getters.getPortParameter;
//				  		let userData = this.$store.getters.getUserData;
				  		
				  		let para = {
				  				system : portParameter.system,
				  				token : this.userData.get('token'),
	  							userId : this.userData.get('userId'),
				  				version : portParameter.version,
				  				id: row.id,
				  		};
							
							getUserAcountTableUnlogout(para).then((res) =>{
									console.log(res)
									if(res.data.code == '1'){
											this.$message({
												message: '取消删除成功',
												type: 'success'
											})
										this.getUsers();
									}else{
										this.$message({
												message: '取消删除失败，请重试！',
												type: 'error'
											})
									}
									
								}).catch((err) =>{
									console.log(err)
								})	
							
					}).catch((err) =>{
							console.log(err)
					});
			}
		},
		addMessage(){
  		this.addContent = true
  	},
  	_initUserType(){ //通过policeID设置文件
//		this.accountTypeList = userAcountType
  			let data = JSON.parse(sessionStorage.getItem('userinfo'));
				let map = new Map(data);
				let policeId = map.get('roleId')
				if(policeId){
					if(policeId == '1' || policeId == '2'){
		  				
		  				this.accountTypeList = userAcountType
		  				
				  		return 
		  		}else if(policeId && policeId == '3'){ //派出所
		  				
		  				let newBox = [];
		  				for(let value of userAcountType){
		  					if(value.id >= policeId){
		  						
		  						newBox.push(value);
		  						this.filters.accountType == policeId
		  					}
		  				}
		  				
		  				this.accountTypeList = newBox
		  				return 
		  			}
				}
				
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
//	this.accountTypeList = userAcountType
  	this._initUserType();
  	this.getUsers();
  	this.judgeAccountType()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.cj_Dialog .el-dialog--small{
		width:600px;
	}
</style>

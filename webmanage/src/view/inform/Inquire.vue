<template>
 <div class="inquire">
 		<el-col :span="24" class="header" style="margin-top:10px;" align="right">
 			<el-form  :inline="true" :model="filters" class="header_form" ref="filters">
 				<!--输入关键字-->
 				<el-form-item label="关键字" class="label_color">
	 				<el-input v-model="filters.name" class="label_input"></el-input>
	 			</el-form-item>
	 				<!--日期选择-->
	 			<el-form-item>
	 				<div class="block">
					    <span class="demonstration">时间：</span>
					    <el-date-picker
					      v-model="filters.dateTime"
					      type="daterange"
					      align="right"
					      placeholder="选择日期范围">
					    </el-date-picker>
				  </div>
	 			</el-form-item>
	 				<!--查询-->
	 			<el-form-item>
				 	<el-button  @click="getUsers">查询</el-button>
	  			</el-form-item>
	  			<!--新增-->
	  			<el-form-item>
				 		<el-button @click="addMessage">新增</el-button>
	  			</el-form-item>
  			
 			</el-form>
 		</el-col>
 		
 		<!--表格-->
 		<template>
 			<el-table :data="tableData" border stripe highlight-current-row style="width: 100%;" v-loading="listLoading">
 				<el-table-column type="index"  label="序号" width="140" align="center"></el-table-column>
 				<el-table-column prop="type" label="类型"  align="center"></el-table-column>
 				<el-table-column prop="title" label="标题" align="center"></el-table-column>
 				<el-table-column prop="dateTime" label="发布时间" align="center" :formatter="formatterTableDateTime"></el-table-column>
 				<el-table-column prop="name" label="发布人" align="center" ></el-table-column>
 				<el-table-column  label="操作" align="center" width="220">
 					<template scope="scope">
 						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">查看</el-button>
 						<el-button size="small" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
 					</template>
 				</el-table-column>
 			</el-table>
 		</template>
 		 <!--:page-sizes="[10, 20, 30, 40,50]"  :current-page="1" -->
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
		 
		<!-- 新增界面-->
		<el-dialog title="通知" class="cj_InformInquireDialog" :visible.sync="dialogFormVisible" @close="formDialogClose('formDialog')" :close-on-click-modal="false">
		  	<el-form :model="formDialog" label-width="formLabelWidth" :rules="formDialogRules" ref="formDialog">
			    <!--<el-form-item label="通知" :label-width="formLabelWidth">
			      <el-input v-model="formDialog.name" auto-complete="off"></el-input>
			    </el-form-item>-->
			    <el-form-item label="通知类型" label-width="80px" prop="type">
			      <el-select v-model="formDialog.type" placeholder="请选择通知类型">
			        <el-option label="协查" value="0"></el-option>
			        <el-option label="通知" value="1"></el-option>
			      </el-select>
			    </el-form-item>
			    
			    <el-form-item label="标题" label-width="80px" prop="title" style="width:420px">
			    	<el-input type="text" size="small" v-model="formDialog.title" placeholder="请输入标题"></el-input>
			    </el-form-item>
			    
			    <el-form-item label="内容" label-width="80px" prop="content" style="width:600px" >
			    	<el-input type="textarea" :autosize="{ minRows: 8, maxRows: 100}" v-model="formDialog.content" placeholder="请输入内容"></el-input>
			    </el-form-item>
			    
			    <el-form-item style="text-align:center;" >
			    	<el-button type="primary" @click="submitSend('formDialog')" :loading="sendLoading">确定发送</el-button>
			    </el-form-item>
			    
			</el-form>
		</el-dialog>
		
		<!--查看界面-->
		<el-dialog title="通知" :visible.sync="checkFromVisble">
			<el-form :model="checkFrom" ref="checkFrom" >
				
				<el-form-item label="通知类型" label-width="80px" >
					<!--<el-select v-model="checkFrom.type">
						<el-option label="协查" value="0">协查</el-option>
						<el-option lable="通知" value="1">通知</el-option>
					</el-select>-->
					<el-select v-model="checkFrom.type" placeholder="请选择通知类型" disabled>
				        <el-option label="协查" value="0"></el-option>
				        <el-option label="通知" value="1"></el-option>
			      	</el-select>
			      	
				</el-form-item>
				
				<el-form-item label="标题" label-width="80px" style="width:420px">
					<el-input type="input" v-model="checkFrom.title" disabled></el-input>
				</el-form-item>
				
				<el-form-item label="内容" label-width="80px" style="width:600px">
					<el-input type="textarea" :autosize="{ minRows: 8, maxRows: 100}" v-model="checkFrom.content" disabled></el-input>
				</el-form-item>
				
				<el-form-item style="text-align:center;">
					<el-button type="primary" disabled>确定发送</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		
 		
 </div>
</template>

<script>
		

import { getInformInquireTable , getInformInquireTableAdd , getInformInquireTableDelete , getInformStatisticsTable , getInquireStatisticsUnsign } from 'api'
//import axios from 'axios'

export default {
  name: 'inquire',
  data () {
    return {
      msg:'Welcome to Your Vue.js App',
      userName:'管理员名字', //当前管理员名字
      pageParameter:'500',
      total:0, //总数据
      page:1,
      listLoading:false,
      dialogFormVisible:false, //是否显示dialog
      checkFromVisble:false, //显示查看dialog
      formLabelWidth:'120px',  //dialog的宽度
      formDialog:{ //新增的dialog数据
    	title:'',
    	content:'',
    	type:''
      },
      checkFrom:{ //点击查看数据
      	title:'',
      	text:'',
      	type:0
      },
      formDialogRules:{ //新增的dialog的rules规则
/** 	el-form的验证规则 
		1.在form里面设置：rules属性！
 		2.在需要的验证的form-item里面设置prop属性对应的属性值必须是值的同一个变量名！
		3 设置对象！属性是对应的数据值！ type必须和formDialog的type一样！
		**/
      	type:[
      		{ required : true , message: '请选择一个通知类型', trigger: 'change'}
      	],
      	title:[
      		{ required : true , message : '请填写标题' , trigger : 'blur'}
      	],
      	content:[
      		{ required : true , message : '请填写内容',trigger : 'blur'}
      	]
      	
      },
      filters: {
          name: '',
          dateTime: []
       }, //关键字搜索
       tableData:[], //表格数据
       userData:null,
       sendLoading:false
        
    }
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
  	submitSend(formDialog){ //新增界面确定发送
  		
		console.log(this.formDialog)
  		//这里的formDialog是传过来的参数!这里this.$refs[formDialog]也可以用对象的属性使用
  		this.$refs[formDialog].validate((valid) => {
  					
			if(valid){
				this.sendLoading = true;
				//vaild 是表示输入内容是否有效！匹配正则表达式！
				let portParameter = this.$store.getters.getPortParameter;
  				let userData = this.$store.getters.getUserData;
				let para = {
	  				system : portParameter.system,
	  				token : this.userData.get('token'),
  					userId : this.userData.get('userId'),
	  				version : portParameter.version,
	  				title: this.formDialog.title,
	  				content: this.formDialog.content,
	  				type: this.formDialog.type
  				};
				getInformInquireTableAdd(para).then((res) =>{
					this.sendLoading = false;
					console.log(res)
					if( res.data.code == '1'){
						
						this.$message({
							message : '新增成功',
							type: 'success'
						});
						this.$refs[formDialog].resetFields();  //这是清空表单里面的数据
						this.dialogFormVisible = false;	
						this.getUsers()
					}else{
						
						this.$message({
							message: '新增失败,请重试!',
							type: 'error'
						})
					}
					
							
				})
				.catch((err) =>{
					console.log(err)
				})
				
				
			}else{
				alert('提交失败')
				return false;
			}
  		})
  	},
  	discrenType(row,column){ //通过返回的0或1识别是协查还是通知
  		//通过绑定formatter 可以格式化展现的数据
  		let num = parseInt(row.type);
  		if(num == 0){
  			return '协查'
  		}else if(num == 1){
  			return '通知'
  		}
  	},
  	
  	addMessage(){ //新增
  		this.dialogFormVisible = true;
  		
  		
  	},
  	getNowDate(){ //获取当前时间
  		
  		let nowDate = new Date();
  		let y = nowDate.getFullYear();
  		let m = nowDate.getMonth()+1;
  		let d = nowDate.getDate();
  		let h = nowDate.getHours();
  		let minute = nowDate.getMinutes();
  		let s = nowDate.getSeconds();
  		
  		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
  		
  	},
  	handleSizeChange(val){
  		console.log(`每页 ${val} 条`);
  		
  	},
  	handleCurrentChange(val){
  		console.log(`当前页码${val}`)
  		this.page = val;
  		this.getUsers()
	},
  	getUsers() {
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
  				page: this.page,
				keyword: this.filters.name,
				endDateTime: dateTimeList[1],
  				startDateTime: dateTimeList[0]
  		};
  		
  		this.listLoading = true;
		
		
		getInformInquireTable(para).then((res) => {
			console.log(res.data)
			this.tableData = res.data.data
			this.total = res.data.total ; 
			this.listLoading = false;
		})
		.catch((error) => {
			console.log(error)
		})
		
	},
	formatDateTime(ArrayDate){ //格式化日期
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
	
	handleEdit(index,row){ //查看
		console.log('index',index,'row',row)
		this.checkFromVisble = true;
		this.checkFrom = Object.assign({},row)
//		if(this.checkFrom.type == 0){
//			this.checkFrom.type = "协查"
//		}else if(this.checkFrom.type == 1){
//			this.checkFrom.type = "通知"
//		}
		
	},
	handleDelete(index,row){ //删除
		
		this.$confirm('确定要删除该通告吗？','提示',{
			
			type : 'warning'
			
		}).then((res) =>{
			let portParameter = this.$store.getters.getPortParameter;
//			let userData = this.$store.getters.getUserData;
  		
			let para = { 
				id : row.id ,
				system : portParameter.system,
				version : portParameter.version,
				token : this.userData.get('token'),
  				userId : this.userData.get('userId')
			};
			getInformInquireTableDelete(para).then((res) =>{
				if(res.data.code == '1'){
					this.$message({
						message : '删除成功',
						type : 'success'
					});
					this.getUsers()
				}else{
					this.$message({
						message : '删除失败,请重新操作!',
						type : 'error'
					});
				}
				
				
			}).catch((err) =>{
				console.log(err)
			})
			
		}).catch((err) =>{
			
		})
		
	},
	formDialogClose(formDialog){ //关闭新增的dialog的时候清空数据
		this.$refs[formDialog].resetFields();
	},
	getUserData(){
		let data = JSON.parse(sessionStorage.getItem('userinfo'));
		let map = new Map(data);
		this.userData = map 
		console.log(this.userData.get('token'))
	}
  	
  },
  mounted(){
  	this.getUserData();
	this.getUsers();
	
//	this.geta();
//	this.getAjaxTableList();
  	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
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


/*.inquire{
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
.cj_InformInquireDialog .el-dialog--small{
		width:650px;
	}
</style>

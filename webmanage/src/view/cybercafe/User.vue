<template>
  <div class="cybercafe_user">
    	<el-col :span="24" align="right" style="margin-top:10px;">
    			<el-form :model="filters" :inline="true">
    					<!--姓名-->
    					<el-form-item label="姓名">
    							<el-input v-model="filters.name"></el-input>
    					</el-form-item>
    					
    					<!--网吧名-->
    					<el-form-item label="网吧名">
    							<el-input v-model="filters.cybercafeName"></el-input>
    					</el-form-item>
    					<!--派出所-->
    					<el-form-item label="派出所">
    							<el-select v-model="filters.policeId">
    									<el-option label="所有派出所" value="0" v-if="userData && userData.get('policeId') == '1' "></el-option>
    									<el-option v-for="(item,index) in upDatePoliceId" :value="item.policeId" :label="item.policeName" :key="index" ></el-option>
    							</el-select>
    					</el-form-item>
    					<!--查询-->
    					<el-form-item>
									<el-button @click="getUsers">查询</el-button>    						
    					</el-form-item>
    					<!--新增-->
    					<!--<el-form-item>
    							<el-button @click="addMessage">新增</el-button>
    					</el-form-item>-->
    			</el-form>
    	</el-col>
    	
    	<!--表格-->
    	<template>
	 			<el-table :data="tableData" border stripe highlight-current-row style="width: 100%;" v-loading="listLoading">
		 				<el-table-column type="index"  label="序号" width="140" align="center"></el-table-column>
		 				<el-table-column prop="cybercafeUserName" label="姓名"  align="center"></el-table-column>
		 				<el-table-column prop="cybercafePosition" label="岗位" align="center"></el-table-column>
		 				<el-table-column prop="cybercafeName" label="所属网吧" align="center"></el-table-column>
		 				<el-table-column prop="policeName" label="所属派出所" align="center" ></el-table-column>
		 				<el-table-column prop="cybercafeUserTelephone" label="联系方式" align="center" ></el-table-column>
		 				<el-table-column  label="操作" align="center" width="220">
		 					<template scope="scope">
		 						<el-button size="small" @click="handleEdit(scope.$index,scope.row)">查看</el-button>
		 						<el-button size="small" @click="handleAmend(scope.$index,scope.row)">修改</el-button>
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
			 
			 
			 <!--新增-->
	    	<el-dialog title="新增" :visible.sync="addContent" class="cybercafe_infor_Dialog" @close="formAddContentClose('formAddContent')">
			 			<el-form :model="formAddContent" label-width="formAddContentWidth"	:rules="formAddContentRules" ref="formAddContent" :inline="true">
		 				<!--姓名-->
		 				<el-form-item label="姓名：" label-width="120px" prop="cybercafeUserName" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.cybercafeUserName"></el-input>
		 				</el-form-item>
		 				<!--身份证号-->
		 				<el-form-item label="身份证号：" label-width="120px"  prop="identityCard" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.identityCard"></el-input>
		 				</el-form-item>
		 				<!--联系电话-->
		 				<el-form-item label="联系电话：" label-width="120px" prop="cybercafeUserTelephone" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.cybercafeUserTelephone"></el-input>
		 				</el-form-item>
		 				<!--户籍所在地-->
		 				<el-form-item label="户籍所在地：" label-width="120px"  :style="{width:'100%'}">
		 					 <el-cascader
					      size="large"
					      :options="options"
					      v-model="selectedOptions"
					      @change="handleChange">
					    </el-cascader style="height:50px;">
					    <el-input type="text" size="small" v-model="formAddContent.address" style="width:265px;margin-left:20px;" placeholder="详细地址"></el-input>
		 				</el-form-item>
		 				<!--暂住地-->
		 				<el-form-item label="暂住地：" label-width="120px"  :style="{width:'100%'}">
		 					<el-cascader
					      size="large"
					      :options="options"
					      v-model="selectedOptions2"
					      @change="handleChange2">
					    </el-cascader>
					    <el-input type="text" size="small" v-model="formAddContent.liveaddress" style="width:265px;margin-left:20px;" placeholder="详细地址"></el-input>
		 				</el-form-item>
		 				<!--所属派出所-->
		 				<el-form-item label="所属派出所：" label-width="120px" prop="policeId"  :style="{width:addContentFormItemWidth}">
		 					<el-select v-model="formAddContent.policeId" size="small" style="width:165px" placeholder="请选择所属派出所" @change="formAddContentSelect(formAddContent.policeId)">
		 						<el-option v-for="(item,index) in upDatePoliceId" :label="item.policeName" :value="item.policeId" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--所属网吧-->
		 				<el-form-item label="所属网吧：" label-width="120px"  prop="cybercafeId" :style="{width:'500px'}">
		 					<el-select v-model="formAddContent.cybercafeId" size="small" style="width:165px" placeholder="请选择所属网吧">
		 						<el-option v-for="(item,index) in addAccountCybercafeList" :label="item.cybercafeName" :value="item.cybercafeId" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--岗位-->
		 				<el-form-item label="岗位：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.cybercafePosition"></el-input>
		 				</el-form-item>
		 				<!--到岗时间-->
		 				<el-form-item label="到岗时间：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text"  size="small" v-model="formAddContent.mountGuardTime" ></el-input>
		 				</el-form-item>
		 				<!--是否通过考核-->
		 				<el-form-item label="是否通过考核：" label-width="120px" prop="isAssess" :style="{width:addContentFormItemWidth}">
		 					<el-select v-model="formAddContent.isAssess" size="small" style="width:165px">
		 						<el-option v-for="(item,index) in assessList" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--个人照片-->
		 				<el-form-item label="个人照片：" label-width="120px"  :style="{width:'400px'}">
		 					
		 					<input ref="addFileId" type="file"  value="" @change="getFileAdd($event)" />
							<img :src="formAddContent.cybercafeUserPhoto" style="max-width:320px;" v-show="formAddContent.cybercafeUserPhoto" />
							
		 				</el-form-item>
		 				<!--保存-->
		 				<el-form-item style="text-align:center;width:100%;">
		 					<el-button type="primary" size="large" :loading="addSaveLoading" @click="submitAddContent('formAddContent')">保存</el-button>
		 				</el-form-item>
		 		</el-form>
			 </el-dialog>
		 
		 
		 	<!--查看-->
	    	<el-dialog title="查看" :visible.sync="checkContent" class="cybercafe_infor_Dialog" @close="formCheckContentClose('formCheckContent')">
			 			<el-form :model="formCheckContent" label-width="formCheckContentWidth"  ref="formCheckContent" :inline="true">
		 				<!--姓名-->
		 				<el-form-item label="姓名：" label-width="120px" prop="cybercafeUserName" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.cybercafeUserName" disabled></el-input>
		 				</el-form-item>
		 				<!--身份证号-->
		 				<el-form-item label="身份证号：" label-width="120px"  prop="identityCard" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.identityCard" disabled></el-input>
		 				</el-form-item>
		 				<!--联系电话-->
		 				<el-form-item label="联系电话：" label-width="120px" prop="cybercafeUserTelephone" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.cybercafeUserTelephone" disabled></el-input>
		 				</el-form-item>
		 				<!--户籍所在地-->
		 				<el-form-item label="户籍所在地：" label-width="120px"  :style="{width:'100%'}" class="selectDisabled">
		 					 <el-cascader
					      size="large"
					      :options="options"
					      v-model="checkSelectedOptions"
					      @change="handleChange">
					    </el-cascader style="height:50px;" >
					    <div class="Disabled_mask"></div>
					    <el-input type="text" size="small" v-model="formCheckContent.address" style="width:265px;margin-left:20px;" placeholder="详细地址" disabled></el-input>
		 				</el-form-item>
		 				<!--暂住地-->
		 				<el-form-item label="暂住地：" label-width="120px"  :style="{width:'100%'}" class="selectDisabled">
		 					<el-cascader
					      size="large"
					      :options="options"
					      v-model="checkSelectedOptions2"
					      @change="handleChange2"
					      >
					    </el-cascader>
					    <div class="Disabled_mask"></div>
					    <el-input type="text" size="small" v-model="formCheckContent.liveaddress" style="width:265px;margin-left:20px;" placeholder="详细地址" disabled></el-input>
		 				</el-form-item>
		 				<!--所属派出所-->
		 				<el-form-item label="所属派出所：" label-width="120px" prop="policeId"  :style="{width:checkContentFormItemWidth}">
		 					<el-select v-model="formCheckContent.policeId" size="small" style="width:165px" placeholder="请选择所属派出所" @change="formCheckContentSelect(formCheckContent.policeId)" disabled>
		 						<el-option v-for="(item,index) in upDatePoliceId" :label="item.policeName" :value="item.policeId" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--所属网吧-->
		 				<el-form-item label="所属网吧：" label-width="120px"  prop="cybercafeId" :style="{width:'500px'}">
		 					<el-select v-model="formCheckContent.cybercafeId" size="small" style="width:165px" placeholder="请选择所属网吧" disabled>
		 						<el-option v-for="(item,index) in checkAccountCybercafeList" :label="item.cybercafeName" :value="item.cybercafeId" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--岗位-->
		 				<el-form-item label="岗位：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.cybercafePosition" disabled></el-input>
		 				</el-form-item>
		 				<!--到岗时间-->
		 				<el-form-item label="到岗时间：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<!--<el-input type="text" size="small"  v-model="formCheckContent.mountGuardTime" disabled></el-input>-->
		 					<el-date-picker
						      v-model="checkContententValue1"
						      type="date"
						      placeholder="选择日期"
						      :picker-options="pickerOptions0"
						      :editable="false"
						      disabled
						      >
						    </el-date-picker>
		 				</el-form-item>
		 				<!--是否通过考核-->
		 				<el-form-item label="是否通过考核：" label-width="120px" prop="isAssess" :style="{width:checkContentFormItemWidth}">
		 					<el-select v-model="formCheckContent.isAssess" size="small" style="width:165px" disabled>
		 						<el-option v-for="(item,index) in assessList" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--个人照片-->
		 				<el-form-item label="个人照片：" label-width="120px"  :style="{width:'400px'}">
		 					<input ref="checkFileId" type="file"  value="" @change="getFileCheck($event)" disabled />
							<img :src="formCheckContent.cybercafeUserPhoto" style="max-width:320px;" v-show="formCheckContent.cybercafeUserPhoto" />
		 				</el-form-item>
		 				<!--保存-->
		 				<el-form-item style="text-align:center;width:100%;">
		 					<el-button type="primary" size="large" disabled>保存</el-button>
		 					
		 				</el-form-item>
		 		</el-form>
			 </el-dialog>
			 
			 
			 <!--修改-->
	    	<el-dialog title="修改" :visible.sync="amendContent" class="cybercafe_infor_Dialog cybercafe_infor_Dialog_amendContent" @close="formAmendContentClose('formAmendContent')" :close-on-click-modal="false">
			 			<el-form :model="formAmendContent" label-width="formAmendContentWidth" :rules="formAmendContentRules" ref="formAmendContent" :inline="true">
		 				<!--姓名-->
		 				<el-form-item label="姓名：" label-width="120px" prop="cybercafeUserName" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.cybercafeUserName" ></el-input>
		 				</el-form-item>
		 				<!--身份证号-->
		 				<el-form-item label="身份证号：" label-width="120px"  prop="identityCard" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.identityCard" ></el-input>
		 				</el-form-item>
		 				<!--联系电话-->
		 				<el-form-item label="联系电话：" label-width="120px" prop="cybercafeUserTelephone" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.cybercafeUserTelephone" ></el-input>
		 				</el-form-item>
		 				<!--户籍所在地-->
		 				<el-form-item label="户籍所在地：" label-width="120px"  :style="{width:'100%'}" >
		 					 <el-cascader
					      size="large"
					      :options="options"
					      v-model="amendSelectedOptions"
					      @change="handleChangeAmend"
					      >
					    </el-cascader style="height:50px;" >
					    <el-input type="text" size="small" v-model="formAmendContent.address" style="width:265px;margin-left:20px;" placeholder="详细地址" ></el-input>
		 				</el-form-item>
		 				<!--暂住地-->
		 				<el-form-item label="暂住地：" label-width="120px"  :style="{width:'100%'}">
		 					<el-cascader
					      size="large"
					      :options="options"
					      v-model="amendSelectedOptions2"
					      @change="handleChange2Amend">
					    </el-cascader>
					    <el-input type="text" size="small" v-model="formAmendContent.liveaddress" style="width:265px;margin-left:20px;" placeholder="详细地址" ></el-input>
		 				</el-form-item>
		 				<!--所属派出所-->
		 				<el-form-item label="所属派出所：" label-width="120px" prop="policeId"  :style="{width:amendContentFormItemWidth}">
		 					<el-select v-model="formAmendContent.policeId" size="small" style="width:165px" placeholder="请选择所属派出所" @change="formAmendContentSelect(formAmendContent.policeId)" >
		 						<el-option v-for="(item,index) in upDatePoliceId" :label="item.policeName" :value="item.policeId" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--所属网吧-->
		 				<el-form-item label="所属网吧：" label-width="120px"  prop="cybercafeId" :style="{width:'500px'}">
		 					<el-select v-model="formAmendContent.cybercafeId" size="small" style="width:165px" placeholder="请选择所属网吧" >
		 						<el-option v-for="(item,index) in amendAccountCybercafeList" :label="item.cybercafeName" :value="item.cybercafeId" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--岗位-->
		 				<el-form-item label="岗位：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.cybercafePosition" ></el-input>
		 				</el-form-item>
		 				<!--到岗时间-->
		 				<el-form-item label="到岗时间：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					
						    <el-date-picker
						      v-model="amendContentValue1"
						      type="date"
						      placeholder="选择日期"
						      :picker-options="pickerOptions0"
						      :editable="false"
						      >
						    </el-date-picker>
		 				</el-form-item>
		 				<!--是否通过考核-->
		 				<el-form-item label="是否通过考核：" label-width="120px" prop="isAssess" :style="{width:amendContentFormItemWidth}">
		 					<el-select v-model="formAmendContent.isAssess" size="small" style="width:165px" >
		 						<el-option v-for="(item,index) in assessList" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--个人照片-->
		 				<el-form-item label="个人照片：" label-width="120px"  :style="{width:'400px'}">
		 					<input ref="AmendFileId" type="file"  value="" @change="getFileAmend($event)"  />
							<img :src="formAmendContent.cybercafeUserPhoto" style="max-width:320px;" v-show="formAmendContent.cybercafeUserPhoto" />
		 				</el-form-item>
		 				<!--保存-->
		 				<el-form-item style="text-align:center;width:100%;">
		 					<el-button type="primary" size="large" :loading="amendSaveLoading" @click="submitAmendContent('formAmendContent')" >保存</el-button>
		 					 
		 				</el-form-item>
		 		</el-form>
			 </el-dialog>
			
  </div>
</template>

<script>
	
import { getCybercafeUserTable , getCybercafeUserTableCheck , getCybercafeUserTableAdd ,getCybercafeUserTableDelete ,getCybercafeUserTableAmend ,getCybercafeByPoliceId ,uploadImg }	from 'api'
import { regionData , CodeToText , TextToCode } from 'element-china-area-data'
import { assess } from '@/common/config'
import axios from 'axios'
export default {
  name: 'cybercafe_user',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      filters : {
      		name: '',
      		policeId : '',
      		cybercafeName : ''
      },
      options: regionData,
      formAddContent:{ //弹窗数据--增加
      	cybercafeUserName :'',
      	identityCard : '',
      	cybercafeUserTelephone : '',
      	policeId : '',
      	cybercafeId : '',
      	cybercafePosition : '',
      	mountGuardTime : '',
      	isAssess : '',
      	cybercafeUserPhoto : '',
      	address:'',
      	city:'',
      	district:'',
      	province: '',
      	liveaddress:'',
      	livecity:'',
      	livedistrict:'',
      	liveprovince:''
      },
      formCheckContent:{ //弹窗数据--查看
      	cybercafeUserName :'',
      	identityCard : '',
      	cybercafeUserTelephone : '',
      	policeId : '',
      	cybercafeId : '',
      	cybercafePosition : '',
      	mountGuardTime : '',
      	isAssess : '',
      	cybercafeUserPhoto : '',
      	address:'',
      	city:'',
      	district:'',
      	province: '',
      	liveaddress:'',
      	livecity:'',
      	livedistrict:'',
      	liveprovince:''
      },
      formAmendContent:{ //弹窗数据--修改
      	cybercafeUserName :'',
      	identityCard : '',
      	cybercafeUserTelephone : '',
      	policeId : '',
      	cybercafeId : '',
      	cybercafePosition : '',
      	mountGuardTime :'',
      	isAssess : '',
      	cybercafeUserPhoto : '',
      	address:'',
      	city:'',
      	district:'',
      	province: '',
      	liveaddress:'',
      	livecity:'',
      	livedistrict:'',
      	liveprovince:''
      },
      amendContentValue1:'', //到岗时间--修改
      checkContententValue1: '', //到岗时间--查看
      assessList : null,   //是否通过考核列表
      selectedOptions:[],  //户籍所在地--新增
      selectedOptions2:[], //暂住地--新增
      checkSelectedOptions:[],  //户籍所在地--查看
      checkSelectedOptions2:[], //暂住地--查看
      amendSelectedOptions:[], //户籍所在地--修改
      amendSelectedOptions2:[], //暂住地--修改
      formAddContentRules:{     //弹窗验证--增加
      	cybercafeUserName : [{ required: true, message: '网吧名称不能为空', trigger: 'blur' }],
	  		cybercafeUserTelephone : [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
	  		cybercafeId : [{ required: true, message: '所属网吧不能为空', trigger: 'blur' }],
	  		isAssess : [{ required: true, message: '是否通过考核不能为空', trigger: 'blur' }],
	  		policeId : [{ required: true, message: '所属派出所不能为空', trigger: 'blur' }]
      },
       formAmendContentRules:{ //弹窗验证--增加
      	cybercafeUserName : [{ required: true, message: '网吧名称不能为空', trigger: 'blur' }],
	  		cybercafeUserTelephone : [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
	  		cybercafeId : [{ required: true, message: '所属网吧不能为空', trigger: 'blur' }],
	  		isAssess : [{ required: true, message: '是否通过考核不能为空', trigger: 'blur' }],
	  		policeId : [{ required: true, message: '所属派出所不能为空', trigger: 'blur' }]
      },
      policeIdLists : [],
      tablePage:1,  //当前页码
      tableData:[], //表格数据
      listLoading: false, //加载状态
      total:0,  //分页的总记录数
      checkContent:false, //查看Dialog
      amendContent:false, //修改Dialog
      addContent:false, //增加Dialog
      formAddContentWidth:'120px', 
    	addContentFormItemWidth:'320px',  //forItme的宽度--新增
    	addSaveLoading:false,  //按钮加载画面--新增
    	addFormShowCybercafe:false, //通过policeId获取所属网吧显示 --新增 
    	addAccountCybercafeList:[], //通过policeId获取所述网吧列表 -- 新增
    	formCheckContentWidth:'120px', 
    	checkContentFormItemWidth:'320px',  //forItme的宽度--查看
    	checkSaveLoading:false,  //按钮加载画面--查看
    	checkAccountCybercafeList:[], //通过policeId获取所述网吧列表 --查看
    	formAmendContentWidth:'120px', 
    	amendContentFormItemWidth:'320px',  //forItme的宽度--修改
    	amendSaveLoading:false,  //按钮加载画面--修改
    	amendAccountCybercafeList:[], //通过policeId获取所述网吧列表 --修改
    	formAmendContentId:null, //修改的id
    	userData:null
    	
    	
    }
  },
  methods:{
  	pickerOptions0(){
  		
  	},
  	getFileAdd(event){ //网吧个人照片--增加
			this.file = event.target.files[0];
          console.log(this.file);
          let formData = new FormData();
           
          formData.append('file', this.file);
					formData.append('token', this.userData.get('token'));
					formData.append('userId', this.userData.get('userId'));
					let config = {
					  headers: {
					    'Content-Type': 'multipart/form-data'
					  }
					}
						axios.post(uploadImg+'/upload.do', formData , config ).then((res) =>{
							console.log(res)
							if(res.data && res.data.code == '1'){
								this.formAddContent.cybercafeUserPhoto = uploadImg + '/' + res.data.fileName 
							}
							
							
						}).catch((err) =>{
							console.log(err)
						})
						
		},
		getFileAmend(event){ //网吧个人照片--修改
			this.file = event.target.files[0];
          console.log(this.file);
          let formData = new FormData();
           
          formData.append('file', this.file);
					formData.append('token', this.userData.get('token'));
					formData.append('userId', this.userData.get('userId'));
					let config = {
					  headers: {
					    'Content-Type': 'multipart/form-data'
					  }
					}
						axios.post(uploadImg+'/upload.do', formData , config ).then((res) =>{
							console.log(res)
							if(res.data && res.data.code == '1'){
								this.formAmendContent.cybercafeUserPhoto = uploadImg + '/' + res.data.fileName 
							}
							
							
						}).catch((err) =>{
							console.log(err)
						})
						
		},
	  getUsers(){
	  		let portParameter = this.$store.getters.getPortParameter;
	  		let userData = this.$store.getters.getUserData;
	  		
				//		this.data = dateTimeList
				//console.log(date)
	  		let para = {
	  				system : portParameter.system,
	  				token : this.userData.get('token'),
	  				userId : this.userData.get('userId'),
	  				version : portParameter.version,
	  				page: this.tablePage,
	  				policeId: this.filters.policeId,
	  				cybercafeName: this.filters.cybercafeName,
	  				cybecafeUserName: this.filters.name
	  		};
	  		
	  		getCybercafeUserTable(para).then((res) =>{
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
			this.getUsers()
			},
			handleEdit(index,row){  //查看
				this.checkContent = true;
				let portParameter = this.$store.getters.getPortParameter;
				let userData = this.$store.getters.getUserData;
				let para = {
					system : portParameter.system,
					token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
				  version : portParameter.version,
				  id : row.id
				}
				getCybercafeUserTableCheck(para).then((res) =>{
					
					if(res.data && res.data.code =="1"){
						console.log(res.data.data)
						this.formCheckContentSelect(res.data.data.policeId)
						res.data.data.policeId = (res.data.data.policeId).toString();
						res.data.data.cybercafeId = (res.data.data.cybercafeId).toString();
						res.data.data.isAssess = (res.data.data.isAssess).toString();
						//格式到岗时间
						this.checkContententValue1 = this.formateDateTime2(res.data.data.mountGuardTime);
						//格式户籍所在地
						if(res.data.data.province && res.data.data.city && res.data.data.district){
							
							this.checkSelectedOptions = this.formateAddress(res.data.data.province,res.data.data.city,res.data.data.district);
						}else{
							this.checkSelectedOptions = []
						};
						
						if(res.data.data.liveprovince && res.data.data.livecity && res.data.data.livedistrict){
							
							this.checkSelectedOptions2 = this.formateAddress(res.data.data.liveprovince,res.data.data.livecity,res.data.data.livedistrict);
						}else{
							this.checkSelectedOptions2 = []
						};
						
						this.formCheckContent = Object.assign({},res.data.data)
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
			  				token : this.userData.get('token'),
	  						userId : this.userData.get('userId'),
			  				version : portParameter.version,
			  				id: row.id,
			  		};
						
						getCybercafeUserTableDelete(para).then((res) =>{
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
			},
			handleAmend(index,row){ //修改
				this.formAmendContentId = row.id;
				this.amendContent = true ;
				let portParameter = this.$store.getters.getPortParameter;
//				let userData = this.$store.getters.getUserData;
				let para = {
					system : portParameter.system,
					token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
				  version : portParameter.version,
				  id : row.id
				}
				getCybercafeUserTableCheck(para).then((res) =>{
					
					if(res.data && res.data.code =="1"){
						console.log(res.data.data)
						this.formAmendContentSelect(res.data.data.policeId)
						res.data.data.policeId = (res.data.data.policeId).toString();
						res.data.data.cybercafeId = (res.data.data.cybercafeId).toString();
						res.data.data.isAssess = (res.data.data.isAssess).toString();
						
						this.amendContentValue1 = this.formateDateTime2(res.data.data.mountGuardTime);
						//地址转换
						if(res.data.data.province && res.data.data.city && res.data.data.district){
							
							this.amendSelectedOptions = this.formateAddress(res.data.data.province,res.data.data.city,res.data.data.district);
						}else{
							this.amendSelectedOptions = []
						};
						
						if(res.data.data.liveprovince && res.data.data.livecity && res.data.data.livedistrict){
							
							this.amendSelectedOptions2 = this.formateAddress(res.data.data.liveprovince,res.data.data.livecity,res.data.data.livedistrict);
						}else{
							this.amendSelectedOptions2 = []
						};
						
						this.formAmendContent = Object.assign({},res.data.data)
					}
					
				}).catch((err) =>{
					console.log(err)
				})
			},
			addMessage(){ //新增
				this.addContent = true;
				
				
			},
			
			submitAddContent(formAddContent){ //弹窗保存--新增
				
				this.$confirm('确定要新增该账户吗？','提示',{
			
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
						  				cybercafeUserName : this.formAddContent.cybercafeUserName,
						  				identityCard : this.formAddContent.identityCard,
						  				cybercafeUserTelephone : this.formAddContent.cybercafeUserTelephone,
						  				policeId : this.formAddContent.policeId,
						  				cybercafeId : this.formAddContent.cybercafeId,
						  				cybercafePosition : this.formAddContent.cybercafePosition,
						  				mountGuardTime : this.formAddContent.mountGuardTime,
						  				isAssess : this.formAddContent.isAssess,
						  				cybercafeUserPhoto : this.formAddContent.cybercafeUserPhoto,
						  				address : this.formAddContent.address,
						  				city : this.formAddContent.city,
						  				district : this.formAddContent.district,
						  				province : this.formAddContent.province,
						  				liveaddress : this.formAddContent.liveaddress,
						  				livecity : this.formAddContent.livecity,
						  				livedistrict : this.formAddContent.livedistrict,
						  				liveprovince : this.formAddContent.liveprovince
						  		};
									console.log(para)
									getCybercafeUserTableAdd(para).then((res) =>{
											this.addSaveLoading = false;
											if(res.data && res.data.code =='1'){
												
												this.$message({
													message:'保存成功',
													type:'success'
												});
												
												this.$refs[formAddContent].resetFields();
												this.addContent = false;
												this.getUsers()
												
											}else{
												this.$message({
													message:'保存失败，请重试！',
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
			submitAmendContent(formAmendContent){ //弹窗保存--修改
					this.$confirm('确定要修改该信息吗？','提示',{
			
					type : 'warning'
					
				}).then((res) =>{
					
						this.$refs[formAmendContent].validate((valid) =>{
							if(valid){
									this.amendSaveLoading = true;
									let portParameter = this.$store.getters.getPortParameter;
									let dateTimeList = null ;
									if(this.amendContentValue1){
						  			dateTimeList = this.formatDateTime(this.amendContentValue1);
						  		}else{
						  			dateTimeList = ''
						  		};
						  		let para = {
						  				system : portParameter.system,
						  				token : this.userData.get('token'),
	  									userId : this.userData.get('userId'),
						  				version : portParameter.version,
						  				cybercafeUserName : this.formAmendContent.cybercafeUserName,
						  				identityCard : this.formAmendContent.identityCard,
						  				cybercafeUserTelephone : this.formAmendContent.cybercafeUserTelephone,
						  				policeId : this.formAmendContent.policeId,
						  				cybercafeId : this.formAmendContent.cybercafeId,
						  				cybercafePosition : this.formAmendContent.cybercafePosition,
						  				mountGuardTime : dateTimeList,
						  				isAssess : this.formAmendContent.isAssess,
						  				cybercafeUserPhoto : this.formAmendContent.cybercafeUserPhoto,
						  				address : this.formAmendContent.address,
						  				city : this.formAmendContent.city,
						  				district : this.formAmendContent.district,
						  				province : this.formAmendContent.province,
						  				liveaddress : this.formAmendContent.liveaddress,
						  				livecity : this.formAmendContent.livecity,
						  				livedistrict : this.formAmendContent.livedistrict,
						  				liveprovince : this.formAmendContent.liveprovince,
						  				id : this.formAmendContentId
						  		};
									console.log(para)
									getCybercafeUserTableAmend(para).then((res) =>{
											this.amendSaveLoading = false;
											if(res.data && res.data.code =='1'){
												
												this.$message({
													message:'保存成功',
													type:'success'
												});
												
												this.$refs[formAmendContent].resetFields();
												this.amendContent = false;
												this.getUsers()
												
											}else{
												this.$message({
													message:'保存失败，请重试！',
													type:'error'
												})
												
											}
											
									}).catch((err) =>{
										console.log(err)
										this.amendSaveLoading = false;
										this.$message({
											message:'保存失败，请重试！',
											type:'error'
										})
									})
									
							}else{
								return false;
							}
							
						});
						
			}).catch((err) =>{
						console.log(err)
				});
			},
			formatDateTime(ArrayDate){ //弹窗表单格式化
				if(ArrayDate){
						let value = ArrayDate.toString();
						let d = new Date(value);
						let y = d.getFullYear();
						let m = (d.getMonth()+1) < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
						let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
						return y +''+ m+''+ date
				}
				
		},
		
		formateDateTime2(date){  //返回来的数据转换为国际标准时间 "20170816000000"
		console.log(date)
			if(date){
					let y = date.substring(0,4);
					let m = date.substring(4,6)-1;
					let d = date.substring(6,8);

					console.log(m,d)
					let myDate = new Date(y,m,d);
					return myDate;
			}
			
		},
			formAddContentSelect(policeId){  //所属派出所下拉获取对应网吧--新增
			
//		let userData = this.$store.getters.getUserData;
  		let para = {
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				policeId : policeId
  		};
  		
			getCybercafeByPoliceId(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
					this.addContentCybercafeIdLoading = true;
					
					let box = res.data.data; 
					for(let value of box){
						value.cybercafeId = (value.cybercafeId).toString();
					}
					
					this.addAccountCybercafeList = box ; 
					
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
					
					this.checkContentCybercafeIdLoading = true;
					
					let box = res.data.data; 
					for(let value of box){
						value.cybercafeId = (value.cybercafeId).toString();
					}
					this.checkAccountCybercafeList = box; 
					
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		formAmendContentSelect(policeId){  //所属派出所下拉获取对应网吧--修改
			
//		let userData = this.$store.getters.getUserData;
  		let para = {
  				token : this.userData.get('token'),
	  			userId : this.userData.get('userId'),
  				policeId : policeId
  		};
  		
			getCybercafeByPoliceId(para).then((res) =>{
				
				if(res.data && res.data.code == '1'){
					
					this.checkContentCybercafeIdLoading = true;
					
					let box = res.data.data; 
					for(let value of box){
						value.cybercafeId = (value.cybercafeId).toString();
					}
					this.amendAccountCybercafeList = box ; 
					console.log('查看网吧')
					console.log(box)
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
			formateAddress(province,city,district){   //把具体的地址转化为code值
				
				let arrayBox = [];
				let proviceCode = TextToCode[province].code;
				let cityCode = TextToCode[province][city].code;
				let districtCode = TextToCode[province][city][district].code;
				
				arrayBox.push(proviceCode)
				arrayBox.push(cityCode)
				arrayBox.push(districtCode)
				
				return arrayBox
				
			},
			handleChange(value){ //转换户籍地信息 -- 增加
			
				let _this = this;
				if(value){
					
					value.forEach((item,i) =>{
						if(i == 0){
							_this.formAddContent.province = CodeToText[item]
						}else if(i == 1){
							_this.formAddContent.city = CodeToText[item]
						}else if(i == 2){
							_this.formAddContent.district = CodeToText[item]
						}
					})
					
				}
				
			},
			handleChange2(value){ //转换暂住地信息 -- 增加
				let _this = this;
				if(value){
					
					value.forEach((item,i) =>{
						
						if(i == 0){
							_this.formAddContent.liveprovince = CodeToText[item]
						}else if(i == 1){
							_this.formAddContent.livecity = CodeToText[item]
						}else if(i == 2){
							_this.formAddContent.livedistrict = CodeToText[item]
						}
					})
					
				}
			},
			handleChangeAmend(value){ //转换户籍地信息 -- 修改
			
				let _this = this;
				if(value){
					
					value.forEach((item,i) =>{
						if(i == 0){
							_this.formAmendContent.province = CodeToText[item]
						}else if(i == 1){
							_this.formAmendContent.city = CodeToText[item]
						}else if(i == 2){
							_this.formAmendContent.district = CodeToText[item]
						}
					})
					
				}
				
			},
			handleChange2Amend(value){ //转换暂住地信息 -- 修改
			
				let _this = this;
				if(value){
					
					value.forEach((item,i) =>{
						
						if(i == 0){
							_this.formAmendContent.liveprovince = CodeToText[item]
						}else if(i == 1){
							_this.formAmendContent.livecity = CodeToText[item]
						}else if(i == 2){
							_this.formAmendContent.livedistrict = CodeToText[item]
						}
					})
				}
			},
			formAddContentClose(formAddContent){ //关闭弹窗清楚数据--新增
				
				this.$refs[formAddContent].resetFields();
				this.addSaveLoading = false;
			},
			formCheckContentClose(formCheckContent){ //关闭弹窗清楚数据--查看
				this.$refs[formCheckContent].resetFields();
			},
			formAmendContentClose(formAmendContent){ //关闭弹窗清楚数据--修改
				this.$refs[formAmendContent].resetFields();
				this.amendSaveLoading = false;
			},
			getUserData(){
				let data = JSON.parse(sessionStorage.getItem('userinfo'));
				let map = new Map(data);
				this.userData = map
				console.log(this.userData)
			}
			/**** methods over ****/
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
	  	this.assessList = assess;
	  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.cybercafe_infor_Dialog .el-dialog--small{
	width:1100px;
}
.cybercafe_infor_Dialog .el-input__icon+.el-input__inner{
	height:30px;
	font-size:inherit;
}
.cybercafe_infor_Dialog .Disabled_mask{
	position:absolute;
	left:0;
	right:0;
	top:0;
	bottom:0;
	z-index:99;
	cursor:not-allowed; 
}
.selectDisabled input{
	background:#eef1f6;
	border-color:#d1dbe5;
	color:#bbb;
}
.cybercafe_infor_Dialog .el-cascader--large .el-cascader__label{
	color:#BBBBBB;
}
.cybercafe_infor_Dialog_amendContent .el-cascader--large .el-cascader__label{
	color:black;
}
</style>

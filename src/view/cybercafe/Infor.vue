<template>
  <div class="cybercafe_infor">
			<el-col :span="24" align="right" style="margin-top:10px;">
    			<el-form :model="filters" :inline="true">
    				<!--网吧名称-->
    				<el-form-item label="网吧名称">
    					<el-input type="text" v-model="filters.cybercafeName"></el-input>
    				</el-form-item>
    				<!--营业状态-->	
    					<el-form-item label="营业状态">
    						<el-select v-model="filters.businessState">
    								<el-option label="所有状态" value="" ></el-option>
    								<el-option label="营业中" value="1" ></el-option>
    								<el-option label="停业中" value="0" ></el-option>
    						</el-select>
    					</el-form-item>
    					<!--派出所-->
    					<el-form-item label="派出所">
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
    						<el-button @click="addMessage">新增</el-button>
    					</el-form-item>
    					
    			</el-form>	
    	</el-col>
    	
    	<!--表格-->
    	<template>
	 			<el-table :data="tableData" border stripe highlight-current-row style="width: 100%;" v-loading="listLoading">
		 				<el-table-column type="index"  label="序号" width="140" align="center"></el-table-column>
		 				<el-table-column prop="cybercafeName" label="网吧名称"  align="center"></el-table-column>
		 				<el-table-column prop="legalUser" label="法人" align="center"></el-table-column>
		 				<el-table-column prop="legalUserTelephone" label="联系方式" align="center"></el-table-column>
		 				<el-table-column prop="businessState" label="营业状态" align="center" ></el-table-column>
		 				<el-table-column prop="policeName" label="所属派出所" align="center" ></el-table-column>
		 				<el-table-column  label="操作" align="center" width="220">
		 					<template scope="scope" >
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
    	<el-dialog title="新增" :visible.sync="addContent" class="cybercafe_infor_Dialog" @close="formAddContentClose('formAddContent')" :close-on-click-modal="false">
	 			<el-form :model="formAddContent" label-width="formAddContentWidth"	:rules="formAddContentRules" ref="formAddContent" :inline="true">
		 				<!--网吧名称-->
		 				<el-form-item label="网吧名称：" label-width="120px" prop="cybercafeName" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.cybercafeName"></el-input>
		 				</el-form-item>
		 				<!--公司名称-->
		 				<el-form-item label="公司名称：" label-width="120px" prop="companyName" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.companyName"></el-input>
		 				</el-form-item>
		 				<!--网吧地址-->
		 				<el-form-item label="网吧地址：" label-width="120px" prop="cybercafeSite" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.cybercafeSite"></el-input>
		 				</el-form-item>
		 				<!--开设日期-->
		 				<el-form-item label="开设日期：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<!--<el-input type="text" size="small" v-model="formAddContent.startDateTime" ></el-input>-->
		 					
						    <el-date-picker
						      v-model="formAddContent.startDateTime"
						      type="date"
						      placeholder="选择日期"
						      >
						    </el-date-picker>
						  
		 				</el-form-item>
		 				<!--营业状态-->
		 				<el-form-item label="营业状态：" label-width="120px"  prop="businessState" :style="{width:addContentFormItemWidth}">
		 					<el-select v-model="formAddContent.businessState" size="small" style="width:165px">
		 						<el-option v-for="(item,index) in businessState" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--星级-->
		 				<el-form-item label="星级：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-select v-model="formAddContent.star" size="small" style="width:165px">
		 						<el-option v-for="(item,index) in startLevel" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--网吧电话-->
		 				<el-form-item label="网吧电话：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.cybercafeTelephone" ></el-input>
		 				</el-form-item>
		 				<!--是否连锁-->
		 				<el-form-item label="是否连锁：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-select v-model="formAddContent.multipleShop" size="small" style="width:165px">
		 						<el-option v-for="(item,index) in alliance" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--监控数量-->
		 				<el-form-item label="监控数量：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.cameraNum" ></el-input>
		 				</el-form-item>
		 				<!--法人-->
		 				<el-form-item label="法人：" label-width="120px" prop="legalUser" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.legalUser" ></el-input>
		 				</el-form-item>
		 				<!--法人电话-->
		 				<el-form-item label="法人电话：" label-width="120px" prop="legalUserTelephone" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.legalUserTelephone" ></el-input>
		 				</el-form-item>
		 				<!--身份证号-->
		 				<el-form-item label="身份证号：" label-width="120px" prop="identityCard" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.identityCard" ></el-input>
		 				</el-form-item>
		 				<!--经营人-->
		 				<el-form-item label="经营人：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.operator" ></el-input>
		 				</el-form-item>
		 				<!--经营人电话-->
		 				<el-form-item label="经营人电话：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.operatorTelephone" ></el-input>
		 				</el-form-item>
		 				<!--电脑数量-->
		 				<el-form-item label="电脑数量：" label-width="120px" prop="computerNum" :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.computerNum" ></el-input>
		 				</el-form-item>
		 				<!--服务商-->
		 				<el-form-item label="服务商：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.serviceProvider" ></el-input>
		 				</el-form-item>
		 				<!--IP地址-->
		 				<el-form-item label="IP地址：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.ipAddressed" ></el-input>
		 				</el-form-item>
		 				<!--接入方式-->
		 				<el-form-item label="接入方式：" label-width="120px"  :style="{width:addContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAddContent.accessWay" ></el-input>
		 				</el-form-item>
		 				<!--所属派出所-->
		 				<el-form-item label="所属派出所：" label-width="120px"  prop="policeId" :style="{width:addContentFormItemWidth}">
		 					<el-select v-model="formAddContent.policeId" size="small" style="width:165px">
								<el-option v-for="(item,index) in upDatePoliceId" :value="item.policeId" :label="item.policeName" :key="index"></el-option>
							</el-select>
		 				</el-form-item>
		 				<!--网吧照片-->
		 				<el-form-item label="网吧照片：" label-width="120px"  :style="{width:'350px'}" prop="cybercafeUrl">
		 						<!--<el-upload
									  class="upload-demo"
									  action="http://jsonplaceholder.typicode.com/posts/"
									  :on-preview="handlePreview"
									  :on-remove="handleRemove"
									  :file-list="fileList2"
									  list-type="picture">
									  <el-button size="small" type="primary">点击上传</el-button>
									  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
									</el-upload>-->
								<!--<input type="file" name="" id="" value="" />-->
								<input ref="addFileId" type="file" value="" @change="getFileAdd($event)">
								<img :src="formAddContent.cybercafeUrl" style="max-width:220px;" v-show="formAddContent.cybercafeUrl" />

		 				</el-form-item>
		 				<!--营业执照-->
		 				<el-form-item label="营业执照：" label-width="120px"  :style="{width:'350px'}" prop="businessLicenseUrl">
		 					<input ref="addFile2Id" type="file" value="" @change="getFileAdd2($event)">
		 					<img :src="formAddContent.businessLicenseUrl" style="max-width:220px;" v-show="formAddContent.businessLicenseUrl" />
		 				</el-form-item>
		 				
		 				<!--保存-->
		 				<el-form-item style="text-align:center;width:100%;">
		 					<el-button type="primary" size="large" :loading="addSaveLoading" @click="submitAddContent('formAddContent')">保存</el-button>
		 				</el-form-item>
		 		</el-form>
		 	</el-dialog>
			 
			 <!--查看-->
    	<el-dialog title="查看" :visible.sync="checkContent" class="cybercafe_infor_Dialog" @close="formCheckContentClose('formCheckContent')">
	 			<el-form :model="formCheckContent" label-width="formCheckContentWidth"	 ref="formCheckContent" :inline="true">
		 				<!--网吧名称-->
		 				<el-form-item label="网吧名称：" label-width="120px" prop="cybercafeName" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.cybercafeName" disabled></el-input>
		 				</el-form-item>
		 				<!--公司名称-->
		 				<el-form-item label="公司名称：" label-width="120px" prop="companyName" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.companyName" disabled></el-input>
		 				</el-form-item>
		 				<!--网吧地址-->
		 				<el-form-item label="网吧地址：" label-width="120px" prop="cybercafeSite" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.cybercafeSite" disabled></el-input>
		 				</el-form-item>
		 				<!--开设日期-->
		 				<el-form-item label="开设日期：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.startDateTime"disabled ></el-input>
		 				</el-form-item>
		 				<!--营业状态-->
		 				<el-form-item label="营业状态：" label-width="120px"  prop="businessState" :style="{width:checkContentFormItemWidth}">
		 					<el-select v-model="formCheckContent.businessState" size="small" style="width:165px" disabled>
		 						<el-option v-for="(item,index) in businessState" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--星级-->
		 				<el-form-item label="星级：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-select v-model="formCheckContent.star" size="small" style="width:165px" disabled>
		 						<el-option label="请选择" value="0"></el-option>
		 						<el-option v-for="(item,index) in startLevel" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--网吧电话-->
		 				<el-form-item label="网吧电话：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.cybercafeTelephone" disabled></el-input>
		 				</el-form-item>
		 				<!--是否连锁-->
		 				<el-form-item label="是否连锁：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-select v-model="formCheckContent.multipleShop" size="small" style="width:165px" disabled>
		 						<el-option v-for="(item,index) in alliance" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--监控数量-->
		 				<el-form-item label="监控数量：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.cameraNum" disabled></el-input>
		 				</el-form-item>
		 				<!--法人-->
		 				<el-form-item label="法人：" label-width="120px" prop="legalUser" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.legalUser" disabled></el-input>
		 				</el-form-item>
		 				<!--法人电话-->
		 				<el-form-item label="法人电话：" label-width="120px" prop="legalUserTelephone" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.legalUserTelephone" disabled></el-input>
		 				</el-form-item>
		 				<!--身份证号-->
		 				<el-form-item label="身份证号：" label-width="120px" prop="identityCard" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.identityCard" disabled></el-input>
		 				</el-form-item>
		 				<!--经营人-->
		 				<el-form-item label="经营人：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.operator" disabled></el-input>
		 				</el-form-item>
		 				<!--经营人电话-->
		 				<el-form-item label="经营人电话：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.operatorTelephone" disabled></el-input>
		 				</el-form-item>
		 				<!--电脑数量-->
		 				<el-form-item label="电脑数量：" label-width="120px" prop="computerNum" :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.computerNum" disabled></el-input>
		 				</el-form-item>
		 				<!--服务商-->
		 				<el-form-item label="服务商：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.serviceProvider" disabled></el-input>
		 				</el-form-item>
		 				<!--IP地址-->
		 				<el-form-item label="IP地址：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.ipAddressed" disabled></el-input>
		 				</el-form-item>
		 				<!--接入方式-->
		 				<el-form-item label="接入方式：" label-width="120px"  :style="{width:checkContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formCheckContent.accessWay" disabled></el-input>
		 				</el-form-item>
		 				<!--所属派出所-->
		 				<el-form-item label="所属派出所：" label-width="120px"  prop="policeId" :style="{width:checkContentFormItemWidth}">
		 					<el-select v-model="formCheckContent.policeId" size="small" style="width:165px" disabled>
								<el-option v-for="(item,index) in upDatePoliceId" :value="item.policeId" :label="item.policeName" :key="index"></el-option>
							</el-select>
		 				</el-form-item>
		 				<!--网吧照片-->
		 				<el-form-item label="网吧照片" label-width="120px"  :style="{width:'350px'}">
		 						<!--<el-upload
									  class="upload-demo"
									  action="http://jsonplaceholder.typicode.com/posts/"
									  :on-preview="handlePreview"
									  :on-remove="handleRemove"
									  :file-list="fileList2"
									  list-type="picture">
									  <el-button size="small" type="primary">点击上传</el-button>
									  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
									</el-upload>-->
								<!--<input type="file" name="" id="" value="" />-->
								<!--<input ref="checkFileId" type="file" >-->
								<img :src="formCheckContent.cybercafeUrl" style="max-width:220px;" v-show="formCheckContent.cybercafeUrl" />

		 				</el-form-item>
		 				<!--营业执照-->
		 				<el-form-item label="营业执照：" label-width="120px"  :style="{width:'350px'}">
		 					<!--<input ref="checkFile2Id" type="file"  disabled>-->
		 					<img :src="formCheckContent.businessLicenseUrl" style="max-width:220px;" v-show="formCheckContent.businessLicenseUrl" />
		 				</el-form-item>
		 				
		 				<!--保存-->
		 				<el-form-item style="text-align:center;width:100%;">
		 					<el-button type="primary" size="large" disabled>保存</el-button>
		 				</el-form-item>
		 		</el-form>
		 	</el-dialog>
		 	
		 	<!--修改-->
    	<el-dialog title="修改" :visible.sync="amendContent" class="cybercafe_infor_Dialog" @close="formAmendContentClose('formAmendContent')" :close-on-click-modal="false">
	 			<el-form :model="formAmendContent" label-width="formAmendContentWidth"	:rules="formAmendContentRules" ref="formAmendContent" :inline="true">
		 				<!--网吧名称-->
		 				<el-form-item label="网吧名称：" label-width="120px" prop="cybercafeName" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.cybercafeName" ></el-input>
		 				</el-form-item>
		 				<!--公司名称-->
		 				<el-form-item label="公司名称：" label-width="120px" prop="companyName" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.companyName" ></el-input>
		 				</el-form-item>
		 				<!--网吧地址-->
		 				<el-form-item label="网吧地址：" label-width="120px" prop="cybercafeSite" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.cybercafeSite" ></el-input>
		 				</el-form-item>
		 				<!--开设日期-->
		 				<el-form-item label="开设日期：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<!--<el-input type="text" size="small" v-model="formAmendContent.startDateTime" ></el-input>-->
		 					<el-date-picker
						      v-model="formAmendContent.startDateTime"
						      type="date"
						      placeholder="选择日期"
						      >
						    </el-date-picker>
		 				</el-form-item>
		 				<!--营业状态-->
		 				<el-form-item label="营业状态：" label-width="120px"  prop="businessState" :style="{width:amendContentFormItemWidth}">
		 					<el-select v-model="formAmendContent.businessState" size="small" style="width:165px" >
		 						<el-option v-for="(item,index) in businessState" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--星级-->
		 				<el-form-item label="星级：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-select v-model="formAmendContent.star" size="small" style="width:165px" >
		 						<el-option label="请选择" value="0"></el-option>
		 						<el-option v-for="(item,index) in startLevel" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--网吧电话-->
		 				<el-form-item label="网吧电话：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.cybercafeTelephone" ></el-input>
		 				</el-form-item>
		 				<!--是否连锁-->
		 				<el-form-item label="是否连锁：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-select v-model="formAmendContent.multipleShop" size="small" style="width:165px" >
		 						<el-option v-for="(item,index) in alliance" :label="item.name" :value="item.id" :key="index"></el-option>
		 					</el-select>
		 				</el-form-item>
		 				<!--监控数量-->
		 				<el-form-item label="监控数量：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.cameraNum" ></el-input>
		 				</el-form-item>
		 				<!--法人-->
		 				<el-form-item label="法人：" label-width="120px" prop="legalUser" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.legalUser" ></el-input>
		 				</el-form-item>
		 				<!--法人电话-->
		 				<el-form-item label="法人电话：" label-width="120px" prop="legalUserTelephone" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.legalUserTelephone" ></el-input>
		 				</el-form-item>
		 				<!--身份证号-->
		 				<el-form-item label="身份证号：" label-width="120px" prop="identityCard" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.identityCard" ></el-input>
		 				</el-form-item>
		 				<!--经营人-->
		 				<el-form-item label="经营人：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.operator" ></el-input>
		 				</el-form-item>
		 				<!--经营人电话-->
		 				<el-form-item label="经营人电话：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.operatorTelephone" ></el-input>
		 				</el-form-item>
		 				<!--电脑数量-->
		 				<el-form-item label="电脑数量：" label-width="120px" prop="computerNum" :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.computerNum" ></el-input>
		 				</el-form-item>
		 				<!--服务商-->
		 				<el-form-item label="服务商：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.serviceProvider" ></el-input>
		 				</el-form-item>
		 				<!--IP地址-->
		 				<el-form-item label="IP地址：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.ipAddressed" ></el-input>
		 				</el-form-item>
		 				<!--接入方式-->
		 				<el-form-item label="接入方式：" label-width="120px"  :style="{width:amendContentFormItemWidth}">
		 					<el-input type="text" size="small" v-model="formAmendContent.accessWay" ></el-input>
		 				</el-form-item>
		 				<!--所属派出所-->
		 				<el-form-item label="所属派出所：" label-width="120px"  prop="policeId" :style="{width:amendContentFormItemWidth}">
		 					<el-select v-model="formAmendContent.policeId" size="small" style="width:165px" >
								<el-option v-for="(item,index) in upDatePoliceId" :value="item.policeId" :label="item.policeName" :key="index"></el-option>
							</el-select>
		 				</el-form-item>
		 				<!--网吧照片-->
		 				<el-form-item label="网吧照片" label-width="120px"  :style="{width:'350px'}">
		 						<!--<el-upload
									  class="upload-demo"
									  action="http://jsonplaceholder.typicode.com/posts/"
									  :on-preview="handlePreview"
									  :on-remove="handleRemove"
									  :file-list="fileList2"
									  list-type="picture">
									  <el-button size="small" type="primary">点击上传</el-button>
									  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
									</el-upload>-->
								<!--<input type="file" name="" id="" value="" />-->
								<input ref="amendFileId" type="file" @change="getFileAmend($event)">
								<img :src="formAmendContent.cybercafeUrl" style="max-width:220px;" v-show="formAmendContent.cybercafeUrl" />

		 				</el-form-item>
		 				<!--营业执照-->
		 				<el-form-item label="营业执照：" label-width="120px"  :style="{width:'350px'}">
		 					<input ref="amendFile2Id" type="file" @change="getFileAmend2($event)" >
		 					<img :src="formAmendContent.businessLicenseUrl" style="max-width:220px;" v-show="formAmendContent.businessLicenseUrl" />
		 				</el-form-item>
		 				
		 				<!--保存-->
		 				<el-form-item style="text-align:center;width:100%;">
		 					<el-button type="primary" size="large" :loading="amendSaveLoading" @click="submitAmendContent('formAmendContent')">保存</el-button>
		 				</el-form-item>
		 		</el-form>
		 	</el-dialog>
			 
  </div>
</template>

<script>
	
	import { getCybercafeInforTable , getCybercafeInforTableCheck , getCybercafeInforTableAdd , getCybercafeInforTableDelete , getCybercafeInforTableAmend , uploadImg} from 'api'
	import { startLevel , businessState , alliance } from '@/common/config'
	import axios from 'axios'
export default {
  name: 'cybercafe_infor',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      filters:{
      		cybercafeName:'',
      		businessState:'',
      		policeId:''
      },
      fileList2: [
      	{
      		name: 'food.jpeg', 
      		url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      	},
      	{
	  			name: 'food2.jpeg', 
	  			url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      	}
      ],
      formAddContent:{ //弹窗数据--新增
      	businessLicenseUrl: '',
      	cybercafeUrl : '',
      	accessWay: '',
      	businessState : '',
      	cameraNum : '',
      	companyName : '',
      	computerNum : '',
      	cybercafeName : '',
      	cybercafeSite : '',
      	cybercafeTelephone : '',
      	identityCard : '',
      	ipAddressed : '',
      	legalUser : '',
      	legalUserTelephone : '',
      	multipleShop : '',
      	operator : '',
      	operatorTelephone : '',
      	policeId : '',
      	policeName : '',
      	serviceProvider : '',
      	star : '',
      	startDateTime : ''
      },
      formCheckContent:{ //弹窗数据--查看
      	businessLicenseUrl: '',
      	cybercafeUrl : '',
      	accessWay: '',
      	businessState : '',
      	cameraNum : '',
      	companyName : '',
      	computerNum : '',
      	cybercafeName : '',
      	cybercafeSite : '',
      	cybercafeTelephone : '',
      	identityCard : '',
      	ipAddressed : '',
      	legalUser : '',
      	legalUserTelephone : '',
      	multipleShop : '',
      	operator : '',
      	operatorTelephone : '',
      	policeId : '',
      	policeName : '',
      	serviceProvider : '',
      	star : '',
      	startDateTime : ''
      },
      formAmendContent:{ //弹窗数据--修改
      	businessLicenseUrl: '',
      	cybercafeUrl : '',
      	accessWay: '',
      	businessState : '',
      	cameraNum : '',
      	companyName : '',
      	computerNum : '',
      	cybercafeName : '',
      	cybercafeSite : '',
      	cybercafeTelephone : '',
      	identityCard : '',
      	ipAddressed : '',
      	legalUser : '',
      	legalUserTelephone : '',
      	multipleShop : '',
      	operator : '',
      	operatorTelephone : '',
      	policeId : '',
      	policeName : '',
      	serviceProvider : '',
      	star : '',
      	startDateTime : ''
      },
      formAddContentRules : {
      		cybercafeName : [{ required: true, message: '网吧名称不能为空', trigger: 'blur' }],
      		companyName : [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
      		cybercafeSite : [{ required: true, message: '网吧地址不能为空', trigger: 'blur' }],
      		legalUser : [{ required: true, message: '法人不能为空', trigger: 'blur' }],
      		legalUserTelephone : [{ required: true, message: '法人电话不能为空', trigger: 'blur' }],
      		identityCard : [{ required: true, message: '身份证不能为空', trigger: 'blur' }],
      		computerNum : [{ required: true, message: '电脑数量不能为空', trigger: 'blur' }],
      		policeId : [{ required: true, message: '所属派出所不能为空', trigger: 'blur' }],
      		businessState : [{ required: true, message: '营业状态不能为空', trigger: 'blur' }],
     	},
     	formAmendContentRules : {
      		cybercafeName : [{ required: true, message: '网吧名称不能为空', trigger: 'blur' }],
      		companyName : [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
      		cybercafeSite : [{ required: true, message: '网吧地址不能为空', trigger: 'blur' }],
      		legalUser : [{ required: true, message: '法人不能为空', trigger: 'blur' }],
      		legalUserTelephone : [{ required: true, message: '法人电话不能为空', trigger: 'blur' }],
      		identityCard : [{ required: true, message: '身份证不能为空', trigger: 'blur' }],
      		computerNum : [{ required: true, message: '电脑数量不能为空', trigger: 'blur' }],
      		policeId : [{ required: true, message: '所属派出所不能为空', trigger: 'blur' }],
      		businessState : [{ required: true, message: '营业状态不能为空', trigger: 'blur' }],
     	},
      startLevel:[], //星级列表
      businessState:[], //营业状态列表
      alliance:[], //是否连锁列表
      businessStateData:[],
      policeIdLists:[],
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
    	formCheckContentWidth:'120px', 
    	checkContentFormItemWidth:'320px',  //forItme的宽度--查看
    	checkSaveLoading:false,  //按钮加载画面--查看
    	formAmendContentWidth:'120px', 
    	amendContentFormItemWidth:'320px',  //forItme的宽度--修改
    	amendSaveLoading:false,  //按钮加载画面--修改
    	file:null,
    	formAmendContentId:null, //修改的id
    	userData:null
    }
  },
  methods:{
		getFileAdd(event){ //网吧照片提交
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
								
								this.formAddContent.cybercafeUrl = uploadImg + '/' + res.data.fileName 
							}
							
							
						}).catch((err) =>{
							console.log(err)
						})
						
		},
		getFileAdd2(event){ //营业执照提交
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
								this.formAddContent.businessLicenseUrl = uploadImg + '/' + res.data.fileName 
							}
						}).catch((err) =>{
							console.log(err)
						})
						
		},
		getFileAmend(event){ //网吧照片提交
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
						this.formAmendContent.cybercafeUrl = uploadImg + '/' + res.data.fileName 
					}
					
				}).catch((err) =>{
					console.log(err)
				})
						
		},
		getFileAmend2(event){ //营业执照提交
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
						this.formAmendContent.businessLicenseUrl = uploadImg + '/' + res.data.fileName 
					}
				}).catch((err) =>{
					console.log(err)
				})
						
		},
  	getUsers(){
  		this.listLoading = true;
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
  				businessState: this.filters.businessState
  		};
  		getCybercafeInforTable(para).then((res) =>{
  			
  			if(res.data && res.data.code == "1"){
  				this.listLoading = false;
  				console.log(res)
  				this.tableData = res.data.data
  				this.total = res.data.total;
  			}
  				
  		}).catch((err) =>{
  			console.log(err)
  		})
  	},
  	
  	handleSizeChange(val){
  		console.log(`每页 ${val} 条`);
  		
  	},
  	handleCurrentChange(val){
  		console.log(`当前页码${val}`)
  		this.tablePage = val;
			this.getUsers();
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
			getCybercafeInforTableCheck(para).then((res) =>{
				
				if(res.data && res.data.code =="1"){
					
					console.log(res.data.data)
					res.data.data.policeId = (res.data.data.policeId).toString()
					res.data.data.businessState = (res.data.data.businessState).toString();
					res.data.data.star = (res.data.data.star).toString();
					res.data.data.multipleShop = (res.data.data.multipleShop).toString();
					this.formCheckContent = Object.assign({},res.data.data);
					console.log(this.formCheckContent)
				}
				
			}).catch((err) =>{
				console.log(err)
			})
	  		
			
		},
		handleRemove(file, fileList) { //上传文件链接时的钩子
			
	    console.log(file, fileList);
	    console.log(file.response)
	  },
	  handlePreview(file) { //文件列表移除时
	  	
	    console.log(file);
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
			  				id: row.id
			  		};
						
						getCybercafeInforTableDelete(para).then((res) =>{
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
			this.amendContent = true;
			this.formAmendContentId = row.id;
			let portParameter = this.$store.getters.getPortParameter;
			let userData = this.$store.getters.getUserData;
			let para = {
				system : portParameter.system,
				token : this.userData.get('token'),
	  		userId : this.userData.get('userId'),
			  version : portParameter.version,
			  id : row.id
			}
			getCybercafeInforTableCheck(para).then((res) =>{
				
				if(res.data && res.data.code =="1"){
					console.log(res.data.data)
					res.data.data.policeId = (res.data.data.policeId).toString()
					res.data.data.businessState = (res.data.data.businessState).toString();
					res.data.data.star = (res.data.data.star).toString();
					res.data.data.computerNum = (res.data.data.computerNum).toString();
					res.data.data.multipleShop = (res.data.data.multipleShop).toString();
					this.formAmendContent = Object.assign({},res.data.data)
				}
				
			}).catch((err) =>{
				console.log(err)
			})
			
		},
		addMessage(){ //新增
			this.addContent = true;
		},
		submitAddContent(formAddContent){  //弹窗信息保存--新增
			
			this.$confirm('确定要新增该网吧信息吗？','提示',{
			
					type : 'warning'
					
				}).then((res) =>{
					
						this.$refs[formAddContent].validate((valid) =>{
							if(valid){
									console.log(this.formAddContent)
									this.addSaveLoading = true;
									let portParameter = this.$store.getters.getPortParameter;
									let dateTimeList = null ;
									if(this.formAddContent.startDateTime){
						  			dateTimeList = this.formatDateTime(this.formAddContent.startDateTime);
						  		}else{
						  			dateTimeList = ''
						  		};
							
						  		let para = {
						  				system : portParameter.system,
						  				token : this.userData.get('token'),
	  									userId : this.userData.get('userId'),
						  				version : portParameter.version,
						  				accessWay : this.formAddContent.accessWay,
											businessLicenseUrl : this.formAddContent.businessLicenseUrl,
							      	businessState : this.formAddContent.businessState,
							      	cameraNum : this.formAddContent.cameraNum,
							      	companyName : this.formAddContent.companyName,
							      	computerNum : this.formAddContent.computerNum,
							      	cybercafeName : this.formAddContent.cybercafeName,
							      	cybercafeSite : this.formAddContent.cybercafeSite,
							      	cybercafeTelephone : this.formAddContent.cybercafeTelephone,
							      	cybercafeUrl : this.formAddContent.cybercafeUrl,
							      	identityCard : this.formAddContent.identityCard,
							      	ipAddressed : this.formAddContent.ipAddressed,
							      	legalUser : this.formAddContent.legalUser,
							      	legalUserTelephone : this.formAddContent.legalUserTelephone,
							      	multipleShop : this.formAddContent.multipleShop,
							      	operator : this.formAddContent.operator,
							      	operatorTelephone : this.formAddContent.operatorTelephone,
							      	policeId : this.formAddContent.policeId,
							      	policeName : this.formAddContent.policeName,
							      	serviceProvider : this.formAddContent.serviceProvider,
							      	star : this.formAddContent.star,
							      	startDateTime : dateTimeList
						  		};
									console.log(para)
									getCybercafeInforTableAdd(para).then((res) =>{
											this.addSaveLoading = false;
											if(res.data && res.data.code =='1'){
												
												this.$message({
													message:'保存成功',
													type:'success'
												})
												
												this.$refs[formAddContent].resetFields();
												this.formAddContent.businessLicenseUrl = '';
												this.formAddContent.cybercafeUrl = '';
												this.$refs.addFileId.value = '';
												this.$refs.addFile2Id.value = ''
												
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
		submitAmendContent(formAmendContent){ //弹窗保存--修改
			
			this.$confirm('确定要修改该网吧信息吗？','提示',{
			
					type : 'warning'
					
				}).then((res) =>{
						
						this.$refs[formAmendContent].validate((valid) =>{
							if(valid){
									this.amendSaveLoading = true;
									let portParameter = this.$store.getters.getPortParameter;
//						  		let userData = this.$store.getters.getUserData;
									let dateTimeList = null ;
									if(this.formAmendContent.startDateTime){
						  			dateTimeList = this.formatDateTime(this.formAmendContent.startDateTime);
						  		}else{
						  			dateTimeList = ''
						  		};
						  		
						  		let para = {
						  				system : portParameter.system,
						  				token : this.userData.get('token'),
	  									userId : this.userData.get('userId'),
						  				version : portParameter.version,
						  				accessWay : this.formAmendContent.accessWay,
											businessLicenseUrl : this.formAmendContent.businessLicenseUrl,
							      	businessState : this.formAmendContent.businessState,
							      	cameraNum : this.formAmendContent.cameraNum,
							      	companyName : this.formAmendContent.companyName,
							      	computerNum : this.formAmendContent.computerNum,
							      	cybercafeName : this.formAmendContent.cybercafeName,
							      	cybercafeSite : this.formAmendContent.cybercafeSite,
							      	cybercafeTelephone : this.formAmendContent.cybercafeTelephone,
							      	cybercafeUrl : this.formAmendContent.cybercafeUrl,
							      	identityCard : this.formAmendContent.identityCard,
							      	ipAddressed : this.formAmendContent.ipAddressed,
							      	legalUser : this.formAmendContent.legalUser,
							      	legalUserTelephone : this.formAmendContent.legalUserTelephone,
							      	multipleShop : this.formAmendContent.multipleShop,
							      	operator : this.formAmendContent.operator,
							      	operatorTelephone : this.formAmendContent.operatorTelephone,
							      	policeId : this.formAmendContent.policeId,
							      	policeName : this.formAmendContent.policeName,
							      	serviceProvider : this.formAmendContent.serviceProvider,
							      	star : this.formAmendContent.star,
							      	startDateTime : dateTimeList,
							      	id : this.formAmendContentId
						  		};
									console.log(para)
									getCybercafeInforTableAmend(para).then((res) =>{
											this.amendSaveLoading = false;
											if(res.data && res.data.code =='1'){
												
												this.$message({
													message:'保存成功',
													type:'success'
												})
												
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
									})
									
							}else{
								return false;
							}
						});
						
			}).catch((err) =>{
						console.log(err)
				});
		},
		formAddContentClose(formAddContent){ //关闭弹窗清楚数据--新增
			this.$refs[formAddContent].resetFields();
			this.$refs.addFileId.value = '';
			this.$refs.addFile2Id.value = '';
			
		},
		formCheckContentClose(formCheckContent){ //关闭弹窗清楚数据--查看
			this.$refs[formCheckContent].resetFields();
//			this.$refs.checkFileId.value = '';
//			this.$refs.checkFile2Id.value = '';
			this.formCheckContent.businessLicenseUrl = '';
			this.formCheckContent.cybercafeUrl = '';
		},
		formAmendContentClose(formAmendContent){ //关闭弹窗清楚数据--修改
			this.$refs[formAmendContent].resetFields();
			this.amendSaveLoading = false;
			this.$refs.amendFileId.value = '';
			this.$refs.amendFile2Id.value = '';
			this.formAmendContent.businessLicenseUrl = '';
			this.formAmendContent.cybercafeUrl = '';
			
		},
		getUserData(){
			let data = JSON.parse(sessionStorage.getItem('userinfo'));
			let map = new Map(data);
			this.userData = map
			console.log(this.userData.get('token'))
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
					  						this.filters.policeId = value.policeId;
					  						this.formAddContent.policeId = value.policeId;
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
  	this.startLevel = startLevel;
  	console.log(startLevel)
  	this.businessState = businessState;
  	this.alliance = alliance;
  	
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.cybercafe_infor_Dialog .el-dialog--small{
	width:1100px;
}
</style>

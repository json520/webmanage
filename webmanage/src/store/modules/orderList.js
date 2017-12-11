import axios from 'axios'
import { getPoliceAllMsg } from 'api'

let state = {
	rowList : '', //首页导航列表男频女频
	params :{ //接口请求参数
		version : '1.0.0',
		system	: 'h5',						
		prefix	: 'http://10.10.16.105:8080/'	  //接口前缀
		
//		'http://139.196.150.50:8086'
	},
	userData:{
		userId:'userId',  //登陆用户Id
		token : 'tokenId',
		userName: '账号人名字',
		userAcountType:'1'
	},
	policeIdList:[]
}

const getters = {
	getOrderList : state => state.rowList,
	getPoliceAllMsg : state => state.policeIdList,
	getUserData : state => state.userData,
	getPortParameter : state => state.params
	//第一个state是传入的参数，第二个是返回的数据
	//	getOrderList : function(state){
	//		return state.rowList
	//	}
}

const actions = { //在外部被调用
	//获取所有的派出所Id
	getAjaxPoliceAllMessage ({commit,state}){ //uuid参数可以动态传递
		
//		let portUrl = state.params.prefix+'/getAlluserLists'
//		axios.get(portUrl,{
//			params :{
//				system	: state.params.system,
//				version : state.params.version,
//				userId  : state.userId,
//				token 	: state.token
//			}
//		})
//		.then((response) =>{
//			//调用mutations方法给操作state的数据，actions是不能直接对state操作
//			
//			let getList = response.data.data
//		
//			commit('updatePoliceIdList',getList)
//		})
//		.catch((error) =>{
//			console.log(error)
//		})
//		alert(getPoliceAllMsg)
		let data = JSON.parse(sessionStorage.getItem('userinfo'));
		let map = new Map(data);
		let para = {
			system	: state.params.system,
			version : state.params.version,
			userId  : map.get('userId'),
			token 	: map.get('token')
		};
		getPoliceAllMsg(para).then((res) =>{
			console.log(res)
			let getList = res.data.data;
			
			commit('updatePoliceIdList',getList);
		})
		.catch((err) =>{
			console.log(err)
		})
		
	}
	
}

const mutations = {
	updatePoliceIdList (state,orderList){
		//第一个state是数据，第二个是调用的时候传入的参数
		state.policeIdList = orderList;
		
	}
}


export default { //向外暴露所有数据
	state,
	getters,
	actions,
	mutations
}

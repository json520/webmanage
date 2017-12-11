import Mock from 'mockjs'; //引入mockjs生成数据
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '谢文东'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
	Users.push(Mock.mock({
	  id: Mock.Random.guid(), //随机生成一个GUID!类似uuid
	  name: Mock.Random.cname(), //生成中文姓名
	  addr: Mock.mock('@county(true)'),//随机生成一个县！生成所属的省市！
	  'age|18-60': 1,
	  birth: Mock.Random.date(),
	  sex: Mock.Random.integer(0, 1)
	}));
}

const InquireList = [];

for (let i = 0; i < 86; i++) {
  InquireList.push(Mock.mock({
  	type: Mock.Random.integer(0,1),
  	title: Mock.Random.ctitle(6,12),
  	text:Mock.Random.cword(20,50),
  	date: Mock.Random.datetime(),
  	name: Mock.Random.cname(), //生成中文姓名
    id: Mock.Random.guid()//随机生成一个GUID!类似uuid
  }));
}


//首页图表
const chartTable = {
	
	informList : {
		check : 90,  //返回一个随机的自然数(大于等于0的整数)
		noCheck :10,
		total : 100
	},
	clueList : {
		endRead : 80,
		noneRead : 20,
		total : 100
	},
	detectiveList : {
		abnormal : 10,
		offLine : 20,
		onLine : 70,
		total : 100
	},
	 faceContrastList : {
	 	abnormal : 30,
	 	normal : 40,
	 	total : 70
	 },
	 fireFightList : {
	 	endPatrolCybercafe : 100,
	 	nonePatrolCybercafe : 30,
	 	total : 130
	 },
	 inspectList : {
	 	disqualification : 100,
	 	 qualified : 200,
	 	 total : 300
	 },
	 videoList : {
	 	endPatrolCamera : 100,
	 	nonePatrolCamera : 10,
	 	endPatrolCybercafe : 100,
	 	nonePatrolCybercafe :10,
	 	partPatrolCybercafe : 20,
	 	violationCybercofe : 30,
	 	total : 270
	 }
	 
	
};

//所有派出所id
const policeAllId = [];

let policeName = ["西溪派出所","古荡湾派出所","文新派出所","三墩派出所","玉泉派出所","蒋村派出所"]
for(let i = 0 ; i < 6 ; i ++){
		policeAllId.push(Mock.mock({
				policeId : i+1 ,
				name : policeName[i]
		}));
}

const informStatisticsTable = [];

Mock.Random.extend({
		constPoliceName : function(date){
			let constPoliceNames = ["西溪派出所","古荡湾派出所","文新派出所","三墩派出所","玉泉派出所","蒋村派出所"];
			return this.pick(constPoliceNames);
		}
})

for(let i = 0 ; i < 20 ; i++){
	informStatisticsTable.push(Mock.mock({
			id : i,
			policeId:Mock.Random.natural(1,6),
			informNum : Mock.Random.natural(1,100),
			policeName : '@CONSTPOLICENAME',
			signProbability : Mock.Random.float(0,1,1,9),
			unsignProbability:Mock.Random.float(0,1,1,9)
			
	}))
}


export { LoginUsers, Users, InquireList, chartTable, policeAllId , informStatisticsTable };

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users ,InquireList ,chartTable ,policeAllId ,informStatisticsTable } from './data/user';
let _Users = Users;
let _InquireList = InquireList; 


export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name , date} = config.params; //config.params是穿过来的参数
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1 && date && user.date.indexOf(date) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      console.log(1)
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      //filter这段不懂！大概意思是20为一个分页!少于20也为一个分页！
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });
 
      // 获取inform/Inquire的table数据
    mock.onGet('/inform/inquireTableList').reply(config =>{
    	let { page , name } = config.params;
    	let mockTableList = _InquireList.filter(user => {
    			if(name && user.name.indexOf(name) == -1){
    				return false;
    			}else{
    				return true;
    			}
    	})
    	console.log(config.params)
    	let total = mockTableList.length;
      mockTableList = mockTableList.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      //filter这段不懂！大概意思是20为一个分页!少于20也为一个分页！
      
    	return new Promise((resolve,reject) => {
    		setTimeout(() => {
    			resolve([200, {
    				users: mockTableList,
    				total:total
    			}]);
    		},1000)
    	})
    	
    })

	/** 华丽分割线 **/
	
		//首页图表
		mock.onGet('/getChartAllLists').reply(config =>{
			 let { system , token , userId , version } = config.params;
			 let mockTableList  = chartTable;
			 
			 return new Promise((resolve,reject) => {
			 	setTimeout(() =>{
			 		resolve([200,{
			 			data : mockTableList,
			 			msg : 'success',
			 			code : '1'
			 		}])
			 	},1000)
			 })
			 
		});
		
		// 获取所有派出所的id
		mock.onGet('/getPoliceAllMsg').reply(config =>{
			let { system , token ,userId , version } = config.params ;
			let mockTableList = policeAllId;
			
			return new Promise((resolve,reject) => {
				setTimeout(() =>{
					resolve([200,{
						data : mockTableList,
						msg  : 'success',
						code : '1'
					}])
				})
			})
		});
		
		//获取通知管理的通知统计和查询数据
		mock.onGet('/getInformStatisticsTable').reply(config =>{
			let { endDateTime , startDateTime , Page , policeId }  = config.params ; 
			let mockTableList = informStatisticsTable;
			
			return new Promise((resolve,reject) =>{
				setTimeout(() =>{
					resolve([200,{
						data : mockTableList,
						msg  : 'success',
						code : '1',
						total:300
					}])
				})
			})
			
		})
	
  }
};
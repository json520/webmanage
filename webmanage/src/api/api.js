import axios from 'axios';

let base = '';

//let apiPort = 'http://192.168.1.20:8089/WbProject';
//export const uploadImg = 'http://192.168.1.20:8089/WbProject'
let apiPort = 'http://192.168.1.9:9090/WbProject/';
export const uploadImg = 'http://192.168.1.9:9090/WbProject/'
export const videoImg = ''  //视频图片地址前缀

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//export const getInquire = params =>{return axios.get(`${base}/inform/inquireTableList`,{ params : params }); };


//真实数据接口
var qs = require('qs');

//1.用户登录

export const getLogin = params =>{ return axios.post(`${apiPort}/getLogin.do`,qs.stringify(params)) ;}; 
//export const getLogin = params =>{ return axios.post(`${apiPort}/getLogin.do`,{ params : params }) ;}; 
//2.退出登录
export const loginOut = params =>{ return axios.post(`${apiPort}/loginOut.do`,{ params : params }) ;}; 


//1.首页获取图表
export const getChartAllLists = params =>{return axios.get(`${apiPort}/getChartAllLists.do`,{ params : params }) ;}; 


//公共数据
//获取所有派出所Id
export const getPoliceAllMsg = params =>{ return axios.get(`${apiPort}/getAlluserLists.do`,{ params : params }) ;};
//通过派出所id获取下面网吧

export const getCybercafeByPoliceId = params =>{ return axios.get(`${apiPort}/getCybercafeByPoliceId.do`,{ params : params }) ;};


//******  通知管理  	******
//1.通知协查获取表格数据和查询
export const getInformInquireTable = params =>{ return axios.get(`${apiPort}/getInformInquireTable.do`,{ params : params }); };
//1.2通知协查新增
export const getInformInquireTableAdd = params =>{ return axios.get(`${apiPort}/getInformInquireTableAdd.do`,{ params : params }); };
//1.3通知协查删除
export const getInformInquireTableDelete = params =>{ return axios.get(`${apiPort}/getInformInquireTableDelete.do`,{ params : params }); };


//2.通知统计获取表格数据和查询
export const getInformStatisticsTable = params =>{ return axios.get(`${apiPort}/getInformStatisticsTable.do`,{ params : params}); };
//2.2通知统计弹窗表格未签收数据
export const getInquireStatisticsUnsign = params =>{ return axios.get(`${apiPort}/getInquireStatisticsUnsign.do`,{ params : params}); };



//******   网络神探 	 ******  

//1.神探状态表格数据
export const getDetectiveStateTable = params => { return axios.get(`${apiPort}/getDetectiveStateTable.do`,{ params : params }) ;};

//2.神探统计表格数据
export const getDetecitveStatisticsTable = params => { return axios.get(`${apiPort}/getDetecitveStatisticsTable.do`,{ params : params }) ;};


//******  视频巡查  	******  

//1.巡查统计表格数据
export const getVideoPatrolTable = params => { return axios.get(`${apiPort}/getVideoPatrolTable.do`,{ params : params }) ;};

//2.违规统计表格数据
export const getVideoViolateTable = params => { return axios.get(`${apiPort}/getVideoViolateTable.do`,{ params : params }) ;};
//2.2违规统计弹窗表格查看详情
export const getVideoViolateTableDetails = params => { return axios.get(`${apiPort}/getVideoViolateTableDetails.do`,{ params : params }) ;};

//3.违规内容表格数据
export const getVideoContentTable = params => { return axios.get(`${apiPort}/getVideoContentTable.do`,{ params : params }) ;};



//******  现场检查		******  
//1.检查记录表格数据
export const getInspectRecordTable = params => { return axios.get(`${apiPort}/getInspectRecordTable.do`,{ params : params }) ;};
//1.2检查记录删除
export const getInspectRecordDelete = params => { return axios.get(`${apiPort}/getInspectRecordDelete.do`,{ params : params }) ;};

//1.3检查记录查看
export const getInspectRecordCheck = params => { return axios.get(`${apiPort}/getInspectRecordCheck.do`,{ params : params }) ;};

//2.检查统计表格数据
export const getInspectStatisticsTable = params => { return axios.get(`${apiPort}/getInspectStatisticsTable.do`,{ params : params }) ;};


//******  消防自查		******  
//1.自查记录表格数据
export const getFirefightingRecordTable = params => { return axios.get(`${apiPort}/getFirefightingRecordTable.do`,{ params : params }) ;};
//1.2自查记录删除
export const getFirefightingRecordTableDelete = params => { return axios.get(`${apiPort}/getFirefightingRecordTableDelete.do`,{ params : params }) ;};
//1.3自查记录查看
export const getFirefightingRecordTableCheck = params => { return axios.get(`${apiPort}/getFirefightingRecordTableCheck.do`,{ params : params }) ;};

//2.自查统计表格数据
export const getFirefightingStatisticsTable = params => { return axios.get(`${apiPort}/getFirefightingStatisticsTable.do`,{ params : params }) ;};


//******   线索上报	******  
//1.线索上报表格数据
export const getClueReportedTable = params => { return axios.get(`${apiPort}/getClueReportedTable.do`,{ params : params }) ;};
//1.2线索删除
export const getClueReportedTableDelete = params => { return axios.get(`${apiPort}/getClueReportedTableDelete.do`,{ params : params }) ;};
//1.3线索查看
export const getClueReportedTableCheck = params => { return axios.get(`${apiPort}/getClueReportedTableCheck.do`,{ params : params }) ;};

//1.4线索阅读
export const getClueReportedTableRead = params => { return axios.get(`${apiPort}/getClueReportedTableRead.do`,{ params : params }) ;};


//2.上报统计表格数据
export const getClueStatisticsTable = params => { return axios.get(`${apiPort}/getClueStatisticsTable.do`,{ params : params }) ;};


//******  网吧管理		******  
//1.网吧信息表格数据
export const getCybercafeInforTable = params => { return axios.get(`${apiPort}/getCybercafeInforTable.do`,{ params : params }) ;};
//1.2网吧信息查看
export const getCybercafeInforTableCheck = params => { return axios.get(`${apiPort}/getCybercafeInforTableCheck.do`,{ params : params }) ;};
//1.3网吧信息新增
export const getCybercafeInforTableAdd = params => { return axios.get(`${apiPort}/getCybercafeInforTableAdd.do`,{ params : params }) ;};
//1.4网吧信息删除
export const getCybercafeInforTableDelete = params => { return axios.get(`${apiPort}/getCybercafeInforTableDelete.do`,{ params : params }) ;};
//1.5网吧信息修改
export const getCybercafeInforTableAmend = params => { return axios.get(`${apiPort}/getCybercafeInforTableAmend.do`,{ params : params }) ;};


//2.网吧人员表格数据
export const getCybercafeUserTable = params => { return axios.get(`${apiPort}/getCybercafeUserTable.do`,{ params : params }) ;};
//2.2网吧人员查看
export const getCybercafeUserTableCheck = params => { return axios.get(`${apiPort}/getCybercafeUserTableCheck.do`,{ params : params }) ;};
//2.3网吧人员新增
export const getCybercafeUserTableAdd = params => { return axios.get(`${apiPort}/getCybercafeUserTableAdd.do`,{ params : params }) ;};
//2.4网吧人员删除
export const getCybercafeUserTableDelete = params => { return axios.get(`${apiPort}/getCybercafeUserTableDelete.do`,{ params : params }) ;};
//2.5网吧人员修改
export const getCybercafeUserTableAmend = params => { return axios.get(`${apiPort}/getCybercafeUserTableAmend.do`,{ params : params }) ;};


//******  单位管理		******  
//1.单位信息表格数据
export const getUnitInforTable = params => { return axios.get(`${apiPort}/getUnitInforTable.do`,{ params : params }) ;};
//1.2单位信息新增
export const getUnitInforTableAdd = params => { return axios.get(`${apiPort}/getUnitInforTableAdd.do`,{ params : params }) ;};
//1.3单位信息修改
export const getUnitInforTableAmend = params => { return axios.get(`${apiPort}/getUnitInforTableAmend.do`,{ params : params }) ;};
//1.3单位信息查看
export const getUnitInforTableCheck = params => { return axios.get(`${apiPort}/getUnitInforTableCheck.do`,{ params : params }) ;};


//2.单位人员表格数据
export const getUnitUserTable = params => { return axios.get(`${apiPort}/getUnitUserTable.do`,{ params : params }) ;};
//2.2单位人员新增
export const getUnitUserTableAdd = params => { return axios.get(`${apiPort}/getUnitUserTableAdd.do`,{ params : params }) ;};
//3.3单位人员修改
export const getUnitUserTableAmend = params => { return axios.get(`${apiPort}/getUnitUserTableAmend.do`,{ params : params }) ;};
//3.4单位人员删除
export const getUnitUserTableDelete = params => { return axios.get(`${apiPort}/getUnitUserTableDelete.do`,{ params : params }) ;};
//3.5单位人员查看
export const getUnitUserTableCheck = params => { return axios.get(`${apiPort}/getUnitUserTableCheck.do`,{ params : params }) ;};



//******  用户管理		******  
//1. 账号管理的表格数据和综合查询
export const getUserAcountTable = params => { return axios.get(`${apiPort}/getUserAcountTable.do`,{ params : params }) ;};
//1.2 账号管理的注销
export const getUserAcountTableLogout = params => { return axios.get(`${apiPort}/getUserAcountTableLogout.do`,{ params : params }) ;};
//1.3 账号管理的取消注销
export const getUserAcountTableUnlogout = params => { return axios.get(`${apiPort}/getUserAcountTableUnlogout.do`,{ params : params }) ;};
//1.4 账号管理的新增
export const getUserAcountTableAdd = params => { return axios.get(`${apiPort}/getUserAcountTableAdd.do`,{ params : params }) ;};
//1.5 账号管理的修改
export const getUserAcountTableAmend = params => { return axios.get(`${apiPort}/getUserAcountTableAmend.do`,{ params : params }) ;};
//1.6 账号管理的查看
export const getUserAcountTableCheck = params => { return axios.get(`${apiPort}/getUserAcountTableCheck.do`,{ params : params }) ;};


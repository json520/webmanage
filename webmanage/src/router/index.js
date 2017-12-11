import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import VLogin from '@/view/login'
import VIdex from '@/view/index'
import VInformInquire from '@/view/inform/Inquire'
import VInformStatistics from '@/view/inform/Statistics'
import VDetectiveState from '@/view/detective/State'
import VDetectiveStatistics from '@/view/detective/Statistics'
import VVideoPatrol from '@/view/video/Patrol'
import VVideoViolate from '@/view/video/Violate'
import VVideoContent from '@/view/video/Content'
import VInspectRecord from '@/view/inspect/Record'
import VInspectStatistics from '@/view/inspect/Statistics'
import VFireFightingRecord from '@/view/fireFighting/Record'
import VFireFightingStatistics from '@/view/fireFighting/Statistics'
import VClueReported from '@/view/clue/Reported'
import VClueStatistics from '@/view/clue/Statistics'
import VCybercafeInfor from '@/view/cybercafe/Infor'
import VCybercafeUser  from '@/view/cybercafe/User'
import VUnitInfor from '@/view/unit/Infor'
import VUnitUser from '@/view/unit/User'
import VUserAcount from '@/view/user/Acount'
import VChart from '@/view/chart/chart'
import NotFound from '@/view/404'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: VLogin,
      hidden:true
    },
    {
    	path:'/',
    	name:'首页1',
    	component:VIdex,
    	leaf:true,
    	children:[
    			{path:'/index',name:'首页',component:VChart}
    	]
    },
//  {
//  	path:'/index',
//  	name:'首页1',
//  	component:VChart
//  },
    {
    	path:'/inform',
    	name:'通知管理',
    	component:VIdex,
    	children:[
    			{path:'/inform/inquire',name:'通知协查',component:VInformInquire},
    			{path:'/inform/statistics',name:'通知统计',component:VInformStatistics}
    	]
    },
    {
    	path:'/detective',
    	name:'网络神探',
    	component:VIdex,
    	children:[
    			{path:'/detective/state',name:'神探状态',component:VDetectiveState},
    			{path:'/detective/statistics',name:'神探统计',component:VDetectiveStatistics}
    	]
    },
    {
    	path:'/video',
    	name:'视频巡查',
    	component:VIdex,
    	children:[
    			{path:'/video/patrol',name:'巡查统计',component:VVideoPatrol},
    			{path:'/video/violate',name:'违规统计',component:VVideoViolate},
    			{path:'/video/content',name:'巡查内容',component:VVideoContent}
    	]
    },
    {
    	path:'/inspect',
    	name:'现场检查',
    	component:VIdex,
    	children:[
    		{path:'/inspect/record',name:'检查记录',component:VInspectRecord},
    		{path:'/inspect/statistics',name:'检查统计',component:VInspectStatistics}
    	]
    },
    {
    	path:'/firefighting',
    	name:'消防自查',
    	component:VIdex,
    	children:[
    		{path:'/firefighting/record',name:'自查记录',component:VFireFightingRecord},
    		{path:'/firefighting/statistics',name:'自查统计',component:VFireFightingStatistics}
    	]
    },
    {
    	path:'/clue',
    	name:'线索上报',
    	component:VIdex,
    	children:[
    		{path:'/clue/record',name:'线索上报',component:VClueReported},
    		{path:'/clue/statistics',name:'上报统计',component:VClueStatistics}
    	]
    },
    {
    	path:'/cybercafe',
    	name:'网吧管理',
    	component:VIdex,
    	children:[
    		{path:'/cybercafe/infor',name:'网吧信息',component:VCybercafeInfor},
    		{path:'/cybercafe/user',name:'网吧人员',component:VCybercafeUser}
    	]
    },
    {
    	path:'/unit',
    	name:'单位管理',
    	component:VIdex,
    	children:[
    		{path:'/unit/infor',name:'单位信息',component:VUnitInfor},
    		{path:'/unit/user',name:'单位人员',component:VUnitUser}
    	]
    },
    {
    	path:'/user',
    	name:'账户管理',
    	component:VIdex,
    	leaf:true,
    	children:[
    		{path:'/user/acount',name:'用户管理',component:VUserAcount}
    	]
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
  ]
})

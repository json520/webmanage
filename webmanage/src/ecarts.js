this.echartsBox.setOption({
                  tooltip:{ //鼠标停留显示
                  	trigger : 'item',
                  	formatter: '{a} <br/> {b} : {c} ({d}%)'
                  },
                  series:[  //图形配置
                  	{
                  		type : 'pie',  //图形的类型
                  		name : '访问来源', //tooltip的标题
                  		radius: ['40%' , '70%'], //饼图的宽度
                  		avoidLabelOverlap: true, //防止标签重叠
                  		startAngle:90,  //起始角度
                  		clockwise: false ,
                  		label : { //饼图上面的标签
                  			normal: { //默认标签
                  				show: true,
                  				position: 'insideTop', //标签与图形的位置
                  				formatter : '{b}:{c}', //显示何种文本样式
                  				textStyle :{  //字体样式
                  						color : '#000',
                  						fontSize: 16
                  				}
                  			}
                  		},
                  		labelLine:{ //标签线
                  			normal:{
                  				show: false
                  			}
                  		},
                  		data:[ //数据
                  			{name: '签收率', value: '20%'},
                  			{name: '未签收率', value: '80%'}
                  		]
                  	}
                  ],
                   color:['#48a7ff','#c196ff',] //默认的颜色
                  
               });
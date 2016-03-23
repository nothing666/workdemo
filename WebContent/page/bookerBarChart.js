$(function(){
	
	 var wid = $(document.body).width();
	 var height = $(document.body).height();
	 
	 
	 $('#showpage').height(height-100);
	 
	/* $('#main').width(wid-200);
	 $('#main').height(height-400);
	 $('#detailsTableContain').width(wid-20);
	 $('#detailsTableContain').height(height-700);*/
	 debugger;

	  //获取后台数据
	  var resultStr = $('#result').val();
	  var result = jQuery.parseJSON(resultStr);
	  var mail = result.mail;
	  var mlist = result.passengers;
	  var booker = result.booker;
	  
	  //给姓名以及邮箱进行赋值
	  $('#bookerId').html(booker+"&nbsp;");
	  $('#mailId').html(mail);
		
	  var xData= [];
	  var yData = [];
	 
	 for(var i=0;i<mlist.length;i++){
		 xData.push(mlist[i].x);
		 yData.push(mlist[i].y);
	 };		
  
	    // Step:3 conifg ECharts's path, link to echarts.js from current page.
	    // Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
	    require.config({
	        paths: {
	            echarts: 'biz/www/js'
	        }
	    });
	    
	    // Step:4 require echarts and use it in the callback.
	    // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
	    require(
	        [
	            'echarts',
	            'echarts/chart/bar',
	            'echarts/chart/line',
	            'echarts/chart/map'
	        ],
	        function (ec) {
	            //--- 折柱 ---
	            var myChart = ec.init(document.getElementById('main'));
	            myChart.setOption({
	                tooltip : {
	                    trigger: 'axis'
	                },
	                legend: {
	                    data:['姓名']
	                },
	                toolbox: {
	                    show : true,
	                    feature : {
	                        mark : {show: false},
	                        dataView : {show: false, readOnly: false},
	                        magicType : {show: true, type: ['line', 'bar']},
	                        restore : {show: true},
	                        saveAsImage : {show: true}
	                    }
	                },
	                calculable : true,
	                xAxis : [
	                    {
	                        type : 'category',
	                        data : xData
	                    }
	                ],
	                yAxis : [
	                    {
	                        type : 'value',
	                        splitArea : {show : true}
	                    }
	                ],
	                series : [
	                    {
	                        name:'姓名',
	                        type:'bar',
	                        data:yData,
	                        barWidth :10
	                    }
	                ]
	            });
	        }
	    );
	    
	    //加载表格数据
	     $('#detailsTableContain').tablegrid({
			 url:'/rail/echart/selectComMailBookingPage.htm',
			 dataType:'json',
			 colModel:[{
		            display:'站点',
		            name:'site',
		            align:'center'
		         },{
		            display:'订票邮箱',
		            name:'bookingMail',
		            align:'center'
		         },{
			            display:'乘车人姓名',
			            name:'passenger',
			            align:'center'
			     },{
			            display:'乘车人手机号',
			            name:'pmobile',
			            align:'center'
			     },{
		            display:'乘车人身份证号',
		            name:'pcertificateCode',
		            align:'center'
		        },{
		            display:'车次',
		            name:'trainNumber',
		            align:'center'
		        },{
		            display:'出发站',
		            name:'departureStation',
		            align:'center'
		         },{
			        display:'到达站',
			        name:'terminalStation',
			        align:'center'
			     },{
		            display:'出发时间',
		            name:'trainTime',
		            align:'center',
		            formatter:function(value,row){
						return Zz.util.date.ShowDateTime(value);
					}
		        }],
			 usepager:true,
			 checkbox:true,
			 height:"auto",
			 width:'auto',
			 rp :5,
			 rpOptions: [5],
			 resizable: false,
			 sortname:'TRAINTIME',
			 sortorder:'desc',
			 params:{bookingMail:mail},
			 showToggleBtn: false
			 
				
		  }); 

	      $('#detailsTableContain').css("display","block");
});
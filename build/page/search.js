
/*定义数据统计全局变量 */

	var sjtj={};
	//乘车信息总条数
	sjtj.dpjlTitleNum=0;
	sjtj.ccjlTitleNum=0;
	
	//身份信息信息总条数
	sjtj.dprsfxxTitleNum=0;
	sjtj.ccrsfxxTitleNum=0;

/*定义数据统计全局变量  end*/
	
$(function(){
	
	//出发地选择
	$('.inputText').focus(function(){
		if($(this).hasClass('optionSelected')){
			$(".options").addClass("hide");
			$(this).parent().find('.options').removeClass('hide');
		}
	});
	//地点选择tab效果
	$('.optionSelected').each(function(){
		$(this).live('focus',function(){
			$(".options").addClass("hide");
			$(this).parent().find('.options').removeClass('hide');
		}); 
	});
	
	$('.specificOption').find('a').each(function(){
		$(this).live('click',function(){
			var oldValue = $(this).parents('.optionSelect').find('.optionSelected').val();
			var newValue = $(this).html();
			$(this).parents('.optionSelect').find('.optionSelected').val(newValue);
			$(this).parents('.optionSelect').find('.options').addClass('hide');
			//$('.optionSelected').removeClass('optionSeOpen');
			var changeFunction = $(this).parents('.optionSelect').find('.optionSelected').attr("changeFunction");
			if(oldValue!=newValue){
				eval(changeFunction);
			}
			
		});
	});	
	$(document).click(function(j){
		var $this=$(j.target);
		if($this.closest(".optionSelect").size() == 0 && $this.closest("#searchEunm").size() == 0){
			$(".options").addClass("hide");
			$('.optionSelected').removeClass('optionSeOpen');
		}
		// 页面尾部锁定
		$('.pageCont').css('min-height',$(window).height()-82);
	});
	$('.optionsType').find('li').each(function(w){
		$(this).find('a').live('click',function(){
			if(!($(this).hasClass('selt'))){
				$('.selt').removeClass('selt');
				$(this).addClass('selt');
				$('.tab').addClass('hide').eq(w).removeClass('hide');
			}
		});
	});
	$(document).click(function(j){
		var $this=$(j.target);
		if($this.closest(".sortItem ").size() == 0){
			$(".items").addClass("hide").removeAttr('style');
			$(".sortItem").find(".open").removeClass('open');
		}
	});
	
	Zz.search.searchTimeMethod();
	// 添加日期控件
	//timeMethod();
	// 添加容器数据信息
	$.ajax({
        type:'post',
        url:"/rail/searchEntry/queryContainerKp.do",
        cache:false,
        dataType:"json",
        success:function(data){
            $('.kpContain').container({
                dataJson:data,
                tools:[
                   {level:1,name:'一级开关',theclass:'titleSwitch_1',thevalue:"",handler:levelOneSwitch},
                    {level:1,name:'二次搜索',theclass:'titleSchSwitch',thevalue:"",handler:secondSch},
                   /*{level:2,name:'二级导出',theclass:'innerTitleExport',thevalue:"",handler:function(){
		           		var checkedVals = $("#"+$(this).parent().next().attr('id')).objectgrid("getCheckedVals");
						alert(checkedVals);
		           }},*/
                   {level:2,name:'二级开关',theclass:'innerTitleSwitch_1',thevalue:"",handler:levelTwoSwitch}
                ]
            });
            
            // 添加卡片和列表数据
            //获取container_kp中的smallTitleCode
            var smallTitleArr = data.result[0].smallTitle;
            var length = smallTitleArr.length;
            for (var i=0 ; i < length; i ++){
            	// 添加卡片和列表数据
            	var smallTitleCode = smallTitleArr[i].smallTitleCode;
                showKp(smallTitleCode);
            }
            
        },
        error:function(){
            alert("json数据格式不正确！");
        }
    });
	
    // 添加容器数据信息
	$.ajax({
        type:'post',
        url:"/rail/searchEntry/queryContainerTable.do",
        cache:false,
        dataType:"json",
        success:function(data){
            $('.tableContain').container({
                dataJson:data,
                tools:[
                   {level:1,name:'一级开关',theclass:'titleSwitch_1',thevalue:"",handler:levelOneSwitch},
                    {level:1,name:'二次搜索',theclass:'titleSchSwitch',thevalue:"",handler:secondSch},
                   {level:2,name:'二级导出',theclass:'innerTitleExport',thevalue:"",handler:function(){
		           		// 获取显示的table列表id
						var tableId = $(this).parent().next().find('table:visible:last').attr("id");
						var selected = $("#"+tableId.split('_')[1]).tablegrid("getCheckedVals");
					    downLoad(tableId,selected);
		           }},
                   {level:2,name:'二级开关',theclass:'innerTitleSwitch_1',thevalue:"",handler:levelTwoSwitch}
                ]
            });
            
            //获取container_table中的smallTitleCode
            var smallTitleArr = data.result[0].smallTitle;
            var length = smallTitleArr.length;
            for (var i=0 ; i < length; i ++){
            	// 添加table和列表数据
            	var smallTitleCode = smallTitleArr[i].smallTitleCode;
                showTable(smallTitleCode);
            }
        },
        error:function(){
            alert("json数据格式不正确！");
        }
    });
	
	//设置查询时间为90天前的是数据
	getTimeByDay($('#timeLi a .selt'),90,"startTime","endTime");
	new Vcity.CitySelector({input:'searchStationText'});
	
});


// 添加列表数据信息
function showTable(smallTitleCode ){

    if(smallTitleCode == "ccjl"){
    	showTravelRecord();
    }else if(smallTitleCode == "dpjl"){
    	showBookingRecord();
    }
    
}

//加载乘车记录表格数据
function showTravelRecord(){
	var params = Zz.search.qureyParam();
	$('#ccjl').tablegrid({
		url:'/rail/travelRecord/queryPage.htm',
		 dataType:'json',
         colModel:[{
            display:'乘车人姓名',
            name:'passenger',
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
            display:'终点站',
            name:'terminalStation',
            align:'center'
        },{
            display:'出发时间',
            name:'trainTime',
            align:'center',
            formatter:function(value,row){
				return Zz.util.date.ShowDateTime(value);
			}
        },{
            display:'订票邮箱',
            name:'bookingMail',
            align:'center'
        },{
        	
            display:'乘车人手机号',
            name:'mobile',
            align:'center'
         },{
            display:'乘车人身份证号',
            name:'certificateCode',
            align:'center'
	     
        }
        ],
		 usepager:true,
     	 //hidepage:false,
		 checkbox:true,
		 height:"auto",
		 width:'auto',
		 resizable: false,
		 sortname:'BOOKINGMAIL',
		 params:params,
		 sortorder:'asc',
		 showToggleBtn: false,
		 preProcess : tableDataPreProcess
		 //addRowProp:showMore
			
	});
}

//统计乘车信息、乘车记录、订票记录条数
function tableDataPreProcess(data,tableId){
		
		if(data){
			if(tableId == 'dpjl'){
				sjtj.dpjlTitleNum = data.total;
			}else if(tableId == 'ccjl'){
				sjtj.ccjlTitleNum = data.total;
			}
			
			$('#'+'innerTitleNum_'+tableId).html('（'+data.total+'条）');

			 //更新乘车信息记录条数
			var total = sjtj.dpjlTitleNum  + sjtj.ccjlTitleNum ;
            $('#titleNum_ccxx').html('（'+total+'条）');
		}
		
		return data;
}


//加载订票记录表格数据
function showBookingRecord(){
	
	var params = Zz.search.qureyParam();
	$('#dpjl').tablegrid({
		url:'/rail/bookingRecord/queryBookingPage.htm',
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
	            display:'订票人姓名',
	            name:'name',
	            align:'center'
	     },{

            display:'乘车人姓名',
            name:'passenger',
            align:'center'
        },{
            display:'订票时间',
            name:'orderTime',
            align:'center',
            formatter:function(value,row){
				return Zz.util.date.ShowDateTime(value);
			}
        },{
            display:'订单号',
            name:'ticketOrder',
            align:'center'
        },{
            display:'订票人手机号',
            name:'mobile',
            align:'center'
         },{
	        display:'订票人身份证',
	        name:'certificateCode',
	        align:'center'
	     },{
            display:'订单类型',
            name:'orderType',
            formatter:detailsShow,
            align:'center'
        }
        ],
		 usepager:true,
     	 //hidepage:false,
		 checkbox:true,
		 height:"auto",
		 width:'auto',
		 resizable: false,
		 sortname:'ORDERTYPE',
		 //params:{passengerName:'望江波',mobile:'18672830810'},
		 params:params,
		 sortorder:'asc',
		 showToggleBtn: false,
		 preProcess : tableDataPreProcess,
		 addRowProp:showMore
			
	});
}

// 添加卡片数据信息(订票人身份信息/乘车人身份信息)
function showKp(smallTitleCode){
	var params ={};
	params = Zz.search.qureyParam();

	if(smallTitleCode == "dprsfxx"){	

		var name = "全息展示";
		$('#'+smallTitleCode).prev().width(575);
		
		$('#'+smallTitleCode).objectgrid({
			 url:'/rail/bookingRecord/findBookerIdentityPage.htm',
			 dataType:'json',
			 checkbox:true,
			 usepager:true,
			 width:575,
			 height:'auto',
			 icon:'/rail/themes/images/icon_user.png',
			 sortname:'orderTime',
			 params:params,
			 sortorder:'desc',
			 linkHandler:[{"column":"objNum","handler":function(){alert("弹出菜单方法！");}}],
			 onDetail:mailAnalysis,
			 tools:[{"name":name,"className":"center","handler":addAnalyse}],
			 preProcess : kpDataPreProcess
		});
		
	}else if(smallTitleCode == "ccrsfxx"){
		var name = "加入分析";
        $('#'+smallTitleCode).prev().width(575);
       		
		$('#'+smallTitleCode).objectgrid({
			 url:'/rail/bookingRecord/findPassengerIdentityPage.htm',
			 dataType:'json',
			 checkbox:true,
			 usepager:true,
			 width:575,
			 height:'auto',
			 icon:'/rail/themes/images/icon_user.png',
			 sortname:'orderTime',
			 params:params,
			 sortorder:'desc',
			 linkHandler:[{"column":"objNum","handler":function(){alert("弹出菜单方法！");}}],
			 onDetail:function(id){alert("详情方法,dataid = 111111"+id);},
			 tools:[{"name":name,"className":"center","handler":addAnalyse}],
			 preProcess : kpDataPreProcess
		});
	}
    
}

//同邮箱的订票分析
function mailAnalysis(id){
	if(id){
		window.open("echart/getBarChart?mail="+id);
	}
}


//加载订票人身份信息、乘车人身份信息以及身份信息的总量统计
function kpDataPreProcess(data , tabId){

	if(data){
		
		if(tabId == 'dprsfxx'){
			sjtj.dprsfxxTitleNum = data.total;
		}else if(tabId == 'ccrsfxx'){
			sjtj.ccrsfxxTitleNum = data.total;
		}
		
		$('#'+'innerTitleNum_'+tabId).html('（'+data.total+'条）');
		
		var total = sjtj.dprsfxxTitleNum+ sjtj.ccrsfxxTitleNum;
		//更新身份信息记录条数
       $('#titleNum_sfxx').html('（'+total+'条）');
             
	}
	return data;

}


// 添加分析数据
function addAnalyse(e){
	if($(e.target).html()=='全息展示'){
		alert("全息展示方法");
		return;
	}
	// 按钮不可点击
	$(e.target).attr('disabled',true);
	// 添加分析数据
	$('.objs').find('li:contains(请选择分析对象)').remove();
	var name = $(e.target).prev().find("li:first>div>a").html();
	var mail = $(e.target).prev().find(".wordWrapper span").html();
	//alert(mail);
	var id = $(e.target).attr("id");
	if($('.objs li').length>=5){
		alert("最多分析5个对象，可以删除选中的对象在添加其他对象！");
	}else{
		$('.objs').prepend('<li id="'+id+'"><div class="objSelt clearfix"><a href="#" class="left name" mail="'+ mail+'">'+name+'</a>'+
                        '<a href="#" class="right delete" onclick="deleteObj(this,\''+id+'\')"></a></div></li>');
        
	}
	// 修改分析数值
    getAnalyseNum();
	btnDisabled(false);
	$('.sortBtn_1 input').removeClass('gray');
}

// 修改分析数值
function getAnalyseNum(){
	var len = $('.objs').find('li').length;
	// 判断里面是否为默认内容
	if(len==1){
		if($('.objs').find('li').html() == '请选择分析对象'){
			len = 0;
		}
	}
	$('#analyseNum').html(len);
	if(len == 0){
		$('.sortBtn_1 input').addClass('gray');
	}
}

// 使用清空和开始分析按钮生效
function btnDisabled(type){
	$('.sortBtn_1 input[type=button]').attr('disabled',type);
}
// 删除要分析的对象
function deleteObj(obj,btnId){
	if($(obj).parents('ul').find('li').length==1){
		clearObj();
		btnDisabled(true);
		
	}
	$(obj).parents('li').remove();
	$('#'+btnId).attr('disabled',false);
	getAnalyseNum();
}

//title二次搜索
function secondSch(){
	//搜索水印效果
	$(".titleSchInput").Watermark("在结果中搜索");
	//titleSch效果
	$(".titleSchSwitch").live("click",function(){
		$(this).parent().addClass("titleSlt");
		return false;
	});
	
	$(document).click(function(j){
		var $this=$(j.target);
		if($this.closest(".titleSlt").size() == 0){
			$(".titleSch").removeClass("titleSlt");
		}
	});
	
	//二次搜索鼠标效果
	$('.titleSchBar').live("mouseenter",function(){
		$(this).addClass('blueBorder');
	});
	
	$('.titleSchBar').live("mouseleave",function(){
		if(!(document.activeElement.className == 'left titleSchInput')){
			$('.titleSchBar').removeClass('blueBorder');
		}
	});
	
	$('.titleSchInput').live('blur',function(){
		$('.titleSchBar').removeClass('blueBorder');
	});
	
	$(".titleSchBar *").live("click",function(){return false;});

}

//二次搜索,搜索响应事件

function doSecondSch(containerId){
	
	//containerId区分是身份信息or乘车信息,取值为sfxx;ccxx
	if(containerId){
		var params = Zz.search.qureyParam(containerId);
		if(containerId && containerId == 'ccxx'){
			Zz.search.queryTable(params,containerId);
		}else if(containerId && containerId == 'sfxx'){
			Zz.search.queryKp(params,containerId);
		}
		
	}
	
}

//改变该列的显示
/*function detailsShow(val,row){
    return '<span class="left unfoldBtn">'+val+'</span><input type="button" class="left" value="" onclick="showMore(\''+row.id+'\',this)"/>';
}*/

function detailsShow(val,row){
	var expandId = "ticketTyp_"+row.id;
	var rowStr = JSON.stringify(row);
	 rowStr = rowStr.replace(/"/g,'@@');
    return '<span class="left unfoldBtn">'+val+'</span><input type="button" class="left" id="'+expandId+'" value="" expand="'+rowStr+'" onclick="showMoreDetails(\''+ rowStr +'\',this)"/>';
}

function showMoreDetails(rowStr,obj){

	rowStr = rowStr.replace(/@@/g,'"');
	var rowObj = jQuery.parseJSON(rowStr);
	
	var dataStr = '{"result":[';
	var arr = [];
	arr.push('"key":"【截获时间】","value":"'+Zz.util.date.ShowDateTime(rowObj.captureTime)+'"');
	arr.push('"key":"【数据源】","value":"'+rowObj.dataSource+'"');
	arr.push('"key":"【上网账号】","value":"'+rowObj.authAccount+'"');
	arr.push('"key":"【源IP】","value":"'+rowObj.sourceIp+'"');
	arr.push('"key":"【目的IP】","value":"'+rowObj.destinationIp+'"');
	arr.push('"key":"【Mac地址】","value":"'+rowObj.sourceMac+'"');
	arr.push('"key":"【手机号】","value":"'+rowObj.mobile+'"');
	arr.push('"key":"【IMSI】","value":"'+rowObj.imsi+'"');
	arr.push('"key":"【IMEI】","value":"'+rowObj.imei+'"');
	arr.push('"key":"【基站识别码】","value":"'+rowObj.station+'"');
	
	var showLen = arr.length;
	for(var i = 0 ; i < showLen; i++){
		dataStr = dataStr + '{' + arr[i] + '},';
	}
	dataStr = dataStr.substring(0, dataStr.length-1)+']}';

	var data = jQuery.parseJSON(dataStr);
	
	var $tr = null;
	// 表示点击行触发的该方法
	if(arguments.length==3){
		$tr = $(arguments[2]);
		obj = $tr.find('input[type=button]');
	}else{
		// 找到父节点tr元素
		$tr = $(obj).parents('tr');
	}
	// 找到改行后台的tr是否为二级内容
	var tmp = $tr.next().attr('id');
	
	if(data!=null){
		// 加载内容
		if(tmp!='childerTr'){ // 添加子列表
			$('#childerTr').remove();
			$('.unfold').removeClass('unfold');
			var colspan = $('td',$tr).length;
			$(obj).addClass('unfold');
			$tr.after('<tr id="childerTr"><td colspan='+colspan+' id="childerTd"><ul class="orderInfos clearfix"></ul></td></tr>');  
			for(d in data.result){
				var li = document.createElement('li');
				var label = document.createElement('label');
				$(label).append(data.result[d].key+"：");
				var span = document.createElement('span');
				$(span).append(data.result[d].value);
				$(span).attr('title',data.result[d].value);
				$(li).addClass('left').append(label).append(span);
				$('.orderInfos').append(li);
			}
			$('#childerTd').append($('.orderInfos'));
		}else{
			$(obj).attr("class")=='unfold'?$(obj).removeAttr('class'):'';
			$tr.next().remove();
			$(obj).removeClass('unfold');
		}
	}
}

// 列表展示更多信息，展开和收起方法
function showMore(id,obj){
	
	var expandId = "ticketTyp_"+id;
	//row数据中已经携带了
	var expandVal = $("#"+id + " #" + expandId).attr("expand");
	showMoreDetails(expandVal,$("#"+id + " #" + expandId));
}

// 容器导航收起和展开方法
function levelOneSwitch(className){
	// 获取鼠标点击事件
	var e = arguments.callee.caller.arguments[0] || window.event;
	// 判断targetName不是div
	var tag = e.target || e.srcElement;
	if(tag.tagName.toUpperCase()!="DIV" && $(tag).attr('class').indexOf('titleSwitch_1')==-1) return false;
	if(typeof(className)=="string"){
		var currentTarget = e.currentTarget?e.currentTarget:tag.parentNode;
		if($('.'+className,currentTarget).closest(".kpContain").size() != 0){
			$('.'+className,currentTarget).hasClass("titleSwitch_2") ? $('.'+className,currentTarget).removeClass("titleSwitch_2") : $('.'+className,currentTarget).addClass("titleSwitch_2");
			$('.'+className,currentTarget).parent().siblings(".basicInner").find(".innerTitleSwitch_1").hasClass("innerTitleSwitch_2") ? $('.'+className,currentTarget).parent().siblings(".basicInner").find(".innerTitleSwitch_1").removeClass("innerTitleSwitch_2") : $('.'+className,currentTarget).parent().siblings(".basicInner").find(".innerTitleSwitch_1").addClass("innerTitleSwitch_2"); 
			$('.'+className,currentTarget).parent().siblings(".basicInner").find(".tableBox").hasClass("hide") ? $('.'+className,currentTarget).parent().siblings(".basicInner").find(".tableBox").removeClass("hide") : $('.'+className,currentTarget).parent().siblings(".basicInner").find(".tableBox").addClass("hide");
		}else if($('.'+className,currentTarget).closest(".tableContain").size() != 0){
			$('.'+className,currentTarget).hasClass("titleSwitch_2") ? $('.'+className,currentTarget).removeClass("titleSwitch_2") : $('.'+className,currentTarget).addClass("titleSwitch_2");
			$('.'+className,currentTarget).parent().siblings(".basicInner").find(".innerTitleSwitch_1").hasClass("innerTitleSwitch_2") ? $('.'+className,currentTarget).parent().siblings(".basicInner").find(".innerTitleSwitch_1").removeClass("innerTitleSwitch_2") : $('.'+className,currentTarget).parent().siblings(".basicInner").find(".innerTitleSwitch_1").addClass("innerTitleSwitch_2");
			$('.'+className,currentTarget).parent().siblings(".basicInner").find(".tableBox").hasClass("hide") ? $('.'+className,currentTarget).parent().siblings(".basicInner").find(".tableBox").removeClass("hide") : $('.'+className,currentTarget).parent().siblings(".basicInner").find(".tableBox").addClass("hide");
		}else if($('.'+className,currentTarget).closest("#basicInfo").size() != 0){
			$('.'+className,currentTarget).hasClass("titleSwitch_2") ? $('.'+className,currentTarget).removeClass("titleSwitch_2") : $('.'+className,currentTarget).addClass("titleSwitch_2");
			if($('.'+className,currentTarget).parent().next(".baicInner").find(".tabsWrapper").size() != 0){
				$('.'+className,currentTarget).parent().next(".baicInner").find(".tabsWrapper").hasClass("hide") ? $('.'+className,currentTarget).parent().next(".baicInner").find(".tabsWrapper").removeClass("hide") : $('.'+className,currentTarget).parent().next(".baicInner").find(".tabsWrapper").addClass("hide");
			}else{
				$('.'+className,currentTarget).parent().next(".basicInner").find(".innerTitleSwitch_1").hasClass("innerTitleSwitch_2") ? $('.'+className,currentTarget).parent().next(".basicInner").find(".innerTitleSwitch_1").removeClass("innerTitleSwitch_2") : $('.'+className,currentTarget).parent().next(".basicInner").find(".innerTitleSwitch_1").addClass("innerTitleSwitch_2");
				$('.'+className,currentTarget).parent().next(".basicInner").find(".tableBox").hasClass("hide") ? $('.'+className,currentTarget).parent().next(".basicInner").find(".tableBox").removeClass("hide") : $('.'+className,currentTarget).parent().next(".basicInner").find(".tableBox").addClass("hide");
			}
		}
	}else{
		if($(this).closest(".kpContain").size() != 0){
			$(this).hasClass("titleSwitch_2") ? $(this).removeClass("titleSwitch_2") : $(this).addClass("titleSwitch_2");
			$(this).parent().siblings(".basicInner").find(".innerTitleSwitch_1").hasClass("innerTitleSwitch_2") ? $(this).parent().siblings(".basicInner").find(".innerTitleSwitch_1").removeClass("innerTitleSwitch_2") : $(this).parent().siblings(".basicInner").find(".innerTitleSwitch_1").addClass("innerTitleSwitch_2"); 
			$(this).parent().siblings(".basicInner").find(".tableBox").hasClass("hide") ? $(this).parent().siblings(".basicInner").find(".tableBox").removeClass("hide") : $(this).parent().siblings(".basicInner").find(".tableBox").addClass("hide");
		}else if($(this).closest(".tableContain").size() != 0){
			$(this).hasClass("titleSwitch_2") ? $(this).removeClass("titleSwitch_2") : $(this).addClass("titleSwitch_2");
			$(this).parent().siblings(".basicInner").find(".innerTitleSwitch_1").hasClass("innerTitleSwitch_2") ? $(this).parent().siblings(".basicInner").find(".innerTitleSwitch_1").removeClass("innerTitleSwitch_2") : $(this).parent().siblings(".basicInner").find(".innerTitleSwitch_1").addClass("innerTitleSwitch_2");
			$(this).parent().siblings(".basicInner").find(".tableBox").hasClass("hide") ? $(this).parent().siblings(".basicInner").find(".tableBox").removeClass("hide") : $(this).parent().siblings(".basicInner").find(".tableBox").addClass("hide");
		}else if($(this).closest("#basicInfo").size() != 0){
			$(this).hasClass("titleSwitch_2") ? $(this).removeClass("titleSwitch_2") : $(this).addClass("titleSwitch_2");
			if($(this).parent().next(".baicInner").find(".tabsWrapper").size() != 0){
				$(this).parent().next(".baicInner").find(".tabsWrapper").hasClass("hide") ? $(this).parent().next(".baicInner").find(".tabsWrapper").removeClass("hide") : $(this).parent().next(".baicInner").find(".tabsWrapper").addClass("hide");
			}else{
				$(this).parent().next(".basicInner").find(".innerTitleSwitch_1").hasClass("innerTitleSwitch_2") ? $(this).parent().next(".basicInner").find(".innerTitleSwitch_1").removeClass("innerTitleSwitch_2") : $(this).parent().next(".basicInner").find(".innerTitleSwitch_1").addClass("innerTitleSwitch_2");
				$(this).parent().next(".basicInner").find(".tableBox").hasClass("hide") ? $(this).parent().next(".basicInner").find(".tableBox").removeClass("hide") : $(this).parent().next(".basicInner").find(".tableBox").addClass("hide");
			}
		}
	}
}

// 子容器收缩和行收缩方法
function levelTwoSwitch(className){
	// 获取鼠标点击事件
	var e = arguments.callee.caller.arguments[0] || window.event;
	// 判断targetName不是div
	var tag = e.target || e.srcElement; 
	if(tag.tagName.toUpperCase()!="DIV" && $(tag).attr('class').indexOf('innerTitleSwitch_1')==-1) return false;
	if(typeof(className)=="string"){
		var currentTarget = e.currentTarget?e.currentTarget:tag.parentNode;
		$('.'+className,currentTarget).hasClass("innerTitleSwitch_2") ? $('.'+className,currentTarget).removeClass("innerTitleSwitch_2") : $('.'+className,currentTarget).addClass("innerTitleSwitch_2");
		$('.'+className,currentTarget).parent().next(".tableBox").hasClass("hide") ? $('.'+className,currentTarget).parent().next(".tableBox").removeClass("hide") : $('.'+className,currentTarget).parent().next(".tableBox").addClass("hide");
	}else{
		$(this).hasClass("innerTitleSwitch_2") ? $(this).removeClass("innerTitleSwitch_2") : $(this).addClass("innerTitleSwitch_2");
		$(this).parent().next(".tableBox").hasClass("hide") ? $(this).parent().next(".tableBox").removeClass("hide") : $(this).parent().next(".tableBox").addClass("hide");
	}
}
// 展开枚举数据
function showEnum(obj){
	//$('#searchEunm').removeClass('hide');
	$('#searchEunm').toggle();
	$(obj).toggleClass("open");
}

//切换搜索关键词
function changeSearchWord(obj,code){
	$('#searchStationText').val("");
	$('#searchText').val("");
	
	if(code == 'cfd' || code == 'mdd'){
		$('#searchStationText').css("display","block");
		$('#searchText').css("display","none");

		//$('.optionSelect').find('.inputText').addClass('optionSelected');
	}else{
		//$('.optionSelect').find('.inputText').removeClass('optionSelected');
		$('#searchStationText').css("display","none");
		$('#searchText').css("display","block");
	}
	var itemName = $('a',obj).html();
	$('#searchCode').val(code);
	$('#searchName').html(itemName);
	$('#searchEunm').addClass('hide').removeAttr('style');
	$(obj).parent().find("li").removeClass('hide');
	$(obj).addClass("hide");
	$(".sortItem").find(".open").removeClass('open');
};


// 添加查询条件
function addItem(){
	var display = $('#searchStationText').css("display");
	if(display == "block"){
		// 查询条件不能为空
		if($('#searchStationText').val().length>0){
			// 获取查询条件、值和code
			var code = $('#searchCode').val();
			var value= $('#searchName').html();
			var searchVal = $('#searchStationText').val();
			// 添加查询条件item
			var result = addItemHtml(code,value,searchVal);
			if(result!="false"){
				$('#searchItems').append(result);
			}else{
				alert('已经存在该查询项，不能再添加相同查询项！');
			}
			changeSearch2Btn(false);
			
		}else{
			alert('查询条件不能为空！');
		}
	}else{
		// 查询条件不能为空
		if($('#searchText').val().length>0){
			// 获取查询条件、值和code
			var code = $('#searchCode').val();
			var value= $('#searchName').html();
			var searchVal = $('#searchText').val();
			// 添加查询条件item
			var result = addItemHtml(code,value,searchVal);
			if(result!="false"){
				$('#searchItems').append(result);
			}else{
				alert('已经存在该查询项，不能再添加相同查询项！');
			}
			changeSearch2Btn(false);
			
		}else{
			alert('查询条件不能为空！');
		}
	}
}

//多条件查询和全部清空隐藏和显示方法
function changeSearch2Btn(type){
	$('.screenWrap input[type=button]').attr('disabled',type);
	if(type == true){
		$('.screenWrap input:first').addClass('clearI_gray');
		$('.screenWrap input:last').addClass('schBtn_2_gray');
	}else{
		$('.screenWrap input:first').removeClass('clearI_gray');
		$('.screenWrap input:last').removeClass('schBtn_2_gray');
	}
}

// 显示和隐藏置顶元素
window.onscroll = function(){
		var scrolltop = $(document).scrollTop();
		if(scrolltop!=0){
			$(".goTop").css("top",$("body").height()-76 + scrolltop).show();
		}else{
			$(".goTop").hide();
		}
};

// 添加item元素
function addItemHtml(code,value,searchVal){
	var searchMoreItems = $('#searchMoreItems').val();
	var result = "";
	if(searchMoreItems.indexOf(code)>-1){
		return "false";
	}else{
		var result = '<div class="left screenItemLeft"><div class="screenItemRight"><div class="screenItemCenter clearfix">'+
                    	'<span class="left itemAdded">'+value+'：'+searchVal+'</span><a href="#" class="right wipe" onclick="deleteSearch(this,\''+code+'\')"></a></div></div></div>';
	}
	// 添加综合查询的条件
	$('#searchMoreItems').val($('#searchMoreItems').val()+code+':'+searchVal+',');
    return result;
}

// 删除查询条件节点
function deleteSearch(obj,code){
	$(obj).parent().parent().parent().remove();
	var items = $('#searchMoreItems').val().split(',');
	var result = "";
	for(i = 0 ;i<items.length;i++){
		if(items[i].length>0 && items[i].indexOf(code)==-1){
			result+=(items[i]+',');
		}
	}
	if(result.length<=0){
		changeSearch2Btn(true);
	}
	$('#searchMoreItems').val(result);
}

// 查询方法
function searchMethod(type){
	// 获取搜索关键词
	var searchCode = $('#searchCode').val();
	// 获取搜索内容
	var searchText = $('#searchText').val();
	var searchStationText = $('#searchStationText').val();
	// 获取多个搜索关键词
	var searchMoreItems = $('#searchMoreItems').val();
	if(type==1){ //　表示单一条件搜索
		if(searchText.length>0){
			Zz.search.doSearch(searchCode,searchText);
		}else if(searchStationText.length>0 ){
			Zz.search.doSearch(searchCode,searchStationText);
		}else{
			Zz.search.queryAll();
		}
	}else if(type==2 && searchMoreItems.length>0){ //　表示多个条件搜索
		Zz.search.doSearchMulti(searchMoreItems);
	}else{
		//alert("查询条件不能为空!");
	}
}
// 清空已经选中的
function clearItems(){
	$("#searchItems").html("");
	// 清空条件
	$("#searchMoreItems").val("");	
	changeSearch2Btn(true);
}

// 选中旅游类型
function selectType(obj){
	// 去掉同级的样式
	$(obj).parent().siblings().find('a').removeClass('selt');
	// 添加选中样式
	$(obj).addClass('selt');
	
	Zz.search.onQueryChange();
}

// 开始分析数据
function startAnalyse(){
	var arrList = [];
	var arr = $('.objs').children('li');
	for (var i = 0; i < arr.length; i++) {
		var obj = {};
		obj.userName = $(arr[i]).find("div>a:first").html();
		obj.userMail = $(arr[i]).find("div>a:first").attr("mail");
		arrList.push(obj);
	}
	var liststr = JSON.stringify(arrList);

	window.open('pgisInfo/showGis.htm?liststr=' +  encodeURIComponent(encodeURIComponent(liststr)));

	//window.open('page/analysis.html?liststr=' +  encodeURIComponent(encodeURIComponent(liststr)));
}

// 清空要分析的数据
function clearObj(){
	// 复原button按钮
	$('.objs').find('li').each(function(){
		var btnId = $(this).attr('id');
		$('#'+btnId).attr('disabled',false);
	});
	$('.objs').html('<li>请选择分析对象</li>');
	btnDisabled(true);
	
	// 修改分析数值
    getAnalyseNum();
}


function deleteAClass(obj){
	$(obj).parent().parent().find('a').removeClass('selt');
}


function downLoad(tableId,selected){
	
	var url = '';
	if(tableId == 'table_ccjl'){
		url = 'fileDownLoad/travelRecordDownLoad.do';
	}else if(tableId == 'table_dpjl'){
		url = 'fileDownLoad/bookingRecordDownLoad.do';
	}
		
	$('#downLoadDiag').dialog({
		title:'下载选项',
		width: 300,
		height:200,
		closed:false,
		cache:false,
		href:'page/downLoadDiag.html',
		modal:true,
		buttons : [{
			text    : '确定',
			iconCls : 'icon-ok',
			handler : function() {
				var selectType = -1;
				$('input[name="selectType"]:checked').each(function(){
					selectType = $(this).val();
			    });

				var isBeginDown = 0;
				if(selected == '请选择要导出的数据！'){
					if(selectType == 1){
						$("#tips_message").html('请选中记录后,再选择"下载选中条目!"');
					}else if(selectType == 0){
						selected = -1;
						isBeginDown = 1;
					}else{
						
					}
				}else {
					if(selectType == 0){
						selected = -1;
						isBeginDown = 1;
					}else if(selectType == 1){
						isBeginDown = 1;
					}else{
						$("#tips_message").html('请选择"下载选中条目!"');
					}	
				}

				if(isBeginDown == 1 ){
					$("#idStr").val(selected);
					$("#download_form").attr("action",url);;
					$("#download_form").submit();	
					$('#downLoadDiag').dialog('close');
				}
			}
		}] 
	});
};


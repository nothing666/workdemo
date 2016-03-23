

Zz.search.onQueryChange= function(){
	var qureyParams =Zz.search.qureyParam();
	Zz.search.queryAll(qureyParams);
};

//初始化日期控件，并显示初始日期为7天
Zz.search.searchTimeMethod = function(){
		$("#startTime ,#endTime").focus(function(){
			WdatePicker({
				skin:'blue',
				dateFmt:'yyyy-MM-dd HH:mm',
				onpicked:Zz.search.onQueryChange
			});
		});
};


 /**
  * 当有来源时,认为是身份信息、乘车信息的二次搜索
  * 若是二次搜索,需带上二次搜索参数;否则将其置为空
  */
//得到查询参数
Zz.search.qureyParam = function(containerId){
	var params = {};
	
	//1. 组合查询框中是否有条件
	var searchMoreItems = $('#searchMoreItems').val();
	var mutliParams  = Zz.search.getMultiPara(searchMoreItems);
	if(mutliParams){
		Zz.search.copyParas(params,mutliParams);
	}else{
		//2. 如果最上面的查询输入框中是否有条件
		// 获取搜索关键词
		var searchCode = $('#searchCode').val();
		// 获取搜索内容
		var searchText = $('#searchText').val();
		if(searchText.length>0){
			params[searchCode] = searchText;
		}
	}
	
	//3. 加入年龄查询条件
	var agePara = Zz.search.getAgePara();
	Zz.search.copyParas(params,agePara);
	
	//4.加入户籍查询条件
	var provincePara = Zz.search.getProvincePara();
	Zz.search.copyParas(params,provincePara);
	
	//5.加入旅客类型
	var passengerTypeParam = Zz.search.getPassengerTypePara();
	
	Zz.search.copyParas(params,passengerTypeParam);
	
	//6. 加入乘车时间条件
	var timeParam = Zz.search.getTimePara();
	Zz.search.copyParas(params,timeParam);
	
	//7.加入二次搜索条件
	//身份信息的二次搜索
	if(containerId){
		
		//身份信息二次搜索栏内容
		var sfxxSecondSearchText = $('#sfxx_secondSearchText').val();
		//乘车信息二次搜索栏内容
		var ccxxSecondSearchText = $('#ccxx_secondSearchText').val();
		if(containerId == 'sfxx'){
			if(sfxxSecondSearchText && sfxxSecondSearchText.length>0){
				if('在结果中搜索' != sfxxSecondSearchText){
					params['sfxxSecondSearch'] = sfxxSecondSearchText;	
				}
			}
		}else if(containerId == 'ccxx'){
			if(ccxxSecondSearchText && ccxxSecondSearchText.length>0){
				if('在结果中搜索' != ccxxSecondSearchText){
					params['ccxxSecondSearch'] = ccxxSecondSearchText;
				}	
			}
		}	
	}else{
		params['sfxxSecondSearch'] = '';
		params['ccxxSecondSearch'] = '';
	}

	return params;
};

Zz.search.copyParas = function(params1, params2){
	if(params2){
		for(var t in params2) 
		{ 
			params1[t]=params2[t]; 
		
		}
	}
};

Zz.search.doSearchMulti = function(searchMoreItems){
	var params  = Zz.search.getMultiPara(searchMoreItems);
	if(params){
		Zz.search.queryAll(params);
	};
};

Zz.search.doSearch =  function(searchCode,searchText){
	//根据查询条件，设置参数
	var param = {};
	param[searchCode] = searchText;
	Zz.search.queryAll(param);
};

Zz.search.queryAll= function(param){
	
	//乘车人查询条件
	var travelParam = {};
	//订票人查询条件
	var bookingParam = {};
	
	buildSearchParam(param,travelParam,bookingParam);
	
	//汇总以上查询条件，更新卡片和表格数据
	var pTravel = {};
	pTravel.params=travelParam;
	$('#ccjl').tableReload(pTravel);
	
	var pbooking = {};
	pbooking.params=bookingParam;
	$('#dpjl').tableReload(pbooking);
	
	var pDpr = {};
	pDpr.params = bookingParam;
	$('#dprsfxx').kpReload(pDpr);
	
	//p 参数; Ccr 乘车人
	var pCcr = {};
	pCcr.params = bookingParam;
	$('#ccrsfxx').kpReload(pCcr);
	
};



/**
 * 刷新乘车信息数据
 */
Zz.search.queryTable= function(param,containerId){
	
	//乘车记录查询条件
	var travelParam = {};
	
	//订票记录、身份信息查询条件
	var bookingParam = {};
	
	buildSearchParam(param,travelParam,bookingParam,containerId);

	//汇总以上查询条件，更新表格数据
	var pTravel = {};
	pTravel.params=travelParam;
	$('#ccjl').tableReload(pTravel);
	
	var pbooking = {};
	pbooking.params=bookingParam;
	$('#dpjl').tableReload(pbooking);
	
};

/**
 * 刷新身份信息数据
 */
Zz.search.queryKp= function(param,containerId){

	//乘车记录查询条件
	var travelParam = {};
	
	//订票记录、身份信息查询条件
	var bookingParam = {};
	
	buildSearchParam(param,travelParam,bookingParam,containerId);

	//汇总以上查询条件，更新卡片数据
	var pbooking = {};
	pbooking.params=bookingParam;
	
	var pDpr = {};
	pDpr.params = bookingParam;
	$('#dprsfxx').kpReload(pDpr);
	
	//p 参数; Ccr 乘车人
	var pCcr = {};
	pCcr.params = bookingParam;
	$('#ccrsfxx').kpReload(pCcr);
};

/**
 * 构建查询参数
 */
function buildSearchParam(param,travelParam,bookingParam,containerId){
	
	if(!param){
		param = {};
	}
	/**
	 'xm'姓名
	 'sjh'手机号
    'sfzh'身份证号
    'dpyx'订票邮箱
    'cc'车次
    'cfd'出发地
    'mdd'目的地
	 */
	
	//1. 加入姓名条件
	if(param.xm){
		travelParam.passenger = param.xm;
		bookingParam.name = param.xm;
	}
	

	//2. 加入手机号条件
	if(param.sjh){
		travelParam.mobile = param.sjh;
		bookingParam.mobile = param.sjh;
	}
	
	//3. 加入身份证号条件
	if(param.sfzh){
		travelParam.certificateCode = param.sfzh;
		bookingParam.certificateCode = param.sfzh;
	}
	
	//4.加入订票邮箱条件
	if(param.dpyx){
		travelParam.bookingMail = param.dpyx;
		bookingParam.bookingMail = param.dpyx;
	}
	
	//5.加入车次条件
	if(param.cc){
		travelParam.trainNumber = param.cc;
		bookingParam.trainNumber = param.cc;
	}
	
	//6.加入出发地条件
	if(param.cfd){
		travelParam.departureStation = param.cfd;
		bookingParam.departureStation =param.cfd;
	}
	//7.加入目的地条件
	if(param.mdd){
		travelParam.terminalStation = param.mdd;
		bookingParam.terminalStation = param.mdd;
	}
	
	//8. 加入年龄查询条件
	var agePara = Zz.search.getAgePara();
	
	if(agePara.beginAge){
		travelParam.beginAge = agePara.beginAge;
		bookingParam.beginAge = agePara.beginAge;
	}
	if(agePara.endAge){
		travelParam.endAge = agePara.endAge;
		bookingParam.endAge = agePara.endAge;
	}
	
	//9. 加入户籍查询条件
	//4.加入户籍查询条件
	var provincePara = Zz.search.getProvincePara();
	if(provincePara.province){
		travelParam.province = provincePara.province;
		bookingParam.province = provincePara.province;
	}
	
	//10. 加入旅客类型
	var passengerTypeParam = Zz.search.getPassengerTypePara();
	if(passengerTypeParam.passengerType){
		travelParam.passengerType = passengerTypeParam.passengerType;
		bookingParam.passengerType = passengerTypeParam.passengerType;
		
	}
	if(passengerTypeParam.bType){
		bookingParam.bType = passengerTypeParam.bType;
		
	}
	if(passengerTypeParam.pType){
		travelParam.pType = passengerTypeParam.pType;
		
	}
	
	//11. 加入乘车时间条件
	var timeParam = Zz.search.getTimePara();
	travelParam.btime = timeParam.btime;
	travelParam.etime = timeParam.etime;
	bookingParam.btime = travelParam.btime;
	bookingParam.etime = travelParam.etime;
	
	
	//12.加入身份信息、乘车信息的二次搜索条件
	if(param.ccxxSecondSearch && containerId && containerId == 'ccxx'){
		travelParam.secondSearch = param.ccxxSecondSearch;
		bookingParam.secondSearch = param.ccxxSecondSearch;
	}else if(param.sfxxSecondSearch && containerId && containerId == 'sfxx'){
		bookingParam.secondSearch = param.sfxxSecondSearch;
	}else{
		travelParam.secondSearch = '';
		bookingParam.secondSearch = '';
	}
}



/**
 * 获取查询时间参数
 */
Zz.search.getTimePara= function(){
	var timeParam = {};
	timeParam.btime =$("#startTime").val()+":00";
	timeParam.etime = $("#endTime").val()+":00";
	return timeParam;
};

/**
 * 获取查询年龄
 */
Zz.search.getAgePara= function(){
	var ageParam = {};
	var ageValue = $(".agesRangeSelected").val();
	if(ageValue == "18以下"){
		ageParam.endAge = 18;
	}else if(ageValue == "18-25"){
		ageParam.beginAge = 18;
		ageParam.endAge = 25;
	}else if(ageValue == "25-35"){
		ageParam.beginAge = 25;
		ageParam.endAge = 35;
	}else if(ageValue == "35-50"){
		ageParam.beginAge = 35;
		ageParam.endAge = 50;
	}else if(ageValue == "50以上"){
		ageParam.beginAge = 50;
	}else{
		//什么也不设置，认为查询全部
	}
	
	
	return ageParam;
};

/**
 * 获取乘客类型
 */
Zz.search.getPassengerTypePara = function(){
	var passengerTypeParam = {};
	var typeValue = $(".passengerTypes li .selt").html();
	if(typeValue == "成人"){
		passengerTypeParam.passengerType = 1;
		passengerTypeParam.bType = 1;
		passengerTypeParam.pType = 1;
	}else if(typeValue == "儿童"){
		passengerTypeParam.passengerType = 2;
		passengerTypeParam.bType = 2;
		passengerTypeParam.pType = 2;
	}else if(typeValue == "学生"){
		passengerTypeParam.passengerType = 3;
		passengerTypeParam.bType = 3;
		passengerTypeParam.pType = 3;
	}else if(typeValue == "伤残军警"){
		passengerTypeParam.passengerType = 4;
		passengerTypeParam.bType = 4;
		passengerTypeParam.pType = 4;
	}else{
		//什么也不设置，认为查询全部
	}
	return passengerTypeParam;
}; 



Zz.search.getMultiPara = function (searchMoreItems){
	if(!searchMoreItems || searchMoreItems.length ==0 ){
		return;
	}
	var items = searchMoreItems.split(',');;
	var params = {};
	for(var i = 0 ;i<items.length;i++){
		if(items[i].length>0){
			var query = items[i].split(':');
			params[query[0]]=query[1];
		};
	}
	return params;
};

Zz.search.getProvincePara = function(){
	var provinceParam = {};
	var provinceName = $("#hjDiv .optionSelected").val();

	var selA= $("#hjDiv .hotSites li").filter(function (index) { 
		
		if( $(this).find("a").html()==provinceName){
			return $(this).find("a");
		}
	});
	if(selA){
		var value =  $(selA).find("a").attr("value");
			if(value != "'0'"){
				provinceParam.province =value;
			}
	}
	return provinceParam;
};


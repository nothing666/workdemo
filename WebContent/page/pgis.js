 Zz.gis.info = {};
//var map ;
 $(function(){	
	Zz.gis.initPage();
	Zz.gis.initMap();
	
	Zz.gis.initTime();
	Zz.gis.initTrack();


});

Zz.gis.initPage = function(){
	$('.pageCont').height($(window).height()-82);
	$('.mapArea').css('max-height',$(window).height()-112);
};

Zz.gis.initTime = function(){
	// 添加日期控件
	//timeMethod(Zz.gis.onTrackTimeChange());
	Zz.gis.searchTimeMethod(Zz.gis.onTrackTimeChange());
	getTimeByDay($('#timeLi a .selt'),90,"gisStartTime","gisEndTime");
};

//初始化日期控件，并显示初始日期为7天
 Zz.gis.searchTimeMethod = function(){

 		$("#gisStartTime ,#gisEndTime").focus(function(){
 			WdatePicker({
 				skin:'blue',
 				dateFmt:'yyyy-MM-dd HH:mm',
 				onpicked:Zz.gis.initTrack
 			});
 		});
 };

 //更新列表和地图轨迹
Zz.gis.initTrack = function(){
		$("#trainTrackDiv").empty();
		var userList = jQuery.parseJSON($("#userList").val());
		var length = userList.length;
		var timeParam = Zz.gis.getTrackTimePara();
		//var i=0;
		for(var i=0; i<length; i++){
			var userName = userList[i].userName;
			var userMail = userList[i].userMail;
			var color = userList[i].color;
			if(userName && userMail){
				//刷新列表
				Zz.gis.trainTrack(timeParam, userName,userMail,color);
				
				//刷新地图
				Zz.gis.gisTrack(timeParam, userName,userMail,color);
			}
		}
		
		registerGisTrackEvent();
 };
 
 /**
  * 获取查询时间参数
  */
 Zz.gis.getTrackTimePara= function(){
 	var timeParam = {};
 	var startTime = $("#gisStartTime").val();
 	var endTime =  $("#gisEndTime").val();
 	if(startTime.length > 0 && endTime.length > 0){
	 	timeParam.btime = startTime +":00";
	 	timeParam.etime = endTime +":00";
 	}
 	return timeParam;
 };
	
var linesMap= {};

var trackPlayMap = {};


//初始化地图
Zz.gis.initMap = function (){
	Zz.gis.info.map = new EzSecurity(document.getElementById("mymap"));
	var point = null;
	Zz.gis.info.map.uEzMap.addMapEventListener(EzEvent.MAP_MOUSEMOVE, function(e){
		if(Zz.gis.info.map.uEzMap.map.bIsGoogleMap){
			point = Zz.gis.info.map.uEzMap.map.meters2latlon(new Point(e.mapPoint.x,e.mapPoint.y));
		}else{
			point = new Point(e.mapPoint.x,e.mapPoint.y);
		}
		document.getElementById("coordiate").innerHTML = "X:"+ point.x + "  Y:" + point.y + " screenPointX:"+e.screenPoint.x+" screenPointY:"+e.screenPoint.y; 
	});
	Zz.gis.info.map.uEzMap.addMapEventListener(EzEvent.MAP_SWITCHMAPSERVER,function(e){

	});
	Zz.gis.info.map.uEzMap.zoomTo(3);
};

/*
根据邮箱显示用户轨迹（实现上，就是将用户轨迹重新绘制在地图上）
*/
function showUserTrack(id){
	//1 。 显示静态轨迹
	if(linesMap[id])
	Zz.gis.info.map.track(linesMap[id]);

	//2 .显示动态轨迹
//	var vPolyline = trackPlayMap[id];
//	vPolyline.XZJ = 1;
//	Zz.gis.info.map.trackPlay(trackPlayMap[id]);
	
}

/* 隐藏用户轨迹（实现上，就是将轨迹删除）*/
function hideUserTrack(id){
	//1.停止静态轨迹
	if(linesMap[id])
	Zz.gis.info.map.uEzMap.removeOverlay(linesMap[id]);				     

//	//2.停止动态轨迹
//	var vPolyline = trackPlayMap[id];
//	//2.1 停止动态轨迹定时器
//	clearInterval(vPolyline._MMMM);
//	vPolyline._IIII = 0;
//	//2.2 将已经画的动态轨迹清除
//	for ( var i = 0; i < vPolyline._TempLineList.length; i++) {
//		Zz.gis.info.map.uEzMap.removeOverlay(vPolyline._TempLineList[i]);
//	}
//	vPolyline._TempLineList.clear();	
//	//2.3 设置标识，不用再循环显示动态轨迹了
//		vPolyline.XZJ = 0;
	}


//查询时间改变时，重新绘制轨迹和列表数据
Zz.gis.onTrackTimeChange = function(){
	Zz.gis.initTrack();
};

//绘制用户Gis轨迹
Zz.gis.gisTrack = function(param, userName,userMail,color){
	param.sort = 'TRAINTIME';
	param.order='asc';
	param.page = 1;
	param.rows = 9999;
	param.passengerName=userName;
	param.bookingMail=userMail;
	
	$.ajax({
		   type: "POST",
		   url: "/rail/pgisInfo/queryGisTrack.do",
		   data:param,
		   async: false,
		   dataType:"json",
		   success: function(data){
				var track = data.track;

				var line = null;
				var userId = userName+ '('+userMail+ ')';
				//1. 首先将以前的轨迹删除
				hideUserTrack(userId);
				
				//2. 在地图上绘制轨迹
				//var pnts = "113.83209,31.385595,114.7541,30.94775,114.2633,30.0531,112.63186,30.547";
				line = new Polyline(track,color, 3,1,1);
				Zz.gis.info.map.track(line);
				
				//3. 将轨迹放入map，便于后面的隐藏显示操作
				linesMap[userId]= line;

				//.显示动态轨迹
//				var lineTrack = null; 
//				lineTrack = new Polyline(track,colorBg, 2,0.5,1);
//				lineTrack.setColor(colorBg);
//				Zz.gis.info.map.trackPlay(lineTrack);
//				
//				trackPlayMap[userId] = lineTrack;
		   }
		});
};

Zz.gis.trainTrack = function(param,userName,userMail,color){ 
	param.sort = 'TRAINTIME';
	param.order='asc';
	param.page = 1;
	param.rows = 9999;
	param.passengerName=userName;
	param.bookingMail=userMail;
	$.ajax({
		   type: "POST",
		   url: "/rail/travelRecord/queryTravelPage.do",
		   data:param,
		   async: false,
		   dataType:"json",
		   success: function(data){
				var htmlStr = '';
				var dataRows = data.rows;
				var len = dataRows.length;
				htmlStr += '<div class="objItem" id="' + userMail + '"';
				htmlStr += '<div class="innerTitleLeft_1" style="background-color:' + color + '">';
				htmlStr += ' <div class="innerTitleRight_1">';
				htmlStr += '  <div class="innerTitleCenter_1 clearfix" onclick="foldMethod()">';
				htmlStr += '    <span class="icon_obj_1 left"></span>';
				htmlStr += '    <h3 class="left innerTitleName">'+ userName + '(' +userMail +')</h3>';
				htmlStr += '    <a class="right innerTitleSwitch_1" href="#"></a>';
				htmlStr += '    <a class="right innerTitleEye" title="在地图中显示" href="#"></a>';
				htmlStr += '  </div>';
				htmlStr += ' </div>';
				htmlStr += '</div>';
				htmlStr += ' <ul class="paths">';
				for(var i=0; i<len; i++){
					htmlStr += '<li>';
					htmlStr += '<a href="#" class="" onclick="singleToggle(this)">';
					htmlStr += '<span>'+ dataRows[i].departureStation +'</span>';
					htmlStr += '<span class="icon_to"></span>';
					htmlStr += '<span>'+ dataRows[i].terminalStation +'</span>';
					htmlStr += '</a>';
					htmlStr += ' <ul class="detailInfo hide">';
					htmlStr += ' <li>';
					htmlStr += '  <label>乘车人姓名：</label>';
					htmlStr += '  <span>' + userName + '</span>';
					htmlStr += ' </li>';
					htmlStr += ' <li>';
					htmlStr += '  <label>手机号：</label>';
					htmlStr += '  <span>' + dataRows[i].mobile + '</span>';
					htmlStr += ' </li>';
					htmlStr += ' <li>';
					htmlStr += '   <label>身份证号：</label>';
					htmlStr += '   <span>' + dataRows[i].certificateCode + '</span>';
					htmlStr += ' </li>';
					htmlStr += ' <li>';
					htmlStr += '   <label>车次：</label>';
					htmlStr += '   <span>' + dataRows[i].trainNumber + ' ' +  dataRows[i].carriage + '车' +  dataRows[i].seat +'</span>';
					htmlStr += ' </li>';
					htmlStr += ' <li>';
					htmlStr += '   <label>出发时间：</label>';
					htmlStr += '   <span>' + Zz.util.date.ShowDateTime(dataRows[i].trainTime) + '</span>';
					htmlStr += ' </li>';
					htmlStr += ' </ul>';
					htmlStr += '</li>';
				}
				$('#trainTrackDiv').append(htmlStr);   
		   }
		});
 };

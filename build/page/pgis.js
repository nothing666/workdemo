 Zz.gis.info = {};
//var map ;
 $(function(){	
	initMap();
	loadGisData();
	
	Zz.gis.initTrack();


});

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
				Zz.gis.trainTrack(timeParam, userName,userMail,color);
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

//加载GIS图上轨迹数据
function loadGisData(){
	//alert($("#userList").val());
	var userList = jQuery.parseJSON($("#userList").val());
	var length = userList.length;
	//var i=0;
	for(var i=0; i<length; i++){
		var userName = userList[i].userName;
		var userMail = userList[i].userMail;
		var color = userList[i].color;
		var colorBg = userList[i].colorBg;
		if(userName && userMail){
			loadGisTrack(userName,userMail,color,colorBg);
		}
	}
}

//初始化地图
function initMap(){
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
	Zz.gis.info.map.uEzMap.zoomTo(5);
}

/*
根据邮箱显示用户轨迹
*/
function showUserTrack(id){
	//1 。 显示静态轨迹
	Zz.gis.info.map.track(linesMap[id]);

	//2 .显示动态轨迹
//	var vPolyline = trackPlayMap[id];
//	vPolyline.XZJ = 1;
//	Zz.gis.info.map.trackPlay(trackPlayMap[id]);
	
}

function hideUserTrack(id){
	//1.停止静态轨迹
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

	
		
   /**
*
*根据乘车人姓名和订票人邮箱获取轨迹
*userName: 乘车人姓名
*userMail: 订票人邮箱
*/
function loadGisTrack(userName, userMail,color,colorBg){
	$.post('/rail/pgisInfo/queryTrack.do', {userName:userName,userMail:userMail}, function(data){
		var track = data.track;

		//1 。 显示静态轨迹
		var line = null;
		var userId = userName+userMail;
		//var pnts = "113.83209,31.385595,114.7541,30.94775,114.2633,30.0531,112.63186,30.547";
		line = new Polyline(track,color, 3,1,1);
		Zz.gis.info.map.track(line);
		
		//将轨迹放入map，便于后面的隐藏显示操作
		linesMap[userId]= line;

		//2 .显示动态轨迹
//		var lineTrack = null; 
//		lineTrack = new Polyline(track,colorBg, 2,0.5,1);
//		lineTrack.setColor(colorBg);
//		Zz.gis.info.map.trackPlay(lineTrack);
//		
//		trackPlayMap[userId] = lineTrack;
		 
	}, 'json');
	
}

Zz.gis.onTrackTimeChange = function(){
	Zz.gis.initTrack();
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
		   url: "/rail/travelRecord/queryPage.do",
		   data:param,
		   async: false,
		   dataType:"json",
		   success: function(data){
				var htmlStr = '';
				var dataRows = data.rows;
				var len = dataRows.length;
				htmlStr += '<div class="objItem" id="' + userMail + '"';
				htmlStr += '<div class="innerTitleLeft_1" style="background-color:' + color + '">';
				htmlStr += '<div class="innerTitleRight_1">';
				htmlStr += ' <div class="innerTitleCenter_1 clearfix" onclick="foldMethod()">';
				htmlStr += '   <span class="icon_obj_1 left"></span>';
				htmlStr += '   <h3 class="left innerTitleName">'+ userName + userMail +'</h3>';
				htmlStr += '   <a class="right innerTitleSwitch_1" href="#"></a>';
				htmlStr += '   <a class="right innerTitleEye" title="在地图中显示" href="#"></a>';
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

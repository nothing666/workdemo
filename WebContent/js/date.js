
// 根据num数值，算出前几天的时间
function getDateByNum(num){
	var currentTime = new Date(); // ��ȡ��ǰ����
	var currentNum = currentTime.getTime(); // ��ȡ��ǰ���ڵ�ǧ����
	var tmpNum = num*24*60*60*1000;  // ��ȡ�������ǧ����
	var resultTime = new Date(currentNum-tmpNum); // �õ�ǰ����ʱ���ǧ����
	return getDateVal(currentTime,num,'end')+"|"+getDateVal(resultTime,num,'start');
}

// 根据date日期对象，拼接出日期字符串
function getDateVal(date,num,type){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	// 小于10的在前面补0
	if(num<0 || type=='end'){
		return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d)+' '+ (h<10?'0'+h:h) + ':' + (mi<10?'0'+mi:mi);
	}
	else{
		return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d)+' 00:00';
	}
}

// 根据day的天数，算出相差的时间，并返回给前台
function getTimeByDay(obj,day,startTime,endTime){
	var oldValue = $(obj).parent().find('.selt').html();
	//alert(oldValue);
	$(obj).siblings().removeClass('selt');
	$(obj).addClass('selt');
	var newValue = $(obj).parent().find('.selt').html();
	if(day!=null && day!="" && day!=-1){
		// ��ȡ��ʼ�ͽ���ʱ��
		var resultTime = getDateByNum(day);
		// ��ʱ�丳ֵ�����ڿؼ���input��
		$("#"+ startTime).val(resultTime.split('|')[1]);
		$("#"+ endTime).val(resultTime.split('|')[0]);
	}else{
		// �Զ���ʱ��
		$("#"+startTime).val("");
		$("#"+endTime).val("");
	}
	
	if(oldValue != newValue){
		var changeFunction = $(obj).attr("changeFunction");
		if(changeFunction){
			eval(changeFunction);
		}
	}
	
}

// 可以手动输入时间（如201412231226）；obj表示前台日期文本框的对象
function changeTime(obj){
	var time = $(obj).val();
	// 验证日期是否为正常日期
	var dateFormat=/^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/;
	if(time!=null && time!=""){
		time = time.replace(new RegExp(/(\/)/g),'').replace(new RegExp(/(-)/g),'').replace(new RegExp(/( )/g),'').replace(new RegExp(/(:)/g),'');
		if(time.length==12){ // 输入12为的日期，表示到分钟
			time = time.substring(0,4)+"/"+time.substring(4,6)+"/"+time.substring(6,8)+" "+time.substring(8,10)+":"+time.substring(10,12);
		}else if(time.length==8){ // 输入8为的长度，表示到天
			time = time.substring(0,4)+"/"+time.substring(4,6)+"/"+time.substring(6,8);
		}else{
			alert("请输入日期到天或到分结束的时间!");
			$(obj).val("");
			return false;
		}
		// 处理输入的日期是否为有效日期
		if(dateFormat.test(time.split(" ")[0].replace(new RegExp(/(\/)/g),'-'))){
			var date = new Date(time);
			$(obj).val(getDateVal(date,-1));
		}else{
			alert("您输入的日期不是正常的日期,请重新输入！");
			$(obj).val("");
		}
	}
	// 隐藏日期控件
	$('div').each(function(i){
		if(i==0){
			$(this).hide();
		}
	});
}

// 判断开始时间不能大于结束时间
function onemonthtypeChange(startTime,endTime){
	var start = $("#"+startTime).val();
	var end = $("#"+endTime).val();
	if(start!=null && start!="" && end!=null && end!="" ){
		var startNum = parseInt(start.replace(/-/g,''),10);
		var endNum = parseInt(end.replace(/-/g,''),10);
		if(startNum>endNum){
			alert("开始时间不能大于结束时间");
			return false;
		}
	}
	return true;
}

// 回车方法
function dateEnter(obj,startTime,endTime){
	// 获取鼠标点击事件
	var e = arguments.callee.caller.arguments[0] || window.event;
	if(e.keyCode==13){
		changeTime(obj);
		onemonthtypeChange(startTime,endTime);
	}
}

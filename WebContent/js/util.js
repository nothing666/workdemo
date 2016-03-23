var Zz  = {}; 
Zz.util = {}; //工具类
Zz.util.date = {};
Zz.util.math = {};
Zz.gis = {};

Zz.search={};

Zz.util.date.ShowDateTime = function(val,format){
    if(!format){
    	format = 'Y-M-D H:m:s';
    }
	if (val){
    	var date = new Date(val);
    	var _fullYear = date.getFullYear();
    	var _year = date.getYear();
    	_year = (_year < 10) ? '0' + _year : '' + _year;
    	var _mon = date.getMonth() + 1;
    	_mon = (_mon < 10) ? '0' + _mon : '' + _mon;
    	var _day = date.getDate();
    	_day = (_day < 10) ? '0' + _day : '' + _day;
    	var _hour = date.getHours();
    	_hour = (_hour < 10) ? '0' + _hour : '' + _hour;
    	var _min = date.getMinutes();
    	_min = (_min < 10) ? '0' + _min : '' + _min;
    	var _sec = date.getSeconds();
    	_sec = (_sec < 10) ? '0' + _sec : '' + _sec;
    	
    	var showStr = format.replace('Y',_fullYear).replace('y',_year).replace('M',_mon).replace('D',_day).replace('d',_day)
    	.replace('H',_hour).replace('h',_hour).replace('m',_min).replace('s',_sec);
    	return showStr;
    }else{
    	return '';
    }
};
 
Zz.util.date.getDateTime = function(days){
	var miniSec = days * 24 * 3600 * 1000;
	var _now = new Date();
	var _times = _now.getTime() + miniSec;
	return new Date(_times);
};

/**
 * 将float类型的数字补0
 * 依赖于Zz.util.math.float2Str
 * val : String | Float  
 */
Zz.util.math.float2Str = function(val){
	val = val + '';
	var idx = val.indexOf('.'); 
	if(idx == -1){
		return val + '.00';
	}else if(idx == val.length - 1){
		return val + '0';
	}else{
		return val ;
	}
};

Zz.util.math.calculate = function(a,b,type){
	if(Zz.sys.isNumber(a) && Zz.sys.isNumber(b) && Zz.sys.isNumber(type)){
		var astr = (a + '');
		var bstr = (b + '');
		var zeroDigit = 0;
		var azeroDigit = 0;//小数点后的位数
		var bzeroDigit = 0;//小数点后的位数
		var divisor = 1;//除数
		var result = 0;
		if(astr.indexOf('.') != -1){
			azeroDigit = astr.length - astr.indexOf('.') - 1;
		}
		if(bstr.indexOf('.') != -1){
			bzeroDigit = bstr.length - bstr.indexOf('.') - 1;
		}
		if(type == Zz.cst.calculate_add || type == Zz.cst.calculate_minus){
			zeroDigit = (azeroDigit > bzeroDigit)? azeroDigit : bzeroDigit;
		}else if(type == Zz.cst.calculate_multi){
			zeroDigit = azeroDigit + bzeroDigit;
		}else if(type == Zz.cst.calculate_divis){
			zeroDigit = azeroDigit - bzeroDigit;
		}else{
			throw new Error('暂不支持的计算类型');
		}
		var tmpLen = Math.abs(zeroDigit);
		for (var i = 0; i < tmpLen; i++) {
			divisor = divisor * 10;
		}
		switch (type) {
		case Zz.cst.calculate_add:
			var aint = a * divisor;
			var bint = b * divisor;
			result = (aint + bint) / divisor;
			break;
		case Zz.cst.calculate_minus:
			var aint = a * divisor;
			var bint = b * divisor;
			result = (aint - bint) / divisor;
			break;
		case Zz.cst.calculate_multi:
			var aint = parseInt(astr.replace('.', ''), 10);
			var bint = parseInt(bstr.replace('.', ''), 10);
			result = (aint * bint) / divisor;
			break;
		case Zz.cst.calculate_divis:
			var aint = parseInt(astr.replace('.', ''), 10);
			var bint = parseInt(bstr.replace('.', ''), 10);
			if(zeroDigit < 0){
				aint = aint * divisor;
			}else{
				bint = bint * divisor;
			}
			result = aint / bint;
			break;
		default:
			break;
		}
		return result;
	}else{
		throw new Error('您的参数有误，不全是Number类型');
	}
};

Zz.util.math.fltAdd = function(a,b){
	return Zz.util.math.calculate(a, b, Zz.cst.calculate_add);
};

Zz.util.math.fltMinus = function(a,b){
	return Zz.util.math.calculate(a, b, Zz.cst.calculate_minus);
};


Zz.util.math.fltMulti = function(a,b){
	return Zz.util.math.calculate(a, b, Zz.cst.calculate_multi);
};

Zz.util.math.fltDivis = function(a,b){
	return Zz.util.math.calculate(a, b, Zz.cst.calculate_divis);
};


Zz.util.math.transUpper = function(val){ 
	var preStr = '';//
	//内部函数，处理位数
	var digit = function(idx){
		var result = '';
		switch (idx) {//选择单位  
			case 0  : result = '分'; break;
			case 1  : result = '角'; break;
			case 2  : result = '元'; break;
			case 3  : result = '拾'; break;
			case 4  : result = '佰'; break;
			case 5  : result = '仟'; break;
			case 6  : result = '万'; break;
			case 7  : result = '拾'; break;
			case 8  : result = '佰'; break;
			case 9  : result = '仟'; break;
			case 10 : result = '亿';break; 
			case 11 : result = '拾';break; 
			case 12 : result = '佰';break; 
			case 13 : result = '仟';break; 
		}
			return result;
	};	
	//内部函数，处理数字
	var bigNum = function(chr){
		var result = '';
		switch (chr){  //选择数字  
			case '1' : result = '壹';break; 
			case '2' : result = '贰';break; 
			case '3' : result = '叁';break; 
			case '4' : result = '肆';break; 
			case '5' : result = '伍';break; 
			case '6' : result = '陆';break; 
			case '7' : result = '柒';break; 
			case '8' : result = '捌';break; 
			case '9' : result = '玖';break; 
			case '0' : result = '零';break; 
		} 
		return result;
	};	
	val = parseFloat(val) ;
	if(val < 0){
		val = Math.abs(val);
		preStr = '负数: ';
	}
	val = Zz.util.math.float2Str(val);
 
	 
	val = val.replace('.','');
	arr = val.split('');
	arr = arr.reverse();
	if(arr.length > 14){
		//这里抛异常
		alert('金额' + val + '过长'); 
		return ; 
	} 
	var len = arr.length;
	var tmp = new Array();
	
	for(var i = 0; i < len; i++){
		tmp[i] = bigNum(arr[i])+ '' + digit(i);
	}
	tmp = tmp.reverse();
	val = tmp.join(""); 
	val = val.replace(/\零拾/g,'零');
	val = val.replace(/\零佰/g,'零');
	val = val.replace(/\零仟/g,'零');
	val = val.replace(/\零零零/g,'零');
	val = val.replace(/\零零/g,'零');
	val = val.replace('零角零分','整'); 
	val = val.replace('零分','整');
	val = val.replace('零角','零');
	val = val.replace('零亿零万零元','亿元');
	val = val.replace('亿零万零元','亿元');
	val = val.replace('零亿零万','亿');
	val = val.replace('零万零元','万元');
	val = val.replace('万零元','万元');
	val = val.replace('零亿','亿');
	val = val.replace(/\零万/g,'万');
	val = val.replace('零元','元');
	val = val.replace('零零','零');
	if(val.indexOf('元零') == 0){
		val = val.replace('元零','');//注意新加的
	}
	if(val.indexOf('壹拾') == 0){
		val = val.replace('壹拾','拾');//注意新加的
	}
	return preStr + val; 
};

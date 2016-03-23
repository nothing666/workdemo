
$(function(){
	// 添加日期控件
	//timeMethod(Zz.gis.onTrackTimeChange());
	Zz.gis.searchTimeMethod(Zz.gis.onTrackTimeChange());
	$('.pageCont').height($(window).height()-82);
	$('.mapArea').css('max-height',$(window).height()-112);
	getTimeByDay($('#timeLi a .selt'),90,"gisStartTime","gisEndTime");
});

function registerGisTrackEvent(){
	$('.objItem .innerTitleEye').each(function(){
		$(this).live('click',function(){
			$(this).toggleClass('active');
			if($(this).attr('class').indexOf('active')>-1){
				$(this).attr('title','关闭地图显示');
				var id = $(this).parent().find('.innerTitleName').html();
				hideUserTrack(id);
			}else{
				$(this).attr('title','在地图中显示');
				var id = $(this).parent().find('.innerTitleName').html();
				showUserTrack(id);
			}
		});
	});

}

// 该区域的全部节点展开和收起方法
function foldMethod(){
	// 获取鼠标点击事件
	var e = arguments.callee.caller.arguments[0] || window.event;
	// 判断targetName不是div
	var tag = e.target || e.srcElement;
	if(tag.tagName.toUpperCase()=='A'){
		if($(tag).attr('class').indexOf('innerTitleSwitch')>-1){
			if($(tag).attr('class').indexOf('innerTitleSwitch_1')>-1){
				$(tag).removeClass('innerTitleSwitch_1').addClass('innerTitleSwitch_2');
				$(tag).parent().parent().parent().next().find('li>ul').show();
				$(tag).parent().parent().parent().next().find('li>a').addClass('open');
			}else{
				$(tag).removeClass('innerTitleSwitch_2').addClass('innerTitleSwitch_1');
				$(tag).parent().parent().parent().next().find('li>ul').hide();
				$(tag).parent().parent().parent().next().find('li>a').removeClass('open');
			}
		}
	}else if(tag.tagName.toUpperCase()=='DIV'){
		$(tag).find('a').each(function(){
			if($(this).attr('class').indexOf('innerTitleSwitch')>-1){
				if($(this).attr('class').indexOf('innerTitleSwitch_1')>-1){
					$(this).removeClass('innerTitleSwitch_1').addClass('innerTitleSwitch_2');
					$(this).parent().parent().parent().next().find('li>ul').show();
					$(this).parent().parent().parent().next().find('li>a').addClass('open');
				}else{
					$(this).removeClass('innerTitleSwitch_2').addClass('innerTitleSwitch_1');
					$(this).parent().parent().parent().next().find('li>ul').hide();
					$(this).parent().parent().parent().next().find('li>a').removeClass('open');
				}
			}
		});
	}
}

// 单个展开和收起
function singleToggle(obj){
	$(obj).next().toggle();
	$(obj).toggleClass('open');
	
}
function deleteAClass(obj){
	$(obj).parent().parent().find('a').removeClass('selt');
}
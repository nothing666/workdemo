/*******************
编写:董亚军
联系方式：yajun@run.com
日期：2015-01-26
版本：RD 1.0
描述：创建容器组件基础版本
*******************/
(function(){
	$.fn.container =function(options){
		var defaultVal = 
		{
			dataJson:null,
			tools:null,
			rightAnchorLog:false,
			rightAnchorObj:false,
			handler:null
		};
		
		var theVal = $.extend(defaultVal,options);

		return this.each(function(){
			var theHtml = "";
			var $_this = $(this);
			
			//将title内容添加到指定容器
			$_this.append(titleHtml(theVal.dataJson));
			
			//判断各title是否按钮、事件，并赋值
			if(theVal.tools != null){
				for(var i=0; i<theVal.tools.length ; i++){
					if(theVal.tools[i].handler){
						if(theVal.tools[i].theclass=='innerTitleSwitch_1'){
							var handler = ((theVal.tools[i].handler+'').split('(')[0]).split('function')[1];
							$($("."+theVal.tools[i].theclass,this).parent(),this).attr('onclick',handler+"('innerTitleSwitch_1')");
						}else if(theVal.tools[i].theclass=='titleSwitch_1'){
							var handler_1 = ((theVal.tools[i].handler+'').split('(')[0]).split('function')[1];
							$($("."+theVal.tools[i].theclass,this).parent(),this).attr('onclick',handler_1+"('titleSwitch_1')");
						}else{
							$("."+theVal.tools[i].theclass,this).click(theVal.tools[i].handler);
						}
					}else{
						$("."+theVal.tools[i].theclass,this).attr("onclick","getToolFnc(\""+theVal.tools[i].name+"\")");
					}
				}
			}
			
			//判断是否有右上角锚点
			if(theVal.rightAnchorLog == true){
				$("#anchorsLog").html(anchorsLog(theVal.dataJson.result[0]));
			}
			if(theVal.rightAnchorObj == true){
				$("#anchorsObj").html(anchorsObj(theVal.dataJson.result[0]));
			}
			
			tabsFnc(theVal);
			anchor();
			
			//添加title工具的默认方法
			getToolFnc = function(toolName){
				//alert("您点击了tool工具的"+toolName);
			};
			
			//生成容器的html
			function titleHtml(data){
				var theHtml="";
				for(var i=0; i<data.result.length; i++){
					
					//判断title下面容器是什么形式，  1为默认的列表形式，2为无形式， 3为tab标签形式
					if(data.result[i].containerType == 2){
						theHtml += '<div class="basicOuter">'
		                        +'<div class="title" id="'+data.result[i].bigTitleCode+'">'
		                            +'<span class="left titleLeft"></span>'
		                            +'<span class="icon_'+data.result[i].bigIconNum+' left"></span>'
		                            +'<h3 class="left titleName">'+data.result[i].bigTitleName+'</h3>'
		                            +'<span class="right titleRight"></span>'
		                        +'</div>'
		                        +'<div class="basicInner"><div class="infoCont clearfix"></div></div></div>';
					}else if(data.result[i].containerType == 3){
						theHtml += '<div class="basicOuter">'
		                        +'<div class="title clearfix" id="'+data.result[i].bigTitleCode+'">'
		                            +'<span class="titleLeft left"></span>'
		                            +'<span class="icon_1 left" id="'+data.result[i].bigTitleCode+'_link"></span>'
		                            +'<h3 class="left titleName">'+data.result[i].bigTitleName+'</h3>'
		                            +'<span class="titleNum" id="titleNum_'+data.result[i].bigTitleCode+'">（'+data.result[i].bigTitleNum+'条）</span>'
		                            +'<span class="titleRight right"></span>'
		                        +'</div>'
		                        
		                        +'<div class="baicInner">';
						theHtml+='<div class="tabsWrapper"><div class="innerTitle clearfix tabsHd"><a class="tabExport right" href="#"></a>';
						// 添加tab页面导航
						for(var b = 0 ; b < data.result[i].smallTitle.length; b++){
							var selected = b==0?"selected":"";
							theHtml+='<div class="left tabRight '+selected+'"><div class="tabLeft">'
							+'<a href="#" class="tabCenter">'+data.result[i].smallTitle[b].smallTitleName+'<span class="contactNum">（'
							+data.result[i].smallTitle[b].smallTitleNum+'）</span></a></div></div>';
						}
						theHtml+='</div><div class="tabsBd">';
						// 添加列表数据标签
						for(var j = 0 ; j < data.result[i].smallTitle.length; j++){
							var hide = j>0?'hide':'';
							//theHtml+='<div class="tabContent clearfix tableBox '+hide+'" id="'+data.result[i].bigTitleCode+'_'+data.result[i].smallTitle[j].smallTitleCode+'"></div>';
							theHtml+='<div class="tabContent clearfix tableBox '+hide+'" id="'+data.result[i].smallTitle[j].smallTitleCode+'"></div>';
							// 封装数组数据，用来动态显示列表数据
							//this.relationPeopleArr[this.relationPeopleArr.length] = ({"url":"json/qqtable5.json","tableId":data.result[i].smallTitle[j].smallTitleCode,"childerUrl":childerUrl});
						}
						theHtml+='</div></div></div></div>';
					}else{
						theHtml += '<div class="basicOuter">'
		                        +'<div class="title clearfix" id="'+data.result[i].bigTitleCode+'">'
		                            +'<span class="titleLeft left"></span>'
		                            +'<span class="icon_'+data.result[i].bigIconNum+' left"></span>'
		                            +'<h3 class="left titleName">'+data.result[i].bigTitleName+'</h3>'
		                            +'<span class="titleNum" id="titleNum_'+data.result[i].bigTitleCode+'">（'+data.result[i].bigTitleNum+'条）</span>'
		                            +'<span class="titleRight right"></span>';
		                            
									if(theVal.tools != null){
				             			theHtml += getBigTool(theVal.tools,data.result[i].bigTitleCode);
									}
						
		                theHtml +='</div><div class="basicInner">';
								
						for(var j = 0 ; j < data.result[i].smallTitle.length; j++){
							theHtml += '<div class="communication">'
		                                +'<div class="innerTitle clearfix" id="'+data.result[i].smallTitle[j].smallTitleCode+'_link">'
		                                    +'<div class="innerTitleLeft left"></div>'
		                                    +'<span class="icon_'+data.result[i].smallTitle[j].smallIconNum+' left"></span>'
		                                    +'<h3 class="left innerTitleName">'+data.result[i].smallTitle[j].smallTitleName+'</h3>'
		                                    +'<span class="left innerTitleNum" id="innerTitleNum_'+data.result[i].smallTitle[j].smallTitleCode+'">（'+data.result[i].smallTitle[j].smallTitleNum+'条）</span>'
		                                    //+'<a href="#" class="left innerSeeAll">查看全部</a>'
		                                    +'<div class="innerTitleRight right"></div>';
		                                    
								if(theVal.tools != null){
									theHtml += getsmallTool(theVal.tools);
								}
											
								theHtml+='</div><div class="tableBox" id="'+data.result[i].smallTitle[j].smallTitleCode+'"></div></div>';
								//添加table列表数组
								//this.tableArr[this.tableArr.length] = ({"url":"json/qqtable"+(j+1)+".json","tableId":data.title[i].smallTitle[j].smallTitleCode,"type":"objPage","childerUrl":childerUrl});
							}
								
						theHtml += '</div></div>';
					}
					
				}
				return theHtml;
			}
			
			//添加各一级title工具
			function getBigTool(theTools,containerId){
	
				var toolshtml = "";
				for(var i=0; i<theTools.length; i++){
					if(theTools[i].level == 1){
						if(theTools[i].name == "二次搜索"){
							toolshtml +='<div class="titleSch right">'
		                        +'<a href="#" class="'+theTools[i].theclass+'">'+theTools[i].thevalue+'</a>'
		                        +'<div class="titleSchBar clearfix">'
									+'<input type="text" id="'+containerId+'_secondSearchText" class="left titleSchInput" maxlength="40" />'
		                            +'<a href="#" class="left titleSchLink" onclick="doSecondSch(\''+containerId+'\')">搜索</a>'
		                        +'</div>'
		                    +'</div>';
						}else{
							toolshtml += '<a href="#" class="'+theTools[i].theclass+' right">'+theTools[i].thevalue+'</a>';
						}
					}
				}
				return toolshtml;
			}
			
			//添加各二级title工具
			function getsmallTool(theTools){
				var toolshtml = "";
				for(var i=0; i<theTools.length; i++){
					if(theTools[i].level == 2){
						if(theTools[i].name == "设置"){
							toolshtml += '<div class="tabDiaBox right">'
								+'<a href="#" class="'+theTools[i].theclass+' right">'+theTools[i].thevalue+'</a>'
							+'</div>';
						}else{
							toolshtml += '<a href="#" class="'+theTools[i].theclass+' right">'+theTools[i].thevalue+'</a>';
						}
					}
				}
				return toolshtml;
			}
		
			// tabs脚本
			function tabsFnc(tabsVal){
				$('.tabRight').each(function(w){
					$(this).click(function(){
						//$(this).closest(".tabsHd").next(".tabsBd").find(".tabContent").eq(w).siblings().empty();
						// 下面这行可以隐藏tab页的数据 ，先注掉  zzq
						//$(this).closest(".tabsHd").next(".tabsBd").find(".tabContent").empty();
						$(this).addClass('selected').siblings().removeClass('selected');
						$('.tabContent').eq(w).removeClass('hide').siblings().addClass('hide');
						$(".sort").hide();
						if(tabsVal.handler != null){
							var tabsId = $(this).parent().next().children('div:visible').attr('id');
							var parentTitleId = $(this).closest(".baicInner").prev(".title").attr("id");
							theVal.handler(tabsId,parentTitleId);
						}
						
					});	
				});
				/*
				$(".groupName").live("click",function(){
					var as = $(this).parent().find('a');
					var index = as.index(this);
					
					$(this).addClass('groupNameSel').siblings().removeClass('groupNameSel');
					$('.groupsDetails .groupDetails').eq(index).removeClass('hide').siblings().addClass('hide');
				});
				*/
			}
			
			//右上角全文锚点
			function anchorsLog(data){
				var resultHtml='<span class="logData">'+data.bigTitleName+'：'+data.bigTitleNum+'</span>'
		                            +'<div class="logObjBtm">'
		                                +'<div class="logObjTop">'
		                                    +'<div class="logObjCenter clearfix">';
											
				for(var i = 0 ; i < data.smallTitle.length ; i++){
					resultHtml += '<a href="#'+data.smallTitle[i].smallTitleCode+'_link" class="left">'+data.smallTitle[i].smallTitleName+'（'+data.smallTitle[i].smallTitleNum+'）</a>';
				}
				resultHtml += '<span class="logobjarrow"></span></div></div></div>';
				return resultHtml;
			};
			
			//右上角对象锚点
			function anchorsObj(data){
				var resultHtml='<span class="logData">'+data.bigTitleName+'：'+data.bigTitleNum+'条</span>'
		                            +'<div class="logObjBtm">'
		                                +'<div class="logObjTop">'
		                                    +'<div class="logObjCenter clearfix">';
				for(var i = 0 ; i < data.smallTitle.length ; i++){
					resultHtml += '<a href="#'+data.smallTitle[i].smallTitleCode+'_link" class="left">'+data.smallTitle[i].smallTitleName+'（'+data.smallTitle[i].smallTitleNum+'）</a>';
				}
		        resultHtml+='<span class="logobjarrow"></span></div></div></div>';
				return resultHtml;
			};
			
			//右上角锚点鼠标经过效果
			$(".logObjResult").each(function(){
				$(this).hover(function(){
					$(this).find(".logData").css("color","#5b9cd4");
					$(this).find(".logObjBtm").show();
				},function(){
					$(this).find(".logData").css("color","#e4e4e4");
					$(this).find(".logObjBtm").hide();
				});
			});
			
			//QQ对象页左侧导航点击效果
			function anchor(){
				$(".logObjResult a").live("click",function(){
						var logA = $(this).attr("href").split("#")[1].split("_")[0];
						//var logA = $(this).attr("href").split("#")[1];
						var logAPos = $("#"+logA).offset().top;
						if(document.getElementById("main")){
							var scrolltop=document.getElementById("main").scrollTop;
						}
						if(theVal.handler != null){
							theVal.handler(waitShow);
						}
						
						$("#main").animate({scrollTop: scrolltop + logAPos-104},0.1);
				});
			}
			
		});
	};
})(jQuery);
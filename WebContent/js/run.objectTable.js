/*
 * author:zhangzequn 
 * date:2015-01-19
 * description:创建对象表格组件；1.展示表格数据信息；2.支持分页；
 * 						3.支持更多加载；4.支持复选框功能；5.支持自定义列显示等功能。
 */
(function($){
	/*
	 * description：默认初始方法,包括调用的标签对象和参数的初始化 
	 * param：
	 * 		div：表示div标签对象
	 * 		p：表示参数配置信息
	 * */
	$.addGrid = function(div,p){
		// 获取div标签id，创建table标签的独立id
		var id = $(div).attr('id');	
		var ulId = "ul_"+id;
		var u = document.createElement("ul");
		u.id = ulId;
		$(div).append(u);
		
		// 判断div标签是否已经存在，存在返回不做任何操作
		if (div.grid) return false; //return if already exist	
		// 设置默认的参数，并赋予默认值
		p = $.extend({
			 height: 200, //default height
			 width: 200, //auto width
			 url: false, //ajax url
			 method: 'POST', // data sending method
			 dataType: 'xml', // type of data loaded
			 errormsg: '连接失败',
			 usepager: false, //
			 usepagemore: false, //
			 hidepage:false,
			 page: 1, //current page
			 total: 1, //total pages
			 rp: 8, // results per page
			 rpOptions: [10,15,20,25,40],
			 title: false,
			 pagestat: '共{total}条记录，当前页显示： {from} - {to}条',
			 pagetext: '当前页',
			 outof: 'of',
			 findtext: '查找',
			 procmsg: '数据正在加载中，请等待 ...',
			 query: '',
			 qtype: '',
			 nomsg: '没有数据',
			 onSuccess: false,
			 onError: false,
			 checkbox:false,
			 autoload:true,
			 onDetail:null, // 详细方法
			 icon:null,     // 默认图标
			 tools:null,    // 操作按钮
			 linkHandler:null,
			 tabId:id
		  }, p);
		  
		  $(div).addClass('objectBox').css('width',p.width).css('height',p.height);
		  $(u).attr({cellPadding: 0, cellSpacing: 0, border: 0}) //添加默认样式，去掉间距
		  .addClass('bulks clearfix');
		  
		  /*
		 * descript：创建ul对象
		 * 			里面全是列表对象的私有属性和方法
		 * */
		var grid = {
			// 加载数据方法
			_populate: function (arg) { //get latest data

				if (this.loading) return true;

				this.loading = true;
				if (!p.url) return false;
				
				$('.pReload',this.pDiv).addClass('loading');
				
				if (!p.newp) p.newp = 1;
				
				if(arg!=null && arg!=1){
					//p.query+='&'+arg.query;
					p.params = arg.params;
					p.newp=1;
				}
				
				if (p.page>p.pages) p.page = p.pages;
				//var param = {page:p.newp, rp: p.rp, sortname: p.sortname, sortorder: p.sortorder, query: p.query, qtype: p.qtype};
				var param = {
						'page': p.newp ,
						'rows' : p.rp,
						'sort': p.sortname,
						'order': p.sortorder,
						'query': p.query,
						'qtype' : p.qtype,
						'searchId': p.searchId,
						'className' : p.className
					};							 
							 
					if (p.params){
						for(var t in p.params) 
						{ 
							param[t]=p.params[t]; 
						}
					}
				
					$.ajax({
					   type: p.method,
					   url: p.url,
					   data: param,
					   dataType: p.dataType,
					   success: function(data){grid._addData(data);},
					   error: function(XMLHttpRequest, textStatus, errorThrown) { try { if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown); } catch (e) {} }
					 });
			},
			// 添加列表数据方法，data：表示后台传过来的数据
			_addData:function(data){
				// 对数据进行加工处理，处理方法由调用组件人员编写。
				if (p.preProcess)
					data = p.preProcess(data, p.tabId);
				
				$('.pReload',this.pDiv).removeClass('loading');
				this.loading = false;
				
				if (!data) 
					{
						$('.pPageStat',this.pDiv).html(p.errormsg);	
						return false;
					}
						
				// 处理分页数据
				if (p.dataType=='xml')
					p.total = +$('result total',data).text();
				else
					p.total = data.total;
					
				if (p.total==0)
					{
						$(u).empty();
						p.pages = 1;
						p.page = 1;
						this._buildpager();
						$('.pPageStat',this.pDiv).html(p.nomsg);
						return false;
					}
				
				p.pages = Math.ceil(p.total/p.rp);
				
				if (p.dataType=='xml')
					p.page = +$('result page',data).text();
				else
					p.page = data.page;
					
				this._buildpager();
				
				$(u).empty();
				if (p.dataType=='json'){
					
					$.each(data.result,function(i,row){
						// 创建li对象
						var li = document.createElement('li');
						//$(li).addClass('bulk left').mouseover(function(){
//							$(this).addClass('bulk_border');
//						}).mouseout(function(){
//							$(this).removeClass('bulk_border');
//						});
						$(li).addClass('bulk left').mouseover(function(){
							$(this).addClass('bulk_border');
							$(this).find('.checkBox_1').live('click',function(){
								if($(this).attr('checked')){
									$(this).parents('.bulk').addClass('bulk_selt');
								}else{
									$(this).parents('.bulk').removeClass('bulk_selt');
								}
							});
						}).mouseout(function(){
							$(this).removeClass('bulk_border');
						});
						var ldiv = document.createElement('div');
						$(ldiv).addClass('clearfix');
						// 在li里面封装一层div，用来显示复选框和详情等
						if(p.checkbox || p.checkbox){
							$(li).append(ldiv);
						}
						// 添加复选框
				 		if(p.checkbox){
				 			//$(ldiv).append('<input type="checkbox" value="'+row.id+'" name="c_'+$(div).attr('id')+'" id="c_'+$(div).attr('id')+'" class="checkBox_1 left">');
				 			
				 			//版本中针对复选框,增加图标信息
				 			$(ldiv).append('<img  src="themes/images/kp4.png" >');
				 		}
				 		// 添加查看详情操作
				 		if(p.onDetail){
				 			var aLink = document.createElement('a');
				 			$(aLink).addClass('details_1 right lightBlack').html('详情&gt;&gt;').click(function(){
				 				p.onDetail(row.id);  // 查看详情方法
				 			});
				 			$(ldiv).append(aLink);
				 		}
				 		// 创建展示数据的ul对象
			 			var c_ul = document.createElement('ul');
			 			$(c_ul).addClass('objectInfo');
				 		// 添加展示数据的内容
				 		$.each(data.head,function(i,head){
				 			var c_li = document.createElement('li');
				 			// 添加方法
				 			var handler = "";
				 			for(var l=0;l<p.linkHandler.length;l++){
				 				if(p.linkHandler[l].column==head.name){
				 					handler = p.linkHandler[l].handler;
				 					break;
				 				}
				 			}
				 			if(i==0){
					 			var c_li_div = document.createElement('div');
					 			$(c_li_div).addClass('objectN left');
					 			$(c_li).addClass('clearfix').append(c_li_div);
					 			// 添加图标
					 			if(p.icon!=null){
					 				
					 				//增加卡片数据的图标详细信息  begin
					 				var img = document.createElement('img');
					 				$(img).attr("src",p.icon);
					 				//$(img).attr("id",row.id+'_'+p.tabId);
					 				$(img).attr("name",p.tabId);
					 				var data = JSON.stringify(row);
					 				$(img).attr("tagName",data);
					 				
					 				//增加卡片数据的图标详细信息  end
					 				
					 				
					 			    $(c_li_div).append(img);
					 			}
					 			var a = document.createElement('a');
					 			$(a).addClass('objectL').html(row.cell[head.name]).click(handler);
					 			$(c_li_div).append(a);
					 			$(c_li).append(c_li_div);
				 			}else{
				 				var span = document.createElement("span");
				 				$(c_li).addClass('wordWrapper');
				 				$(c_li).append('<label>'+head.display+'</label>').append(span);
				 				$(span).html(row.cell[head.name]).click(handler);
				 				$(span).attr("title",row.cell[head.name]);
				 			}
				 			$(c_ul).append(c_li);
				 		});
				 		$(li).append(c_ul);
				 		// 添加操作按钮
						grid._addTools(li,row);
				 		$(u).append(li);
					});
					
		          /* 卡片信息不足一页时,卡片信息进行补齐  begin */
					var showNum = p.rp;
					var actualNum = data.result.length;
					var vacancyNum = showNum - actualNum;
					
					if( vacancyNum > 0){
						for(var i= 0 ; i < vacancyNum ; i++){
							var li = document.createElement('li');
							$(li).addClass('bulk left').mouseover(function(){
								$(this).addClass('bulk_border');
								$(this).find('.checkBox_1').live('click',function(){
									if($(this).attr('checked')){
										$(this).parents('.bulk').addClass('bulk_selt');
									}else{
										$(this).parents('.bulk').removeClass('bulk_selt');
									}
								});
							}).mouseout(function(){
								$(this).removeClass('bulk_border');
							});
							var ldiv = document.createElement('div');
							$(ldiv).addClass('clearfix');

					 		// 创建展示数据的ul对象
				 			var c_ul = document.createElement('ul');
				 			$(c_ul).addClass('objectInfo');

					 		$(li).append(c_ul);
					 		$(u).append(li);
						}
					}
				/* 卡片信息不足一页时,卡片信息进行补齐  end */	
					
				}
			},
			
			// 添加操作按钮
			_addTools:function(obj,row){
				if(p.tools!=null){
					for(t in p.tools){
						var tool = p.tools[t];
						// 创建button
						var button = document.createElement("button");
						$(button).attr("type","button").addClass(tool.className)
						.html(tool.name).click(tool.handler).attr('id',ulId+'_'+row.id);
						$(obj).append(button);
					}
				}
			},
			
			// 重新创建列表的分页数据
			_buildpager: function(){ //rebuild pager based on new properties
				$('.pcontrol input',this.pDiv).val(p.page)
				.keyup(
					function ()
					{
						var val = $(this).val();
						var reg = new RegExp("^[0-9]*$");
						if(!reg.test(val)){ // 当前页只能是数子类型
							$(this).val(val.substring(0,val.length-1));
							alert("请输入数字！");
						}else if(parseInt(val)<=0 || parseInt(val)>p.pages){ // 当前页不能小于0或大于总页数
							$(this).val(val.substring(0,val.length-1));
							alert("输入数字不能大于最大页数且大于0！");
						}
					}
				);
				$('.pcontrol span',this.pDiv).html(" / "+p.pages);
				var r1 = (p.page-1) * p.rp + 1; 
				var r2 = r1 + p.rp - 1; 
				if (p.total<r2) r2 = p.total;
				
				var stat = p.pagestat;
				
				stat = stat.replace(/{from}/,r1);
				stat = stat.replace(/{to}/,r2);
				stat = stat.replace(/{total}/,p.total);
				
				$('.pPageStat',this.pDiv).html(stat);
				
			},
			
			// 监听加载更多事件处理方法，根据请求参数和当前页数加一，查询数据
			_changePageMore: function (){
				if(p.newp<=1){
					p.newp=1;
				}
				var param = {
						'page': p.newp ,
						'rows' : p.rp,
						'sort': p.sortname,
						'order': p.sortorder,
						'query': p.query,
						'qtype' : p.qtype,
						'searchId': p.searchId,
						'className' : p.className
					};							 
							 
					if (p.params){
						for(var t in p.params) 
						{ 
							param[t]=p.params[t]; 
						}
					}
				
					$.ajax({
					   type: p.method,
					   url: p.url,
					   data: param,
					   dataType: p.dataType,
					   success: function(data){grid._addData(data);},
					   error: function(XMLHttpRequest, textStatus, errorThrown) { try { if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown); } catch (e) {} }
					 });
			},
			//改变列表分页数据
			_changePage: function (ctype){ //change page

				if (this.loading) return true;
			
				switch(ctype)
				{
					case 'first': p.newp = 1; break;
					case 'prev': if (p.page>1) p.newp = parseInt(p.page) - 1; break;
					case 'next': if (p.page<p.pages) p.newp = parseInt(p.page) + 1; break;
					case 'last': p.newp = p.pages; break;
					case 'input': 
							var nv = parseInt($('.pcontrol input',this.pDiv).val());
							if (isNaN(nv) || nv<1) nv = 1;
							else if (nv > p.pages) nv = p.pages;
							$('.pcontrol input',this.pDiv).val(nv);
							p.newp =nv;
							break;
				}
				if (p.newp==p.page) return false;
				
				if (p.onChangePage) 
					p.onChangePage(p.newp);
				else				
					this._populate();
			
			}
		};
		
		// load data
		if (p.url&&p.autoload) 
		{
			grid._populate();
		}
		
		// 创建分页对象
		if (p.usepager) grid.pDiv = document.createElement('div'); //create pager container
		// 创建加载跟多对象
		if (p.usepagemore) grid.pmDiv = document.createElement('div'); //create pageMore container
		//init divs
		grid.gDiv = document.createElement('div'); //create global container
		grid.mDiv = document.createElement('div'); //create title container
		grid.hDiv = document.createElement('div'); //create header container
		grid.bDiv = document.createElement('div'); //create body container
		grid.vDiv = document.createElement('div'); //create grip
		grid.rDiv = document.createElement('div'); //create horizontal resizer
		grid.cDrag = document.createElement('div'); //create column drag
		grid.block = document.createElement('div'); //creat blocker
		grid.nDiv = document.createElement('div'); //create column show/hide popup
		grid.nBtn = document.createElement('div'); //create column show/hide button
		grid.iDiv = document.createElement('div'); //create editable layer
		grid.tDiv = document.createElement('div'); //create toolbar
		grid.sDiv = document.createElement('div');
		
		// add pager
		if (p.usepager)
		{
			grid.pDiv.innerHTML = '<div></div>';
			$(grid.bDiv).append(grid.pDiv);
			if(p.hidepage){
				$(grid.bDiv).mouseover(
					function(){
						$('.pagingWrapper',grid.pDiv).show();
					}
				)
				.mouseout(
					function(){
						$('.pagingWrapper',grid.pDiv).hide();
					}
				);
			}
			
			//var html = ' <div class="pGroup"> <div class="pFirst pButton"><span></span></div><div class="pPrev pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pcontrol">'+p.pagetext+' <input type="text" size="4" value="1" /> '+p.outof+' <span> 1 </span></span></div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pNext pButton"><span></span></div><div class="pLast pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pReload pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pPageStat"></span></div>';
			var html = '<div class="pagingWrapper clearfix">'
				+'<div class="right">'
					+'<a href="#" class="prePage">上一页</a>'
					+'<a href="#" class="nextPage">下一页</a>'
					+'<span class="pcontrol">第'
					+'<input type="text" class="pageNum" value="1" />'
					+'<span class="indexPage"></span></span>'
					+'<a href="#" class="enter">跳转</a>'
				+'</div>'
			+'</div>';
			$(grid.pDiv).html(html);
			if(p.hidepage){
				$('.pagingWrapper',grid.pDiv).hide()
				.mouseover(
					function(){
						$('.pagingWrapper',grid.pDiv).show();
					}
				)
				.mouseout(
					function(){
						$('.pagingWrapper',grid.pDiv).hide();
					}
				);
			}
			$('.pReload',grid.pDiv).click(function(){grid._populate()});
			$('.pFirst',grid.pDiv).click(function(){grid._changePage('first')});
			$('.prePage',grid.pDiv).click(function(){grid._changePage('prev')});
			$('.nextPage',grid.pDiv).click(function(){grid._changePage('next')});
			$('.pLast',grid.pDiv).click(function(){grid._changePage('last')});
			$('.enter',grid.pDiv).click(function(){grid._changePage('input')});
			$('.pcontrol input',grid.pDiv).keydown(function(e){if(e.keyCode==13) grid._changePage('input')});
			if ($.browser.msie&&$.browser.version<7) $('.pButton',grid.pDiv).hover(function(){$(this).addClass('pBtnOver');},function(){$(this).removeClass('pBtnOver');});
			$(grid.pDiv,grid.sDiv).append("<div style='clear:both'></div>");
			
			// 添加分页数据
			grid._buildpager();
		}
		
		// add pagemore
		if (p.usepagemore)
		{
			grid.pmDiv.innerHTML = '<div></div>';
			$(grid.bDiv).append(grid.pmDiv);
			var html = '<div class="pagingWrapper"><a href="#" class="downmore">加载更多</a></div>';
			$(grid.pmDiv).html(html);
			$('.downmore',grid.pmDiv).click(function(){grid._changePageMore()});
			$(grid.pmDiv).append("<div style='clear:both'></div>");
		}
		$(div).append(grid.bDiv);
		
		u.p = p;
		u.grid = grid;
	};
	
	var docloaded = false;
		
	$(document).ready(function () {docloaded = true} );
	
	// 调用组件入口
	$.fn.objectgrid = function(p){
		// 获取选中的值
		if(p=="getCheckedVals"){
			var result = "";
			$("#ul_"+$(this).attr('id')+" input:checkbox").each(function(){
				if($(this).attr('checked')){
					result+=$(this).val()+',';
				}
			});
			if(result!=''){
				result = result.substring(0,result.length-1);
			}else{
				result = "请选择要导出的数据！";
			}
			return result;
		}
		
		return this.each(function(){
			if (!docloaded){
				$(document).ready(function(){
					$.addGrid(this,p);
				});
			} else {
				$.addGrid(this,p);
			}
		});
	};
	
	$.fn.kpReload = function(p) { // function to reload grid
		return this.each( function() {
		var ul = document.getElementById('ul_'+$(this).attr('id'));
			if (ul.grid&&ul.p.url) ul.grid._populate(p);
		});
	}; //end tableReload
})(jQuery);

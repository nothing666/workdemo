/*
 * author:zhangzequn 
 * date:2015-01-19
 * description:创建表格组件；1.拖拽功能改变宽度；2.展示表格数据信息；3.支持分页；
 * 						4.支持更多加载；5.支持复选框功能；6.支持自定义列显示等功能。
 */
 
(function($){
	 
	/*
	 * description：默认初始方法,包括调用的标签对象和参数的初始化 
	 * param：
	 * 		div：表示div标签对象
	 * 		p：表示参数配置信息
	 * */
	$.addTable = function(div,p)
	{
		// 获取div标签id，创建table标签的独立id
		var id = $(div).attr('id');
		var tableId = "table_"+id;
		var t = document.createElement("table");
		t.id = tableId;
		$(div).append(t);
		
		// 判断div标签是否已经存在，存在返回不做任何操作
		if (div.grid) return false; //return if already exist	
		// 设置默认的参数，并赋予默认值
		p = $.extend({
			 height: 200, //default height
			 width: 600, //auto width
			 striped: true, //apply odd even stripes
			 novstripe: false,
			 minwidth: 70, //min width of columns
			 minheight: 80, //min height of columns
			 resizable: true, //resizable table
			 url: false, //ajax url
			 method: 'POST', // data sending method
			 dataType: 'xml', // type of data loaded
			 errormsg: '连接失败',
			 usepager: false, //
			 usepagemore: false, //
			 hidepage:false,
			 nowrap: true, //
			 page: 1, //current page
			 total: 1, //total pages
			 useRp: true, //use the results per page select box
			 rp: 15, // results per page
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
			 minColToggle: 1, //minimum allowed column to be hidden
			 showToggleBtn: true, //show or hide column toggle popup
			 hideOnSubmit: true,
			 autoload: true,
			 blockOpacity: 0.5,
			 onDragCol: false,
			 onToggleCol: false,
			 onChangeSort: false,
			 onSuccess: false,
			 onError: false,
			 onSubmit: false, // using a custom _populate function
			 checkbox:false,
			 doubleClassName:'erow',
			 searchId:null,
			 className:null,
			 tableId:id
		  }, p);
		  		

		$(t)
		.show() //展示列表数据
		.attr({cellPadding: 0, cellSpacing: 0, border: 0})  //添加默认样式，去掉间距
		.removeAttr('width') //去掉宽度属性	
		;
		
		// 设置列宽度，不能为auto这样就会出现不对其效果，要从新改变下宽度
		if(p.width=='auto'){
			// 判断是否是子表格
			if($(div).parent()[0].tagName.toUpperCase()!="DIV"){
				p.width = $(div).width()-80;	
			}else{
				p.width = $(div).width();
			}
			if(p.width<600){
				p.width = 600;
			}
		}
		// 这个代码解决表格套表格拖拽功能的
		//$(div).css("width",p.width);
		$(t).css("width","90%");
		
		/*
		 * descript：创建列表对象
		 * 			里面全是列表对象的私有属性和方法
		 * 			包括：退拽监听、宽度监听、鼠标事件监听、创建表格、异步加载数据等方法 
		 * 
		 * */
		var grid = {
			_hset : {},
			// 重新拖拽方法
			_rePosDrag: function () {

			var cdleft = 0 - this.hDiv.scrollLeft;
			if (this.hDiv.scrollLeft>0) cdleft -= Math.floor(p.cgwidth/2);
			$(grid.cDrag).css({top:grid.hDiv.offsetTop+1});
			var cdpad = this.cdpad;
			
			$('div',grid.cDrag).hide();
			// 获取拖动的标头宽度数据信息
			$('thead tr:first th:visible',this.hDiv).each
				(
			 	function ()
					{
					var n = $('thead tr:first th:visible',grid.hDiv).index(this);

					var cdpos = parseInt($('div',this).width());
					var ppos = cdpos;
					if (cdleft==0) 
							cdleft -= Math.floor(p.cgwidth/2); 

					cdpos = $(this).width() + cdleft + cdpad;//cdpos + cdleft + cdpad
					
					$('div:eq('+n+')',grid.cDrag).css({'left':cdpos+'px'}).show();

					cdleft = cdpos;
					}
				);
				
			},
			// 根据newH（拖动后的宽度），重新给该列单元格设置宽度。
			_fixHeight: function (newH) {
					newH = false;
					if (!newH) newH = $(grid.bDiv).height();
					var hdHeight = $(this.hDiv).height();
					$('div',this.cDrag).each(
						function ()
							{
								$(this).height(newH+hdHeight);
							}
					);
					
					var nd = parseInt($(grid.nDiv).height());
					
					if (nd>newH)
						$(grid.nDiv).height(newH).width(200);
					else
						$(grid.nDiv).height('auto').width('auto');
					
					$(grid.block).css({height:newH,marginBottom:(newH * -1)});
					
					var hrH = grid.bDiv.offsetTop + newH;
					if (p.height != 'auto' && p.resizable) hrH = grid.vDiv.offsetTop;
					$(grid.rDiv).css({height: hrH});
				
			},
			// 拖拽开始方法，dragtype：拖拽类型；e:鼠标监听事件；obj:当前拖动标头的及节点对象
			_dragStart: function (dragtype,e,obj) { //default drag function start
				// 如果有子表格或别的数据，要从新刷新下列表，在进行拖拽。
				grid._populate();
				if (dragtype=='colresize') //column resize
					{
						$(grid.nDiv).hide();$(grid.nBtn).hide();
						var n = $('div',this.cDrag).index(obj);
						var ow = $('th:visible div:eq('+n+')',this.hDiv).width();
						$(obj).addClass('dragging').siblings().hide();
						$(obj).prev().addClass('dragging').show();
						
						this.colresize = {startX: e.pageX, ol: parseInt(obj.style.left), ow: ow, n : n };
						
						$('body').css('cursor','col-resize');
					}
				else if (dragtype=='vresize') //table resize
					{
						var hgo = false;
						$('body').css('cursor','row-resize');
						if (obj) 
							{
							hgo = true;
							$('body').css('cursor','col-resize');
							}
						this.vresize = {h: p.height, sy: e.pageY, w: p.width, sx: e.pageX, hgo: hgo};
						
					}

				/*else if (dragtype=='colMove') //column header drag
					{
						$(grid.nDiv).hide();$(grid.nBtn).hide();
						this._hset = $(this.hDiv).offset();
						this._hset.right = this._hset.left + $('table',this.hDiv).width();
						this._hset.bottom = this._hset.top + $('table',this.hDiv).height();
						this.dcol = obj;
						this.dcoln = $('th',this.hDiv).index(obj);
						
						this.colCopy = document.createElement("div");
						this.colCopy.className = "colCopy";
						this.colCopy.innerHTML = obj.innerHTML;
						if ($.browser.msie)
						{
						this.colCopy.className = "colCopy ie";
						}
						
						
						$(this.colCopy).css({position:'absolute',float:'left',display:'none', textAlign: obj.align});
						$('body').append(this.colCopy);
						$(this.cDrag).hide();
						
					}*/
														
				$('body').noSelect();
			
			},
			// 拖动中处理的方法，e：鼠标事件
			_dragMove: function (e) {
			
				if (this.colresize) //column resize
					{
						var n = this.colresize.n;
						var diff = e.pageX-this.colresize.startX;
						var nleft = this.colresize.ol + diff;
						var nw = this.colresize.ow + diff;
						if (nw > p.minwidth)
							{
								$('div:eq('+n+')',this.cDrag).css('left',nleft);
								this.colresize.nw = nw;
							}
					}
				else if (this.vresize) //table resize
					{
						var v = this.vresize;
						var y = e.pageY;
						var diff = y-v.sy;
						
						if (!p.defwidth) p.defwidth = p.width;
						
						if (p.width != 'auto' && !p.nohresize && v.hgo)
						{
							var x = e.pageX;
							var xdiff = x - v.sx;
							var newW = v.w + xdiff;
							if (newW > p.defwidth)
								{
									this.gDiv.style.width = newW + 'px';
									p.width = newW;
								}
						}
						
						var newH = v.h + diff;
						if ((newH > p.minheight || p.height < p.minheight) && !v.hgo)
							{
								this.bDiv.style.height = newH + 'px';
								p.height = newH;
								this._fixHeight(newH);
							}
						v = null;
					}
				else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver'); 
					if (e.pageX > this._hset.right || e.pageX < this._hset.left || e.pageY > this._hset.bottom || e.pageY < this._hset.top)
					{
						//this._dragEnd();
						$('body').css('cursor','move');
					}
					else 
					$('body').css('cursor','pointer');
					$(this.colCopy).css({top:e.pageY + 10,left:e.pageX + 20, display: 'block'});
				}													
			
			},
			// 拖动后重新设置类表宽度
			_dragEnd: function () {
				if (this.colresize)
					{
						// 列表的哪一列拖动列
						var n = this.colresize.n;
						// 拖动后的新宽度
						var nw = this.colresize.nw;
								$('th:visible div:eq('+n+')',this.hDiv).css('width',nw);
								$('tr',this.bDiv).each (
									function ()
										{
											$('td:visible div:eq('+n+')',this).css('width',nw);
										}
								);
								this.hDiv.scrollLeft = this.bDiv.scrollLeft;


						$('div:eq('+n+')',this.cDrag).siblings().show();
						$('.dragging',this.cDrag).removeClass('dragging');
						$(t).css("width",$('.hDivBox',this.hDiv).find("table").width());
						this._rePosDrag();
						this._fixHeight();
						this.colresize = false;
					}
				else if (this.vresize)
					{
						this.vresize = false;
					}
				else if (this.colCopy)
					{
						$(this.colCopy).remove();
						if (this.dcolt != null)
							{
							
							
							if (this.dcoln>this.dcolt)
								$('th:eq('+this.dcolt+')',this.hDiv).before(this.dcol);
							else
								$('th:eq('+this.dcolt+')',this.hDiv).after(this.dcol);
							
							
							
							this._switchCol(this.dcoln,this.dcolt);
							$(this.cdropleft).remove();
							$(this.cdropright).remove();
							this._rePosDrag();
							
							if (p.onDragCol) p.onDragCol(this.dcoln, this.dcolt);
																			
							}
						
						this.dcol = null;
						this._hset = null;
						this.dcoln = null;
						this.dcolt = null;
						this.colCopy = null;
						
						$('.thMove',this.hDiv).removeClass('thMove');
						$(this.cDrag).show();
					}										
				$('body').css('cursor','default');
				$('body').noSelect(false);
			},
			_toggleCol: function(cid,visible) {
				
				var ncol = $("th[axis='col"+cid+"']",this.hDiv)[0];
				var n = $('thead th',grid.hDiv).index(ncol);
				var cb = $('input[value='+cid+']',grid.nDiv)[0];
				
				
				if (visible==null)
					{
						visible = ncol.hide;
					}
				
				
				
				if ($('input:checked',grid.nDiv).length<p.minColToggle&&!visible) return false;
				
				if (visible)
					{
						ncol.hide = false;
						$(ncol).show();
						cb.checked = true;
					}
				else
					{
						ncol.hide = true;
						$(ncol).hide();
						cb.checked = false;
					}
					
						$('tbody tr',t).each
							(
								function ()
									{
										if (visible)
											$('td:eq('+n+')',this).show();
										else
											$('td:eq('+n+')',this).hide();
									}
							);							
				
				this._rePosDrag();
				
				if (p.onToggleCol) p.onToggleCol(cid,visible);
				
				return visible;
			},
			_switchCol: function(cdrag,cdrop) { //switch columns
				
				$('tbody tr',t).each
					(
						function ()
							{
								if (cdrag>cdrop)
									$('td:eq('+cdrop+')',this).before($('td:eq('+cdrag+')',this));
								else
									$('td:eq('+cdrop+')',this).after($('td:eq('+cdrag+')',this));
							}
					);
					
					//switch order in nDiv
					if (cdrag>cdrop)
						$('tr:eq('+cdrop+')',this.nDiv).before($('tr:eq('+cdrag+')',this.nDiv));
					else
						$('tr:eq('+cdrop+')',this.nDiv).after($('tr:eq('+cdrag+')',this.nDiv));
						
					if ($.browser.msie&&$.browser.version<7.0) $('tr:eq('+cdrop+') input',this.nDiv)[0].checked = true;	
					
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
			},			
			_scroll: function() {
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					this._rePosDrag();
			},
			// 添加列表数据方法，data：表示后台传过来的数据
			_addData: function (data) { //parse data
				
				// 对数据进行加工处理，处理方法由调用组件人员编写。
				if (p.preProcess)
					data = p.preProcess(data, p.tableId);
				
				$('.pReload',this.pDiv).removeClass('loading');
				this.loading = false;

				if (!data) 
					{
					$('.pPageStat',this.pDiv).html(p.errormsg);	
					return false;
					}
					// 处理分页数据
				if (p.dataType=='xml')
					p.total = +$('rows total',data).text();
				else
					p.total = data.total;
				if (p.total==0)
					{
					$('tr, a, td, div',t).unbind();
					$(t).empty();
					p.pages = 1;
					p.page = 1;
					this._buildpager();
					$('.pPageStat',this.pDiv).html(p.nomsg);
					return false;
					}
				p.pages = Math.ceil(p.total/p.rp);
				
				if (p.dataType=='xml')
					p.page = +$('rows page',data).text();
				else
					p.page = data.page;
				this._buildpager();

				//创建一个新的tbody对象，往里面添加数据
				var tbody = document.createElement('tbody');				
				if (p.dataType=='json')
				{
					$.each
					(
					 data.rows,
					 function(i,row) 
					 	{
					 		// 给额外属性赋值
					 		if(data.searchId!=null){
					 			p.searchId = extend = data.searchId;
					 		}
					 		// 给额外属性赋值
					 		if(data.className!=null){
					 			p.className = extend1 = data.className;
					 		}
					 		// 创建tr对象
							var tr = document.createElement('tr');
							var checkboxHtml = "";
							// 添加复选框
					 		if(p.checkbox){
					 			// 获取列的操作方法，根据linkhandler是否有值添加到该列里面
					 			var linkHandlerHtml = "";
											// 获取操作数组信息
											var linkhandler = p.linkhandler;
											// 添加操作
											if(typeof(linkhandler)!='undefined'){
												for(index in linkhandler){
													var handler = ((linkhandler[index].handler+'').split('(')[0]).split('function')[1];
													linkHandlerHtml+='<a href="#" class="'+linkhandler[index].bclass+'" onclick="'+handler+'('+row.id+')"></a>';
												}
											}											
					 			checkboxHtml="<td width='70px'><input type='checkbox' onclick='checkMethod(this);' value='"+row.id+"'>"+linkHandlerHtml+"</td>";
					 			$(tr).append(checkboxHtml);
					 		}else{
					 			$(tr).append(checkboxHtml);
					 		}
					 		// 各行变色处理方法
							if (i % 2 && p.striped) tr.className = p.doubleClassName;
							
							if (row.id) tr.id = row.id;
							
							// 创建列表的td对象，并展示给td对象填充内容
							$('thead tr:first th',grid.hDiv).each
							(
							 	function (k)
								{
							 		//有checkbox
							 		if(p.checkbox){
								 		if( k==0){
								 			return;
								 		}
										// 自定义显示方式
										var indexArr = indexs.substring(0,indexs.length-1).split(',');
										var isFormatter = false;
										for(_i in indexArr){
											if(indexArr[_i]!="" && (k-1)==indexArr[_i]){
												isFormatter = true;
												break;
											}
										}
										var td = document.createElement('td');
										var idx = $(this).attr('col');
										td.align = this.align;
										if(iconIndex==k-1){
											$(td).html('<span id="span_click" class="text_slice"><img src="../themes/icons/'+row[idx]+'" /></span>');
										}else{
										//	debugger;
											//$(td).html('<span id="span_click" class="text_slice">'+(isFormatter?p.colModel[k].formatter(row.cell[idx],row):row.cell[idx])+'</span>');
											var can = true;
											var text = "";
											if(p.colModel[k-1]!=null && p.colModel[k-1].formatter!=undefined && typeof(p.colModel[k-1].formatter)=='string'){
												text = (isFormatter?(eval(p.colModel[k-1].formatter+'(row[idx],row)')):row[idx]);
											}else{
												text = (isFormatter?p.colModel[k-1].formatter(row[idx],row):row[idx]);
											}
											// 这行的信息下标和截取字符串长度
											if(index_length!=null && index_length.length>0){
												var arrys = index_length.substring(0,index_length.lastIndexOf(',')).split(",");
												for(var l=0;l<arrys.length;l++){
													if(k==arrys[l].split(':')[0]){
														$(td).html(text.substring(0,arrys[l].split(':')[1])+'<br><span id="span_click" class="text_slice">'+text.substring(arrys[l].split(':')[1])+'</span>');
														can = false;
														break;
													}
												}
											}
											if(can){
												$(td).html('<span id="span_click" class="text_slice">'+text+'</span>');
											}
										}							 			
							 			
							 			
							 		}else{
							 			//没有checkbox
										// 自定义显示方式
										var indexArr = indexs.substring(0,indexs.length-1).split(',');
										var isFormatter = false;
										for(_i in indexArr){
											if(indexArr[_i]!="" && (k)==indexArr[_i]){
												isFormatter = true;
												break;
											}
										}
										var td = document.createElement('td');
										var idx = $(this).attr('col');
										td.align = this.align;
										if(iconIndex==k){
											$(td).html('<span id="span_click" class="text_slice"><img src="../themes/icons/'+row[idx]+'" /></span>');
										}else{
										//	debugger;
											//$(td).html('<span id="span_click" class="text_slice">'+(isFormatter?p.colModel[k].formatter(row.cell[idx],row):row.cell[idx])+'</span>');
											var can = true;
											var text = "";
											if(p.colModel[k]!=null && p.colModel[k].formatter!=undefined && typeof(p.colModel[k].formatter)=='string'){
												text = (isFormatter?(eval(p.colModel[k].formatter+'(row[idx],row)')):row[idx]);
											}else{
												text = (isFormatter?p.colModel[k].formatter(row[idx],row):row[idx]);
											}
											// 这行的信息下标和截取字符串长度
											if(index_length!=null && index_length.length>0){
												var arrys = index_length.substring(0,index_length.lastIndexOf(',')).split(",");
												for(var l=0;l<arrys.length;l++){
													if(k==arrys[l].split(':')[0]){
														$(td).html(text.substring(0,arrys[l].split(':')[1])+'<br><span id="span_click" class="text_slice">'+text.substring(arrys[l].split(':')[1])+'</span>');
														can = false;
														break;
													}
												}
											}
											if(can){
												$(td).html('<span id="span_click" class="text_slice">'+text+'</span>');
											}
										}
							 			
							 		}

									$(tr).append(td);
									td = null;					
					 			}
							); 
							
							// 如果没有表头处理方法
							if ($('thead',this.gDiv).length<1) //handle if grid has no headers
							{

									for (idx=0;idx<cell.length;idx++)
										{
										var td = document.createElement('td');
										td.innerHTML = row.cell[idx];
										$(tr).append(td);
										td = null;
										}
							}							
							// tbody追加tr对象
							$(tbody).append(tr);
							tr = null;
						}
					);				
					
				} else if (p.dataType=='xml') {

				i = 1;

				$("rows row",data).each
				(
				 
				 	function ()
						{
							
							i++;
							
							var tr = document.createElement('tr');
							if (i % 2 && p.striped) tr.className = p.doubleClassName;

							var nid =$(this).attr('id');
							if (nid) tr.id = 'row' + nid;
							
							nid = null;
							
							var robj = this;

							$('thead tr:first th',grid.hDiv).each
							(
							 	function ()
									{										
										var td = document.createElement('td');
										var idx = $(this).attr('axis').substr(3);
										td.align = this.align;
										td.innerHTML = $("cell:eq("+ idx +")",robj).text();
										$(tr).append(td);
										td = null;
									}
							);
							
							
							if ($('thead',this.gDiv).length<1) //handle if grid has no headers
							{
								$('cell',this).each
								(
								 	function ()
										{
										var td = document.createElement('td');
										td.innerHTML = $(this).text();
										$(tr).append(td);
										td = null;
										}
								);
							}
							
							$(tbody).append(tr);
							tr = null;
							robj = null;
						}
				);
				
				}

				$('tr',t).unbind();
				$(t).empty();
				
				$(t).append(tbody);
				// 给列表表格渲染拖动标签，在每个td里面创建一个div标签
				this._addCellProp();
				
				this._addRowProp(data);
				
				//this._fixHeight($(this.bDiv).height());
				
				this._rePosDrag();
				
				tbody = null; data = null; i = null; 
				
				if (p.onSuccess) p.onSuccess(p);
				if (p.hideOnSubmit) $(grid.block).remove();//$(t).show();
				
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if ($.browser.opera) $(t).css('visibility','visible');
				
			},
			// 加载更多方法，在原有列表后面追加列表数据，列表本身不做刷新
			_addMoreData: function (data) { //parse data
				if (p.preProcess)
					data = p.preProcess(data,p.tableId);
				
				$('.pReload',this.pDiv).removeClass('loading');
				this.loading = false;

				if (!data) 
					{
					$('.pPageStat',this.pDiv).html(p.errormsg);	
					return false;
					}

				//build new body
				var tbody = document.createElement('tbody');				
				if (p.dataType=='json')
				{
					$.each
					(
					 data.rows,
					 function(i,row) 
					 	{
					 		var lastTr = $(t).find("tr:last");
							var tr = document.createElement('tr');
							var checkboxHtml = "";
					 		if(p.checkbox){
					 			checkboxHtml="<td width='70px'><input type='checkbox' value='"+row.id+"'></td>";
					 			$(tr).append(checkboxHtml);
					 		}
							if ($(lastTr).attr('class')==null) tr.className = p.doubleClassName;
							
							if (row.id) tr.id = 'row' + row.id;
							
							//add cell
							$('thead tr:first th',grid.hDiv).each
							(
							 	function (i)
									{
										// 自定义显示方式
										var indexArr = indexs.substring(0,indexs.length-1).split(',');
										var isFormatter = false;
										for(_i in indexArr){
											if(indexArr[_i]!="" && i==indexArr[_i]){
												isFormatter = true;
												break;
									  		}
										}
										var td = document.createElement('td');
										var idx = $(this).attr('axis').substr(3);
										td.align = this.align;
										//alert($(td).width());
										if(iconIndex==i){
											$(td).html('<span class="text_slice"><img src="themes/icons/'+row.cell[idx]+'" /></span>');
										}else{
											$(td).html('<span class="text_slice">'+(isFormatter?p.colModel[k].formatter(row.cell[idx],row):row.cell[idx])+'</span>');
										}
										//$(td).html('<span class="text_slice">'+(isFormatter?p.colModel[i].formatter(row.cell[idx],row):row.cell[idx])+'</span>');
										if(p.checkbox){
											if(i<$('thead tr:first th').length-1)
												$(tr).append(td);
										}else{
											$(tr).append(td);
										}
										td = null;
									}
							);
							 
							if ($('thead',this.gDiv).length<1) //handle if grid has no headers
							{

									for (idx=0;idx<cell.length;idx++)
										{
										var td = document.createElement('td');
										td.innerHTML = row.cell[idx];
										$(tr).append(td);
										td = null;
										}
							}							
							
							$(lastTr).after(tr);
							//$(tbody).append(tr);
							tr = null;
						}
					);				
					
				} else if (p.dataType=='xml') {

				i = 1;                   

				$("rows row",data).each
				(
				 
				 	function ()
						{
							var lastTr = $(t).find("tr:last");
							
							i++;
							
							var tr = document.createElement('tr');
							if (i % 2 && p.striped) tr.className = p.doubleClassName;

							var nid =$(this).attr('id');
							if (nid) tr.id = 'row' + nid;
							
							nid = null;
							
							var robj = this;

							
							
							$('thead tr:first th',grid.hDiv).each
							(
							 	function ()
									{
										
										var td = document.createElement('td');
										var idx = $(this).attr('axis').substr(3);
										td.align = this.align;
										td.innerHTML = $("cell:eq("+ idx +")",robj).text();
										$(tr).append(td);
										td = null;
									}
							);
							
							
							if ($('thead',this.gDiv).length<1) //handle if grid has no headers
							{
								$('cell',this).each
								(
								 	function ()
										{
										var td = document.createElement('td');
										td.innerHTML = $(this).text();
										$(tr).append(td);
										td = null;
										}
								);
							}
							
							$(lastTr).after(tr);
							//$(tbody).append(tr);
							tr = null;
							robj = null;
						}
				);
				
				}

				//$('tr',t).unbind();
				//$(t).empty();
				
				//$(t).append(tbody);
				this._addCellProp();
				this._addRowProp(data);
				
				//this._fixHeight($(this.bDiv).height());
				
				this._rePosDrag();
				
				tbody = null; data = null; i = null; 
				
				if (p.onSuccess) p.onSuccess();
				if (p.hideOnSubmit) $(grid.block).remove();//$(t).show();
				
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if ($.browser.opera) $(t).css('visibility','visible');
			},
			// 改变排序样式和处理方法
			_changeSort: function(th) { //change sortorder
				// 去掉全选的选中状态
				$('input:checkbox').attr('checked',false);
				if (this.loading) return true;
				
				$(grid.nDiv).hide();$(grid.nBtn).hide();
				
				if (p.sortname == $(th).attr('abbr'))
				{
					if (p.sortorder=='asc') p.sortorder = 'desc'; 
					else p.sortorder = 'asc';						
				}else{
					p.sortorder = 'asc';
				}
				
				//$(th).addClass('sorted').siblings().removeClass('sorted');
				$(th).siblings();
				$('.sdesc',this.hDiv).removeClass('sdesc');
				$('.sasc',this.hDiv).removeClass('sasc');
				$('div',th).addClass('s'+p.sortorder);
				p.sortname= $(th).attr('abbr');
				
				if (p.onChangeSort)
					p.onChangeSort(p.sortname,p.sortorder);
				else
					this._populate(1);
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
			_populate: function (arg) { //get latest data
				if (this.loading) return true;

				if (p.onSubmit)
					{
						var gh = p.onSubmit();
						if (!gh) return false;
					}

				this.loading = true;
				if (!p.url) return false;
				
				$('.pPageStat',this.pDiv).html(p.procmsg);
				
				$('.pReload',this.pDiv).addClass('loading');
				
				$(grid.block).css({top:grid.bDiv.offsetTop});
				
				if (p.hideOnSubmit) $(this.gDiv).prepend(grid.block); //$(t).hide();
				
				if ($.browser.opera) $(t).css('visibility','hidden');

				if (!p.newp) p.newp = 1;
				
				if (p.page>p.pages) p.page = p.pages;
				//var param = {page:p.newp, rp: p.rp, sortname: p.sortname, sortorder: p.sortorder, query: p.query, qtype: p.qtype};
				if(arg!=null && arg!=1){
					//p.query+='&'+arg.query;
					p.params = arg.params;
					p.newp=1;
				}else if(arg==1){
					p.newp=1;
				}
				/*else{
					p.newp++;
				}*/
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
			_doSearch: function () {
				p.query = $('input[name=q]',grid.sDiv).val();
				p.qtype = $('select[name=qtype]',grid.sDiv).val();
				p.newp = 1;

				this._populate();				
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
					   success: function(data){grid._addMoreData(data);},
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
							if (isNaN(nv)) nv = 1;
							if (nv<1) nv = 1;
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
			
			},
			// 给列表表格渲染拖动标签，在每个td里面创建一个div
			_addCellProp: function ()
			{
				
					$('tbody tr td',grid.bDiv).each
					(
						function ()
							{
									var tdDiv = document.createElement('div');
									var n = $('td',$(this).parent()).index(this);
									var pth = $('th:eq('+n+')',grid.hDiv).get(0);
			
									if (pth!=null)
									{
									if (p.sortname==$(pth).attr('abbr')&&p.sortname) 
										{
										this.className = 'sorted';
										}
									 $(tdDiv).css({textAlign:pth.align,width: $('div:first',pth)[0].style.width});
									 
									 if (pth.hide) $(this).css('display','none');
									 
									 }
									 
									 if (p.nowrap==false) $(tdDiv).css('white-space','normal');
									 
									 if (this.innerHTML=='') this.innerHTML = '&nbsp;';
									 
									 //tdDiv.value = this.innerHTML; //store preprocess value
									 if(this.innerHTML.indexOf('div')<0){
									 	tdDiv.innerHTML = this.innerHTML;
										 var prnt = $(this).parent()[0];
										 var pid = false;
										 if (prnt.id) pid = prnt.id.substr(3);
										 
										 if (pth!=null)
										 {
										 if (pth.process) pth.process(tdDiv,pid);
										 }
										 
										$(this).empty().append(tdDiv).removeAttr('width'); //wrap content
	
										//add editable event here 'dblclick'
									 }

							}
					);
					
			},
			__getCellDim: function (obj) // get cell prop for editable event
			{
				var ht = parseInt($(obj).height());
				var pht = parseInt($(obj).parent().height());
				var wt = parseInt(obj.style.width);
				var pwt = parseInt($(obj).parent().width());
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'));
				var pdt = parseInt($(obj).css('paddingTop'));
				return {ht:ht,wt:wt,top:top,left:left,pdl:pdl, pdt:pdt, pht:pht, pwt: pwt};
			},
			_addRowProp: function(data)
			{
					$('tbody tr',grid.bDiv).each
					(
						function (i)
							{
							$(this)
							.click(
								function (e) 
									{ 
										var obj = (e.target || e.srcElement); 
										if (obj.href || obj.type || obj.id!='span_click') return true;
										//$(this).toggleClass('trSelected');
										if (p.singleSelect) $(this).siblings().removeClass('trSelected');
										// add for method tr
										if(p.addRowProp){
											// 拼接每行的数据json字符串
											var jsonStr = '{';
											for (var c=0;c<p.colModel.length;c++){
												jsonStr += '"'+p.colModel[c].name+"\":\""+data.rows[i][p.colModel[c].name]+"\",";
											}
											// 去掉最后面的一个“，”
											jsonStr = jsonStr.substring(0,jsonStr.length-1);
											jsonStr += '}';
											// 把json字符串装换成为json格式
											jsonStr = (new Function("","return "+jsonStr))();
											// 给行方法传id和改行的数据
											p.addRowProp(data.rows[i].id,jsonStr,this);
										}
										// 选中前面的复选框
										/*$(this).find("td:first").find("input:checkbox").each(function(e){
											if(typeof($(this).attr("checked"))=="undefined"){
												$(this).attr("checked",true);											
											}else{
												$(this).attr("checked",false);
											}
										});*/
									}
							)
							.mousedown(
								function (e)
									{
										if (e.shiftKey)
										{
										$(this).toggleClass('trSelected'); 
										grid.multisel = true; 
										this.focus();
										$(grid.gDiv).noSelect();
										}
									}
							)
							.mouseup(
								function ()
									{
										if (grid.multisel)
										{
										grid.multisel = false;
										$(grid.gDiv).noSelect(false);
										}
									}
							)
							.hover(
								function (e) 
									{ 
										$(this).addClass('trSelected');
									//if (grid.multisel) 
										//{
										//$(this).toggleClass('trSelected'); 
										//}
									},
								function () {
									$(this).removeClass('trSelected');
								}						
							);
							/*.hover(
								function (e) 
									{ 
									if (grid.multisel) 
										{
										$(this).toggleClass('trSelected'); 
										}
									},
								function () {}						
							);*/
							
							if ($.browser.msie&&$.browser.version<7.0)
								{
									$(this)
									.hover(
										function () { $(this).addClass('trOver'); },
										function () { $(this).removeClass('trOver'); }
									)
									;
								}
							}
					);
			},
			pager: 0
			};	
		// 	那几个列内容需要自定义显示
		var indexs = '';
		// 显示图标
		var iconIndex = -1; 
		// 这行信息保存要这行的列（下标：长度）
		var index_length = '';
		// 有几列是隐藏的
		var hideNum = 0;
		//create model if any
		if (p.colModel)
		{
			var width = 70;
			var shortColNum = 0;
			var avgWidth = 0;
			for (i=0;i<p.colModel.length;i++){
				if(p.colModel[i].shortSize){
					shortColNum+=1;
				}else if(p.colModel[i].hide){
					hideNum+=1;
				}
			}
			if(shortColNum>0){
				if(p.checkbox){
					avgWidth = (p.width-70*(shortColNum+1)-(p.colModel.length+2)*2)/(p.colModel.length-shortColNum-hideNum)-1;
				}
				else
					avgWidth = (p.width-70*shortColNum-(p.colModel.length+1)*2)/(p.colModel.length-shortColNum-hideNum)-1;
			}else{
				if(p.checkbox){
					avgWidth = (p.width-70-(p.colModel.length+1)*2)/(p.colModel.length-hideNum)-1;
				}
				else
					avgWidth = (p.width-(p.colModel.length+1)*2)/(p.colModel.length-hideNum)-1;
			}
			thead = document.createElement('thead');
			tr = document.createElement('tr');
			var checkboxHtml="";
			if(p.checkbox){
				checkboxHtml="<th col='id' width='70'><input type='checkbox' id='cks_"+$(t).attr('id')+"' name='cks_"+$(t).attr('id')+"' onclick='checkAll(this,\""+$(t).attr('id')+"\")'/></th>";
				$(tr).append(checkboxHtml);
			}
			
			for (i=0;i<p.colModel.length;i++)
				{
					var cm = p.colModel[i];
					var th = document.createElement('th');
					
					// 添加图标
					if(cm.name.toUpperCase().indexOf('ICON')>-1){
						iconIndex = i;
					}
					// 给该列添加col属性
					if (cm.name){
						$(th).attr('col',cm.name);						
					}
					
					// 隐藏列
					if(cm.hide){
						$(th).attr('display',"none");
					}
					// 添加排序
					if (cm.sortable){
						$(th).attr('abbr',cm.name).css("cursor","pointer");
						$(th).addClass('defaultSort');
					}
					// 这行的信息下标和截取字符串长度
					if(cm.lineLength){
						index_length += i+':'+cm.lineLength+",";
					}
					
					//th.idx = i;
					$(th).attr('axis','col'+i);
					
					if (cm.align)
						th.align = cm.align;
						
					if (cm.width) 
						$(th).attr('width',cm.width);
					else if (cm.shortSize) 
						$(th).attr('width',width);
					else
						$(th).attr('width',avgWidth>0?avgWidth:cm.width);

					if (cm.hide)
						{
							th.hide = true;
						}
					
					if (cm.process)
						{
							th.process = cm.process;
						}
					if(cm.handler){
						//$(th).live('click',cm.handler).addClass('thSort_1');
						
						var span = document.createElement("span");
						var id = $(div).attr('id');
						$(span).html(cm.display).css("cursor","pointer").css('color','#888').attr('id','span_'+id+'_'+cm.name);
						if(typeof(cm.handler)=='string'){
							//var param = '{"data":{"url":"'+cm.menuUrl+'","protocolType":"'+$(div).attr("id")+'","colName":"'+cm.name+'"}}';
							$('#span_'+id+'_'+cm.name).die('click',eval(cm.handler));
							$('#span_'+id+'_'+cm.name).live('click',{url:cm.menuUrl,protocolType:$(div).attr('id'),colName:cm.name},eval(cm.handler));
							//$(span).attr('onclick',cm.handler+'('+param+')');
						}else{
							$('#span_'+id+'_'+cm.name).die('click',cm.handler);
							$('#span_'+id+'_'+cm.name).live('click',{url:cm.menuUrl,protocolType:$(div).attr('id'),colName:cm.name},cm.handler);
						}
						//$('#span_'+id+'_'+cm.name).live('click',{url:cm.menuUrl,protocolType:$(div).attr('id'),colName:cm.name},cm.handler);
						$(th).append(span);
						
					}else{
						th.innerHTML = cm.display;
					}
					
					if(cm.formatter){
						indexs+=i+",";
						if(navigator.userAgent.indexOf('Firefox')!=-1){
							$(th).append('<span class="thTip_f">&nbsp;&nbsp;&nbsp;</span>');
						}else{
							$(th).append('<span class="thTip">&nbsp;&nbsp;&nbsp;</span>');
						}
						
					}

					$(tr).append(th);
				}
			$(thead).append(tr);
			$(t).prepend(thead);
		} // end if p.colmodel	

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
		
		if (p.usepager) grid.pDiv = document.createElement('div'); //create pager container
		if (p.usepagemore) grid.pmDiv = document.createElement('div'); //create pageMore container
		grid.hTable = document.createElement('table');

		//set gDiv
		grid.gDiv.className = 'flexigrid';
		//if (p.width!='auto') grid.gDiv.style.width = p.width + 'px';

		//add conditional classes
		if ($.browser.msie)
			$(grid.gDiv).addClass('ie');
		
		if (p.novstripe)
			$(grid.gDiv).addClass('novstripe');

		$(t).before(grid.gDiv);
		$(grid.gDiv)
		.append(t)
		;

		//set toolbar
		if (p.tools) 
		{
			grid.tDiv.className = 'tDiv';
			var tDiv2 = document.createElement('div');
			tDiv2.className = 'tDiv2';
			
			for (i=0;i<p.tools.length;i++)
				{
					var btn = p.tools[i];
					if (!btn.separator)
					{
						var btnDiv = document.createElement('div');
						btnDiv.className = 'fbutton';
						btnDiv.innerHTML = "<div><span>"+btn.name+"</span></div>";
						if (btn.bclass) 
							$('span',btnDiv)
							.addClass(btn.bclass)
							.css({paddingLeft:20})
							;
						btnDiv.handler = btn.handler;
						btnDiv.name = btn.name;
						if (btn.handler)
						{
							$(btnDiv).click
							(	
								function () 
								{
								this.handler(this.name,grid.gDiv);
								}
							);
						}
						$(tDiv2).append(btnDiv);
						if ($.browser.msie&&$.browser.version<7.0)
						{
							$(btnDiv).hover(function(){$(this).addClass('fbOver');},function(){$(this).removeClass('fbOver');});
						}
						
					} else {
						$(tDiv2).append("<div class='btnseparator'></div>");
					}
				}
				$(grid.tDiv).append(tDiv2);
				$(grid.tDiv).append("<div style='clear:both'></div>");
				$(grid.gDiv).prepend(grid.tDiv);
		}
		
		//set hDiv
		grid.hDiv.className = 'hDiv';

		$(t).before(grid.hDiv);

		//set hTable
			grid.hTable.cellPadding = 0;
			grid.hTable.cellSpacing = 0;
			$(grid.hDiv).append('<div class="hDivBox"></div>');
			$('div',grid.hDiv).append(grid.hTable);
			var thead = $("thead:first",t).get(0);
			if (thead) $(grid.hTable).append(thead);
			thead = null;
		
		if (!p.colmodel) var ci = 0;

		//setup thead			
			$('thead tr:first th',grid.hDiv).each
			(
			 	function ()
					{
						var thdiv = document.createElement('div');
						
						
					
						if ($(this).attr('abbr'))
							{
							$(this).click(
								function (e) 
									{
										var tag = e.target || e.srcElement;
										if(tag.tagName.toUpperCase()!='SPAN'){
											if (!$(this).hasClass('thOver')) return false;
											var obj = (e.target || e.srcElement);
											if (obj.href || obj.type) return true; 
											grid._changeSort(this);
										}
									}
								);
							
							if ($(this).attr('abbr')==p.sortname)
								{
								this.className = 'sorted';
								thdiv.className = 's'+p.sortorder;
								}
							}
							
							if (this.hide) $(this).hide();
							
							if (!p.colmodel)
							{
								$(this).attr('axis','col' + ci++);
							}
							
							
						 $(thdiv).css({textAlign:this.align, width: this.width + 'px'});
						 thdiv.innerHTML = this.innerHTML;
						 
						$(this).empty().append(thdiv).removeAttr('width')
						.mousedown(function (e) 
							{
								//grid._dragStart('colMove',e,this);
							})
						.hover(
							function(){
								if (!grid.colresize&&!$(this).hasClass('thMove')&&!grid.colCopy) $(this).addClass('thOver');
								
								if ($(this).attr('abbr')!=p.sortname&&!grid.colCopy&&!grid.colresize&&$(this).attr('abbr')) 
									$('div',this).addClass('s'+p.sortorder);
								else if ($(this).attr('abbr')==p.sortname&&!grid.colCopy&&!grid.colresize&&$(this).attr('abbr'))
									{
										var no = '';
										if (p.sortorder=='asc') no = 'desc';
										else no = 'asc';
										//$('div',this).removeClass('s'+p.sortorder).addClass('s'+no);
										//$('div',this).addClass('s'+no);
									}
								
								if (grid.colCopy) 
									{
									var n = $('th',grid.hDiv).index(this);
									
									if (n==grid.dcoln) return false;
									
									
									
									if (n<grid.dcoln) $(this).append(grid.cdropleft);
									else $(this).append(grid.cdropright);
									
									grid.dcolt = n;
									
									} else if (!grid.colresize) {
										
									var nv = $('th:visible',grid.hDiv).index(this);
									var onl = parseInt($('div:eq('+nv+')',grid.cDrag).css('left'));
									var nw = jQuery(grid.nBtn).outerWidth();
									nl = onl - nw + Math.floor(p.cgwidth/2);
									
									$(grid.nDiv).hide();$(grid.nBtn).hide();
									
									$(grid.nBtn).css({'left':nl,top:grid.hDiv.offsetTop}).show();
									
									var ndw = parseInt($(grid.nDiv).width());
									
									$(grid.nDiv).css({top:grid.bDiv.offsetTop});
									
									if ((nl+ndw)>$(grid.gDiv).width())
										$(grid.nDiv).css('left',onl-ndw+1);
									else
										$(grid.nDiv).css('left',nl);
										
									if ($(this).hasClass('sorted')) 
										$(grid.nBtn).addClass('srtd');
									else
										$(grid.nBtn).removeClass('srtd');
										
									}
									
							},
							function(){
								$(this).removeClass('thOver');
								if ($(this).attr('abbr')!=p.sortname) $('div',this).removeClass('s'+p.sortorder);
								else if ($(this).attr('abbr')==p.sortname)
									{
										var no = '';
										if (p.sortorder=='asc') no = 'desc';
										else no = 'asc';
										
										$('div',this).addClass('s'+p.sortorder).removeClass('s'+no);
									}
								if (grid.colCopy) 
									{								
									$(grid.cdropleft).remove();
									$(grid.cdropright).remove();
									grid.dcolt = null;
									}
							}); //wrap content
					}
			);

		//set bDiv
		grid.bDiv.className = 'bDiv';
		$(t).before(grid.bDiv);
		$(grid.bDiv)
		.css({ height: (p.height=='auto') ? 'auto' : p.height+"px"})
		.scroll(function (e) {grid._scroll()})
		.append(t);
		
		if (p.height == 'auto'){
			$('table',grid.bDiv).addClass('autoht');
			}

		//add td properties
		grid._addCellProp();
		
		//add row properties
		grid._addRowProp();
		
		//set cDrag
		
		var cdcol = $('thead tr:first th:first',grid.hDiv).get(0);
		
		if (cdcol != null)
		{		
			grid.cDrag.className = 'cDrag';
			grid.cdpad = 0;
			
			grid.cdpad += (isNaN(parseInt($('div',cdcol).css('borderLeftWidth'))) ? 0 : parseInt($('div',cdcol).css('borderLeftWidth'))); 
			grid.cdpad += (isNaN(parseInt($('div',cdcol).css('borderRightWidth'))) ? 0 : parseInt($('div',cdcol).css('borderRightWidth'))); 
			grid.cdpad += (isNaN(parseInt($('div',cdcol).css('paddingLeft'))) ? 0 : parseInt($('div',cdcol).css('paddingLeft'))); 
			grid.cdpad += (isNaN(parseInt($('div',cdcol).css('paddingRight'))) ? 0 : parseInt($('div',cdcol).css('paddingRight'))); 
			grid.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'))) ? 0 : parseInt($(cdcol).css('borderLeftWidth'))); 
			grid.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'))) ? 0 : parseInt($(cdcol).css('borderRightWidth'))); 
			grid.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'))) ? 0 : parseInt($(cdcol).css('paddingLeft'))); 
			grid.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'))) ? 0 : parseInt($(cdcol).css('paddingRight'))); 
	
			$(grid.bDiv).before(grid.cDrag);
			
			var cdheight = $(grid.bDiv).height();
			var hdheight = $(grid.hDiv).height();
			
			$(grid.cDrag).css({top: -hdheight + 'px'});
			
			$('thead tr:first th',grid.hDiv).each
			(
			 	function ()
					{
						var cgDiv = document.createElement('div');
						$(grid.cDrag).append(cgDiv);
						if (!p.cgwidth) p.cgwidth = $(cgDiv).width();
						$(cgDiv).css({height: cdheight + hdheight})
						.mousedown(function(e){grid._dragStart('colresize',e,this);})
						;
						if ($.browser.msie&&$.browser.version<7.0)
						{
							grid._fixHeight($(grid.gDiv).height());
							$(cgDiv).hover(
								function () 
								{
								grid._fixHeight();
								$(this).addClass('dragging') 
								},
								function () { if (!grid.colresize) $(this).removeClass('dragging') }
							);
						}
					}
			);
		
		//grid._rePosDrag();
							
		}
		

		//add strip		
		if (p.striped){ 
			$('tbody tr:odd',grid.bDiv).addClass(p.doubleClassName);
		}
			
		if (p.resizable && p.height !='auto') 
		{
		grid.vDiv.className = 'vGrip';
		$(grid.vDiv)
		.mousedown(function (e) { grid._dragStart('vresize',e)})
		.html('<span></span>');
		$(grid.bDiv).after(grid.vDiv);
		}
		
		if (p.resizable && p.width !='auto' && !p.nohresize) 
		{
			grid.rDiv.className = 'hGrip';
			$(grid.rDiv)
			.mousedown(function (e) {grid._dragStart('vresize',e,true);})
			.html('<span></span>')
			.css('height',$(grid.gDiv).height());
			if ($.browser.msie&&$.browser.version<7.0)
			{
				$(grid.rDiv).hover(function(){$(this).addClass('hgOver');},function(){$(this).removeClass('hgOver');});
			}
			$(grid.gDiv).append(grid.rDiv);
		}
		
		// add pager
		if (p.usepager)
		{
		//grid.pDiv.className = 'pDiv';
		//grid.pDiv.innerHTML = '<div class="pDiv2"></div>';
		grid.pDiv.innerHTML = '<div></div>';
		$(grid.bDiv).after(grid.pDiv);
		if(p.hidepage){
			$(div).mouseenter(
				function(){
					$('.pagingWrapper',grid.pDiv).show();
				}
			)
			.mouseleave(
				function(){
					$('.pagingWrapper',grid.pDiv).hide();
				}
			);
		}
		
		var html = '<div class="pagingWrapper clearfix ">'
			+'<div class="right">'
				+'<a href="#" class="prePage">上一页</a>'
				+'<a href="#" class="nextPage">下一页</a>'
				+'<span class="pcontrol">第'
				+'<input type="text" class="pageNum" value="1" />'
				+'<span class="indexPage"></span></span>'
				+'<a href="#" class="enter">跳转</a>'
				+'<span class="divRp"></span>'
			+'</div>'
		+'</div>';
		$('div',grid.pDiv).html(html);
		
		$('.pReload',grid.pDiv).click(function(){grid._populate()});
		$('.pFirst',grid.pDiv).click(function(){grid._changePage('first')});
		$('.prePage',grid.pDiv).click(function(){grid._changePage('prev')});
		$('.nextPage',grid.pDiv).click(function(){grid._changePage('next')});
		$('.pLast',grid.pDiv).click(function(){grid._changePage('last')});
		$('.enter',grid.pDiv).click(function(){grid._changePage('input')});
		$('.pcontrol input',grid.pDiv).keydown(function(e){if(e.keyCode==13) grid._changePage('input')});
		if ($.browser.msie&&$.browser.version<7) $('.pButton',grid.pDiv).hover(function(){$(this).addClass('pBtnOver');},function(){$(this).removeClass('pBtnOver');});
			
			if (p.useRp)
			{
			var opt = "";
			for (var nx=0;nx<p.rpOptions.length;nx++)
			{
				if (p.rp == p.rpOptions[nx]) sel = 'selected="selected"'; else sel = '';
				 opt += "<option value='" + p.rpOptions[nx] + "' " + sel + " >" + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
			};
			//$('.pDiv2',grid.pDiv).prepend("<div class='pGroup'><select name='rp'>"+opt+"</select></div> <div class='btnseparator'></div>");
			$('.divRp',grid.pDiv).prepend("<div class='pGroup'><select name='rp'>"+opt+"</select></div> <div class='btnseparator'></div>");
			$('select',grid.pDiv).change(
					function ()
					{
						if (p.onRpChange) 
							p.onRpChange(+this.value);
						else
							{
							p.newp = 1;
							p.rp = +this.value;
							grid._populate();
							}
					}
				);
			}
		
		//add search button
		if (p.searchitems)
			{
				$('.pDiv2',grid.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
				$('.pSearch',grid.pDiv).click(function(){$(grid.sDiv).slideToggle('fast',function(){$('.sDiv:visible input:first',grid.gDiv).trigger('focus');});});				
				//add search box
				grid.sDiv.className = 'sDiv';
				
				sitems = p.searchitems;
				
				var sopt = "";
				for (var s = 0; s < sitems.length; s++)
				{
					if (p.qtype=='' && sitems[s].isdefault==true)
					{
					p.qtype = sitems[s].name;
					sel = 'selected="selected"';
					} else sel = '';
					sopt += "<option value='" + sitems[s].name + "' " + sel + " >" + sitems[s].display + "&nbsp;&nbsp;</option>";						
				}
				
				if (p.qtype=='') p.qtype = sitems[0].name;
				
				$(grid.sDiv).append("<div class='sDiv2'>"+p.findtext+" <input type='text' size='30' name='q' class='qsbox' /> <select name='qtype'>"+sopt+"</select> <!--input type='button' value='Clear' /--></div>");

				$('input[name=q],select[name=qtype]',grid.sDiv).keydown(function(e){if(e.keyCode==13) grid._doSearch()});
				$('input[value=Clear]',grid.sDiv).click(function(){$('input[name=q]',grid.sDiv).val(''); p.query = ''; grid._doSearch(); });
				$(grid.bDiv).after(grid.sDiv);				
				
			}
		
		
		}
		$(grid.pDiv,grid.sDiv).append("<div style='clear:both'></div>");
		
		// add pagemore
		if (p.usepagemore)
		{
			grid.pmDiv.innerHTML = '<div></div>';
			$(grid.bDiv).after(grid.pmDiv);
			var html = '<div class="pagingWrapper"><a href="#" class="downmore">加载更多</a></div>';
			$('div',grid.pmDiv).html(html);
			$('.downmore',grid.pDiv).click(function(){grid._changePageMore()});
		}
		$(grid.pmDiv).append("<div style='clear:both'></div>");
	
	
		// add title
		if (p.title)
		{
			grid.mDiv.className = 'mDiv';
			grid.mDiv.innerHTML = '<div class="ftitle">'+p.title+'</div>';
			$(grid.gDiv).prepend(grid.mDiv);
			if (p.showTableToggleBtn)
				{
					$(grid.mDiv).append('<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
					$('div.ptogtitle',grid.mDiv).click
					(
					 	function ()
							{
								$(grid.gDiv).toggleClass('hideBody');
								$(this).toggleClass('vsble');
							}
					);
				}
			//grid._rePosDrag();
		}

		//setup cdrops
		grid.cdropleft = document.createElement('span');
		grid.cdropleft.className = 'cdropleft';
		grid.cdropright = document.createElement('span');
		grid.cdropright.className = 'cdropright';

		//add block
		grid.block.className = 'gBlock';
		var gh = $(grid.bDiv).height();
		var gtop = grid.bDiv.offsetTop;
		$(grid.block).css(
		{
			width: grid.bDiv.style.width,
			height: gh,
			background: 'white',
			position: 'relative',
			marginBottom: (gh * -1),
			zIndex: 1,
			top: gtop,
			left: '0px'
		}
		);
		$(grid.block).fadeTo(0,p.blockOpacity);				
		
		// add column control
		if ($('th',grid.hDiv).length)
		{
			
			grid.nDiv.className = 'nDiv';
			grid.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(grid.nDiv).css(
			{
				marginBottom: (gh * -1),
				display: 'none',
				top: gtop
			}
			).noSelect()
			;
			
			var cn = 0;
			
			
			$('th div',grid.hDiv).each
			(
			 	function ()
					{
						var kcol = $("th[axis='col" + cn + "']",grid.hDiv)[0];
						var chk = 'checked="checked"';
						if (kcol.style.display=='none') chk = '';
						
						$('tbody',grid.nDiv).append('<tr><td class="ndcol1"><input type="checkbox" '+ chk +' class="togCol" value="'+ cn +'" /></td><td class="ndcol2">'+this.innerHTML+'</td></tr>');
						cn++;
					}
			);
			
			if ($.browser.msie&&$.browser.version<7.0)
				$('tr',grid.nDiv).hover
				(
				 	function () {$(this).addClass('ndcolover');},
					function () {$(this).removeClass('ndcolover');}
				);
			
			$('td.ndcol2',grid.nDiv).click
			(
			 	function ()
					{
						if ($('input:checked',grid.nDiv).length<=p.minColToggle&&$(this).prev().find('input')[0].checked) return false;
						return grid._toggleCol($(this).prev().find('input').val());
					}
			);
			
			$('input.togCol',grid.nDiv).click
			(
			 	function ()
					{
						
						if ($('input:checked',grid.nDiv).length<p.minColToggle&&this.checked==false) return false;
						$(this).parent().next().trigger('click');
						//return false;
					}
			);


			$(grid.gDiv).prepend(grid.nDiv);
			
			$(grid.nBtn).addClass('nBtn')
			.html('<div></div>')
			.attr('title','Hide/Show Columns')
			.click
			(
			 	function ()
				{
			 	$(grid.nDiv).toggle(); return true;
				}
			);
			
			if (p.showToggleBtn) $(grid.gDiv).prepend(grid.nBtn);
			
		}
		
		// add date edit layer
		$(grid.iDiv)
		.addClass('iDiv')
		.css({display:'none'})
		;
		$(grid.bDiv).append(grid.iDiv);
		
		// add tablegrid events
		$(grid.bDiv)
		.hover(function(){$(grid.nDiv).hide();$(grid.nBtn).hide();},function(){if (grid.multisel) grid.multisel = false;})
		;
		$(grid.gDiv)
		.hover(function(){},function(){$(grid.nDiv).hide();$(grid.nBtn).hide();})
		;
		
		//add document events
		$(document)
		.mousemove(function(e){grid._dragMove(e)})
		.mouseup(function(e){grid._dragEnd()})
		.hover(function(){},function (){grid._dragEnd()})
		;
		
		//browser adjustments
		if ($.browser.msie&&$.browser.version<7.0)
		{
			$('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv',grid.gDiv)
			.css({width: '100%'});
			$(grid.gDiv).addClass('ie6');
			if (p.width!='auto') $(grid.gDiv).addClass('ie6fullwidthbug');			
		} 
		
		grid._rePosDrag();
		grid._fixHeight();
		
		//make grid functions accessible
		t.p = p;
		t.grid = grid;
		
		// load data
		if (p.url&&p.autoload) 
			{
			grid._populate();
			}
		return t;		
			
	};

	var docloaded = false;
	
	var extend='',extend1='';
	
	$(document).ready(function () {docloaded = true} );

	// 调用入口
	$.fn.tablegrid = function(p) {
		// 列表的复选框 ，全选和取消功能
		checkAll = function(checkObj,tableId){
			var isCheck = $(checkObj).attr('checked');
			$("#"+tableId+" input:checkbox").each(function(){
				if(isCheck){
					$(this).attr('checked',true);
					$(this).parents("tr").removeClass('erow').css({backgroundColor:"#d1e6f8"});
				}else{
					$(this).attr('checked',false);
					if($(this).parents("tr").index()%2>0){
						$(this).parents("tr").addClass('erow').css({backgroundColor:"#fff"});
					}else{
						$(this).parents("tr").css({backgroundColor:"#fff"});
					}
				  }
			});
		};
		
		// 列表复选框选中触发的方法
		checkMethod=function (obj){
			// 如果全部选中后要给全选的状态改为选中，反之不选中
			var can = true;
			var tableId = $(obj).parents("table:visible").attr("id");
			$(obj).parents("table:visible").find(":checkbox:visible").each(function(){
				if(!$(this).attr('checked')){
					can=false;
				}
			});
			$("#"+tableId.split('_')[1]+" input:checkbox:visible").each(function(i){
				if(i==0){
					$(this).attr('checked',can);
				}
			});
			//$("#cks_"+tableId).prop("checked",true);
			//alert(document.getElementById('cks_'+tableId).checked);
			//document.getElementById('cks_'+tableId).checked=true;	
			
			if($(obj).attr('checked')){
				$(obj).parents("tr").removeClass('erow').css({backgroundColor:"#d1e6f8"});			
			}else{
				if($(obj).parents("tr").index()%2>0){
					$(obj).parents("tr").addClass('erow').css({backgroundColor:"#fff"});
				}else{
					$(obj).parents("tr").css({backgroundColor:"#fff"});
				}
			}
		};

		// 获取选中的值
		if(p=="getCheckedVals"){
			var result = "";
			$("#table_"+$(this).attr('id')+" input:checkbox").each(function(){
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
		
		// 二次查询回显处理
		if(p.thCol!=null && p.type!=null){
			$(this).find("table:visible:first>thead tr:first th:visible").each(function(){
				if($(this).attr("col")==p.thCol){
					$(this)[p.type]("backBorder");
				}
			});
			return null;
		}
		
		// 获取选中的值
		if(p=="extend"){
			return extend;
		}
		// 获取选中的值
		if(p=="extend1"){
			return extend1;
		}
		
		return this.each( function() {
				if (!docloaded){
					$(this).hide();
					var t = this;
					$(document).ready(function(){
						$.addTable(t,p);
					});
				} else {
					$.addTable(this,p);
				}
			});

	}; //end tablegrid

	$.fn.tableReload = function(p) { // function to reload grid
		return this.each( function() {
		var table = document.getElementById('table_'+$(this).attr('id'));
			if (table.grid&&table.p.url) table.grid._populate(p);
		});

		/*return this.each( function() {
				if (this.grid&&this.p.url) this.grid._populate();
			});*/

	}; //end tableReload

	$.fn.tableOptions = function(p) { //function to update general options

		return this.each( function() {
				if (this.grid) $.extend(this.p,p);
			});

	}; //end tableOptions

	$.fn.tableToggleCol = function(cid,visible) { // function to reload grid

		return this.each( function() {
				if (this.grid) this.grid._toggleCol(cid,visible);
			});

	}; //end tableToggleCol

	$.fn.tableAddData = function(data) { // function to add data to grid

		return this.each( function() {
				if (this.grid) this.grid._addData(data);
			});

	};

	$.fn.noSelect = function(p) { //no select plugin by me :-)

		if (p == null) 
			prevent = true;
		else
			prevent = p;

		if (prevent) {
		
		return this.each(function ()
			{
				if ($.browser.msie||$.browser.safari) $(this).bind('selectstart',function(){return false;});
				else if ($.browser.mozilla) 
					{
						$(this).css('MozUserSelect','none');
						$('body').trigger('focus');
					}
				else if ($.browser.opera) $(this).bind('mousedown',function(){return false;});
				else $(this).attr('unselectable','on');
			});
			
		} else {

		
		return this.each(function ()
			{
				if ($.browser.msie||$.browser.safari) $(this).unbind('selectstart');
				else if ($.browser.mozilla) $(this).css('MozUserSelect','inherit');
				else if ($.browser.opera) $(this).unbind('mousedown');
				else $(this).removeAttr('unselectable','on');
			});
		
		}

	}; //end noSelect
	
})(jQuery);
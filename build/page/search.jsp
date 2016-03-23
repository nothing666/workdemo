<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	String path = request.getContextPath();
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>rail-搜索结果页</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/themes/global.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/themes/style.css" />
<link href="<%=path%>/themes/import_basic.css" rel="stylesheet" type="text/css"/>
<link href="<%=path%>/themes/container.css" rel="stylesheet" type="text/css"/>
<link href="<%=path%>/themes/style_1660.css" rel="stylesheet" type="text/css"/>

<link rel="stylesheet" type="text/css"
	href="<%=path%>/js/jquery-easyui-1.4.2/themes/rail/easyui.css" />
<link rel="stylesheet" type="text/css"
	href="<%=path%>/js/jquery-easyui-1.4.2/themes/icon.css" />
<link rel="stylesheet" type="text/css"
	href="<%=path%>/js/jquery-easyui-1.4.2/themes/rail/tabs.css" />
	
<script type="text/javascript" src="<%=path%>/js/jquery-1.7.2.min.js"></script>

<script type="text/javascript"
	src="<%=path%>/js/jquery-easyui-1.4.2/jquery.easyui.min.js"></script>
<script type="text/javascript"
	src="<%=path%>/js/jquery-easyui-1.4.2/jquery.edatagrid.js"></script>
<script type="text/javascript"
	src="<%=path%>/js/jquery-easyui-1.4.2/datagrid-detailview.js"></script>
<script type="text/javascript"
	src="<%=path%>/js/jquery-easyui-1.4.2/locale/easyui-lang-zh_CN.js"></script>

<script type="text/javascript" src="<%=path%>/js/run.container.js"></script>
<script type="text/javascript" src="<%=path%>/js/run.objectTable.js"></script>
<script type="text/javascript" src="<%=path%>/js/run.table.js"></script>
<script type="text/javascript" src="<%=path%>/js/run.table.js"></script>
<script type="text/javascript" src="<%=path%>/js/datePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery.watermarkinput.js"></script>
<script type="text/javascript" src="<%=path%>/js/date.js"></script>
<script type="text/javascript" src="<%=path%>/js/util.js"></script>
<script type="text/javascript" src="<%=path%>/page/searchFun.js"></script>
<script type="text/javascript" src="<%=path%>/page/search.js"></script>

<!-- 城市选择控件 -->
<link href="<%=path%>/js/cityselect/citySelector.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="<%=path%>/js/cityselect/citySelector.js"></script>


</head>

<body>
<div class="top">
	<div class="topContWrap">
    	<div class="topCont clearfix">
        	<img class="left logo" src="<%=path%>/themes/images/logo.png" alt="logo" />
            <a class="right close" href="#"></a>
            <div class="right letters">
                <a class="letterLink" href="#"></a>
                <span class="letterNum">
                    <span class="letterNumBg">
                        <em>8</em>
                    </span>
                </span>
            </div>
            <span class="right userName">您好，Admin</span>
        </div>
    </div>
</div>
<div class="pageCont">
	<div class="contentWrap">
    	<div class="seachLeft">
        	<div class="seachRight">
            	<div class="seachCenter">
                	<div class="schContWrap clearfix">
                    	<div class="left sortItem clearfix">
                    		<input type="hidden" id="searchCode" value="xm"/>
                            <span id="searchName" class="left itemSelt">姓名</span>
                            <a href="#" class="right selectLink" onclick="showEnum(this)"></a>
                            <ul id="searchEunm" class="items hide">
                            	<li class="hide" onclick="changeSearchWord(this,'xm')"><a href="#" class="item">姓名</a></li>
                                <li onclick="changeSearchWord(this,'sjh')"><a href="#" class="item">手机号</a></li>
                                <li onclick="changeSearchWord(this,'sfzh')"><a href="#" class="item">身份证号</a></li>
                                <li onclick="changeSearchWord(this,'dpyx')"><a href="#" class="item">订票邮箱</a></li>
                                <li onclick="changeSearchWord(this,'cc')"><a href="#" class="item">车次</a></li>
                                <li onclick="changeSearchWord(this,'cfd')"><a href="#" class="item">出发地</a></li>
                                <li onclick="changeSearchWord(this,'mdd')"><a href="#" class="item">目的地</a></li>
                            </ul>
                        </div>
                        <div class="left optionSelect clearfix">
                            <input id="searchText" class="inputText" type="text" />
                            <input id="searchStationText" class="inputText" type="text" style="display:none"/>
                        <a href="#" class="left addItem" onclick="addItem()"></a>
                        <a href="#" class="left schBtn" onclick="searchMethod(1)">搜索</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="screenWrap clearfix">
        	<div id="searchItems"></div>
            <input type="button" class="left clearItems clearI_gray" onclick="clearItems()" disabled="disabled" value=""/>
            <input type="hidden" value="" id="searchMoreItems"/>
            <input type="button" class="left schBtn_2 schBtn_2_gray" onclick="searchMethod(2)" disabled="disabled" value=""/>
        </div>
        <div class="infosWrap">
        	<ul class="infos">
            	<li class="clearfix">
                	<label class="left">年龄段：</label>
                    <div class="left optionSelect">
                    	<!--<a href="#" class="siteSelected">长沙</a>-->
                        <input class="optionSelected agesRangeSelected" changeFunction="Zz.search.onQueryChange()" type="text" value="全部"" />
                        <div class="ages options hide">
                            <ul class="specificOption clearfix">
                                <li class="left"><a href="#" class="selt">全部</a></li>
                                <li class="left"><a href="#">18以下</a></li>
                                <li class="left"><a href="#">18-25</a></li>
                                <li class="left"><a href="#">25-35</a></li>
                                <li class="left"><a href="#">35-50</a></li>
                                <li class="left"><a href="#">50以上</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li class="clearfix">
                	<label class="left">户籍归属：</label>
                    <div class="left optionSelect" id="hjDiv">
                        <input class="optionSelected siteSelected" type="text" value="全部" changeFunction="Zz.search.onQueryChange()"/>
                        <div class=" sites options hide">
                            <ul class="optionsType clearfix">
                                <li class="left"><a href="#" class="selt">选择用户归属省份</a></li>
                            </ul>
                            <div class="optionsList">
                                <div class="tab specificOption">
                                    <ul class="left hotSites">
                                        <li class="left"><a href="#" value="'0'">全部</a></li> 
                                        <li class="left"><a href="#" value="'34'">安徽省</a></li>
                                        <li class="left"><a href="#" value="'11'">北京市</a></li>
                                        <li class="left"><a href="#" value="'50','51'">重庆市</a></li>
                                        <li class="left"><a href="#" value="'35'">福建省</a></li>
                                        <li class="left"><a href="#" value="'62'">甘肃省</a></li>
                                        <li class="left"><a href="#" value="'44'">广东省</a></li>
                                        <li class="left"><a href="#" value="'45'">广西壮族自治区</a></li>
                                        <li class="left"><a href="#" value="'52'">贵州省</a></li>
                                        <li class="left"><a href="#" value="'44','46'">海南省</a></li>
                                        <li class="left"><a href="#" value="'13'">河北省</a></li>
                                        <li class="left"><a href="#" value="'41'">河南省</a></li>
                                        <li class="left"><a href="#" value="'23'">黑龙江省</a></li>
                                        <li class="left"><a href="#" value="'42'">湖北省</a></li>
                                        <li class="left"><a href="#" value="'43'">湖南省</a></li>
                                        <li class="left"><a href="#" value="'22'">吉林省</a></li>
                                        <li class="left"><a href="#" value="'32'">江苏省</a></li>
                                        <li class="left"><a href="#" value="'36'">江西省</a></li>
                                        <li class="left"><a href="#" value="'21'">辽宁省</a></li>
                                        <li class="left"><a href="#" value="'15'">内蒙古自治区</a></li>
                                        <li class="left"><a href="#" value="'64'">宁夏回族自治区</a></li>
                                        <li class="left"><a href="#" value="'63'">青海省</a></li>
                                        <li class="left"><a href="#" value="'37'">山东省</a></li>
                                        <li class="left"><a href="#" value="'14'">山西省</a></li>
                                        <li class="left"><a href="#" value="'61'">陕西省</a></li>
                                        <li class="left"><a href="#" value="'31'">上海市</a></li>
                                        <li class="left"><a href="#" value="'51'">四川省</a></li>
                                        <li class="left"><a href="#" value="'12'">天津市</a></li>
                                        <li class="left"><a href="#" value="'54'">西藏自治区</a></li>
                                        <li class="left"><a href="#" value="'65'">新疆维吾尔自治区</a></li>
                                        <li class="left"><a href="#" value="'53'">云南省</a></li>
                                        <li class="left"><a href="#" value="'33'">浙江省</a></li>                                       
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </li>
                <li class="clearfix">
                	<label class="left">旅客类型：</label>
                    <ul class="passengerTypes clearfix">
                    	<li class="left"><a href="#" class="selt" onclick="selectType(this)">全部</a></li>
                        <li class="left"><a href="#" onclick="selectType(this)">成人</a></li>
                        <li class="left"><a href="#" onclick="selectType(this)">儿童</a></li>
                        <li class="left"><a href="#" onclick="selectType(this)">学生</a></li>
                        <li class="left"><a href="#" onclick="selectType(this)">伤残军警</a></li>
                    </ul>
                </li>
                <li class="clearfix">
                	<label class="left">乘车时间范围：</label>
                   	<ul class="left rangeTypes clearfix">
                    	<li class="clearfix" id="timeLi">
		                    <a href="#" class="left" onclick="getTimeByDay(this,7,'startTime','endTime')" changeFunction="Zz.search.onQueryChange()">7天</a>
		                    <a href="#" class="left" onclick="getTimeByDay(this,30,'startTime','endTime')" changeFunction="Zz.search.onQueryChange()">30天</a>
		                    <a href="#" class="left selt" onclick="getTimeByDay(this,90,'startTime','endTime')" changeFunction="Zz.search.onQueryChange()">90天</a>
                            <div class="left timeSeWrap clearfix">
                                <label class="left dateLabel">起止日期：</label>
                                <input id="startTime" type="text" class="cusDate left timeSelect" style="width:130px" onfocus="deleteAClass(this)" onkeydown="dateEnter(this)" value=""/>
                                <span class="left">&nbsp;—&nbsp;</span>
                                <input id="endTime" type="text" class="cusDate left timeSelect"  style="width:130px" onfocus="deleteAClass(this)" onkeydown="dateEnter(this)" value=""/>
                            </div>
	                    </li>
                    </ul> 
                </li>
            </ul>
            
            
	        
        </div>
        <div class="kpTable">
        	<!-- 添加容器、列表和卡片 start -->
	        <div class="kpContain"></div>
	        <div class="tableContain"></div>
	        <!-- 添加容器、列表和卡片 end -->
        </div>
        <div class="analyObj">
        	<span class="letterNum">
                <span class="letterNumBg">
                    <em id="analyseNum">0</em>
                </span>
            </span>
            <div class="title clearfix">
            	<span class="titleLeft left"></span>
                <span class="icon_1 left"></span>
                <h3 class="left titleName">分析对象</h3>
                <span class="titleRight right"></span>
            </div>
            <ul class="objs">
            	<li>
                	请选择分析对象
                </li>
            </ul>
            <div class="sortBtn_1">
                <input type="button" class="gray" onclick="clearObj()" disabled="disabled" value="清空对象">
                <input type="button" class="gray" onclick="startAnalyse()" disabled="disabled" value="开始分析">
            </div>
            
        </div>
        <a class="goTop" href="#"></a>
    </div>
    
</div>
<div class="footer">
	<div class="footerContWrap">
    	<div class="footerCont">
        	<img class="runLogo" src="<%=path%>/themes/images/run_logo.png" alt="run_logo" />
        </div>
    </div>
</div>

<div id="downLoadDiag"></div>

</body>
</html>
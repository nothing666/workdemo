<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="edu.yale.its.tp.cas.client.filter.CASFilter"%>
<%@page isELIgnored="false" %>
<% 
	String path = request.getContextPath();
	HttpSession casSession = request.getSession();
	String account = (String) casSession.getAttribute(CASFilter.CAS_FILTER_USER);
	if(account == null || account.isEmpty()){
	    account = "RUN";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>RAIL用户行程轨迹分析</title>
<link rel="stylesheet" type="text/css" href="<%=path%>/themes/global.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/themes/style.css" />
<link href="<%=path%>/themes/import_basic.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="<%=path%>/js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="<%=path%>/js/datePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/date.js"></script>
<script type="text/javascript" src="<%=path%>/js/util.js"></script>
<script type="text/javascript" src="<%=path%>/page/analysis.js"></script>
<script type="text/javascript" src="<%=path%>/page/pgis.js"></script>
<script type="text/javascript" charset="gb2312" src="http://15.48.191.11:8080/RGIS_Security/js/config.js" ></script>

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
            <span class="right userName">您好，<%=account%></span>
        </div>
    </div>
</div>
<div class="pageCont">
	<div class="contentWrap">
		<div class="analy clearfix">
        	<div class="left mapArea">
        	    <div id="mymap" class="map" style="width: 806px; height:100%;"></div>
   				 <div id="coordiate"></div>
            </div>
            <div class="left objDetails">
            	<div class="rangeTypesWrap clearfix ">
                	<label class="left" id="top">乘车时间范围：</label>
                   	<div class="left rangeTypes">
                    	<a href="#" onclick="getTimeByDay(this,7,'gisStartTime','gisEndTime')"  changeFunction="Zz.gis.onTrackTimeChange()">7天</a>
                        <a href="#" onclick="getTimeByDay(this,30,'gisStartTime','gisEndTime')" changeFunction="Zz.gis.onTrackTimeChange()">30天</a>
                        <a href="#" onclick="getTimeByDay(this,90,'gisStartTime','gisEndTime')" changeFunction="Zz.gis.onTrackTimeChange()" class="selt">90天</a>
                    </div> 
                </div>
                <div class="timeSeleWrap clearfix">
                	<label class="left">起止日期</label>
                    <input id="gisStartTime" type="text" class="cusDate left timeSelect" onfocus="deleteAClass(this)"  onkeydown="dateEnter(this)" value=""/>
                    <span class="left">&nbsp;—&nbsp;</span>
                    <input id="gisEndTime" type="text" class="cusDate left timeSelect" onfocus="deleteAClass(this)" onkeydown="dateEnter(this)" value=""/>
                </div>
                <div id="trainTrackDiv">
                </div>
            </div>
        </div>
        <a class="goTop" href="#top"></a>
    </div>
</div>
<input type="hidden" id="userList" value='${userList}'/>
<div class="footer">
	<div class="footerContWrap">
    	<div class="footerCont">
        	<img class="runLogo" src="<%=path%>/themes/images/run_logo.png" alt="run_logo" />
        </div>
    </div>
</div>
</body>
</html>
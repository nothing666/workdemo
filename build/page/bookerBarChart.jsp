<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
	String path = request.getContextPath();
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>rail-同邮箱分析页</title>

<link rel="stylesheet" type="text/css" href="<%=path%>/themes/global.css" />
<link rel="stylesheet" type="text/css" href="<%=path%>/themes/style.css" />
<link href="<%=path%>/themes/import_basic.css" rel="stylesheet" type="text/css"/>
<link href="<%=path%>/themes/container.css" rel="stylesheet" type="text/css"/>
<link href="<%=path%>/themes/style_1660.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="<%=path%>/js/jquery-1.7.2.min.js"></script>

<script type="text/javascript" src="<%=path%>/js/run.container.js"></script>
<script type="text/javascript" src="<%=path%>/js/run.objectTable.js"></script>
<script type="text/javascript" src="<%=path%>/js/run.table.js"></script>
<script type="text/javascript" src="<%=path%>/js/run.table.js"></script>
<script type="text/javascript" src="<%=path%>/js/datePicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=path%>/js/jquery.watermarkinput.js"></script>
<script type="text/javascript" src="<%=path%>/js/date.js"></script>
<script type="text/javascript" src="<%=path%>/js/util.js"></script>
<script type="text/javascript" src="<%=path%>/echart/biz/www/js/echarts.js"></script>
<script type="text/javascript" src="<%=path%>/page/bookerBarChart.js"></script>

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

	<div >
		<div style=" margin-left: 50px; margin-right: 50px;background: white; height: 600px;">
			<div id="title"
				style="font-weight: 600; font-size: 13px;  float: left; margin-left: 230px;">
				同邮箱订票人分析
			</div>
			<div style="float: left; margin-left:  470px;">
				<img id="booker_png"  src="<%=path%>/images/booker.png" style="vertical-align: middle;" width="16" height="16"> 
					<span id="bookerId" style="font-weight: 600; font-size: 13px;"></span> 
				<img id="mail_png"	src="<%=path%>/images/mail.png" style="vertical-align: middle;" width="16" height="16"> 
					<span id="mailId" style="font-weight: 600; font-size: 13px;"></span>
			</div>
			<div id="main" style="height:400px;border:1px solid #ccc;padding:10px; height:60%; "></div>

	        <div id ="detailsTableContain" class="tableBox" style="display:block; width: 87%;height: 30%;align-content: center;margin-left: 90px;margin-right: 90px;"></div>
		
		    <a class="goTop" href="#"></a>
		</div>
		<input type="hidden" id="result" /> 
	</div>

	</div>
		<div class="footer">
			<div class="footerContWrap">
		    	<div class="footerCont">
		        	<img class="runLogo" src="<%=path%>/themes/images/run_logo.png" alt="run_logo" />
		        </div>
		 </div>
	</div>

    
</body>
<script>
	//获取后台数据
	$('#result').val('${result}');
</script>
</html>
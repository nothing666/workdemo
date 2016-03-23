var myChart;
//var domCode = document.getElementById('sidebar-code');
var domGraphic = document.getElementById('graphic');
var domMain = document.getElementById('main');
var domMessage = document.getElementById('wrong-message');
var iconResize = document.getElementById('icon-resize');
var needRefresh = false;

var enVersion = location.hash.indexOf('-en') != -1;
var hash = location.hash.replace('-en','');
hash = hash.replace('#','') || (needMap() ? 'default' : 'macarons');
hash += enVersion ? '-en' : '';

var curTheme;
function requireCallback (ec, defaultTheme) {
    curTheme = themeSelector ? defaultTheme : {};
    echarts = ec;
    refresh();
    window.onresize = myChart.resize;
}



var themeSelector = $('#theme-select');
if (themeSelector) {
    themeSelector.html(
        '<option selected="true" name="macarons">macarons</option>'
        + '<option name="infographic">infographic</option>'
        + '<option name="shine">shine</option>'
        + '<option name="dark">dark</option>'
        + '<option name="blue">blue</option>'
        + '<option name="green">green</option>'
        + '<option name="red">red</option>'
        + '<option name="gray">gray</option>'
        + '<option name="helianthus">helianthus</option>'
        + '<option name="default">default</option>'
    );
    $(themeSelector).on('change', function(){
        selectChange($(this).val());
    });
    function selectChange(value){
        var theme = value;
        myChart.showLoading();
        $(themeSelector).val(theme);
        if (theme != 'default') {
            window.location.hash = value + (enVersion ? '-en' : '');
            require(['theme/' + theme], function(tarTheme){
                curTheme = tarTheme;
                setTimeout(refreshTheme, 500);
            })
        }
        else {
            window.location.hash = enVersion ? '-en' : '';
            curTheme = {};
            setTimeout(refreshTheme, 500);
        }
    }
    function refreshTheme(){
        myChart.hideLoading();
        myChart.setTheme(curTheme);
    }
    if ($(themeSelector).val(hash.replace('-en', '')).val() != hash.replace('-en', '')) {
        $(themeSelector).val('macarons');
        hash = 'macarons' + enVersion ? '-en' : '';
        window.location.hash = hash;
    }
}

function autoResize() {
    if ($(iconResize).hasClass('glyphicon-resize-full')) {
        focusCode();
        iconResize.className = 'glyphicon glyphicon-resize-small';
    }
    else {
        focusGraphic();
        iconResize.className = 'glyphicon glyphicon-resize-full';
    }
}

function focusCode() {
   // domCode.className = 'col-md-8 ani';
    domGraphic.className = 'col-md-4 ani';
}

function focusGraphic() {
  //  domCode.className = 'col-md-4 ani';
    domGraphic.className = 'col-md-8 ani';
    if (needRefresh) {
        myChart.showLoading();
        setTimeout(refresh, 1000);
    }
}

//var editor = CodeMirror.fromTextArea(
//    document.getElementById("code"),
//    { lineNumbers: true }
//);
//editor.setOption("theme", 'monokai');
//
//
//editor.on('change', function(){needRefresh = true;});

var option = {
	    backgroundColor: '#1b1b1b',
	    color: ['gold','aqua','lime'],
	    title : {
	        text: '乘客行程轨迹',
	        x:'center',
	        textStyle : {
	            color: '#fff'
	        }
	    },
	    tooltip : {
	        trigger: 'item',
	        formatter: '{b}'
	    },
	    legend: {
	        orient: 'vertical',
	        x:'left',
	        data:['陈海东','李欣','周剑'],
//	        selectedMode: 'single',
//	        selected:{
//	            '陈海东' : false,
//	            '李欣' : false
//	        },
	        textStyle : {
	            color: '#fff'
	        }
	    },
	    toolbox: {
	        show : true,
	        orient : 'vertical',
	        x: 'right',
	        y: 'center',
	        feature : {
	            mark : {show: true},
	            dataView : {show: true, readOnly: false},
	            restore : {show: true},
	            saveAsImage : {show: true}
	        }
	    },
	    series : [
	        {
	            name: '陈海东',
	            type: 'map',
	            mapType: 'china',
	            roam: true,
	            hoverable: false,
	            itemStyle:{
	                normal:{
	                    borderColor:'rgba(100,149,237,1)',
	                    borderWidth:0.5,
	                    areaStyle:{
	                        color: '#1b1b1b'
	                    }
	                }
	            },
	            
	            data:[],

                markLine : {
                    smooth:true,
                    effect : {
                        show: true,
                        scaleSize: 1,
                        period: 30,
                        color: '#fff',
                        shadowBlur: 10
                    },
	                itemStyle : {
	                    normal: {
	                        borderWidth:1,
	                        lineStyle: {
	                            type: 'solid',
	                            shadowBlur: 10
	                        }
	                    }
	                },
	                data : [
	                    [{name:'北京'},{name:'包头'}],
	                    [{name:'包头'},{name:'北海'}],
	                    [{name:'北海'},{name:'广州'}],
	                    [{name:'广州'},{name:'郑州'}],
	                    [{name:'郑州'},{name:'珠海'}]
	                ]
	            },
	            markPoint : {
	                symbol:'emptyCircle',
	                symbolSize : function (v){
	                    return 10 ;
	                },
	                effect : {
	                    show: true,
	                    shadowBlur : 0
	                },
	                itemStyle:{
	                    normal:{
	                        label:{show:false}
	                    },
	                    emphasis: {
	                        label:{position:'top'}
	                    }
	                },
	                data : [
	                    {name:'北京',value:95},
	                    {name:'包头',value:90},
	                    {name:'北海',value:80},
	                    {name:'广州',value:70},
	                    {name:'郑州',value:60},
	                    {name:'珠海',value:50}
	                ]
	            },
		        geoCoord: {
		                '上海': [121.4648,31.2891],
		                '东莞': [113.8953,22.901],
		                '东营': [118.7073,37.5513],
		                '中山': [113.4229,22.478],
		                '临汾': [111.4783,36.1615],
		                '临沂': [118.3118,35.2936],
		                '丹东': [124.541,40.4242],
		                '丽水': [119.5642,28.1854],
		                '乌鲁木齐': [87.9236,43.5883],
		                '佛山': [112.8955,23.1097],
		                '保定': [115.0488,39.0948],
		                '兰州': [103.5901,36.3043],
		                '包头': [110.3467,41.4899],
		                '北京': [116.4551,40.2539],
		                '北海': [109.314,21.6211],
		                '南京': [118.8062,31.9208],
		                '南宁': [108.479,23.1152],
		                '南昌': [116.0046,28.6633],
		                '南通': [121.1023,32.1625],
		                '厦门': [118.1689,24.6478],
		                '台州': [121.1353,28.6688],
		                '合肥': [117.29,32.0581],
		                '呼和浩特': [111.4124,40.4901],
		                '咸阳': [108.4131,34.8706],
		                '哈尔滨': [127.9688,45.368],
		                '唐山': [118.4766,39.6826],
		                '嘉兴': [120.9155,30.6354],
		                '大同': [113.7854,39.8035],
		                '大连': [122.2229,39.4409],
		                '天津': [117.4219,39.4189],
		                '太原': [112.3352,37.9413],
		                '威海': [121.9482,37.1393],
		                '宁波': [121.5967,29.6466],
		                '宝鸡': [107.1826,34.3433],
		                '宿迁': [118.5535,33.7775],
		                '常州': [119.4543,31.5582],
		                '广州': [113.5107,23.2196],
		                '廊坊': [116.521,39.0509],
		                '延安': [109.1052,36.4252],
		                '张家口': [115.1477,40.8527],
		                '徐州': [117.5208,34.3268],
		                '德州': [116.6858,37.2107],
		                '惠州': [114.6204,23.1647],
		                '成都': [103.9526,30.7617],
		                '扬州': [119.4653,32.8162],
		                '承德': [117.5757,41.4075],
		                '拉萨': [91.1865,30.1465],
		                '无锡': [120.3442,31.5527],
		                '日照': [119.2786,35.5023],
		                '昆明': [102.9199,25.4663],
		                '杭州': [119.5313,29.8773],
		                '枣庄': [117.323,34.8926],
		                '柳州': [109.3799,24.9774],
		                '株洲': [113.5327,27.0319],
		                '武汉': [114.3896,30.6628],
		                '汕头': [117.1692,23.3405],
		                '江门': [112.6318,22.1484],
		                '沈阳': [123.1238,42.1216],
		                '沧州': [116.8286,38.2104],
		                '河源': [114.917,23.9722],
		                '泉州': [118.3228,25.1147],
		                '泰安': [117.0264,36.0516],
		                '泰州': [120.0586,32.5525],
		                '济南': [117.1582,36.8701],
		                '济宁': [116.8286,35.3375],
		                '海口': [110.3893,19.8516],
		                '淄博': [118.0371,36.6064],
		                '淮安': [118.927,33.4039],
		                '深圳': [114.5435,22.5439],
		                '清远': [112.9175,24.3292],
		                '温州': [120.498,27.8119],
		                '渭南': [109.7864,35.0299],
		                '湖州': [119.8608,30.7782],
		                '湘潭': [112.5439,27.7075],
		                '滨州': [117.8174,37.4963],
		                '潍坊': [119.0918,36.524],
		                '烟台': [120.7397,37.5128],
		                '玉溪': [101.9312,23.8898],
		                '珠海': [113.7305,22.1155],
		                '盐城': [120.2234,33.5577],
		                '盘锦': [121.9482,41.0449],
		                '石家庄': [114.4995,38.1006],
		                '福州': [119.4543,25.9222],
		                '秦皇岛': [119.2126,40.0232],
		                '绍兴': [120.564,29.7565],
		                '聊城': [115.9167,36.4032],
		                '肇庆': [112.1265,23.5822],
		                '舟山': [122.2559,30.2234],
		                '苏州': [120.6519,31.3989],
		                '莱芜': [117.6526,36.2714],
		                '菏泽': [115.6201,35.2057],
		                '营口': [122.4316,40.4297],
		                '葫芦岛': [120.1575,40.578],
		                '衡水': [115.8838,37.7161],
		                '衢州': [118.6853,28.8666],
		                '西宁': [101.4038,36.8207],
		                '西安': [109.1162,34.2004],
		                '贵阳': [106.6992,26.7682],
		                '连云港': [119.1248,34.552],
		                '邢台': [114.8071,37.2821],
		                '邯郸': [114.4775,36.535],
		                '郑州': [113.4668,34.6234],
		                '鄂尔多斯': [108.9734,39.2487],
		                '重庆': [107.7539,30.1904],
		                '金华': [120.0037,29.1028],
		                '铜川': [109.0393,35.1947],
		                '银川': [106.3586,38.1775],
		                '镇江': [119.4763,31.9702],
		                '长春': [125.8154,44.2584],
		                '长沙': [113.0823,28.2568],
		                '长治': [112.8625,36.4746],
		                '阳泉': [113.4778,38.0951],
		                '青岛': [120.4651,36.3373],
		                '韶关': [113.7964,24.7028]
		            }        	
		        
	        
	        },       
	        { 
	        name: '李欣',
	            type: 'map',
	            mapType: 'china',
	            data:[],
	            markLine : {
	                smooth:true,
	                effect : {
	                    show: true,
	                    scaleSize: 1,
	                    period: 30,
	                    color: '#fff',
	                    shadowBlur: 10
	                },
	                itemStyle : {
	                    normal: {
	                        borderWidth:1,
	                        lineStyle: {
	                            type: 'solid',
	                            shadowBlur: 10
	                        }
	                    }
	                },
	                itemStyle : {
	                    normal: {
	                        borderWidth:1,
	                        lineStyle: {
	                            type: 'solid',
	                            shadowBlur: 10
	                        }
	                    }
	                },
	                data : [
	                    [{name:'上海'},{name:'包头'}],
	                    [{name:'包头'},{name:'武汉'}],
	                    [{name:'武汉'},{name:'广州'}],
	                    [{name:'广州'},{name:'烟台'}],
	                    [{name:'上海'},{name:'珠海'}]
	                ]
	            },
	            markPoint : {
	                symbol:'emptyCircle',
	                symbolSize : function (v){
	                    return 10 ;
	                },
	                effect : {
	                    show: true,
	                    shadowBlur : 0
	                },
	                itemStyle:{
	                    normal:{
	                        label:{show:false}
	                    },
	                    emphasis: {
	                        label:{position:'top'}
	                    }
	                },
	                data : [
	                    {name:'上海',value:95},
	                    {name:'包头',value:90},
	                    {name:'武汉',value:80},
	                    {name:'广州',value:70},
	                    {name:'烟台',value:60},
	                    {name:'珠海',value:50}
	                ]
	            }
	        },

	        {
	            name: '周剑',
	            type: 'map',
	            mapType: 'china',
	            data:[],
	            markLine : {
	                smooth:true,
	                effect : {
	                    show: true,
	                    scaleSize: 1,
	                    period: 30,
	                    color: '#fff',
	                    shadowBlur: 10
	                },
	                itemStyle : {
	                    normal: {
	                        borderWidth:1,
	                        lineStyle: {
	                            type: 'solid',
	                            shadowBlur: 10
	                        }
	                    }
	                },
	                data : [
	                    [{name:'广州'},{name:'盐城'}],
	                    [{name:'盐城'},{name:'郑州'}],
	                    [{name:'重庆'},{name:'长春'}],
	                    [{name:'长沙'},{name:'重庆'}],
	                    [{name:'长春'},{name:'盐城'}]
	                ]
	            },
	            markPoint : {
	                symbol:'emptyCircle',
	                symbolSize : function (v){
	                    return 10;
	                },
	                effect : {
	                    show: true,
	                    shadowBlur : 0
	                },
	                itemStyle:{
	                    normal:{
	                        label:{show:false}
	                    },
	                    emphasis: {
	                        label:{position:'top'}
	                    }
	                },
	                data : [
	                    {name:'广州',value:95},
	                    {name:'盐城',value:90},
	                    {name:'郑州',value:80},
	                    {name:'重庆',value:70},
	                    {name:'长春',value:60},
	                    {name:'长沙',value:50}
	                ]
	            }

	        },
	        {
	            name: '全国',
	            type: 'map',
	            roam: true,
	            hoverable: false,
	            mapType: 'china',
	            itemStyle:{
	                normal:{
	                    borderColor:'rgba(100,149,237,1)',
	                    borderWidth:1,
	                    areaStyle:{
	                        color: '#1b1b1b'
	                    }
	                }
	            },
	            data:[],
	            markLine : {
	                smooth:true,
	                symbol: ['none', 'circle'],  
	                symbolSize : 1,
	                itemStyle : {
	                    normal: {
	                        color:'#fff',
	                        borderWidth:1,
	                        borderColor:'rgba(32,147,32,1)'
	                    }
	                },
	                data : [
	                    [{name:'北京'},{name:'包头'}],
	                    [{name:'包头'},{name:'北海'}],
	                    [{name:'北海'},{name:'广州'}],
	                    [{name:'广州'},{name:'郑州'}],
	                    [{name:'郑州'},{name:'珠海'}],
	                    [{name:'上海'},{name:'包头'}],
	                    [{name:'包头'},{name:'武汉'}],
	                    [{name:'武汉'},{name:'广州'}],
	                    [{name:'广州'},{name:'烟台'}],
	                    [{name:'上海'},{name:'珠海'}],
	                    [{name:'广州'},{name:'盐城'}],
	                    [{name:'盐城'},{name:'郑州'}],
	                    [{name:'重庆'},{name:'长春'}],
	                    [{name:'长沙'},{name:'重庆'}],
	                    [{name:'长春'},{name:'盐城'}]	                  
	                ]
	            }
	        }
	    ]
	};
function refresh(isBtnRefresh){
    if (isBtnRefresh) {
        needRefresh = true;
        focusGraphic();
        return;
    }
    needRefresh = false;
    if (myChart && myChart.dispose) {
        myChart.dispose();
    }
    myChart = echarts.init(domMain, curTheme);
    window.onresize = myChart.resize;
   // (new Function(editor.doc.getValue()))();
    myChart.setOption(option, true)
    domMessage.innerHTML = '';
}

function needMap() {
    var href = location.href;
    return href.indexOf('map') != -1
           || href.indexOf('mix3') != -1
           || href.indexOf('mix5') != -1
           || href.indexOf('dataRange') != -1;

}

var echarts;

    // for echarts online home page
    require.config({
        paths: {
            echarts: '../../echart/biz/www/js',
            theme:'../../echart/biz/theme'
        }
    });
    launchExample();


var isExampleLaunched;
function launchExample() {
    if (isExampleLaunched) {
        return;
    }

    // 按需加载
    isExampleLaunched = 1;
    require(
        [
            'echarts',
            'theme/' + hash.replace('-en', ''),
            'echarts/chart/line',
            'echarts/chart/bar',
            'echarts/chart/scatter',
            'echarts/chart/k',
            'echarts/chart/pie',
            'echarts/chart/radar',
            'echarts/chart/force',
            'echarts/chart/chord',
            'echarts/chart/gauge',
            'echarts/chart/funnel',
            'echarts/chart/eventRiver',
            needMap() ? 'echarts/chart/map' : 'echarts'
        ],
        requireCallback
    );
}


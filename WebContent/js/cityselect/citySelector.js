/* *
 * ---------------------------------------- *
 * 城市选择组件 v1.0
 * Author: VVG
 * QQ: 83816819
 * Mail: mysheller@163.com
 * http://www.cnblogs.com/NNUF/
 * ---------------------------------------- *
 * Date: 2012-07-10
 * ---------------------------------------- *
 * */

/* *
 * 全局空间 Vcity
 * */
var Vcity = {};
/* *
 * 静态方法集
 * @name _m
 * */
Vcity._m = {
    /* 选择元素 */
    $:function (arg, context) {
        var tagAll, n, eles = [], i, sub = arg.substring(1);
        context = context || document;
        if (typeof arg == 'string') {
            switch (arg.charAt(0)) {
                case '#':
                    return document.getElementById(sub);
                    break;
                case '.':
                    if (context.getElementsByClassName) return context.getElementsByClassName(sub);
                    tagAll = Vcity._m.$('*', context);
                    n = tagAll.length;
                    for (i = 0; i < n; i++) {
                        if (tagAll[i].className.indexOf(sub) > -1) eles.push(tagAll[i]);
                    }
                    return eles;
                    break;
                default:
                    return context.getElementsByTagName(arg);
                    break;
            }
        }
    },

    /* 绑定事件 */
    on:function (node, type, handler) {
        node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
    },
    
    unbind:function(node,type,handler){
    	node.removeEventListener(type,handler,false);
    },

    /* 获取事件 */
    getEvent:function(event){
        return event || window.event;
    },

    /* 获取事件目标 */
    getTarget:function(event){
        return event.target || event.srcElement;
    },

    /* 获取元素位置 */
    getPos:function (node) {
        var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
            scrollt = document.documentElement.scrollTop || document.body.scrollTop;
        var pos = node.getBoundingClientRect();
        return {top:pos.top + scrollt, right:pos.right + scrollx, bottom:pos.bottom + scrollt, left:pos.left + scrollx }
    },

    /* 添加样式名 */
    addClass:function (c, node) {
        if(!node)return;
        node.className = Vcity._m.hasClass(c,node) ? node.className : node.className + ' ' + c ;
    },

    /* 移除样式名 */
    removeClass:function (c, node) {
        var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
        if(!Vcity._m.hasClass(c,node))return;
        node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
    },

    /* 是否含有CLASS */
    hasClass:function (c, node) {
        if(!node || !node.className)return false;
        return node.className.indexOf(c)>-1;
    },

    /* 阻止冒泡 */
    stopPropagation:function (event) {
        event = event || window.event;
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    },
    /* 去除两端空格 */
    trim:function (str) {
        return str.replace(/^\s+|\s+$/g,'');
    }
};

/* 所有城市数据,可以按照格式自行添加（北京|beijing|bj），前16条为热门城市 */
//
//Vcity.allCity = ['北京|beijing|bj','上海|shanghai|sh', '重庆|chongqing|cq',  '深圳|shenzhen|sz', '广州|guangzhou|gz', '杭州|hangzhou|hz',
//    '南京|nanjing|nj', '苏州|shuzhou|sz', '天津|tianjin|tj', '成都|chengdu|cd', '南昌|nanchang|nc', '三亚|sanya|sy','青岛|qingdao|qd',
//    '厦门|xiamen|xm', '西安|xian|xa','长沙|changsha|cs','合肥|hefei|hf','西藏|xizang|xz', '内蒙古|neimenggu|nmg', '安庆|anqing|aq', '阿泰勒|ataile|atl', '安康|ankang|ak',
//    '阿克苏|akesu|aks', '包头|baotou|bt', '北海|beihai|bh', '百色|baise|bs','保山|baoshan|bs', '长治|changzhi|cz', '长春|changchun|cc', '常州|changzhou|cz', '昌都|changdu|cd',
//    '朝阳|chaoyang|cy', '常德|changde|cd', '长白山|changbaishan|cbs', '赤峰|chifeng|cf', '大同|datong|dt', '大连|dalian|dl', '达县|daxian|dx', '东营|dongying|dy', '大庆|daqing|dq', '丹东|dandong|dd',
//    '大理|dali|dl', '敦煌|dunhuang|dh', '鄂尔多斯|eerduosi|eeds', '恩施|enshi|es', '福州|fuzhou|fz', '阜阳|fuyang|fy', '贵阳|guiyang|gy',
//    '桂林|guilin|gl', '广元|guangyuan|gy', '格尔木|geermu|gem', '呼和浩特|huhehaote|hhht', '哈密|hami|hm',
//    '黑河|heihe|hh', '海拉尔|hailaer|hle', '哈尔滨|haerbin|heb', '海口|haikou|hk', '黄山|huangshan|hs', '邯郸|handan|hd',
//    '汉中|hanzhong|hz', '和田|hetian|ht', '晋江|jinjiang|jj', '锦州|jinzhou|jz', '景德镇|jingdezhen|jdz',
//    '嘉峪关|jiayuguan|jyg', '井冈山|jinggangshan|jgs', '济宁|jining|jn', '九江|jiujiang|jj', '佳木斯|jiamusi|jms', '济南|jinan|jn',
//    '喀什|kashi|ks', '昆明|kunming|km', '康定|kangding|kd', '克拉玛依|kelamayi|klmy', '库尔勒|kuerle|kel', '库车|kuche|kc', '兰州|lanzhou|lz',
//    '洛阳|luoyang|ly', '丽江|lijiang|lj', '林芝|linzhi|lz', '柳州|liuzhou|lz', '泸州|luzhou|lz', '连云港|lianyungang|lyg', '黎平|liping|lp',
//    '连成|liancheng|lc', '拉萨|lasa|ls', '临沧|lincang|lc', '临沂|linyi|ly', '芒市|mangshi|ms', '牡丹江|mudanjiang|mdj', '满洲里|manzhouli|mzl', '绵阳|mianyang|my',
//    '梅县|meixian|mx', '漠河|mohe|mh', '南充|nanchong|nc', '南宁|nanning|nn', '南阳|nanyang|ny', '南通|nantong|nt', '那拉提|nalati|nlt',
//    '宁波|ningbo|nb', '攀枝花|panzhihua|pzh', '衢州|quzhou|qz', '秦皇岛|qinhuangdao|qhd', '庆阳|qingyang|qy', '齐齐哈尔|qiqihaer|qqhe',
//    '石家庄|shijiazhuang|sjz',  '沈阳|shenyang|sy', '思茅|simao|sm', '铜仁|tongren|tr', '塔城|tacheng|tc', '腾冲|tengchong|tc', '台州|taizhou|tz',
//    '通辽|tongliao|tl', '太原|taiyuan|ty', '威海|weihai|wh', '梧州|wuzhou|wz', '文山|wenshan|ws', '无锡|wuxi|wx', '潍坊|weifang|wf', '武夷山|wuyishan|wys', '乌兰浩特|wulanhaote|wlht',
//    '温州|wenzhou|wz', '乌鲁木齐|wulumuqi|wlmq', '万州|wanzhou|wz', '乌海|wuhai|wh', '兴义|xingyi|xy', '西昌|xichang|xc',  '襄樊|xiangfan|xf',
//    '西宁|xining|xn', '锡林浩特|xilinhaote|xlht', '西双版纳|xishuangbanna|xsbn', '徐州|xuzhou|xz', '义乌|yiwu|yw', '永州|yongzhou|yz', '榆林|yulin|yl', '延安|yanan|ya', '运城|yuncheng|yc',
//    '烟台|yantai|yt', '银川|yinchuan|yc', '宜昌|yichang|yc', '宜宾|yibin|yb', '盐城|yancheng|yc', '延吉|yanji|yj', '玉树|yushu|ys', '伊宁|yining|yn', '珠海|zhuhai|zh', '昭通|zhaotong|zt',
//    '张家界|zhangjiajie|zjj', '舟山|zhoushan|zs', '郑州|zhengzhou|zz', '中卫|zhongwei|zw', '芷江|zhijiang|zj', '湛江|zhanjiang|zj'];


Vcity.allCity = ['北京|beijing|bj','成都|chengdu|cd','长沙|changsha|cs', '大连|dalian|dl','广州|guangzhou|gz','哈尔滨|haerbin|heb','海口|haikou|hk','杭州|hangzhou|hz','吉林|jilin|jl',
                 '南京|nanjing|nj','上海|shanghai|sh','深圳|shenzhen|sz', '沈阳|shenyang|sy','武汉|wuhan|wh', '郑州|zhengzhou|zz','西安|xian|xa',
                 '阿克苏地区|akesudiqu|aksdq','鞍山|anshan|as','安康|ankang|ak','安庆|anqing|aq','安阳|anyang|ay','巴彦淖尔|bayannaoer|byne',
                 '巴音郭楞蒙古自治州|bayinguolengmengguzizhizhou|byglmgzzz','白城|baicheng|bc','白山|baishan|bs','白银|baiyin|by','百色|baise|bs',
                  '蚌埠|bengbu|bb','包头|baotou|bt','保定|baoding|bd','宝鸡|baoji|bj','北海|beihai|bh','本溪|benxi|bx','滨州|binzhou|bz',
                  '博尔塔拉蒙古自治州|boertalamengguzizhizhou|betlmgzzz','沧州|cangzhou|cz','昌吉回族自治州|changjihuizuzizhizhou|cjhzzzz','常德|changde|cd',
                                  '常州|changzhou|cz','长春|changchun|cc','长治|changzhi|cz','朝阳|chaoyang|cy','潮州|chaozhou|cz','巢湖|chaohu|ch',
                                  '郴州|chenzhou|cz','澄迈县|chengmaixian|cmx','承德|chengde|cd','池州|chizhou|cz','赤峰|chifeng|cf','崇左|chongzuo|cz',
                                  '滁州|chuzhou|cz','楚雄彝族自治州|chuxiongyizuzizhizhou|cxyzzzz','达州|dazhou|dz','大理白族自治州|dalibaizuzizhizhou|dlbzzzz',
                                 '大庆|daqing|dq','大同|datong|dt','大兴安岭地区|daxinganlingdiqu|dxaldq','丹东|dandong|dd','德阳|deyang|dy',
                                  '德州|dezhou|dz','定西|dingxi|dx','东方|dongfang|df','东营|dongying|dy','东莞|dongguan|dg','鄂尔多斯|eerduosi|eeds','鄂州|ezhou|ez',
                                  '恩施土家族苗族自治州|entujiazumiaozuzizhizhou|etjzmzzzz','防城港|fangchenggang|fcg','佛山|foshan|fs','福州|fuzhou|fz','抚顺|fushun|fs',
                                  '抚州|fuzhou|fz','阜新|fuxin|fx','阜阳|fuyang|fy','赣州|ganzhou|gz','固原|guyuan|gy','广安|guangan|ga','广元|guangyuan|gy',
                                  '桂林|guilin|gl','贵港|guigang|gg','哈密地区|hamidiqu|hmdq','海北藏族自治州|haibeizangzuzizhizhou|hbzzzzz',
                                  '海东地区|haidongdiqu|hddq','海西蒙古族藏族自治州|haiximengguzuzangzuzizhizhou|hxmgzzzzzz','邯郸|handan|hd',
                                  '汉中|hanzhong|hz','菏泽|heze|hz','河池|hechi|hc','河源|heyuan|hy','鹤壁|hebi|hb','鹤岗|hegang|hg','合肥|hefei|hf',
                                  '贺州|hezhou|hz','黑河|heihe|hh','衡水|hengshui|hs','衡阳|hengyang|hy','红河哈尼族彝族自治州|honghehanizuyizuzizhizhou|hhhnzyzzzz',
                                  '呼和浩特|huhehaote|hhht','呼伦贝尔|hulunbeier|hlbe','葫芦岛|huludao|hld','湖州|huzhou|hz','怀化|huaihua|hh','淮安|huaian|ha','淮北|huaibei|hb',
                                  '淮南|huainan|hn','黄冈|huanggang|hg','黄山|huangshan|hs','黄石|huang|h','惠州|huizhou|hz','鸡西|jixi|jx','吉安|jian|ja','济南|jinan|jn',
                                  '济宁|jining|jn','济源|jiyuan|jy','嘉兴|jiaxing|jx','嘉峪关|jiayuguan|jyg','佳木斯|jiamusi|jms','焦作|jiaozuo|jz','揭阳|jieyang|jy','金昌|jinchang|jc',
                                  '金华|jinhua|jh','锦州|jinzhou|jz','晋城|jincheng|jc','晋中|jinzhong|jz','荆门|jingmen|jm','荆州|jingzhou|jz','景德镇|jingdezhen|jdz','九江|jiujiang|jj',
                                  '酒泉|jiuquan|jq','喀什地区|kadiqu|kdq','开封|kaifeng|kf','克孜勒苏柯尔克孜自治州|kezilesukeerkezizizhizhou|kzlskekzzzz','昆明|kunming|km',
                                  '拉萨|lasa|ls','莱芜|laiwu|lw','来宾|laibin|lb','兰州|lanzhou|lz','廊坊|langfang|lf','乐东黎族自治县|ledonglizuzizhixian|ldlzzzx','乐山|leshan|ls',
                                  '丽水|lishui|ls','连云港|lianyungang|lyg','凉山彝族自治州|liangshanyizuzizhizhou|lsyzzzz','聊城|liaocheng|lc',
                                  '辽阳|liaoyang|ly','辽源|liaoyuan|ly','临汾|linfen|lf','临沂|linyi|ly','柳州|liuzhou|lz','六安|luan|la',
                                  '龙岩|longyan|ly','娄底|loudi|ld','吕梁|lvliang|ll','洛阳|luoyang|ly','马鞍山|maanshan|mas','茂名|maoming|mm',
                                  '梅州|meizhou|mz','眉山|meishan|ms','绵阳|mianyang|my','牡丹江|mudanjiang|mdj','那曲地区|naqudiqu|nqdq',
                                  '南昌|nanchang|nc','南充|nanchong|nc','南宁|nanning|nn','南平|nanping|np','南通|nantong|nt',
                                  '南阳|nanyang|ny','内江|neijiang|nj','宁波|ningbo|nb','宁德|ningde|nd','攀枝花|panzhihua|pzh','盘锦|panjin|pj',
                                  '萍乡|pingxiang|px','平顶山|pingdingshan|pds','平凉|pingliang|pl','莆田|putian|pt','七台河|qitaihe|qth',
                                  '齐齐哈尔|qiqihaer|qqhe','钦州|qinzhou|qz','秦皇岛|qinhuangdao|qhd','青岛|qingdao|qd','清远|qingyuan|qy',
                                  '庆阳|qingyang|qy','琼海|qionghai|qh','曲靖|qujing|qj','泉州|quanzhou|qz','日照|rizhao|rz','三门峡|sanmenxia|smx',
                                  '三明|sanming|sm','三亚|sanya|sy','汕头|shantou|st','商洛|shangluo|sl','商丘|shangqiu|sq',
                                  '上饶|shangrao|sr','韶关|shaoguan|sg','邵阳|shaoyang|sy','绍兴|shaoxing|sx',
                                 '十堰|shiyan|sy','石河子|shihezi|shz','石家庄|shijiazhuang|sjz',
                                  '石嘴山|shizuishan|szs','双鸭山|shuangyashan|sys','朔州|shuozhou|sz','四平|siping|sp','松原|songyuan|sy',
                                  '苏州|suzhou|sz','宿迁|suqian|sq','宿州|suzhou|sz','随州|suizhou|sz','绥化|suihua|sh','遂宁|suining|sn',
                                  '塔城地区|tachengdiqu|tcdq','台州|taizhou|tz','泰安|taian|ta','泰州|taizhou|tz','太原|taiyuan|ty',
                                  '唐山|tangshan|ts','天津|tianjin|tj','天水|tianshui|ts','铁岭|tieling|tl','通化|tonghua|th','通辽|tongliao|tl',
                                  '铜陵|tongling|tl','吐鲁番地区|tulufandiqu|tlfdq','威海|weihai|wh','潍坊|weifang|wf','渭南|weinan|wn',
                                  '温州|wenzhou|wz','乌海|wuhai|wh','乌兰察布|wulanchabu|wlcb','乌鲁木齐|wulumuqi|wlmq','无锡|wuxi|wx',
                                  '芜湖|wuhu|wh','梧州|wuzhou|wz','武威|wuwei|ww','西宁|xining|xn',
                                  '锡林郭勒盟|xilinguolemeng|xlglm','厦门|xiamen|xm','咸宁|xianning|xn','咸阳|xianyang|xy','襄樊|xiangfan|xf',
                                  '湘潭|xiangtan|xt','湘西土家族苗族自治州|xiangxitujiazumiaozuzizhizhou|xxtjzmzzzz','孝感|xiaogan|xg',
                                  '新乡|xinxiang|xx','新余|xinyu|xy','忻州|xinzhou|xz','信阳|xinyang|xy','兴安盟|xinganmeng|xam',
                                  '邢台|xingtai|xt','徐州|xuzhou|xz','许昌|xuchang|xc','宣城|xuancheng|xc','烟台|yantai|yt','盐城|yancheng|yc',
                                  '延安|yanan|ya','延边朝鲜族自治州|yanbianchaoxianzuzizhizhou|ybcxzzzz','扬州|yangzhou|yz','阳江|yangjiang|yj',
                                  '阳泉|yangquan|yq','伊春|yichun|yc','伊犁哈萨克自治州|yilihasakezizhizhou|ylhskzzz','宜宾|yibin|yb',
                                  '宜昌|yichang|yc','宜春|yichun|yc','益阳|yiyang|yy','银川|yinchuan|yc','鹰潭|yingtan|yt','营口|yingkou|yk',
                                  '永州|yongzhou|yz','榆林|yulin|yl','玉林|yulin|yl','玉溪|yuxi|yx','岳阳|yueyang|yy','云浮|yunfu|yf',
                                  '运城|yuncheng|yc','枣庄|zaozhuang|zz','湛江|zhanjiang|zj','漳州|zhangzhou|zz','张家界|zhangjiajie|zjj',
                                  '张家口|zhangjiakou|zjk','张掖|zhangye|zy','昭通|zhaotong|zt','肇庆|zhaoqing|zq','镇江|zhenjiang|zj',
                                 '中山|zhongshan|zs','中卫|zhongwei|zw','重庆|chongqing|cq','周口|zhoukou|zk',
                                  '珠海|zhuhai|zh','株洲|zhuzhou|zz','驻马店|zhumadian|zmd','资阳|ziyang|zy','淄博|zibo|zb','自贡|zigong|zg',
                                  '亳州|bozhou|bz','衢州|quzhou|qz','漯河|luohe|lh','濮阳|puyang|py'];

/* 正则表达式 筛选中文城市名、拼音、首字母 */

Vcity.regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w)\w*$/i;
Vcity.regExChiese = /([\u4E00-\u9FA5\uf900-\ufa2d]+)/;

/* *
 * 格式化城市数组为对象oCity，按照a-h,i-p,q-z,hot热门城市分组：
 * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{i:[1.2.3],j:[1,2,3]},QRSTUVWXYZ:{}}
 * */

(function () {
    var citys = Vcity.allCity, match, letter,
        regEx = Vcity.regEx,
        reg2 = /^[a-h]$/i, reg3 = /^[i-p]$/i, reg4 = /^[q-z]$/i;
    if (!Vcity.oCity) {
        Vcity.oCity = {hot:{},ABCDEFGH:{}, IJKLMNOP:{}, QRSTUVWXYZ:{}};
        //console.log(citys.length);
        for (var i = 0, n = citys.length; i < n; i++) {
            match = regEx.exec(citys[i]);
            letter = match[3].toUpperCase();
            if (reg2.test(letter)) {
                if (!Vcity.oCity.ABCDEFGH[letter]) Vcity.oCity.ABCDEFGH[letter] = [];
                Vcity.oCity.ABCDEFGH[letter].push(match[1]);
            } else if (reg3.test(letter)) {
                if (!Vcity.oCity.IJKLMNOP[letter]) Vcity.oCity.IJKLMNOP[letter] = [];
                Vcity.oCity.IJKLMNOP[letter].push(match[1]);
            } else if (reg4.test(letter)) {
                if (!Vcity.oCity.QRSTUVWXYZ[letter]) Vcity.oCity.QRSTUVWXYZ[letter] = [];
                Vcity.oCity.QRSTUVWXYZ[letter].push(match[1]);
            }
            /* 热门城市 前16条 */
            if(i<16){
                if(!Vcity.oCity.hot['hot']) Vcity.oCity.hot['hot'] = [];
                Vcity.oCity.hot['hot'].push(match[1]);
            }
        }
    }
})();
/* 城市HTML模板 */
Vcity._template = [
    '<p class="tip">热门城市(支持汉字/拼音)</p>',
    '<ul>',
    '<li class="on">热门城市</li>',
    '<li>ABCDEFGH</li>',
    '<li>IJKLMNOP</li>',
    '<li>QRSTUVWXYZ</li>',
    '</ul>'
];

/* *
 * 城市控件构造函数
 * @CitySelector
 * */

Vcity.CitySelector = function () {
    this.initialize.apply(this, arguments);
};

Vcity.CitySelector.prototype = {

    constructor:Vcity.CitySelector,

    /* 初始化 */

    initialize :function (options) {
        var input = options.input;
        this.input = Vcity._m.$('#'+ input);
        this.inputEvent();
    },

    /* *
     * @createWarp
     * 创建城市BOX HTML 框架
     * */

    createWarp:function(){
        var inputPos = Vcity._m.getPos(this.input);
        var div = this.rootDiv = document.createElement('div');
        var that = this;

        // 设置DIV阻止冒泡
        Vcity._m.on(this.rootDiv,'click',function(event){
            Vcity._m.stopPropagation(event);
        });

        // 设置点击文档隐藏弹出的城市选择框
        Vcity._m.on(document, 'click', function (event) {
            event = Vcity._m.getEvent(event);
            var target = Vcity._m.getTarget(event);
            if(target == that.input) return false;
            //console.log(target.className);
            if (that.cityBox)Vcity._m.addClass('hide', that.cityBox);
            if (that.ul)Vcity._m.addClass('hide', that.ul);
            if(that.myIframe)Vcity._m.addClass('hide',that.myIframe);
        });
        div.className = 'citySelector';
        div.style.position = 'absolute';
        div.style.left = inputPos.left + 'px';
        div.style.top = inputPos.bottom + 'px';
        div.style.zIndex = 999999;

        // 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
        var isIe = (document.all) ? true : false;
        var isIE6 = this.isIE6 = isIe && !window.XMLHttpRequest;
        if(isIE6){
            var myIframe = this.myIframe =  document.createElement('iframe');
            myIframe.frameborder = '0';
            myIframe.src = 'about:blank';
            myIframe.style.position = 'absolute';
            myIframe.style.zIndex = '-1';
            this.rootDiv.appendChild(this.myIframe);
        }

        var childdiv = this.cityBox = document.createElement('div');
        childdiv.className = 'cityBox';
        childdiv.id = 'cityBox';
        childdiv.innerHTML = Vcity._template.join('');
        var hotCity = this.hotCity =  document.createElement('div');
        hotCity.className = 'hotCity';
        childdiv.appendChild(hotCity);
        div.appendChild(childdiv);
        this.createHotCity();
    },

    /* *
     * @createHotCity
     * TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
     * {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{},QRSTUVWXYZ:{}}
     **/

    createHotCity:function(){
        var odiv,odl,odt,odd,odda=[],str,key,ckey,sortKey,regEx = Vcity.regEx,
            oCity = Vcity.oCity;
        for(key in oCity){
            odiv = this[key] = document.createElement('div');
            // 先设置全部隐藏hide
            odiv.className = key + ' ' + 'cityTab hide';
            sortKey=[];
            for(ckey in oCity[key]){
                sortKey.push(ckey);
                // ckey按照ABCDEDG顺序排序
                sortKey.sort();
            }
            for(var j=0,k = sortKey.length;j<k;j++){
                odl = document.createElement('dl');
                odt = document.createElement('dt');
                odd = document.createElement('dd');
                odt.innerHTML = sortKey[j] == 'hot'?'&nbsp;':sortKey[j];
                odda = [];
                for(var i=0,n=oCity[key][sortKey[j]].length;i<n;i++){
                    str = '<a href="javascript:">' + oCity[key][sortKey[j]][i] + '</a>';
                    odda.push(str);
                }
                odd.innerHTML = odda.join('');
                odl.appendChild(odt);
                odl.appendChild(odd);
                odiv.appendChild(odl);
            }

            // 移除热门城市的隐藏CSS
            Vcity._m.removeClass('hide',this.hot);
            this.hotCity.appendChild(odiv);
        }
        document.body.appendChild(this.rootDiv);
        /* IE6 */
        this.changeIframe();

        this.tabChange();
        this.linkEvent();
    },

    /* *
     *  tab按字母顺序切换
     *  @ tabChange
     * */

    tabChange:function(){
        var lis = Vcity._m.$('li',this.cityBox);
        var divs = Vcity._m.$('div',this.hotCity);
        var that = this;
        for(var i=0,n=lis.length;i<n;i++){
            lis[i].index = i;
            lis[i].onclick = function(){
                for(var j=0;j<n;j++){
                    Vcity._m.removeClass('on',lis[j]);
                    Vcity._m.addClass('hide',divs[j]);
                }
                Vcity._m.addClass('on',this);
                Vcity._m.removeClass('hide',divs[this.index]);
                /* IE6 改变TAB的时候 改变Iframe 大小*/
                that.changeIframe();
            };
        }
    },

    /* *
     * 城市LINK事件
     *  @linkEvent
     * */

    linkEvent:function(){
        var links = Vcity._m.$('a',this.hotCity);
        var that = this;
        for(var i=0,n=links.length;i<n;i++){
            links[i].onclick = function(){
                that.input.value = this.innerHTML;
                Vcity._m.addClass('hide',that.cityBox);
                /* 点击城市名的时候隐藏myIframe */
                Vcity._m.addClass('hide',that.myIframe);
            }
        }
    },

    /* *
     * INPUT城市输入框事件
     * @inputEvent
     * */

    inputEvent:function(){
        var that = this;
        Vcity._m.on(this.input,'click',function(event){
            event = event || window.event;
            if(!that.cityBox){
                that.createWarp();
            }else if(!!that.cityBox && Vcity._m.hasClass('hide',that.cityBox)){
                // slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
                if(!that.ul || (that.ul && Vcity._m.hasClass('hide',that.ul))){
                    Vcity._m.removeClass('hide',that.cityBox);

                    /* IE6 移除iframe 的hide 样式 */
                    //alert('click');
                    Vcity._m.removeClass('hide',that.myIframe);
                    that.changeIframe();
                }
            }
        });
        Vcity._m.on(this.input,'focus',function(){
            that.input.select();
            if(that.input.value == '城市名') that.input.value = '';
        });
        Vcity._m.on(this.input,'blur',function(){
            if(that.input.value == '') that.input.value = '城市名';
        });
        Vcity._m.on(this.input,'keyup',function(event){
            event = event || window.event;
            var keycode = event.keyCode;
            Vcity._m.addClass('hide',that.cityBox);
            that.createUl();

            /* 移除iframe 的hide 样式 */
            Vcity._m.removeClass('hide',that.myIframe);

            // 下拉菜单显示的时候捕捉按键事件
            if(that.ul && !Vcity._m.hasClass('hide',that.ul) && !that.isEmpty){
                that.KeyboardEvent(event,keycode);
            }
        });
    },

    /* *
     * 生成下拉选择列表
     * @ createUl
     * */

    createUl:function () {
        //console.log('createUL');
        var str;
        var value = Vcity._m.trim(this.input.value);
        // 当value不等于空的时候执行
        if (value !== '') {
            var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
            var searchResult = [];
            for (var i = 0, n = Vcity.allCity.length; i < n; i++) {
                if (reg.test(Vcity.allCity[i])) {
                    var match = Vcity.regEx.exec(Vcity.allCity[i]);
                    if (searchResult.length !== 0) {
                        str = '<li><b class="cityname">' + match[1] + '</b><b class="cityspell">' + match[2] + '</b></li>';
                    } else {
                        str = '<li class="on"><b class="cityname">' + match[1] + '</b><b class="cityspell">' + match[2] + '</b></li>';
                    }
                    searchResult.push(str);
                }
            }
            this.isEmpty = false;
            // 如果搜索数据为空
            if (searchResult.length == 0) {
                this.isEmpty = true;
                str = '<li class="empty">使用当前输入作为检索条件吗： "<em>' + value + '</em>"</li>';
                searchResult.push(str);
            }
            // 如果slideul不存在则添加ul
            if (!this.ul) {
                var ul = this.ul = document.createElement('ul');
                ul.className = 'cityslide';
                this.rootDiv && this.rootDiv.appendChild(ul);
                // 记录按键次数，方向键
                this.count = 0;
            } else if (this.ul && Vcity._m.hasClass('hide', this.ul)) {
                this.count = 0;
                Vcity._m.removeClass('hide', this.ul);
            }
            this.ul.innerHTML = searchResult.join('');

            /* IE6 */
            this.changeIframe();

            // 绑定Li事件
            this.liEvent();
        }else{
            Vcity._m.addClass('hide',this.ul);
            Vcity._m.removeClass('hide',this.cityBox);

            Vcity._m.removeClass('hide',this.myIframe);

            this.changeIframe();
        }
    },

    /* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
    changeIframe:function(){
        if(!this.isIE6)return;
        this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
        this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
    },

    /* *
     * 特定键盘事件，上、下、Enter键
     * @ KeyboardEvent
     * */

    KeyboardEvent:function(event,keycode){
        var lis = Vcity._m.$('li',this.ul);
        var len = lis.length;
        switch(keycode){
            case 40: //向下箭头↓
                this.count++;
                if(this.count > len-1) this.count = 0;
                for(var i=0;i<len;i++){
                    Vcity._m.removeClass('on',lis[i]);
                }
                Vcity._m.addClass('on',lis[this.count]);
                break;
            case 38: //向上箭头↑
                this.count--;
                if(this.count<0) this.count = len-1;
                for(i=0;i<len;i++){
                    Vcity._m.removeClass('on',lis[i]);
                }
                Vcity._m.addClass('on',lis[this.count]);
                break;
            case 13: // enter键
                this.input.value = Vcity.regExChiese.exec(lis[this.count].innerHTML)[0];
                Vcity._m.addClass('hide',this.ul);
                Vcity._m.addClass('hide',this.ul);
                /* IE6 */
                Vcity._m.addClass('hide',this.myIframe);
                break;
            default:
                break;
        }
    },

    /* *
     * 下拉列表的li事件
     * @ liEvent
     * */

    liEvent:function(){
        var that = this;
        var lis = Vcity._m.$('li',this.ul);
        for(var i = 0,n = lis.length;i < n;i++){
            Vcity._m.on(lis[i],'click',function(event){
                event = Vcity._m.getEvent(event);
                var target = Vcity._m.getTarget(event);
                that.input.value = Vcity.regExChiese.exec(target.innerHTML)[0];
                Vcity._m.addClass('hide',that.ul);
                /* IE6 下拉菜单点击事件 */
                Vcity._m.addClass('hide',that.myIframe);
            });
            Vcity._m.on(lis[i],'mouseover',function(event){
                event = Vcity._m.getEvent(event);
                var target = Vcity._m.getTarget(event);
                Vcity._m.addClass('on',target);
            });
            Vcity._m.on(lis[i],'mouseout',function(event){
                event = Vcity._m.getEvent(event);
                var target = Vcity._m.getTarget(event);
                Vcity._m.removeClass('on',target);
            })
        }
    }
};
package com.bjrun.autodata.utils.common;

public class MoneyUpperUtil {
    public static void main(String[] args) {
        System.out.println(upperNum("12.23"));
    }

    public static String upperNum(String val) {
        String preStr = "";
        if (val.startsWith("-")) {
            preStr = "负数: ";
        }
        StringBuffer sb = new StringBuffer(val);
        byte valArr[] = sb.reverse().toString().replace(".", "").replace("-", "").getBytes();
        int len = valArr.length;
        String tmp[] = new String[len];
        for (int i = 0; i < len; i++) {
            tmp[i] = bigNum(valArr[i]) + "" + digitChn(i);
        }
        StringBuffer tmpSb = new StringBuffer();
        for (int i = len; i > 0; i--) {
            tmpSb.append(tmp[i - 1]);
        }
        String valStr = tmpSb.toString();
        valStr = valStr.replaceAll("零拾", "零");
        valStr = valStr.replaceAll("零佰", "零");
        valStr = valStr.replaceAll("零仟", "零");
        valStr = valStr.replaceAll("零零零", "零");
        valStr = valStr.replaceAll("零零", "零");
        valStr = valStr.replaceAll("零角零分", "整");
        valStr = valStr.replaceAll("零分", "整");
        valStr = valStr.replaceAll("零角", "零");
        valStr = valStr.replaceAll("零亿零万零元", "亿元");
        valStr = valStr.replaceAll("亿零万零元", "亿元");
        valStr = valStr.replaceAll("零亿零万", "亿");
        valStr = valStr.replaceAll("零万零元", "万元");
        valStr = valStr.replaceAll("万零元", "万元");
        valStr = valStr.replaceAll("零亿", "亿");
        valStr = valStr.replaceAll("零万", "万");
        valStr = valStr.replaceAll("零元", "元");
        valStr = valStr.replaceAll("零零", "零");
        if (valStr.indexOf("元零") == 0) {
            valStr = valStr.replaceAll("元零", "");// 注意新加的
        }
        if (valStr.indexOf("壹拾") == 0) {
            valStr = valStr.replaceAll("壹拾", "拾");// 注意新加的
        }
        return preStr + valStr;
    }

    private static String digitChn(int idx) {
        String result = null;
        switch (idx) {// 选择单位
        case 0:
            result = "分";
            break;
        case 1:
            result = "角";
            break;
        case 2:
            result = "元";
            break;
        case 3:
            result = "拾";
            break;
        case 4:
            result = "佰";
            break;
        case 5:
            result = "仟";
            break;
        case 6:
            result = "万";
            break;
        case 7:
            result = "拾";
            break;
        case 8:
            result = "佰";
            break;
        case 9:
            result = "仟";
            break;
        case 10:
            result = "亿";
            break;
        case 11:
            result = "拾";
            break;
        case 12:
            result = "佰";
            break;
        case 13:
            result = "仟";
            break;
        }
        return result;
    }

    private static String bigNum(byte chr) {
        String result = null;
        switch (chr) { // 选择数字
        case '1':
            result = "壹";
            break;
        case '2':
            result = "贰";
            break;
        case '3':
            result = "叁";
            break;
        case '4':
            result = "肆";
            break;
        case '5':
            result = "伍";
            break;
        case '6':
            result = "陆";
            break;
        case '7':
            result = "柒";
            break;
        case '8':
            result = "捌";
            break;
        case '9':
            result = "玖";
            break;
        case '0':
            result = "零";
            break;
        }
        return result;
    }
}

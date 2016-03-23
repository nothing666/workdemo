package com.bjrun.autodata.utils.common;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class TransUtil {
/**
 * Date转字符串
 * @param date
 * @return
 */
    public static String DateToStr(Date date) {
       SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
       String str = format.format(date);
       return str;
    } 
    /**
     * 字符串转Date
     * @param date
     * @return
     */
    public static Date StrToDate(String str, String formatStr) {
        SimpleDateFormat format = new SimpleDateFormat(formatStr );
        Date date = null;
        try {
         date = format.parse(str);
        } catch (ParseException e) {
         e.printStackTrace();
        }
        return date;
     }

     
    public static void main(String[] args) {
        System.out.println(TransUtil.StrToDate("2014-12-12", "yyyy-MM-dd"));
    }
}

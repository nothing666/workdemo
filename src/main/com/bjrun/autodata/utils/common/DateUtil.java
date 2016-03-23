package com.bjrun.autodata.utils.common;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author: Andy Yao
 */
public class DateUtil
{

    /**
     * format date to string as "yyyy-MM-dd"
     * @param date
     * @return "yyyy-MM-dd"
     */
    public static String dateToString(Date date)
    {

        return dateToString(date, "yyyy-MM-dd");
    }

    public static String dateToString(Date date, String format)
    {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        /*TimeZone timeZoneChina = TimeZone.getTimeZone("GMT");
        sdf.setTimeZone(timeZoneChina);*/
        return sdf.format(date);
    }

    public static Date stringToDate(String dateStr, String format)
    {
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        /*TimeZone timeZoneChina = TimeZone.getTimeZone("GMT");
        sdf.setTimeZone(timeZoneChina);*/
        try
        {
            return sdf.parse(dateStr);
        } catch (Exception e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return null;
    }

    /**
     * format string as "yyyy-MM-dd" to Date
     * @param date
     * @return "yyyy-MM-dd"
     */
    public static Date stringToDate(String dateStr)
    {

        return stringToDate(dateStr, "yyyy-MM-dd");
    }

    public static final String DATE_FORMAT_1 = "yyyy-MM-dd HH:mm:ss";

    public static final String DATE_FORMAT_2 = "yyyy-MM-dd";

    public static final String DATE_FORMAT_3 = "yyyyMMddhhmmss";

    public static final String DATE_FORMAT_4 = "yyyy年MM月dd日";
}

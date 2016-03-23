package com.bjrun.autodata.utils.common;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sun.org.apache.bcel.internal.generic.Type;

public class EntityMapUtil
{

    private static final String CLASS = "class";

    /**
     * 将实体类转换成Map对象
     * 
     * @param bean
     *            带有数据的实体类对象
     * @return Map对象
     */

    public static Map<String, Object> entityToMap(Object bean)
    {
        Map<String, Object> map = new HashMap<String, Object>();
        try
        {
            BeanInfo beanInfo = Introspector.getBeanInfo(bean.getClass());
            PropertyDescriptor[] propertyDescriptors = beanInfo
                    .getPropertyDescriptors();

            for (PropertyDescriptor property : propertyDescriptors)
            {
                String key = property.getName();
                // 过滤class属性
                if (!key.equals(CLASS))
                {
                    // 得到property对应的getter方法
                    Method getter = property.getReadMethod();
                    Object value = getter.invoke(bean);
                    map.put(key, value);
                }
            }
        } catch (IntrospectionException e)
        {
            e.printStackTrace();
        } catch (IllegalArgumentException e)
        {
            e.printStackTrace();
        } catch (IllegalAccessException e)
        {
            e.printStackTrace();
        } catch (InvocationTargetException e)
        {
            e.printStackTrace();
        }
        return map;
    }

    /**
     * 
     * @param c
     *            实体类对象的类型
     * @param listmap
     *            从mybatis中查询获得的包含map类型数据的list对象（有数据）
     * @return 返回转载Object的list
     */
    public static List<?> listmapToList(Class<?> c,
            List<Map<String, Object>> listmap)
    {
        List<Object> list = new ArrayList<Object>();
        try
        {

            for (Map<String, Object> map : listmap)
            {
                Object obj = c.newInstance();
                obj = EntityMapUtil.mapToEntity(map, obj);
                list.add(obj);
            }
        } catch (InstantiationException e)
        {
            e.printStackTrace();
        } catch (IllegalAccessException e)
        {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 将Map对象转换成实体类
     * 
     * @param map
     *            带有数据的map对象
     * @param bean
     *            必须为实体类对象，也是要返回的对象
     * @return
     */
    public static Object mapToEntity(Map<String, Object> map, Object bean)
    {
        if (map != null && bean != null)
        {
            try
            {
                BeanInfo beanInfo = Introspector.getBeanInfo(bean.getClass());
                PropertyDescriptor[] propertyDescriptors = beanInfo
                        .getPropertyDescriptors();
                for (PropertyDescriptor property : propertyDescriptors)
                {
                    String key = property.getName();
                    boolean boo = false;
                    if (map.containsKey(key))
                    {
                        boo = true;
                    } else if (map.containsKey(key.toUpperCase()))
                    {
                        key = key.toUpperCase();
                        boo = true;
                    } else if (map.containsKey(key.toLowerCase()))
                    {
                        key = key.toLowerCase();
                        boo = true;
                    }
                    if (boo)
                    {
                        Object value = map.get(key);
                        value = transFieldType(property.getPropertyType(),
                                value);

                        Method setter = property.getWriteMethod();
                        setter.invoke(bean, value);
                        // 得到property对应的setter方法
                    }
                }
            } catch (IntrospectionException e)
            {
                e.printStackTrace();
            } catch (IllegalArgumentException e)
            {
                e.printStackTrace();
            } catch (IllegalAccessException e)
            {
                e.printStackTrace();
            } catch (InvocationTargetException e)
            {
                e.printStackTrace();
            } catch (Exception e)
            {
                e.printStackTrace();
            }
        }
        return bean;
    }

    private static Object transFieldType(Class<?> c, Object value)
            throws SQLException
    {
        // 转int
        if (c.toString().equals(Type.INT.toString()))
        {
            value = Integer.parseInt(value.toString());
        }
        // 转Integer
        if (c.equals(Integer.class))
        {
            value = Integer.valueOf(value.toString());
        }
        // 转long
        if (c.toString().equals(Type.LONG.toString()))
        {
            value = Long.parseLong(value.toString());
        }

        // 转Long
        if (c.equals(Long.class))
        {
            value = Long.valueOf(value.toString());
        }

        // 转float
        if (c.equals(float.class))
        {
            value = Float.parseFloat(value.toString());
        }

        // 转Float
        if (c.equals(Float.class))
        {
            value = Float.valueOf(value.toString());
        }

        if (c.equals(BigDecimal.class))
        {
            BigDecimal bd = (BigDecimal) value;
            value = bd.floatValue();
        }

        // 转java.util.Date
        if (c.equals(Date.class))
        {
            Timestamp stmp = ((oracle.sql.TIMESTAMP) value).timestampValue();
            Date date = new Date();
            date.setTime(stmp.getTime());
            value = date;
        }

        // 转java.sql.Timestamp
        if (c.equals(Timestamp.class))
        {
            Timestamp stmp = (Timestamp) value;
            value = stmp;
        }
        return value;
    }

}
